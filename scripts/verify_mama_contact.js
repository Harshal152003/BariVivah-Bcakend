import 'dotenv/config';
import connectDB from '../src/lib/dbConnect.js';
import User from '../src/models/User.js';

async function testMamaContactField() {
  console.log('🧪 Verifying mamaContact field end-to-end...\n');
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB database');

    // 1. Find or create test user
    let testUser = await User.findOne({ phone: '+919999977777' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Mama Contact Test User',
        phone: '+919999977777',
        email: 'mamacontact@barivivah.com',
        mamaSurname: 'Deshmukh',
        mamaContact: '+91 9876543210'
      });
    } else {
      testUser.mamaSurname = 'Deshmukh';
      testUser.mamaContact = '+91 9876543210';
      await testUser.save();
    }

    console.log(`👤 User ID: ${testUser._id}`);
    console.log(`  Mama Surname: ${testUser.mamaSurname}`);
    console.log(`  Mama Contact: ${testUser.mamaContact}`);

    // 2. Re-query from DB to verify persistence
    const reQueriedUser = await User.findById(testUser._id);
    if (reQueriedUser.mamaContact === '+91 9876543210') {
      console.log('\n🎉 SUCCESS: mamaContact field successfully persisted to MongoDB database!');
    } else {
      throw new Error('❌ mamaContact field failed to persist!');
    }

    // Clean up test user
    await User.deleteOne({ _id: testUser._id });
    console.log('🧹 Cleaned up test user');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

testMamaContactField();
