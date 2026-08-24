import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Report from '@/models/Report';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

function getUserIdFromAuthHeader(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id || decoded.userId || decoded._id;
  } catch (err) {
    return null;
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const reporterId = getUserIdFromAuthHeader(request);
    if (!reporterId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in to report a profile.' },
        { status: 401 }
      );
    }

    const { reportedUserId, reason, description } = await request.json();

    if (!reportedUserId || !reason) {
      return NextResponse.json(
        { success: false, message: 'Candidate user ID and reason are required.' },
        { status: 400 }
      );
    }

    if (String(reporterId) === String(reportedUserId)) {
      return NextResponse.json(
        { success: false, message: 'You cannot report your own profile.' },
        { status: 400 }
      );
    }

    // Verify candidate profile exists
    const candidateUser = await User.findById(reportedUserId);
    if (!candidateUser) {
      return NextResponse.json(
        { success: false, message: 'Candidate user profile not found.' },
        { status: 444 }
      );
    }

    // Save report
    const newReport = await Report.create({
      reporterId,
      reportedUserId,
      reason: String(reason).trim(),
      description: description ? String(description).trim() : '',
      status: 'Pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. Our safety team will review this candidate.',
      reportId: newReport._id,
    });
  } catch (error) {
    console.error('[API/Reports] Error submitting report:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error submitting report.' },
      { status: 500 }
    );
  }
}
