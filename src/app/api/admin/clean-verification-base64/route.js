import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function GET() {
  try {
    await dbConnect();

    // Find users with base64 verificationSelfieUrl or verificationDocUrl
    const usersWithBase64 = await User.find({
      $or: [
        { verificationSelfieUrl: { $regex: '^data:image' } },
        { verificationDocUrl: { $regex: '^data:image' } }
      ]
    });

    let cleanedCount = 0;

    for (const u of usersWithBase64) {
      let updated = false;

      if (u.verificationSelfieUrl && u.verificationSelfieUrl.startsWith('data:image')) {
        try {
          const res = await cloudinary.uploader.upload(u.verificationSelfieUrl, {
            folder: 'verifications/selfies'
          });
          u.verificationSelfieUrl = res.secure_url;
          updated = true;
        } catch (e) {
          console.error(`Failed to clean selfie for user ${u._id}:`, e);
        }
      }

      if (u.verificationDocUrl && u.verificationDocUrl.startsWith('data:image')) {
        try {
          const res = await cloudinary.uploader.upload(u.verificationDocUrl, {
            folder: 'verifications/documents'
          });
          u.verificationDocUrl = res.secure_url;
          updated = true;
        } catch (e) {
          console.error(`Failed to clean doc for user ${u._id}:`, e);
        }
      }

      if (updated) {
        await u.save();
        cleanedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      cleanedUsersCount: cleanedCount,
      message: `Cleaned ${cleanedCount} users with base64 verification images!`
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
