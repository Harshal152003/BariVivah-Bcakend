import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    await dbConnect();

    let token = req.cookies.get('authToken')?.value;
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    const { userId, selfiePhoto, docType, docPhoto } = await req.json();
    const targetUserId = userId || (token ? verifyToken(token)?.userId : null);

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'User ID or valid token required' },
        { status: 401, headers: corsHeaders }
      );
    }

    if (!selfiePhoto) {
      return NextResponse.json(
        { error: 'Live pose selfie photo is required for verification' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Auto-upload Base64 images to Cloudinary if needed
    let finalSelfieUrl = selfiePhoto;
    if (selfiePhoto && selfiePhoto.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(selfiePhoto, {
          folder: 'verifications/selfies',
        });
        finalSelfieUrl = uploadRes.secure_url;
      } catch (err) {
        console.error('Error uploading verification selfie to Cloudinary:', err);
      }
    }

    let finalDocUrl = docPhoto;
    if (docPhoto && docPhoto.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(docPhoto, {
          folder: 'verifications/documents',
        });
        finalDocUrl = uploadRes.secure_url;
      } catch (err) {
        console.error('Error uploading verification document to Cloudinary:', err);
      }
    }

    const user = await User.findByIdAndUpdate(
      targetUserId,
      {
        verificationSelfieUrl: finalSelfieUrl,
        verificationDocType: docType || null,
        verificationDocUrl: finalDocUrl || null,
        verificationRequested: true,
        verificationStatus: 'Pending',
        verificationRejectReason: null,
        verificationSubmittedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Verification request submitted successfully',
        verificationStatus: user.verificationStatus,
        verificationRequested: user.verificationRequested,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('[API verification-submit Error]:', error);
    return NextResponse.json(
      { error: 'Failed to submit verification request: ' + error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
