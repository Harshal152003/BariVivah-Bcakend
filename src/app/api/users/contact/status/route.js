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

  const { searchParams } = new URL(request.url);
  const targetUserId = searchParams.get('targetUserId');

  if (!targetUserId) {
    return NextResponse.json({ error: 'Missing targetUserId' }, { status: 400, headers: corsHeaders });
  }

  try {
    // Check if there is an existing unlock record
    const unlockRecord = await ContactUnlock.findOne({ userId, unlockedUserId: targetUserId });
    
    if (unlockRecord) {
      // Find the target user's contact information
      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404, headers: corsHeaders });
      }
      return NextResponse.json({
        unlocked: true,
        contactNumber: targetUser.phone || 'N/A'
      }, { status: 200, headers: corsHeaders });
    }

    return NextResponse.json({ unlocked: false }, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error('Error fetching contact status:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
