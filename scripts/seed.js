const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Schema } = mongoose;

// Load .env manually to avoid 'dotenv' dependency issues
try {
    const envPath = path.resolve(__dirname, '..', '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        // Skip empty lines or comments
        if (!line || line.startsWith('#')) return;

        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            // Join all remaining parts back together in case the value contains '='
            const value = parts.slice(1).join('=').trim();
            // Remove generic quotes if present
            const cleanValue = value.replace(/^["']|["']$/g, '');
            process.env[key] = cleanValue;
        }
    });
} catch (e) {
    console.log('⚠️ Could not load .env file, relying on system environment variables.');
}

// --- Mongoose Models (Re-defined for standalone script to avoid Next.js import issues) ---

// Admin Schema
const adminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin'
    }
});

// Employee Schema
const employeeSchema = new Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Manager', 'Employee'], default: 'Employee' },
    status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
    permissions: {
        overview: { type: Boolean, default: false },
        userManagement: { type: Boolean, default: false },
        verification: { type: Boolean, default: false },
        payment: { type: Boolean, default: false },
        report: { type: Boolean, default: false },
        setting: { type: Boolean, default: false }
    },
    department: { type: String, trim: true },
    position: { type: String, trim: true },
    joined: { type: Date, default: Date.now },
    lastLogin: { type: Date }
}, {
    timestamps: true
});

