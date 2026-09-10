import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function backfillProfileIds() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const users = await mongoose.connection.collection('users').find({}).toArray();
  console.log(`Found ${users.length} users in total.`);

  let updatedCount = 0;
  for (const user of users) {
    if (!user.profileId) {
      const generatedId = `BV-${user._id.toString().slice(-6).toUpperCase()}`;
      await mongoose.connection.collection('users').updateOne(
        { _id: user._id },
        { $set: { profileId: generatedId } }
      );
      updatedCount++;
    }
  }

  console.log(`Successfully updated ${updatedCount} users with permanent profileId.`);

  // Verify Hrishita Barve (6a8d3611d82eff8296eab992)
  const testUser = await mongoose.connection.collection('users').findOne({
    _id: new mongoose.Types.ObjectId('6a8d3611d82eff8296eab992')
  });

  console.log('Verified Hrishita Barve:', {
    name: testUser?.name,
    profileId: testUser?.profileId,
    _id: testUser?._id
  });

  // Verify searching by regex
  const searchTest = await mongoose.connection.collection('users').find({
    $or: [
      { profileId: new RegExp('BV-EAB992', 'i') },
      { profileId: new RegExp('EAB992', 'i') }
    ]
  }).toArray();

  console.log(`Search test for BV-EAB992 returned ${searchTest.length} records:`, searchTest.map(u => ({ name: u.name, profileId: u.profileId })));

  await mongoose.disconnect();
}

backfillProfileIds().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
