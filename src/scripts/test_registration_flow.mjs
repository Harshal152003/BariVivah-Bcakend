import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:3000';

async function testRegistrationDecoupling() {
  console.log('=== Starting Registration Decoupling & Ghost Account Prevention Test ===\n');

  const testPhone = '9000000001';
  const fullPhone = `+91${testPhone}`;

  const mongoose = (await import('mongoose')).default;
  await mongoose.connect(process.env.MONGODB_URI);
  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  await User.deleteMany({ phone: fullPhone });

  // Step 1: Send OTP
  console.log('1. Calling /api/send-otp...');
  const sendRes = await fetch(`${API_BASE}/api/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: testPhone })
  });
  const sendData = await sendRes.json();
  console.log('Send OTP Response:', sendData);

  // Use test account or review OTP
  const testOtp = '123456';

  // Step 2: Verify OTP
  console.log('\n2. Calling /api/verify-otp with phone:', testPhone);
  const verifyRes = await fetch(`${API_BASE}/api/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: testPhone, otp: testOtp })
  });
  const verifyData = await verifyRes.json();
  console.log('Verify OTP Response Status:', verifyRes.status);
  console.log('Verify OTP Response Body:', verifyData);

  if (!verifyData.success || !verifyData.isNewUser) {
    console.error('FAILED: verify-otp should return isNewUser: true');
    process.exit(1);
  }

  if (!verifyData.registrationToken) {
    console.error('FAILED: verify-otp should return registrationToken for new users');
    process.exit(1);
  }

  // Step 3: Check DB connection & ensure NO phantom user was created in MongoDB
  const dbUserBefore = await User.findOne({ phone: fullPhone });
  console.log('\n3. Database check after OTP verification:');
  console.log('User document in DB before registration form submission:', dbUserBefore);

  if (dbUserBefore) {
    console.error('FAILED: verify-otp created an orphaned blank record in MongoDB!');
    process.exit(1);
  }
  console.log('SUCCESS: No orphaned document was created in MongoDB during OTP verification!');

  // Step 4: Submit complete profile registration
  console.log('\n4. Submitting registration to /api/users/register...');
  const regPayload = {
    name: 'Aarav Bari',
    phone: testPhone,
    email: 'aarav.bari.test@example.com',
    password: 'SecurePassword123!',
    gender: 'Male',
    dob: '1998-05-15',
    state: 'Maharashtra',
    currentCity: 'Pune',
    maritalStatus: 'Unmarried',
    height: "5'10\"",
    education: 'B.Tech',
    income: '15-20 LPA',
    workSector: 'Private Sector',
    occupation: 'Software Engineer',
    registrationToken: verifyData.registrationToken
  };

  const regRes = await fetch(`${API_BASE}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload)
  });
  const regData = await regRes.json();
  console.log('Registration Response Status:', regRes.status);
  console.log('Registration Response Body:', regData);

  if (!regData.success) {
    console.error('FAILED: Registration failed:', regData);
    process.exit(1);
  }

  const dbUserAfter = await User.findOne({ phone: fullPhone });
  console.log('\n5. Database check after registration submission:');
  console.log('User document in DB:', {
    _id: dbUserAfter._id,
    profileId: dbUserAfter.profileId,
    name: dbUserAfter.name,
    phone: dbUserAfter.phone,
    email: dbUserAfter.email,
    phoneIsVerified: dbUserAfter.phoneIsVerified,
    isVerified: dbUserAfter.isVerified
  });

  if (!dbUserAfter || !dbUserAfter.name || !dbUserAfter.profileId) {
    console.error('FAILED: User not properly registered in MongoDB');
    process.exit(1);
  }
  console.log('SUCCESS: User profile registered atomically with profileId:', dbUserAfter.profileId);

  // Step 5: Duplicate registration attempt should be rejected
  console.log('\n6. Testing duplicate registration attempt...');
  const dupRes = await fetch(`${API_BASE}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload)
  });
  const dupData = await dupRes.json();
  console.log('Duplicate Reg Status:', dupRes.status, 'Body:', dupData);

  if (dupRes.status !== 400 || dupData.success) {
    console.error('FAILED: Duplicate registration was not blocked!');
    process.exit(1);
  }
  console.log('SUCCESS: Duplicate registration properly rejected.');

  // Step 6: Verify existing user login via verify-otp
  console.log('\n7. Testing OTP login for existing registered user...');
  const loginOtpRes = await fetch(`${API_BASE}/api/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: testPhone, otp: testOtp })
  });
  const loginOtpData = await loginOtpRes.json();
  console.log('Existing User OTP Login Body:', loginOtpData);

  if (!loginOtpData.success || loginOtpData.isNewUser !== false || !loginOtpData.userId) {
    console.error('FAILED: Existing user OTP login failed');
    process.exit(1);
  }
  console.log('SUCCESS: Existing user verified and authenticated successfully (isNewUser: false).');

  // Clean up test user
  await User.deleteOne({ phone: fullPhone });
  console.log('\nCleaned up test record:', fullPhone);

  await mongoose.disconnect();
  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

testRegistrationDecoupling().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