// Subscription Schema
const subscriptionSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        durationInDays: { type: Number, required: true },
        features: {
            contactUnlockLimit: { type: Number, default: 0 },
            chatEnabled: { type: Boolean, default: false },
            visitorHistory: { type: Boolean, default: false },
            profileBoosts: { type: Number, default: 0 },
            advancedFilters: { type: Boolean, default: false }
        },
        displayFeatures: [String],
        isActive: { type: Boolean, default: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

// FormSection Schema
const fieldSchema = new mongoose.Schema({
    name: String,
    label: String,
    type: { type: String, enum: ['text', 'number', 'select', 'date', 'checkbox', 'textarea'] },
    required: Boolean,
    options: [String], // For select fields
    placeholder: String,
    order: Number
});

const sectionSchema = new mongoose.Schema({
    name: String,
    label: String,
    icon: String,
    order: Number,
    fields: [fieldSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


// User Schema (Simplified version of models/User.js for seeding)
const UserSchema = new Schema({
    name: String,
    phone: { type: String, unique: true },
    email: { type: String, unique: true },
    gender: { type: String, default: null },
    dob: Date,
    religion: String,
    caste: String,
    subCaste: String,
    currentCity: String,
    education: String,
    occupation: String,
    income: { type: String, default: null },
    maritalStatus: { type: String, default: "Unmarried" },
    motherTongue: { type: String, default: null },
    height: String,
    weight: String,
    complexion: String,
    bloodGroup: { type: String, default: null },

    // Privacy
    isVerified: { type: Boolean, default: true },
    profileCompletion: { type: Number, default: 80 },

    // Subscription
    subscription: {
        plan: { type: String, default: 'free' },
        isSubscribed: { type: Boolean, default: false }
    },

    createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
const FormSection = mongoose.models.FormSection || mongoose.model('FormSection', sectionSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// --- Sample Data Generators ---

const predefinedAdmins = [
    {
        username: "superadmin",
        password: "superadmin123",
        role: "superadmin"
    },
    {
        username: "admin@gmail.com",
        password: "admin123",
        role: "admin"
    }
];

const subscriptionPlans = [
    {
        name: "Silver Plan",
        price: 499,
        durationInDays: 30,
        features: {
            contactUnlockLimit: 10,
            chatEnabled: true,
            visitorHistory: false,
            profileBoosts: 0,
            advancedFilters: false
        },
        displayFeatures: ["View up to 10 contacts", "Send up to 20 messages", "Profile highlighting"]
    },
    {
        name: "Gold Plan",
        price: 999,
        durationInDays: 90,
        features: {
            contactUnlockLimit: 50,
            chatEnabled: true,
            visitorHistory: true,
            profileBoosts: 5,
            advancedFilters: true
        },
        displayFeatures: ["View up to 50 contacts", "Unlimited messages", "Priority support", "Profile highlighting"]
    },
    {
        name: "Platinum Plan",
        price: 2499,
        durationInDays: 365,
        features: {
            contactUnlockLimit: 9999,
            chatEnabled: true,
            visitorHistory: true,
            profileBoosts: 20,
            advancedFilters: true
        },
        displayFeatures: ["Unlimited contacts", "Unlimited messages", "Relationship manager", "Top of search results"]
    }
];

const sampleEmployees = [
    {
        name: "Ravi Kumar",
        username: "ravi.kumar",
        email: "ravi.kumar@example.com",
        phone: "+919988776655",
        password: "employee123",
        role: "Manager",
        department: "Operations",
        position: "Senior Manager",
        permissions: {
            overview: true,
            userManagement: true,
            verification: true,
            payment: true,
            report: true,
            setting: false
        }
    },
    {
        name: "Anita Singh",
        username: "anita.singh",
        email: "anita.singh@example.com",
        phone: "+919988776656",
        password: "employee123",
        role: "Employee",
        department: "Customer Support",
        position: "Support Executive",
        permissions: {
            overview: true,
            userManagement: true,
            verification: true,
            payment: false,
            report: false,
            setting: false
        }
    },
    {
        name: "Suresh Verma",
        username: "suresh.verma",
        email: "suresh.verma@example.com",
        phone: "+919988776657",
        password: "employee123",
        role: "Employee",
        department: "Verification",
        position: "Verification Officer",
        permissions: {
            overview: false,
            userManagement: false,
            verification: true,
            payment: false,
            report: true,
            setting: false
        }
    }
];

const formSections = [
    {
        name: "section-basic-info",
        label: "Basic Information",
        icon: "User",
        order: 1,
        fields: [
            { name: "name", label: "Full Name", type: "text", required: true, order: 1 },
            { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], required: true, order: 2 },
            { name: "dob", label: "Date of Birth", type: "date", required: true, order: 3 },
            { name: "maritalStatus", label: "Marital Status", type: "select", options: ["Unmarried", "Divorced", "Widowed"], required: true, order: 4 },
            { name: "height", label: "Height", type: "text", required: true, order: 5 },
            { name: "weight", label: "Weight", type: "text", required: true, order: 6 },
            { name: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: false, order: 7 },
            { name: "complexion", label: "Complexion", type: "select", options: ["Fair", "Wheatish", "Dark"], required: false, order: 8 },
            { name: "motherTongue", label: "Mother Tongue", type: "select", options: ["Hindi", "English", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Punjabi"], required: true, order: 9 },
            { name: "currentCity", label: "Current City", type: "text", required: true, order: 10 },
            { name: "permanentAddress", label: "Permanent Address", type: "textarea", required: true, order: 11 },
            { name: "wearsLens", label: "Wears Lens", type: "select", options: ["Yes", "No"], required: false, order: 12 }
        ]
    },
    {
        name: "section-education-profession",
        label: "Education & Profession",
        icon: "Briefcase",
        order: 2,
        fields: [
            { name: "education", label: "Highest Education", type: "select", options: ["High School", "Bachelor's", "Master's", "Doctorate", "Diploma", "Other"], required: true, order: 1 },
            { name: "occupation", label: "Occupation", type: "text", required: true, order: 2 },
            { name: "income", label: "Annual Income", type: "select", options: ["0-2 Lakhs", "2-5 Lakhs", "5-8 Lakhs", "8-12 Lakhs", "12-18 Lakhs", "18-25 Lakhs", "25-35 Lakhs", "35+ Lakhs"], required: true, order: 3 },
            { name: "fieldOfStudy", label: "Field of Study", type: "text", required: false, order: 4 },
            { name: "college", label: "College/University", type: "text", required: false, order: 5 },
            { name: "company", label: "Company", type: "text", required: false, order: 6 }
        ]
    },
    {
        name: "section-1752492308390",
        label: "Religious & Community",
        icon: "User",
        order: 3,
        fields: [
            { name: "subCaste", label: "Sub Caste", type: "text", required: false, order: 1 },
            { name: "gothra", label: "Gothra", type: "text", required: false, order: 2 }
        ]
    },
    {
        name: "section-1752482037997",
        label: "Relative Information",
        icon: "User",
        order: 4,
        fields: [
            { name: "fatherName", label: "Father's Name", type: "text", required: true, order: 1 },
            { name: "mother", label: "Mother's Name", type: "text", required: true, order: 2 },
            { name: "brothers", label: "No. of Brothers", type: "number", required: false, order: 3 },
            { name: "marriedBrothers", label: "Married Brothers", type: "number", required: false, order: 4 },
            { name: "sisters", label: "No. of Sisters", type: "number", required: false, order: 5 },
            { name: "marriedSisters", label: "Married Sisters", type: "number", required: false, order: 6 },
            { name: "parentResidenceCity", label: "Parent's Residence City", type: "text", required: false, order: 7 },
            { name: "nativeDistrict", label: "Native District", type: "text", required: false, order: 8 },
            { name: "nativeCity", label: "Native City", type: "text", required: false, order: 9 },
            { name: "familyWealth", label: "Family Wealth", type: "text", required: false, placeholder: "e.g. 50 Lakhs, 1 Crore", order: 10 },
            { name: "parentOccupation", label: "Parent's Occupation", type: "text", required: false, order: 11 },
            { name: "mamaSurname", label: "Mama's Surname", type: "text", required: false, order: 12 },
            { name: "relativeSurname", label: "Relative Surnames", type: "text", required: false, placeholder: "Comma separated", order: 13 }
        ]
    },
    {
        name: "section-1752492699329",
        label: "Horoscope Information",
        icon: "User",
        order: 5,
        fields: [
            { name: "rashi", label: "Rashi", type: "select", options: ["Mesh", "Vrishabh", "Mithun", "Kark", "Simha", "Kanya", "Tula", "Vrishchik", "Dhanu", "Makar", "Kumbh", "Meen"], required: false, order: 1 },
            { name: "nakshatra", label: "Nakshatra", type: "text", required: false, order: 2 },
            { name: "charan", label: "Charan", type: "text", required: false, order: 3 },
            { name: "gan", label: "Gan", type: "text", required: false, order: 4 },
            { name: "nadi", label: "Nadi", type: "text", required: false, order: 5 },
            { name: "mangal", label: "Mangal", type: "select", options: ["Yes", "No", "Anshik"], required: false, order: 6 },
            { name: "birthPlace", label: "Birth Place", type: "text", required: false, order: 7 },
            { name: "birthTime", label: "Birth Time", type: "text", required: false, order: 8 },
            { name: "gotraDevak", label: "Gotra Devak", type: "text", required: false, order: 9 }
        ]
    },
    {
        name: "section-1752493374295",
        label: "Expectations",
        icon: "User",
        order: 6,
        fields: [
            { name: "expectedHeight", label: "Expected Height", type: "select", options: ["4'5\" - 5'0\"", "5'0\" - 5'5\"", "5'5\" - 6'0\"", "6'0\"+"], required: false, order: 1 },
            { name: "expectedEducation", label: "Expected Education", type: "select", options: ["High School", "Bachelor's", "Master's", "Doctorate", "Diploma", "Other"], required: false, order: 3 },
            { name: "preferredCity", label: "Preferred City", type: "text", placeholder: "Enter Preferred City", required: false, order: 4 },
            { name: "expectedAgeDifference", label: "Expected Age Difference", type: "select", options: ["1-3 Years", "3-5 Years", "5-7 Years", "7+ Years"], required: false, order: 5 },
            { name: "expectedIncome", label: "Expected Income", type: "select", options: ["0-2 Lakhs", "2-5 Lakhs", "5-8 Lakhs", "8-12 Lakhs", "12-18 Lakhs", "18-25 Lakhs", "25-35 Lakhs", "35+ Lakhs"], required: false, order: 6 },
            { name: "divorcee", label: "Accept Divorcee", type: "select", options: ["Yes", "No"], required: false, order: 7 }
        ]
    }
];

const sampleUsers = [
    {
        name: "Aarav Sharma",
        phone: "+919876543210",
        email: "aarav.sharma@example.com",
        gender: "Male",
        dob: new Date("1995-08-15"),
        religion: "Hindu",
        caste: "Bari",
        subCaste: "Kanyakubja",
        currentCity: "Mumbai",
        education: "Bachelor's",
        occupation: "Software Engineer",
        income: "18-25 Lakhs",
        maritalStatus: "Unmarried",
        motherTongue: "Hindi",
        height: "5'10\"",
        weight: "75 kg",
        complexion: "Fair",
        bloodGroup: "O+",
        isVerified: true
    },
    {
        name: "Priya Patel",
        phone: "+919876543211",
        email: "priya.patel@example.com",
        gender: "Female",
        dob: new Date("1997-05-20"),
        religion: "Hindu",
        caste: "Bari",
        subCaste: "Leuva",
        currentCity: "Ahmedabad",
        education: "Master's",
        occupation: "Marketing Manager",
        income: "12-18 Lakhs",
        maritalStatus: "Unmarried",
        motherTongue: "Gujarati",
        height: "5'5\"",
        weight: "55 kg",
        complexion: "Wheatish",
        bloodGroup: "B+",
        isVerified: true
    },
    {
        name: "Rohan Deshmukh",
        phone: "+919876543212",
        email: "rohan.deshmukh@example.com",
        gender: "Male",
        dob: new Date("1992-11-10"),
        religion: "Hindu",
        caste: "Bari",
        subCaste: "96 Kuli",
        currentCity: "Pune",
        education: "Master's",
        occupation: "Civil Engineer",
        income: "12-18 Lakhs",
        maritalStatus: "Divorced",
        motherTongue: "Marathi",
        height: "5'11\"",
        weight: "80 kg",
        complexion: "Wheatish",
        bloodGroup: "A+",
        isVerified: true
    },
    {
        name: "Sneha Reddy",
        phone: "+919876543213",
        email: "sneha.reddy@example.com",
        gender: "Female",
        dob: new Date("1996-03-25"),
        religion: "Hindu",
        caste: "Bari",
        subCaste: null,
        currentCity: "Hyderabad",
        education: "Doctorate",
        occupation: "Doctor",
        income: "18-25 Lakhs",
        maritalStatus: "Unmarried",
        motherTongue: "Telugu",
        height: "5'6\"",
        weight: "60 kg",
        complexion: "Fair",
        bloodGroup: "AB+",
        isVerified: true
    },
    {
        name: "Vikram Singh",
        phone: "+919876543214",
        email: "vikram.singh@example.com",
        gender: "Male",
        dob: new Date("1994-01-30"),
        religion: "Hindu",
        caste: "Bari",
        subCaste: null,
        currentCity: "Chandigarh",
        education: "Master's",
        occupation: "Business Owner",
        income: "35+ Lakhs",
        maritalStatus: "Unmarried",
        motherTongue: "Punjabi",
        height: "6'0\"",
        weight: "85 kg",
        complexion: "Fair",
        bloodGroup: "O-",
        isVerified: true
    },
    {
        name: "Meera Iyer",
        phone: "+919876543215",
        email: "meera.iyer@example.com",
        gender: "Female",
        dob: new Date("1998-07-12"),
        religion: "Hindu",
        caste: "Bari",
        subCaste: "Iyer",
        currentCity: "Chennai",
        education: "Master's",
        occupation: "Professor",
        income: "8-12 Lakhs",
        maritalStatus: "Unmarried",
        motherTongue: "Tamil",
        height: "5'4\"",
        weight: "52 kg",
        complexion: "Fair",
        bloodGroup: "B+",
        isVerified: true
    },
    {
        name: "Arjun Nair",
        phone: "+919876543216",
        email: "arjun.nair@example.com",
        gender: "Male",
        dob: new Date("1993-09-05"),
        religion: "Hindu",
        caste: "Bari",
        subCaste: null,
        currentCity: "Kochi",
        education: "Bachelor's",
        occupation: "Architect",
        income: "12-18 Lakhs",
        maritalStatus: "Unmarried",
        motherTongue: "Malayalam",
        height: "5'9\"",
        weight: "72 kg",
        complexion: "Wheatish",
        bloodGroup: "A-",
        isVerified: true
    },
    {
        name: "Ananya Gupta",
        phone: "+919876543217",
        email: "ananya.gupta@example.com",
        gender: "Female",
        dob: new Date("1996-12-01"),
        religion: "Hindu",
        caste: "Bari",
        subCaste: "Gupta",
        currentCity: "Delhi",
        education: "Master's",
        occupation: "Chartered Accountant",
        income: "18-25 Lakhs",
        maritalStatus: "Unmarried",
        motherTongue: "Hindi",
        height: "5'3\"",
        weight: "50 kg",
        complexion: "Fair",
        bloodGroup: "O+",
        isVerified: true
    },
    {
        name: "Mohammed Khan",
        phone: "+919876543218",
        email: "mohammed.khan@example.com",
        gender: "Male",
        dob: new Date("1991-04-18"),
        religion: "Hindu",
        caste: "Bari",
        subCaste: null,
        currentCity: "Lucknow",
        education: "Master's",
        occupation: "Software Developer",
        income: "12-18 Lakhs",
        maritalStatus: "Unmarried",
        motherTongue: "Urdu",
        height: "5'10\"",
        weight: "78 kg",
        complexion: "Wheatish",
        bloodGroup: "B-",
        isVerified: true
    },
    {
        name: "Kavita Joshi",
        phone: "+919876543219",
        email: "kavita.joshi@example.com",
        gender: "Female",
        dob: new Date("1995-10-22"),
        religion: "Hindu",
        caste: "Bari",
        subCaste: "Deshastha",
        currentCity: "Pune",
        education: "Master's",
        occupation: "Content Writer",
        income: "5-8 Lakhs",
        maritalStatus: "Unmarried",
        motherTongue: "Marathi",
        height: "5'2\"",
        weight: "48 kg",
        complexion: "Fair",
        bloodGroup: "AB-",
        isVerified: true
    }
];

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI is not defined in .env file");
        process.exit(1);
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB");

        // --- Seed Admins ---
        console.log("Seeding Admins...");
        // Optional: Clear existing admins to avoid conflicts or just upsert
        // await Admin.deleteMany({}); // Uncomment to clear all admins first

        for (const adminData of predefinedAdmins) {
            const existingAdmin = await Admin.findOne({ username: adminData.username });
            if (existingAdmin) {
                console.log(`⚠️ Admin ${adminData.username} already exists. Skipping.`);
            } else {
                await Admin.create(adminData);
                console.log(`✅ Created Admin: ${adminData.username} (${adminData.role})`);
            }
        }

        // --- Seed Employees ---
        console.log("Seeding Employees...");
        for (const empData of sampleEmployees) {
            const existingEmp = await Employee.findOne({ $or: [{ username: empData.username }, { email: empData.email }] });
            if (existingEmp) {
                console.log(`⚠️ Employee ${empData.username} already exists. Skipping.`);
            } else {
                await Employee.create(empData);
                console.log(`✅ Created Employee: ${empData.name} (${empData.role})`);
            }
        }

        // --- Seed Subscriptions ---
        console.log("Seeding Subscription Plans...");
        // We treat subscription plans as just documents in the Subscription collection
        // that might serve as 'templates' or 'active' plans?
        // The model implies user-specific subscriptions with 'userId'.
        // But usually 'Plans' are a separate collection.
        // The USER asked to "create subscription plans".
        // Looking at the schema: it has `userId`.
        // If `userId` is optional (it is not marked required), then these can be Plan templates.
        // Let's check the schema again. `userId` is NOT required.
        // So I will create these as templates without `userId`.

        for (const planData of subscriptionPlans) {
            const existingPlan = await Subscription.findOne({ name: planData.name, userId: null });
            if (existingPlan) {
                console.log(`⚠️ Plan ${planData.name} already exists. Skipping.`);
            } else {
                await Subscription.create(planData);
                console.log(`✅ Created Plan: ${planData.name}`);
            }
        }

        // --- Seed Form Sections ---
        // --- Seed Form Sections ---
        console.log("Seeding Form Sections...");
        for (const sectionData of formSections) {
            const updatedSection = await FormSection.findOneAndUpdate(
                { name: sectionData.name },
                sectionData,
                { upsert: true, new: true }
            );
            console.log(`✅ Upserted Section: ${sectionData.label}`);
        }

        // --- Seed Users ---
        console.log("Seeding Users...");
        // Optional: Clear existing users
        // await User.deleteMany({}); // Uncomment to clear all users first

        for (const userData of sampleUsers) {
            const existingUser = await User.findOne({ $or: [{ email: userData.email }, { phone: userData.phone }] });
            if (existingUser) {
                console.log(`⚠️ User ${userData.name} already exists. Skipping.`);
            } else {
                await User.create(userData);
                console.log(`✅ Created User: ${userData.name}`);
            }
        }

        console.log("🎉 Seeding completed successfully!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
