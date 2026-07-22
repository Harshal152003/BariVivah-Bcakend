const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables manually from .env
try {
    const envPath = path.resolve(__dirname, '..', '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        if (!line || line.startsWith('#')) return;

        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            const cleanValue = value.replace(/^["']|["']$/g, '');
            process.env[key] = cleanValue;
        }
    });
} catch (e) {
    console.log('⚠️ Could not load .env file, relying on system environment variables.');
}

const { Schema } = mongoose;

// Minimal User Schema for deletion operation
const userSchema = new Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Keep other schemas clean in case they have hooks
const InterestSchema = new Schema({}, { strict: false });
const Interest = mongoose.models.Interest || mongoose.model('Interest', InterestSchema);

const ContactUnlockSchema = new Schema({}, { strict: false });
const ContactUnlock = mongoose.models.ContactUnlock || mongoose.model('ContactUnlock', ContactUnlockSchema);

async function deleteCandidateProfiles() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not set in environment!");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("Connected to MongoDB successfully!");

        console.log("Starting deletion of candidate profiles...");
        
        // 1. Delete all user profiles
        const userDeleteResult = await User.deleteMany({});
        console.log(`Successfully deleted ${userDeleteResult.deletedCount} candidate profiles from the User collection.`);

        // 2. Clear mutual matching / interests relationships to prevent orphan data reference errors
        const interestDeleteResult = await Interest.deleteMany({});
        console.log(`Successfully deleted ${interestDeleteResult.deletedCount} records from the Interest collection.`);

        // 3. Clear contact unlock history records
        const contactDeleteResult = await ContactUnlock.deleteMany({});
        console.log(`Successfully deleted ${contactDeleteResult.deletedCount} records from the ContactUnlock collection.`);

        console.log("All candidate data deleted successfully!");
        mongoose.connection.close();
        process.exit(0);

    } catch (err) {
        console.error("Deletion process failed:", err);
        process.exit(1);
    }
}

deleteCandidateProfiles();
