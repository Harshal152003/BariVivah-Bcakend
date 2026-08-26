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
    const males = await mongoose.connection.collection('users').find({
      email: { $regex: /barivivah\.test$/i },
      gender: 'Male'
    }).limit(5).toArray();

    const females = await mongoose.connection.collection('users').find({
      email: { $regex: /barivivah\.test$/i },
      gender: 'Female'
    }).limit(5).toArray();

    console.log('\n======================================================');
    console.log('✨ NEWLY SEEDED MAHARASHTRIAN MALE PROFILES (SAMPLE)');
    console.log('======================================================');
    males.forEach((m, idx) => {
      console.log(`\n${idx + 1}. ${m.name} (${m.caste}) - ${m.gender}`);
      console.log(`   Phone: ${m.phone} | Email: ${m.email}`);
      console.log(`   City: ${m.currentCity} | Height: ${m.height} | Diet: ${m.diet}`);
      console.log(`   Education: ${m.education} (${m.fieldOfStudy}) from ${m.college}`);
      console.log(`   Occupation: ${m.occupation} at ${m.company} (${m.income})`);
      console.log(`   Father: ${m.fatherName} (${m.fatherOccupation}) | Mother: ${m.mother}`);
      console.log(`   Gothra: ${m.gothra} | Rashi: ${m.rashi} | Mangal: ${m.mangal}`);
      console.log(`   Photo URL: ${m.profilePhoto}`);
    });

    console.log('\n======================================================');
    console.log('✨ NEWLY SEEDED MAHARASHTRIAN FEMALE PROFILES (SAMPLE)');
    console.log('======================================================');
    females.forEach((f, idx) => {
      console.log(`\n${idx + 1}. ${f.name} (${f.caste}) - ${f.gender}`);
      console.log(`   Phone: ${f.phone} | Email: ${f.email}`);
      console.log(`   City: ${f.currentCity} | Height: ${f.height} | Diet: ${f.diet}`);
      console.log(`   Education: ${f.education} (${f.fieldOfStudy}) from ${f.college}`);
      console.log(`   Occupation: ${f.occupation} at ${f.company} (${f.income})`);
      console.log(`   Father: ${f.fatherName} (${f.fatherOccupation}) | Mother: ${f.mother}`);
      console.log(`   Gothra: ${f.gothra} | Rashi: ${f.rashi} | Mangal: ${f.mangal}`);
      console.log(`   Photo URL: ${f.profilePhoto}`);
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
