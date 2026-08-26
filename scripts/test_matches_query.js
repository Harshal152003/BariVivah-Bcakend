const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    if (!line || line.startsWith('#')) return;
    const parts = line.split('=');
    if (parts.length >= 2) {
      process.env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const User = mongoose.connection.collection('users');
    const allUsers = await User.find({}).toArray();

    console.log('--- USER SUMMARY & INTERACTED COUNTS ---');
    for (const u of allUsers) {
      const sentCount = u.interestsSent ? u.interestsSent.length : 0;
      const passedCount = u.passedUsers ? u.passedUsers.length : 0;
      if (sentCount > 0 || passedCount > 0) {
        console.log(`User: ${u.name} (${u._id}) | Phone: ${u.phone} | Gender: ${u.gender} | Sent: ${sentCount} | Passed: ${passedCount}`);
      }
    }

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
