// This file handles the API route for fetching all users with pagination and filtering
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User'; // Assuming your User model is imported from here
import connectDB from '@/lib/dbConnect';
// Connect to MongoDB if not already connected
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081', // Must be explicit, not *
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

export async function GET(request) {
  try {
    await connectDB();

    // Get query parameters for potential filtering
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const pageParam = searchParams.get('page') || 1;
    
    let limit = 0; // Default to 0 (no limit, fetch all users) unless page/limit pagination is requested
    if (limitParam && limitParam !== 'all') {
      limit = parseInt(limitParam, 10);
    }
    const page = parseInt(pageParam, 10);
    const skip = limit > 0 ? (page - 1) * limit : 0;
    
    // Basic query - you can extend this with more filters as needed
    const query = {};
    
    // Optional: Add filters based on query parameters
    if (searchParams.get('isVerified')) {
      query.isVerified = searchParams.get('isVerified') === 'true';
    }

    if (searchParams.get('verificationStatus')) {
      query.verificationStatus = searchParams.get('verificationStatus');
    }
    
    if (searchParams.get('gender')) {
      query.gender = searchParams.get('gender');
    }
    
    // Fetch users with query
    let userQuery = User.find(query).select('-__v').sort({ createdAt: -1 }).lean();
    if (skip > 0) userQuery = userQuery.skip(skip);
    if (limit > 0) userQuery = userQuery.limit(limit);
    
    const users = await userQuery;
    
    // Get total count for pagination info
    const total = await User.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    },{headers:corsHeaders});
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users', error: error.message },
      { status: 500 ,headers:corsHeaders  }
    );
  }
}