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
    console.log('Connected to MongoDB');
    const total = await mongoose.connection.collection('users').countDocuments();
    const males = await mongoose.connection.collection('users').countDocuments({ gender: 'Male' });
    const females = await mongoose.connection.collection('users').countDocuments({ gender: 'Female' });
    console.log(`Total Users: ${total} (Males: ${males}, Females: ${females})`);
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Error:', err);
    process.exit(1);
  });
