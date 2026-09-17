import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:3000';

async function testAccountDeletionFlow() {
  console.log('=== Starting Account Deletion & Profile Closed Tombstone Test ===\n');

  const mongoose = (await import('mongoose')).default;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
  } catch (e) {
    console.log('Retrying connection...');
    await new Promise(r => setTimeout(r, 1000));
    await mongoose.connect(process.env.MONGODB_URI);
  }

  const User = mongoose.models.User || (await import('../models/User.js')).default;
  const Interest = mongoose.models.Interest || (await import('../models/Interest.js')).default;
  const ContactUnlock = mongoose.models.ContactUnlock || (await import('../models/ContactUnlock.js')).default;
  const DeletedAccount = mongoose.models.DeletedAccount || (await import('../models/DeletedAccount.js')).default;
  const { createToken } = await import('../lib/auth.js');
  const otpStore = (await import('../lib/otpStore.js')).default;

  const phoneA = '9000000010';
  const phoneB = '9000000020';
  const fullPhoneA = `+91${phoneA}`;
  const fullPhoneB = `+91${phoneB}`;

  // Clean up any previous test remnants
  await User.deleteMany({ phone: { $in: [fullPhoneA, fullPhoneB] } });
  await User.deleteMany({ phone: { $regex: /DELETED_.*_(\+919000000020|9000000020)/ } });
  await DeletedAccount.deleteMany({ phone: { $in: [fullPhoneB, phoneB] } });

  // 1. Create Test Users
  console.log('1. Creating Test User A and Test User B in MongoDB...');
  const userA = await User.create({
    name: 'Pooja Bari',
    phone: fullPhoneA,
    gender: 'Female',
    dob: new Date('1999-04-10'),
    currentCity: 'Mumbai',
    education: 'MBA',
    isVerified: true,
    phoneIsVerified: true,
    status: 'Active'
  });

  const userB = await User.create({
    name: 'Rohan Bari',
    phone: fullPhoneB,
    gender: 'Male',
    dob: new Date('1996-08-20'),
    currentCity: 'Pune',
    education: 'B.Tech',
    isVerified: true,
    phoneIsVerified: true,
    status: 'Active'
  });

  const tokenA = createToken(userA._id);
  const tokenB = createToken(userB._id);

  console.log(`Created User A (${userA._id}, ${userA.name}) and User B (${userB._id}, ${userB.name})`);

  // 2. Create Interactions:
  // - Received interest for A (sent by B)
  // - Sent interest for A (sent to B)
  // - Match between A and B
  // - Contact Unlock by A on B
  console.log('\n2. Creating test interactions (Received, Sent, Match, Unlocked Contact)...');
  const receivedInterest = await Interest.create({
    senderId: userB._id,
    receiverId: userA._id,
    status: 'pending'
  });

  const sentInterest = await Interest.create({
    senderId: userA._id,
    receiverId: userB._id,
    status: 'pending'
  });

  const matchInterest = await Interest.create({
    senderId: userA._id,
    receiverId: userB._id,
    status: 'accepted'
  });

  const unlockRecord = await ContactUnlock.create({
    userId: userA._id,
    unlockedUserId: userB._id,
    unlockedAt: new Date()
  });

  // 3. Check APIs before deletion
  console.log('\n3. Verifying APIs BEFORE deletion...');
  const resRecBefore = await fetch(`${API_BASE}/api/interest/received?userId=${userA._id}`);
  const dataRecBefore = await resRecBefore.json();
  console.log('Received response:', dataRecBefore);
  const recSenderBefore = dataRecBefore.interests?.[0]?.sender;
  console.log('Received Interest Sender Name before deletion:', recSenderBefore?.name);

  if (recSenderBefore?.name !== 'Rohan Bari') {
    console.error('FAILED: Expected Rohan Bari before deletion');
    process.exit(1);
  }

  // 4. Perform Account Deletion on User B
  console.log('\n4. Executing account deletion for User B via /api/users/delete...');
  otpStore.set(fullPhoneB, '123456');

  const delRes = await fetch(`${API_BASE}/api/users/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenB}`
    },
    body: JSON.stringify({
      otp: '123456',
      reasonCategory: 'Married',
      reasonText: 'Found partner on BariVivah'
    })
  });
  const delData = await delRes.json();
  console.log('Delete Response:', delData);

  if (!delData.success) {
    console.error('FAILED: Account deletion failed:', delData);
    process.exit(1);
  }

  // Check User B in DB
  const dbUserB = await User.findById(userB._id);
  console.log('\nUser B document state in DB after deletion:', {
    _id: dbUserB._id,
    isDeleted: dbUserB.isDeleted,
    status: dbUserB.status,
    phone: dbUserB.phone,
    deletedAt: dbUserB.deletedAt
  });

  if (!dbUserB.isDeleted || dbUserB.status !== 'Deleted' || !dbUserB.phone.startsWith('DELETED_')) {
    console.error('FAILED: User B was not properly soft-deleted');
    process.exit(1);
  }
  console.log('SUCCESS: User B is soft-deleted and phone index freed!');

  // 5. Verify APIs AFTER deletion
  console.log('\n5. Verifying APIs AFTER deletion...');

  // 5a. Received Interests
  const resRecAfter = await fetch(`${API_BASE}/api/interest/received?userId=${userA._id}`);
  const dataRecAfter = await resRecAfter.json();
  const recSenderAfter = dataRecAfter.interests?.find(i => i._id.toString() === receivedInterest._id.toString())?.sender;
  console.log('Received Interest Sender after deletion:', recSenderAfter);

  if (!recSenderAfter?.isDeleted || recSenderAfter?.status !== 'Deleted' || !recSenderAfter?.name.includes('Closed')) {
    console.error('FAILED: Received interest does not properly tombstone deleted sender!');
    process.exit(1);
  }
  console.log('SUCCESS: Received interest shows graceful "Profile Closed" tombstone!');

  // 5b. Sent Interests
  const resSentAfter = await fetch(`${API_BASE}/api/interest/send?userId=${userA._id}`);
  const dataSentAfter = await resSentAfter.json();
  const sentRecAfter = dataSentAfter.interests?.find(i => i._id.toString() === sentInterest._id.toString())?.receiver;
  console.log('Sent Interest Receiver after deletion:', sentRecAfter);

  if (!sentRecAfter?.isDeleted || sentRecAfter?.status !== 'Deleted' || !sentRecAfter?.name.includes('Closed')) {
    console.error('FAILED: Sent interest does not properly tombstone deleted receiver!');
    process.exit(1);
  }
  console.log('SUCCESS: Sent interest shows graceful "Profile Closed" tombstone!');

  // 5c. Matches
  const resMatchAfter = await fetch(`${API_BASE}/api/interest/matches?userId=${userA._id}`);
  const dataMatchAfter = await resMatchAfter.json();
  const matchedUserAfter = dataMatchAfter.matches?.[0]?.matchedUser;
  console.log('Matched Candidate after deletion:', matchedUserAfter);

  if (!matchedUserAfter?.isDeleted || matchedUserAfter?.status !== 'Deleted' || !matchedUserAfter?.name.includes('Closed')) {
    console.error('FAILED: Matches list does not properly tombstone deleted candidate!');
    process.exit(1);
  }
  console.log('SUCCESS: Matched candidate shows graceful "Profile Closed" tombstone!');

  // 5d. Unlocked Contacts
  const resContactAfter = await fetch(`${API_BASE}/api/users/contact/list`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  const dataContactAfter = await resContactAfter.json();
  const unlockedCandidateAfter = dataContactAfter.contacts?.[0]?.user;
  console.log('Unlocked Contact after deletion:', unlockedCandidateAfter);

  if (!unlockedCandidateAfter?.isDeleted || !unlockedCandidateAfter?.phone.includes('Closed')) {
    console.error('FAILED: Unlocked contact list does not properly handle deleted user!');
    process.exit(1);
  }
  console.log('SUCCESS: Unlocked contact list safely preserved with "Profile Closed" status!');

  // 5e. Search Feed Excludes Deleted User
  const resSearch = await fetch(`${API_BASE}/api/users/search?currentUserId=${userA._id}`);
  const dataSearch = await resSearch.json();
  const foundInSearch = dataSearch.users?.some(u => u._id.toString() === userB._id.toString());
  console.log('Deleted User found in active search results:', foundInSearch);

  if (foundInSearch) {
    console.error('FAILED: Deleted user appeared in active search feed!');
    process.exit(1);
  }
  console.log('SUCCESS: Deleted user completely excluded from active search/discovery feed!');

  // 6. Cleanup test records
  await User.deleteMany({ _id: { $in: [userA._id, userB._id] } });
  await Interest.deleteMany({ _id: { $in: [receivedInterest._id, sentInterest._id, matchInterest._id] } });
  await ContactUnlock.deleteMany({ _id: unlockRecord._id });
  await DeletedAccount.deleteMany({ userId: userB._id.toString() });

  await mongoose.disconnect();
  console.log('\n=== ALL ACCOUNT DELETION & PROFILE CLOSED TESTS PASSED! ===');
}

testAccountDeletionFlow().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
