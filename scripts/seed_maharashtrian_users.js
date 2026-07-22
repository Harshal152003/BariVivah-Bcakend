const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

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

// Config Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const { Schema } = mongoose;

// User schema matching User.js model exactly
const userSchema = new Schema({
    name: String,
    phone: { type: String, unique: true },
    email: { type: String, unique: true },
    gender: String,
    dob: Date,
    religion: { type: String, default: 'Hindu' },
    caste: { type: String, default: 'Bari' },
    subCaste: String,
    currentCity: String,
    education: String,
    occupation: String,
    income: String,
    maritalStatus: String,
    height: String,
    bloodGroup: String,
    diet: String,
    gothra: String,
    mangal: String,
    birthTime: String,
    birthPlace: String,
    rashi: String,
    isVerified: { type: Boolean, default: true },
    profileCompletion: { type: Number, default: 85 },
    profilePhoto: String,
    photos: [{
        url: String,
        isPrimary: { type: Boolean, default: false }
    }],
    subscription: {
        plan: { type: String, default: 'free' },
        isSubscribed: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const dummyUsers = [
  // --- 15 MALES ---
  {
    name: "Aditya Joshi",
    phone: "+919000000001",
    email: "aditya.joshi@example.com",
    gender: "Male",
    dob: new Date("1994-06-15"),
    currentCity: "Pune",
    education: "M.Tech (Computer Science)",
    occupation: "Senior Software Engineer",
    income: "18-25 Lakhs",
    maritalStatus: "Never Married",
    height: "5'10\"",
    bloodGroup: "O+",
    diet: "Veg",
    gothra: "Sandilya",
    mangal: "No",
    birthTime: "08:30 AM",
    birthPlace: "Pune",
    rashi: "Gemini",
    tempImageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Rahul Patil",
    phone: "+919000000002",
    email: "rahul.patil@example.com",
    gender: "Male",
    dob: new Date("1993-11-05"),
    currentCity: "Nashik",
    education: "B.E. (Mechanical)",
    occupation: "Assistant Manager",
    income: "8-12 Lakhs",
    maritalStatus: "Never Married",
    height: "5'9\"",
    bloodGroup: "B+",
    diet: "Non-Veg",
    gothra: "Bharadwaj",
    mangal: "No",
    birthTime: "11:15 AM",
    birthPlace: "Nashik",
    rashi: "Scorpio",
    tempImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Swapnil More",
    phone: "+919000000003",
    email: "swapnil.more@example.com",
    gender: "Male",
    dob: new Date("1991-04-18"),
    currentCity: "Mumbai",
    education: "MCA",
    occupation: "Tech Lead",
    income: "25-35 Lakhs",
    maritalStatus: "Never Married",
    height: "5'8\"",
    bloodGroup: "A+",
    diet: "Non-Veg",
    gothra: "Gautama",
    mangal: "No",
    birthTime: "02:45 PM",
    birthPlace: "Mumbai",
    rashi: "Taurus",
    tempImageUrl: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Aniket Sawant",
    phone: "+919000000004",
    email: "aniket.sawant@example.com",
    gender: "Male",
    dob: new Date("1992-07-30"),
    currentCity: "Nagpur",
    education: "MBA (Marketing)",
    occupation: "Key Account Manager",
    income: "12-18 Lakhs",
    maritalStatus: "Never Married",
    height: "5'11\"",
    bloodGroup: "O-",
    diet: "Non-Veg",
    gothra: "Angiras",
    mangal: "Yes",
    birthTime: "06:10 PM",
    birthPlace: "Nagpur",
    rashi: "Leo",
    tempImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Manoj Gadkari",
    phone: "+919000000005",
    email: "manoj.gadkari@example.com",
    gender: "Male",
    dob: new Date("1990-12-05"),
    currentCity: "Aurangabad",
    education: "M.D. (Medicine)",
    occupation: "Consultant Doctor",
    income: "35+ Lakhs",
    maritalStatus: "Never Married",
    height: "5'10\"",
    bloodGroup: "AB+",
    diet: "Veg",
    gothra: "Atri",
    mangal: "No",
    birthTime: "04:20 AM",
    birthPlace: "Aurangabad",
    rashi: "Sagittarius",
    tempImageUrl: "https://images.unsplash.com/photo-1618018352910-334fd7f24a16?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Abhishek Kulkarni",
    phone: "+919000000011",
    email: "abhishek.kulkarni@example.com",
    gender: "Male",
    dob: new Date("1994-09-12"),
    currentCity: "Thane",
    education: "B.Tech & MBA",
    occupation: "Product Manager",
    income: "18-25 Lakhs",
    maritalStatus: "Never Married",
    height: "5'11\"",
    bloodGroup: "B+",
    diet: "Veg",
    gothra: "Vasishta",
    mangal: "No",
    birthTime: "09:05 AM",
    birthPlace: "Mumbai",
    rashi: "Virgo",
    tempImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Vikram Shinde",
    phone: "+919000000012",
    email: "vikram.shinde@example.com",
    gender: "Male",
    dob: new Date("1993-02-18"),
    currentCity: "Satara",
    education: "B.Sc (Agriculture)",
    occupation: "Agribusiness Owner",
    income: "12-18 Lakhs",
    maritalStatus: "Never Married",
    height: "5'8\"",
    bloodGroup: "O+",
    diet: "Non-Veg",
    gothra: "Kashyap",
    mangal: "Yes",
    birthTime: "03:30 PM",
    birthPlace: "Satara",
    rashi: "Aquarius",
    tempImageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Siddharth Deshmukh",
    phone: "+919000000013",
    email: "siddharth.deshmukh@example.com",
    gender: "Male",
    dob: new Date("1995-05-24"),
    currentCity: "Pune",
    education: "M.S. (Mechanical Engineering)",
    occupation: "Research Engineer",
    income: "18-25 Lakhs",
    maritalStatus: "Never Married",
    height: "5'9\"",
    bloodGroup: "A-",
    diet: "Veg",
    gothra: "Gautama",
    mangal: "No",
    birthTime: "07:45 PM",
    birthPlace: "Pune",
    rashi: "Cancer",
    tempImageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Prathamesh Rane",
    phone: "+919000000014",
    email: "prathamesh.rane@example.com",
    gender: "Male",
    dob: new Date("1992-10-08"),
    currentCity: "Mumbai",
    education: "B.Com & CA",
    occupation: "Chartered Accountant",
    income: "18-25 Lakhs",
    maritalStatus: "Never Married",
    height: "5'7\"",
    bloodGroup: "B-",
    diet: "Veg",
    gothra: "Vatsa",
    mangal: "No",
    birthTime: "12:10 PM",
    birthPlace: "Ratnagiri",
    rashi: "Libra",
    tempImageUrl: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Aditya Phadke",
    phone: "+919000000015",
    email: "aditya.phadke@example.com",
    gender: "Male",
    dob: new Date("1996-01-29"),
    currentCity: "Kolhapur",
    education: "B.Arch",
    occupation: "Consulting Architect",
    income: "8-12 Lakhs",
    maritalStatus: "Never Married",
    height: "5'10\"",
    bloodGroup: "O+",
    diet: "Veg",
    gothra: "Atri",
    mangal: "Yes",
    birthTime: "08:15 AM",
    birthPlace: "Kolhapur",
    rashi: "Capricorn",
    tempImageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Akshay Gokhale",
    phone: "+919000000031",
    email: "akshay.gokhale@example.com",
    gender: "Male",
    dob: new Date("1993-07-14"),
    currentCity: "Pune",
    education: "MBA (Finance)",
    occupation: "Investment Banker",
    income: "25-35 Lakhs",
    maritalStatus: "Never Married",
    height: "5'11\"",
    bloodGroup: "A+",
    diet: "Veg",
    gothra: "Kashyap",
    mangal: "No",
    birthTime: "10:30 AM",
    birthPlace: "Pune",
    rashi: "Gemini",
    tempImageUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Nikhil Kadam",
    phone: "+919000000032",
    email: "nikhil.kadam@example.com",
    gender: "Male",
    dob: new Date("1991-09-02"),
    currentCity: "Mumbai",
    education: "B.E. (Civil)",
    occupation: "Project Manager",
    income: "12-18 Lakhs",
    maritalStatus: "Never Married",
    height: "5'8\"",
    bloodGroup: "B+",
    diet: "Non-Veg",
    gothra: "Bharadwaj",
    mangal: "No",
    birthTime: "05:50 PM",
    birthPlace: "Thane",
    rashi: "Virgo",
    tempImageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Sameer Naik",
    phone: "+919000000033",
    email: "sameer.naik@example.com",
    gender: "Male",
    dob: new Date("1994-04-20"),
    currentCity: "Goa",
    education: "Hotel Management",
    occupation: "Restaurant Owner",
    income: "18-25 Lakhs",
    maritalStatus: "Never Married",
    height: "5'9\"",
    bloodGroup: "O+",
    diet: "Non-Veg",
    gothra: "Sandilya",
    mangal: "No",
    birthTime: "01:25 PM",
    birthPlace: "Panaji",
    rashi: "Aries",
    tempImageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Gaurav Sutar",
    phone: "+919000000034",
    email: "gaurav.sutar@example.com",
    gender: "Male",
    dob: new Date("1995-12-18"),
    currentCity: "Sangli",
    education: "B.Des (UI/UX)",
    occupation: "Product Designer",
    income: "12-18 Lakhs",
    maritalStatus: "Never Married",
    height: "5'8\"",
    bloodGroup: "AB-",
    diet: "Veg",
    gothra: "Gautama",
    mangal: "No",
    birthTime: "11:40 PM",
    birthPlace: "Miraj",
    rashi: "Sagittarius",
    tempImageUrl: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Tejas Shinde",
    phone: "+919000000035",
    email: "tejas.shinde@example.com",
    gender: "Male",
    dob: new Date("1990-08-30"),
    currentCity: "Solapur",
    education: "M.Com",
    occupation: "Business Partner",
    income: "8-12 Lakhs",
    maritalStatus: "Never Married",
    height: "5'7\"",
    bloodGroup: "A+",
    diet: "Non-Veg",
    gothra: "Vasishta",
    mangal: "Yes",
    birthTime: "06:15 AM",
    birthPlace: "Solapur",
    rashi: "Leo",
    tempImageUrl: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=400"
  },

  // --- 15 FEMALES ---
  {
    name: "Priyanka Shinde",
    phone: "+919000000006",
    email: "priyanka.shinde@example.com",
    gender: "Female",
    dob: new Date("1997-03-22"),
    currentCity: "Mumbai",
    education: "MBA (Finance)",
    occupation: "Financial Analyst",
    income: "12-18 Lakhs",
    maritalStatus: "Never Married",
    height: "5'5\"",
    bloodGroup: "B+",
    diet: "Veg",
    gothra: "Kashyap",
    mangal: "No",
    birthTime: "02:10 PM",
    birthPlace: "Mumbai",
    rashi: "Aries",
    tempImageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Sneha Kulkarni",
    phone: "+919000000007",
    email: "sneha.kulkarni@example.com",
    gender: "Female",
    dob: new Date("1996-08-10"),
    currentCity: "Pune",
    education: "M.Sc. (Microbiology)",
    occupation: "Research Scientist",
    income: "8-12 Lakhs",
    maritalStatus: "Never Married",
    height: "5'4\"",
    bloodGroup: "AB+",
    diet: "Veg",
    gothra: "Vasishta",
    mangal: "No",
    birthTime: "10:05 AM",
    birthPlace: "Pune",
    rashi: "Leo",
    tempImageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Tanvi Deshmukh",
    phone: "+919000000008",
    email: "tanvi.deshmukh@example.com",
    gender: "Female",
    dob: new Date("1995-10-22"),
    currentCity: "Thane",
    education: "B.Arch",
    occupation: "Interior Designer",
    income: "12-18 Lakhs",
    maritalStatus: "Never Married",
    height: "5'6\"",
    bloodGroup: "O+",
    diet: "Veg",
    gothra: "Kashyap",
    mangal: "No",
    birthTime: "07:30 AM",
    birthPlace: "Thane",
    rashi: "Libra",
    tempImageUrl: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Tejaswini Chavan",
    phone: "+919000000009",
    email: "tejaswini.chavan@example.com",
    gender: "Female",
    dob: new Date("1998-05-12"),
    currentCity: "Kolhapur",
    education: "B.Pharm",
    occupation: "Pharmacist",
    income: "5-8 Lakhs",
    maritalStatus: "Never Married",
    height: "5'3\"",
    bloodGroup: "B-",
    diet: "Veg",
    gothra: "Vatsa",
    mangal: "Yes",
    birthTime: "04:15 PM",
    birthPlace: "Kolhapur",
    rashi: "Virgo",
    tempImageUrl: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Vaishali Patil",
    phone: "+919000000010",
    email: "vaishali.patil@example.com",
    gender: "Female",
    dob: new Date("1994-11-28"),
    currentCity: "Mumbai",
    education: "M.Com",
    occupation: "Chartered Accountant",
    income: "18-25 Lakhs",
    maritalStatus: "Never Married",
    height: "5'5\"",
    bloodGroup: "O-",
    diet: "Veg",
    gothra: "Bharadwaj",
    mangal: "No",
    birthTime: "09:45 AM",
    birthPlace: "Jalgaon",
    rashi: "Scorpio",
    tempImageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Anjali Shinde",
    phone: "+919000000021",
    email: "anjali.shinde@example.com",
    gender: "Female",
    dob: new Date("1996-12-05"),
    currentCity: "Pune",
    education: "B.E. (Information Technology)",
    occupation: "Software Engineer",
    income: "12-18 Lakhs",
    maritalStatus: "Never Married",
    height: "5'4\"",
    bloodGroup: "A+",
    diet: "Veg",
    gothra: "Sandilya",
    mangal: "No",
    birthTime: "01:40 PM",
    birthPlace: "Pune",
    rashi: "Sagittarius",
    tempImageUrl: "https://images.unsplash.com/photo-1631130362583-c90fb53ddc2a?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Shraddha Bhide",
    phone: "+919000000022",
    email: "shraddha.bhide@example.com",
    gender: "Female",
    dob: new Date("1993-04-14"),
    currentCity: "Mumbai",
    education: "MBA (HR)",
    occupation: "HR Manager",
    income: "12-18 Lakhs",
    maritalStatus: "Never Married",
    height: "5'6\"",
    bloodGroup: "B+",
    diet: "Veg",
    gothra: "Gautama",
    mangal: "No",
    birthTime: "11:20 AM",
    birthPlace: "Mumbai",
    rashi: "Aries",
    tempImageUrl: "https://images.unsplash.com/photo-1604004555489-723a93d6ce74?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Komal Mahajan",
    phone: "+919000000023",
    email: "komal.mahajan@example.com",
    gender: "Female",
    dob: new Date("1995-09-02"),
    currentCity: "Nashik",
    education: "M.A. (English)",
    occupation: "Content Specialist",
    income: "5-8 Lakhs",
    maritalStatus: "Never Married",
    height: "5'3\"",
    bloodGroup: "O+",
    diet: "Veg",
    gothra: "Bharadwaj",
    mangal: "Yes",
    birthTime: "06:10 AM",
    birthPlace: "Nashik",
    rashi: "Virgo",
    tempImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Sayali Sawant",
    phone: "+919000000024",
    email: "sayali.sawant@example.com",
    gender: "Female",
    dob: new Date("1997-07-18"),
    currentCity: "Satara",
    education: "B.Sc (Nursing)",
    occupation: "Staff Nurse",
    income: "5-8 Lakhs",
    maritalStatus: "Never Married",
    height: "5'5\"",
    bloodGroup: "A-",
    diet: "Non-Veg",
    gothra: "Vasishta",
    mangal: "No",
    birthTime: "03:45 PM",
    birthPlace: "Satara",
    rashi: "Cancer",
    tempImageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Prachi Kadam",
    phone: "+919000000025",
    email: "prachi.kadam@example.com",
    gender: "Female",
    dob: new Date("1994-02-28"),
    currentCity: "Aurangabad",
    education: "BDS",
    occupation: "Dental Surgeon",
    income: "18-25 Lakhs",
    maritalStatus: "Never Married",
    height: "5'4\"",
    bloodGroup: "AB+",
    diet: "Veg",
    gothra: "Atri",
    mangal: "No",
    birthTime: "08:15 AM",
    birthPlace: "Aurangabad",
    rashi: "Capricorn",
    tempImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Pallavi More",
    phone: "+919000000041",
    email: "pallavi.more@example.com",
    gender: "Female",
    dob: new Date("1995-10-10"),
    currentCity: "Kolhapur",
    education: "M.Pharm",
    occupation: "Quality Analyst",
    income: "8-12 Lakhs",
    maritalStatus: "Never Married",
    height: "5'4\"",
    bloodGroup: "B+",
    diet: "Veg",
    gothra: "Sandilya",
    mangal: "Yes",
    birthTime: "09:30 AM",
    birthPlace: "Kolhapur",
    rashi: "Libra",
    tempImageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Swara Joshi",
    phone: "+919000000042",
    email: "swara.joshi@example.com",
    gender: "Female",
    dob: new Date("1998-01-15"),
    currentCity: "Thane",
    education: "B.Sc (Animation)",
    occupation: "Animator / Illustrator",
    income: "8-12 Lakhs",
    maritalStatus: "Never Married",
    height: "5'5\"",
    bloodGroup: "O+",
    diet: "Veg",
    gothra: "Kashyap",
    mangal: "No",
    birthTime: "04:50 PM",
    birthPlace: "Mumbai",
    rashi: "Capricorn",
    tempImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Rutuja Tawde",
    phone: "+919000000043",
    email: "rutuja.tawde@example.com",
    gender: "Female",
    dob: new Date("1992-06-25"),
    currentCity: "Mumbai",
    education: "LL.B",
    occupation: "Corporate Lawyer",
    income: "18-25 Lakhs",
    maritalStatus: "Never Married",
    height: "5'6\"",
    bloodGroup: "A+",
    diet: "Non-Veg",
    gothra: "Bharadwaj",
    mangal: "No",
    birthTime: "11:05 AM",
    birthPlace: "Mumbai",
    rashi: "Cancer",
    tempImageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Dipali Gadkari",
    phone: "+919000000044",
    email: "dipali.gadkari@example.com",
    gender: "Female",
    dob: new Date("1994-08-08"),
    currentCity: "Nagpur",
    education: "B.E. (Chemical)",
    occupation: "Process Engineer",
    income: "12-18 Lakhs",
    maritalStatus: "Never Married",
    height: "5'5\"",
    bloodGroup: "B-",
    diet: "Veg",
    gothra: "Gautama",
    mangal: "No",
    birthTime: "01:30 PM",
    birthPlace: "Nagpur",
    rashi: "Leo",
    tempImageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Snehal Rane",
    phone: "+919000000045",
    email: "snehal.rane@example.com",
    gender: "Female",
    dob: new Date("1996-03-30"),
    currentCity: "Ratnagiri",
    education: "M.A. (Psychology)",
    occupation: "Counselor",
    income: "5-8 Lakhs",
    maritalStatus: "Never Married",
    height: "5'3\"",
    bloodGroup: "O-",
    diet: "Veg",
    gothra: "Vatsa",
    mangal: "No",
    birthTime: "08:15 AM",
    birthPlace: "Ratnagiri",
    rashi: "Aries",
    tempImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
  }
];

async function seed() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not set in environment!");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("Connected to MongoDB successfully!");

        console.log("Starting Dummy Maharashtrian Users Seeding...");
        console.log(`Cloudinary Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);

        for (const user of dummyUsers) {
            console.log(`\n--------------------------------------------`);
            console.log(`Processing user: ${user.name} (${user.gender})`);

            // 1. Delete existing user with same email or phone to keep DB clean
            await User.deleteMany({
                $or: [
                    { phone: user.phone },
                    { email: user.email }
                ]
            });
            console.log(`Deleted existing users matching phone ${user.phone} / email ${user.email}`);

            // 2. Upload photo from Unsplash direct to Cloudinary
            let cloudinaryUrl = "";
            try {
                console.log(`Uploading portrait from Unsplash to Cloudinary...`);
                const uploadResult = await cloudinary.uploader.upload(user.tempImageUrl, {
                    folder: 'matrimony-profiles',
                    resource_type: 'image'
                });
                cloudinaryUrl = uploadResult.secure_url;
                console.log(`✅ Uploaded to Cloudinary successfully! URL: ${cloudinaryUrl}`);
            } catch (err) {
                console.warn(`❌ Cloudinary upload failed for ${user.name}:`, err.message || err);
                cloudinaryUrl = user.tempImageUrl; // Fallback to raw unsplash URL if upload fail
            }

            // 3. Create database document payload
            const dbPayload = {
                name: user.name,
                phone: user.phone,
                email: user.email,
                gender: user.gender,
                dob: user.dob,
                currentCity: user.currentCity,
                education: user.education,
                occupation: user.occupation,
                income: user.income,
                maritalStatus: user.maritalStatus,
                height: user.height,
                bloodGroup: user.bloodGroup,
                diet: user.diet,
                gothra: user.gothra,
                mangal: user.mangal,
                birthTime: user.birthTime,
                birthPlace: user.birthPlace,
                rashi: user.rashi,
                religion: "Hindu",
                caste: "Bari",
                subCaste: "Bari",
                isVerified: true,
                profileCompletion: 90,
                profilePhoto: cloudinaryUrl,
                photos: [{
                    url: cloudinaryUrl,
                    isPrimary: true
                }],
                subscription: {
                    plan: 'premium',
                    isSubscribed: true
                }
            };

            // 4. Save to MongoDB
            const newUser = await User.create(dbPayload);
            console.log(`✅ User registered in MongoDB with ID: ${newUser._id}`);
        }

        console.log("\n============================================");
        console.log("🎉 Seeding 30 Maharashtrian users completed successfully!");
        mongoose.connection.close();
        process.exit(0);

    } catch (err) {
        console.error("❌ Seeding process failed:", err);
        process.exit(1);
    }
}

seed();
