const API_BASE = 'http://localhost:3000';

async function testDeletionE2E() {
  console.log('=== Starting Pure HTTP E2E Account Deletion & Tombstone Test ===\n');

  const phoneA = '9100000001';
  const phoneB = '9200000001';

  // 1. Register User A
  console.log('1. Registering User A (Pooja Bari)...');
  const regResA = await fetch(`${API_BASE}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Pooja Bari',
      phone: phoneA,
      email: 'pooja.bari.test@example.com',
      password: 'Password123!',
      gender: 'Female',
      dob: '1999-04-10',
      state: 'Maharashtra',
      currentCity: 'Mumbai',
      education: 'MBA'
    })
  });
  const regDataA = await regResA.json();
  console.log('User A registration:', regDataA.success ? `Success (ID: ${regDataA.user?.id || regDataA.user?._id})` : regDataA.message);

  // 2. Register User B
  console.log('2. Registering User B (Rohan Bari)...');
  const regResB = await fetch(`${API_BASE}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Bari',
      phone: phoneB,
      email: 'rohan.bari.test@example.com',
      password: 'Password123!',
      gender: 'Male',
      dob: '1996-08-20',
      state: 'Maharashtra',
      currentCity: 'Pune',
      education: 'B.Tech'
    })
  });
  const regDataB = await regResB.json();
  console.log('User B registration:', regDataB.success ? `Success (ID: ${regDataB.user?.id || regDataB.user?._id})` : regDataB.message);

  const tokenA = regDataA.token;
  const tokenB = regDataB.token;
  const idA = regDataA.user?.id || regDataA.user?._id;
  const idB = regDataB.user?.id || regDataB.user?._id;

  // 3. User B sends interest to User A
  console.log('\n3. User B sends interest to User A...');
  const sendRes = await fetch(`${API_BASE}/api/interest/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenB}`
    },
    body: JSON.stringify({ senderId: idB, receiverId: idA })
  });
  const sendData = await sendRes.json();
  console.log('Send Interest Status:', sendRes.status, 'Body:', sendData);

  // 4. Verify Received interests for User A before deletion
  console.log('\n4. Checking received interests for User A before deletion...');
  const recResBefore = await fetch(`${API_BASE}/api/interest/received?userId=${idA}`);
  const recDataBefore = await recResBefore.json();
  const senderBefore = recDataBefore.interests?.[0]?.sender;
  console.log('Received Sender before deletion:', senderBefore?.name);

  // 5. Send OTP & Delete User B's Account
  console.log('\n5. Sending OTP and deleting User B account...');
  await fetch(`${API_BASE}/api/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: phoneB })
  });

  const delRes = await fetch(`${API_BASE}/api/users/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenB}`
    },
    body: JSON.stringify({
      otp: '123456',
      reasonCategory: 'Married',
      reasonText: 'Found partner on BariVivah'
    })
  });
  const delData = await delRes.json();
  console.log('Account Deletion Status:', delRes.status, 'Response:', delData);

  if (!delData.success) {
    console.error('FAILED: Account deletion failed');
    process.exit(1);
  }

  // 6. Verify Received Interests for User A AFTER deletion
  console.log('\n6. Checking received interests for User A AFTER deletion...');
  const recResAfter = await fetch(`${API_BASE}/api/interest/received?userId=${idA}`);
  const recDataAfter = await recResAfter.json();
  const senderAfter = recDataAfter.interests?.[0]?.sender;
  console.log('Received Sender after deletion:', senderAfter);

  if (!senderAfter?.isDeleted || senderAfter?.status !== 'Deleted' || !senderAfter?.name.includes('Closed')) {
    console.error('FAILED: Tombstone not populated on received interests!');
    process.exit(1);
  }
  console.log('SUCCESS: Received interest shows graceful "Profile Closed" tombstone!');

  // 7. Verify /api/users/[id] for deleted User B returns 404 with isDeleted: true
  console.log('\n7. Checking /api/users/[id] for deleted User B...');
  const profileRes = await fetch(`${API_BASE}/api/users/${idB}`);
  const profileData = await profileRes.json();
  console.log('Profile Detail Status:', profileRes.status, 'Body:', profileData);

  if (profileRes.status !== 404 || !profileData.isDeleted || profileData.error !== 'Profile Closed') {
    console.error('FAILED: /api/users/[id] did not return Profile Closed response');
    process.exit(1);
  }
  console.log('SUCCESS: /api/users/[id] returns proper "Profile Closed" error response!');

  // 8. Verify Search Excludes Deleted User B
  console.log('\n8. Checking Search endpoint...');
  const searchRes = await fetch(`${API_BASE}/api/users/search?currentUserId=${idA}`);
  const searchData = await searchRes.json();
  const foundInSearch = (searchData.users || []).some(u => (u._id || u.id) === idB);
  console.log('Deleted user present in search results:', foundInSearch);

  if (foundInSearch) {
    console.error('FAILED: Deleted user appeared in search results!');
    process.exit(1);
  }
  console.log('SUCCESS: Deleted user is excluded from search feeds!');

  // 9. Verify Phone Number Can Be Re-Registered
  console.log('\n9. Testing re-registration with freed phone number...');
  const reRegRes = await fetch(`${API_BASE}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Bari Reborn',
      phone: phoneB,
      email: 'rohan.new@example.com',
      password: 'Password123!',
      gender: 'Male',
      dob: '1996-08-20',
      state: 'Maharashtra',
      currentCity: 'Pune'
    })
  });
  const reRegData = await reRegRes.json();
  console.log('Re-registration with same phone:', reRegData.success ? `Success (New ID: ${reRegData.user?.id})` : reRegData.message);

  if (!reRegData.success) {
    console.error('FAILED: Freed phone number could not be re-registered!');
    process.exit(1);
  }
  console.log('SUCCESS: Freed phone number re-registered with brand new Profile ID!');

  console.log('\n=== ALL E2E ACCOUNT DELETION TESTS PASSED SUCCESSFULLY! ===');
}

testDeletionE2E().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
