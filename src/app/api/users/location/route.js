import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PUT(request) {
  try {
    await dbConnect();

    let userId = null;
    let token = request.cookies.get('authToken')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded?.userId) {
        userId = decoded.userId;
      }
    }

    const body = await request.json();
    if (!userId) {
      userId = body.userId;
    }

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { latitude, longitude, currentCity, state, country, formattedAddress, permissionGranted } = body;

    const locationUpdate = {
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      currentCity: currentCity || null,
      state: state || null,
      country: country || 'India',
      formattedAddress: formattedAddress || null,
      permissionGranted: Boolean(permissionGranted),
      lastUpdated: new Date()
    };

    const updateData = {
      location: locationUpdate,
      updatedAt: new Date()
    };

    // Auto-update top-level currentCity and state if detected
    if (currentCity) {
      updateData.currentCity = currentCity;
    }
    if (state) {
      updateData.state = state;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Location updated successfully',
      location: updatedUser.location,
      user: updatedUser
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
