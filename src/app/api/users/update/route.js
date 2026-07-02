// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import User from '@/models/User';
// import dbConnect from '@/lib/dbConnect';
// export const dynamic = 'force-dynamic';

// export async function PUT(request) {
//   try {
//     await dbConnect();

//     console.log("DB connected✅");


//     // Get token from cookies
//     // const token = request.cookies.get('authToken')?.value;
//     // if (!token) {
//     //   return NextResponse.json(
//     //     { message: 'Unauthorized' },
//     //     { status: 401 }
//     //   );
//     // }

//     // // Verify token
//     // const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // if (!decoded) {
//     //   return NextResponse.json(
//     //     { message: 'Invalid token' },
//     //     { status: 401 }
//     //   );
//     // }

//    const body = await request.json();
// const {
//   // Basic Info
//   name,
//   dob,
//   currentCity,
//   maritalStatus,
//   height,
//   motherTongue,
//   gender,
//   religion,
//   caste,
//   subCaste,
//   gothra,
//   education,
//   fieldOfStudy,
//   college,
//   occupation,
//   company,
//   income,
//   weight,
//   userId,
//   verificationStatus,
//   email,
//   bloodGroup,
//   complexion,
//   wearsLens,
//   permanentAddress,
//   profilePhoto,
//   // Relative Info
//   fatherName,
//   parentResidenceCity,
//   mother,
//   brothers,
//   marriedBrothers,
//   sisters,
//   marriedSisters,
//   nativeDistrict,
//   nativeCity,
//   familyWealth,
//   relativeSurname,
//   parentOccupation,
//   mamaSurname,

//   // Horoscope Info
//   rashi,
//   nakshira,
//   charan,
//   gan,
//   nadi,
//   mangal,
//   birthPlace,
//   birthTime,
//   gotraDevak,

//   // Expectations
//   expectedCaste,
//   preferredCity,
//   expectedAgeDifference,
//   expectedEducation,
//   divorcee,
//   expectedHeight,
//   expectedIncome,

// // Profile Setup
//       profileSetup,

//   // Photos
//   photos
// } = body;

// console.log(body);

// const updateData = {
//   // Basic Info
//   name,
//   dob,
//   currentCity,
//   maritalStatus,
//   height,
//   motherTongue,
//   gender,
//   religion,
//   caste,
//   subCaste,
//   gothra,
//   education,
//   fieldOfStudy,
//   college,
//   occupation,
//   company,
//   income,
//   weight,
//   verificationStatus,
//   email,
//   bloodGroup,
//   complexion,
//   wearsLens,
//   permanentAddress,

//   // Relative Info
//   fatherName,
//   parentResidenceCity,
//   mother,
//   brothers,
//   marriedBrothers,
//   sisters,
//   marriedSisters,
//   nativeDistrict,
//   nativeCity,
//   familyWealth,
//   relativeSurname,
//   parentOccupation,
//   mamaSurname,
//   profilePhoto,

//   // Horoscope Info
//   rashi,
//   nakshira,
//   charan,
//   gan,
//   nadi,
//   mangal,
//   birthPlace,
//   birthTime,
//   gotraDevak,

//   // Expectations
//   expectedCaste,
//   preferredCity,
//   expectedAgeDifference,
//   expectedEducation,
//   divorcee,
//   expectedHeight,
//   expectedIncome,

//   // Photos
//   photos,
//    profileSetup: {
//         willAdminFill: profileSetup?.willAdminFill ,
//         dontAskAgain: profileSetup?.dontAskAgain 
//       },

//   // Timestamp
//   updatedAt: new Date()
// };

// console.log('Update Data:', userId);

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       updateData,

//       { new: true, runValidators: true }
//     ).select('-__v');

//     if (!updatedUser) {
//       return NextResponse.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(updatedUser);
//   } catch (error) {
//     console.error('Error updating user profile:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

//api/users/update
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import FormSection from '@/models/FormSection';
import dbConnect from '@/lib/dbConnect';
import { calculateProfileCompletion } from '@/lib/profileCompletion';

export const dynamic = 'force-dynamic';
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081', // Must be explicit, not *
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};
export async function PUT(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, phone, ...updateData } = body;

    console.log("Received update data:", updateData);

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Fetch existing user to calculate completion
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Merge existing user fields with updated fields to calculate completion
    const mergedUser = {
      ...existingUser.toObject(),
      ...updateData
    };

    if (updateData.profileSetup) {
      mergedUser.profileSetup = {
        ...existingUser.profileSetup,
        ...updateData.profileSetup
      };
    }

    // Calculate profile completion dynamically
    updateData.profileCompletion = calculateProfileCompletion(mergedUser);

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    // Handle special cases if needed
    if (updateData.profileSetup) {
      updateData.profileSetup = {
        willAdminFill: Boolean(updateData.profileSetup.willAdminFill),
        dontAskAgain: Boolean(updateData.profileSetup.dontAskAgain)
      };
    }

    if (updateData.photos && Array.isArray(updateData.photos)) {
      updateData.photos = updateData.photos.map(photo => ({
        url: photo.url,
        isPrimary: photo.isPrimary || false
      }));
    }

    // Update the user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v -password');

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error.message
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders
  });
}