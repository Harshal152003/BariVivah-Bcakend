import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Plan prices - should match exactly with your subscription plan names
    const planPrices = {
      'Premium Plan': 1999,
      'Gold Plan': 999,
      'Silver Plan': 899,
      'Basic Plan': 499,
      // Add all other plans you have with their exact names and prices
    };

    // Count users
    const totalUsers = await User.countDocuments();
    
    // Count all subscribed users
    const subscribedUsersCount = await User.countDocuments({ 
      'subscription.isSubscribed': true 
    });
    
    // Get all subscribed users with their plan types for revenue calculation
    const subscribedUsers = await User.find(
      { 'subscription.isSubscribed': true },
      { 'subscription.plan': 1 }
    );

    // Calculate revenue based on actual plans of subscribed users
    let revenue = 0;
    subscribedUsers.forEach(user => {
      const planName = user.subscription.plan;
      if (planName && planPrices[planName]) {
        revenue += planPrices[planName];
      }
    });

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email phone profilePhoto isVerified subscription createdAt');

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          subscribedUsers: subscribedUsersCount, // All subscribed users count
          revenue,
          changes: {
            totalUsers: '+12%',
            subscribedUsers: '+15%',
            revenue: '+18%',
          }
        },
        recentUsers
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}