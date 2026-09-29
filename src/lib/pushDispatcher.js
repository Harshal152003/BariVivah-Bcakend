import { Expo } from 'expo-server-sdk';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Dispatch Push Notifications to one or multiple users.
 * 
 * @param {Object} options
 * @param {string|string[]} options.recipientUserIds - Single User ID or Array of User IDs
 * @param {string} options.title - Notification Title
 * @param {string} options.body - Notification Body Message
 * @param {Object} [options.data] - Custom deep linking / routing data payload
 * @param {string} [options.channelId] - Android channel ID ('matrimony_matches', 'matrimony_requests', 'matrimony_announcements')
 * @param {string} [options.category] - Preference category ('matchAlerts', 'requestAlerts', 'adminAnnouncements')
 * @param {string} [options.sound] - Notification sound ('default')
 * @param {number} [options.badge] - iOS app icon badge count
 */
export async function sendPushNotification({
  recipientUserIds,
  title,
  body,
  data = {},
  channelId = 'matrimony_requests',
  category = 'requestAlerts',
  sound = 'default',
  badge = 1,
}) {
  if (!recipientUserIds) return { success: false, message: 'No recipients provided' };

  try {
    await dbConnect();

    const ids = Array.isArray(recipientUserIds) ? recipientUserIds : [recipientUserIds];
    if (ids.length === 0) return { success: true, count: 0 };

    // Query active users and their registered push tokens
    const users = await User.find({
      _id: { $in: ids },
      isDeleted: { $ne: true },
      'pushTokens.0': { $exists: true }, // Has at least one token
    })
      .select('_id pushTokens notificationPreferences')
      .lean();

    if (!users || users.length === 0) {
      return { success: true, dispatched: 0, reason: 'No registered push tokens found for recipients' };
    }

    const messages = [];
    const tokenToUserMap = new Map();

    for (const u of users) {
      // Check user preferences if category is specified
      if (category && u.notificationPreferences && u.notificationPreferences[category] === false) {
        continue; // User opted out of this notification category
      }

      if (Array.isArray(u.pushTokens)) {
        for (const pt of u.pushTokens) {
          const pushToken = pt?.token;
          if (pushToken && Expo.isExpoPushToken(pushToken)) {
            messages.push({
              to: pushToken,
              sound: sound || 'default',
              title,
              body,
              data: {
                ...data,
                timestamp: new Date().toISOString(),
              },
              channelId: channelId || 'matrimony_requests',
              priority: 'high',
              badge,
            });
            tokenToUserMap.set(pushToken, u._id.toString());
          }
        }
      }
    }

    if (messages.length === 0) {
      return { success: true, dispatched: 0, reason: 'No valid Expo push tokens' };
    }

    // Chunk messages into batches (Expo accepts up to 100 per request)
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    const invalidTokens = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);

        // Check tickets for immediate errors
        ticketChunk.forEach((ticket, idx) => {
          if (ticket.status === 'error') {
            const failedToken = chunk[idx]?.to;
            if (ticket.details?.error === 'DeviceNotRegistered' && failedToken) {
              invalidTokens.push(failedToken);
            }
          }
        });
      } catch (chunkErr) {
        console.error('[PushDispatcher] Chunk sending error:', chunkErr);
      }
    }

    // Automatically prune dead tokens asynchronously
    if (invalidTokens.length > 0) {
      try {
        await User.updateMany(
          { 'pushTokens.token': { $in: invalidTokens } },
          { $pull: { pushTokens: { token: { $in: invalidTokens } } } }
        );
        console.log(`[PushDispatcher] Pruned ${invalidTokens.length} dead/unregistered tokens.`);
      } catch (pruneErr) {
        console.warn('[PushDispatcher] Error pruning invalid tokens:', pruneErr);
      }
    }

    return {
      success: true,
      dispatched: messages.length,
      ticketsCount: tickets.length,
    };
  } catch (error) {
    console.error('[PushDispatcher] General dispatch exception:', error);
    return { success: false, error: error.message };
  }
}
