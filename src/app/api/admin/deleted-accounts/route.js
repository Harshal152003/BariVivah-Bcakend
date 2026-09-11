import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DeletedAccount from '@/models/DeletedAccount';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const reason = searchParams.get('reason') || 'All';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = searchParams.get('limit') === 'all' ? 1000 : parseInt(searchParams.get('limit') || '50', 10);

    const query = {};

    if (reason && reason !== 'All') {
      query.reasonCategory = reason;
    }

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { phone: regex },
        { email: regex },
        { profileId: regex },
        { reasonText: regex },
        { city: regex },
      ];
    }

    const totalCount = await DeletedAccount.countDocuments(query);
    const deletedAccounts = await DeletedAccount.find(query)
      .sort({ deletedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Summary counts
    const totalAll = await DeletedAccount.countDocuments({});
    const marriedCount = await DeletedAccount.countDocuments({ reasonCategory: 'Married' });
    const otherCount = await DeletedAccount.countDocuments({ reasonCategory: 'Other' });

    return NextResponse.json(
      {
        success: true,
        data: deletedAccounts,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
        },
        stats: {
          totalAll,
          marriedCount,
          otherCount,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching deleted accounts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch deleted accounts', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
