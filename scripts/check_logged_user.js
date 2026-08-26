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
    const users = await mongoose.connection.collection('users').find({}).project({ name: 1, phone: 1, gender: 1, caste: 1, interestsSent: 1, passedUsers: 1 }).toArray();
    console.log(`Total users in DB: ${users.length}`);

    const males = users.filter(u => u.gender === 'Male');
    const females = users.filter(u => u.gender === 'Female');
    const undefinedGender = users.filter(u => !u.gender || (u.gender !== 'Male' && u.gender !== 'Female'));

    console.log(`Male Users: ${males.length}, Female Users: ${females.length}, Undefined Gender Users: ${undefinedGender.length}`);

    console.log('\n--- SAMPLE USERS ---');
    users.slice(0, 10).forEach(u => {
      console.log(`ID: ${u._id} | Name: ${u.name} | Phone: ${u.phone} | Gender: ${u.gender} | Caste: ${u.caste}`);
    });

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
