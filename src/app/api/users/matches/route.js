import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import { getMatches } from '@/services/matching/matchingEngine';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request) {
  try {
    await dbConnect();

    // 1. Authentication extraction
    let token = request.cookies.get('authToken')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page'), 10) || 1;
    const limit = parseInt(searchParams.get('limit'), 10) || 20;
    const cursor = searchParams.get('cursor') || null;
    const requestedUserId = searchParams.get('userId');

    let currentUserId = requestedUserId || null;

    if (token && !currentUserId) {
      try {
        const decoded = verifyToken(token);
        if (decoded && decoded.userId) {
          currentUserId = decoded.userId;
        }
      } catch (err) {
        console.warn('Invalid JWT token in matches API:', err.message);
      }
    }

    // 2. Gather filter parameters
    const filters = {
      caste: searchParams.get('caste'),
      isVerified: searchParams.get('isVerified') || searchParams.get('verified'),
      location: searchParams.get('location'),
      minScore: searchParams.get('minScore') || searchParams.get('minCompatibility'),
      sort: searchParams.get('sort'),
      seed: searchParams.get('seed')
    };

    // 3. Delegate execution to High-Performance Matching Engine
    const result = await getMatches({
      currentUserId,
      page,
      limit,
      cursor,
      filters
    });

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch matches', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
