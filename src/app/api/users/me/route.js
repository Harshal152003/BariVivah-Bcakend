import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { Weight } from 'lucide-react';
import { verifyToken } from '@/lib/auth';
// export const dynamic = 'force-dynamic';2
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081', // Must be explicit, not *
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};
export async function GET(request) {
  try {
    await dbConnect();

    // Get token from cookie or Authorization header
    let token = request.cookies.get('authToken')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
    console.log('Token :', token);
    // Verify token
    const decoded = verifyToken(token);
    console.log('Decoded Token', decoded);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    const user = await User.findById(decoded.userId).select('-__v');
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }
    console.log('User found:', user);
    // Filter data based on privacy settings
    const userData = {
      // Basic Info
      name: user.name,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      gender: user.gender,
      dob: user.dob,
      height: user.height,
      weight: user.weight,
      maritalStatus: user.maritalStatus,
      motherTongue: user.motherTongue,
      email: user.email,
      bloodGroup: user.bloodGroup,
      complexion: user.complexion,
      wearsLens: user.wearsLens,
      permanentAddress: user.permanentAddress,
      diet: user.diet,
      hobbies: user.hobbies,

      // Religious & Community
      religion: user.religion,
      caste: user.caste,
      subCaste: user.subCaste,
      gothra: user.gothra,

      // Education & Profession
      education: user.education,
      fieldOfStudy: user.fieldOfStudy,
      college: user.college,
      occupation: user.occupation,
      company: user.company,
      income: user.income,
      profilePhoto: user.profilePhoto,

      // Location
      currentCity: user.currentCity,
      state: user.state,

      // Relative Info
      fatherName: user.fatherName,
      parentResidenceCity: user.parentResidenceCity,
      mother: user.mother,
      brothers: user.brothers,
      marriedBrothers: user.marriedBrothers,
      sisters: user.sisters,
      marriedSisters: user.marriedSisters,
      nativeDistrict: user.nativeDistrict,
      nativeCity: user.nativeCity,
      familyWealth: user.familyWealth,
      relativeSurname: user.relativeSurname,
      parentOccupation: user.parentOccupation,
      mamaSurname: user.mamaSurname,

      // Horoscope Info
      rashi: user.rashi,
      nakshira: user.nakshira,
      charan: user.charan,
      gan: user.gan,
      nadi: user.nadi,
      mangal: user.mangal,
      birthPlace: user.birthPlace,
      birthTime: user.birthTime,
      gotraDevak: user.gotraDevak,

      // Expectations
      expectedCaste: user.expectedCaste,
      expectedSubCaste: user.expectedSubCaste,
      preferredCity: user.preferredCity,
      expectedAgeDifference: user.expectedAgeDifference,
      expectedEducation: user.expectedEducation,
      expectedWorkingStatus: user.expectedWorkingStatus,
      divorcee: user.divorcee,
      expectedHeight: user.expectedHeight,
      expectedIncome: user.expectedIncome,

      // System Info
      id: user._id,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
      preferences: user.preferences,
      subscription: user.subscription,
      createdAt: user.createdAt,
      profileCompletion: user.profileCompletion,

      // profile setup
      profileSetup: {
        willAdminFill: user.profileSetup?.willAdminFill || false,
        dontAskAgain: user.profileSetup?.dontAskAgain || false
      }
    };
    console.log("Me = ", userData)
    return NextResponse.json(userData, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}