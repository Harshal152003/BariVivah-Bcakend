import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import ContactUnlock from '@/models/ContactUnlock';
import { verifyToken } from '@/lib/auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

function getUserIdFromRequest(request) {
  let token = request.cookies.get('authToken')?.value;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

export async function GET(request) {
  await connectDB();

  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  try {
    // Find all unlocked contacts for the current user
    // Populate details of the unlocked user profiles
    const unlocks = await ContactUnlock.find({ userId })
      .populate({
        path: 'unlockedUserId',
        select: 'name phone email profilePhoto education currentCity caste dob gender height maritalStatus income'
      })
      .sort({ createdAt: -1 });

    const contactList = unlocks
      .filter(record => record.unlockedUserId !== null)
      .map(record => ({
        unlockId: record._id,
        unlockedAt: record.unlockedAt || record.createdAt,
        user: record.unlockedUserId
      }));

    return NextResponse.json({
      success: true,
      contacts: contactList
    }, { status: 200, headers: corsHeaders });

  } catch (err) {
    console.error('Error fetching unlocked contacts list:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
