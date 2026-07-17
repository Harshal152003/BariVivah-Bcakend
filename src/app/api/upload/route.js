import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function POST(request) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: 'matrimony-profiles',
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message || String(error) },
      { status: 500 }
    );
  }
}