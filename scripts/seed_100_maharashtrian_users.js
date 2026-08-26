const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env
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

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  phone: { type: String, unique: true },
  email: { type: String, unique: true, sparse: true },
  gender: String,
  dob: Date,
  height: String,
  religion: { type: String, default: 'Hindu' },
  caste: { type: String, default: 'Bari' },
  subCaste: String,
  gothra: String,
  currentCity: String,
  state: { type: String, default: 'Maharashtra' },
  education: String,
  fieldOfStudy: String,
  college: String,
  occupation: String,
  company: String,
  workSector: { type: String, default: 'Private Sector' },
  income: String,
  permanentAddress: String,
  bloodGroup: String,
  wearsLens: String,
  bio: String,
  about: String,
  diet: String,
  motherTongue: { type: String, default: 'Marathi' },
  maritalStatus: { type: String, default: 'Unmarried' },
  createdFor: { type: String, default: 'Self' },
  familyType: { type: String, default: 'Nuclear Family' },
  familyFinancialStatus: { type: String, default: 'Middle Class' },
  fatherName: String,
  fatherOccupation: String,
  parentOccupation: String,
  mother: String,
  motherOccupation: String,
  brothers: { type: Number, default: 0 },
  marriedBrothers: { type: Number, default: 0 },
  sisters: { type: Number, default: 0 },
  marriedSisters: { type: Number, default: 0 },
  nativePlace: String,
  nativeDistrict: String,
  nativeCity: String,
  parentResidenceCity: String,
  mamaSurname: String,
  relativeSurname: [String],
  rashi: String,
  mangal: String,
  birthPlace: String,
  birthTime: String,
  hobbies: String,
  expectedCaste: { type: String, default: 'Bari' },
  expectedEducation: String,
  expectedProfession: String,
  expectedLocation: String,
  expectedHeight: String,
  expectedIncome: String,
  isVerified: { type: Boolean, default: true },
  phoneIsVerified: { type: Boolean, default: true },
  verificationStatus: { type: String, default: 'Verified' },
  profileCompletion: { type: Number, default: 92 },
  profilePhoto: String,
  photos: [{
    url: String,
    isPrimary: { type: Boolean, default: false }
  }],
  subscription: {
    plan: { type: String, default: 'free' },
    isSubscribed: { type: Boolean, default: false }
  },
  location: {
    latitude: Number,
    longitude: Number,
    currentCity: String,
    state: String,
    country: { type: String, default: 'India' },
    permissionGranted: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Curated High Quality Unsplash Portrait Photos for Indian Males & Females
const MALE_PHOTOS = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
];

const FEMALE_PHOTOS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600"
];

// Helper data generator lists
const MAHARASHTRIAN_MALE_NAMES = [
  "Rahul Pawar", "Swapnil Patil", "Aditya Deshmukh", "Rohan Kulkarni", "Tanmay Joshi",
  "Sameer Shinde", "Nikhil More", "Omkar Jadhav", "Sanket Gaikwad", "Tejas Bhosale",
  "Akshay Kamble", "Prathamesh Sawant", "Harshal Wagh", "Abhishek Kadam", "Vikram Salunkhe",
  "Saurabh Thorat", "Chaitanya Rane", "Varun Mane", "Vishal Mhatre", "Rohit Kale",
  "Aniket Bandgar", "Prasad Gavali", "Tushar Chaudhari", "Mandar Phadke", "Siddhesh Mahajan",
  "Gaurav Dhage", "Mayur Jagtap", "Avinash Shirke", "Prashant Shelke", "Hrishikesh Barve",
  "Bhushan Godse", "Chetan Borse", "Dhananjay Nimbalkar", "Ganesh Dhumal", "Jayesh Suryavanshi",
  "Kedar Bhave", "Mahesh Khot", "Navnath Ghadge", "Parag Bapat", "Rajesh Landge",
  "Shrikant Gupte", "Sumeet Nalawade", "Vinay Tambe", "Yashwant Gore", "Yogesh Pisal",
  "Amol Sonawane", "Devendra Narvekar", "Hemant Divekar", "Rushikesh Mohite", "Shailesh Karande"
];

const MAHARASHTRIAN_FEMALE_NAMES = [
  "Ananya Pawar", "Snehal Patil", "Pooja Deshmukh", "Rashmi Kulkarni", "Neha Joshi",
  "Priya Shinde", "Rutuja More", "Swati Jadhav", "Priyanka Gaikwad", "Sayali Bhosale",
  "Divya Kamble", "Ashwini Sawant", "Pragati Wagh", "Shweta Kadam", "Komal Salunkhe",
  "Madhuri Thorat", "Rucha Rane", "Meenal Mane", "Vaishnavi Mhatre", "Tanvi Kale",
  "Aarti Bandgar", "Pallavi Gavali", "Tejal Chaudhari", "Mansi Phadke", "Shruti Mahajan",
  "Gayatri Dhage", "Monali Jagtap", "Aditi Shirke", "Preeti Shelke", "Hrishita Barve",
  "Bhavana Godse", "Chetna Borse", "Deepali Nimbalkar", "Gauri Dhumal", "Jyoti Suryavanshi",
  "Kasturi Bhave", "Mayuri Khot", "Namrata Ghadge", "Poorva Bapat", "Radhika Landge",
  "Shraddha Gupte", "Sonal Nalawade", "Vidya Tambe", "Yogita Gore", "Archana Pisal",
  "Varsha Sonawane", "Dipali Narvekar", "Harshada Divekar", "Ritu Mohite", "Seema Karande"
];

const CITIES = [
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Thane", lat: 19.2183, lng: 72.9781 },
  { name: "Nashik", lat: 20.0059, lng: 73.7898 },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { name: "Chhatrapati Sambhajinagar", lat: 19.8762, lng: 75.3433 },
  { name: "Kolhapur", lat: 16.7050, lng: 74.2433 },
  { name: "Satara", lat: 17.6805, lng: 74.0183 },
  { name: "Sangli", lat: 16.8524, lng: 74.5815 },
  { name: "Solapur", lat: 17.6599, lng: 75.9064 },
  { name: "Navi Mumbai", lat: 19.0330, lng: 73.0297 },
  { name: "Ahmednagar", lat: 19.0948, lng: 74.7480 },
  { name: "Latur", lat: 18.4088, lng: 76.5604 },
  { name: "Jalgaon", lat: 21.0077, lng: 75.5626 },
  { name: "Amravati", lat: 20.9374, lng: 77.7796 }
];

const EDUCATIONS = [
  { edu: "B.Tech / B.E.", field: "Computer Engineering", college: "COEP Technological University, Pune" },
  { edu: "M.Tech", field: "Structural Engineering", college: "VJTI Mumbai" },
  { edu: "MBBS", field: "Medicine & Surgery", college: "B.J. Government Medical College, Pune" },
  { edu: "MD", field: "Internal Medicine", college: "Grant Government Medical College, Mumbai" },
  { edu: "MBA", field: "Finance & Marketing", college: "Symbiosis Institute of Business Management (SIBM), Pune" },
  { edu: "Chartered Accountant (CA)", field: "Audit & Taxation", college: "ICAI Institute" },
  { edu: "B.Com", field: "Banking & Accounts", college: "Brihan Maharashtra College of Commerce (BMCC), Pune" },
  { edu: "M.Sc", field: "Biotechnology", college: "Savitribai Phule Pune University" },
  { edu: "B.Arch", field: "Architecture & Design", college: "Sir J.J. College of Architecture, Mumbai" },
  { edu: "LL.B.", field: "Corporate Law", college: "ILS Law College, Pune" }
];

const PROFESSIONS = [
  { occ: "Senior Software Engineer", company: "TCS Innovation Labs", sector: "Private Sector", inc: "15-20 Lakhs" },
  { occ: "Senior Product Manager", company: "Infosys Technologies", sector: "Private Sector", inc: "20-30 Lakhs" },
  { occ: "Data Scientist & AI Specialist", company: "Accenture Digital", sector: "Private Sector", inc: "18-25 Lakhs" },
  { occ: "Doctor / Resident Physician", company: "Sahyadri Multi-Speciality Hospital", sector: "Private Sector", inc: "15-25 Lakhs" },
  { occ: "Chartered Accountant", company: "KPMG / Self-Practice Firm", sector: "Private Sector", inc: "12-18 Lakhs" },
  { occ: "Civil & Structural Consultant", company: "Larsen & Toubro Ltd", sector: "Private Sector", inc: "10-15 Lakhs" },
  { occ: "Assistant Manager", company: "HDFC Bank Ltd", sector: "Private Sector", inc: "8-12 Lakhs" },
  { occ: "Architectural Designer", company: "Design Studio Associates", sector: "Business / Self Employed", inc: "10-15 Lakhs" },
  { occ: "Business Owner & Founder", company: "Enterprise Solutions", sector: "Business / Self Employed", inc: "30-50 Lakhs" },
  { occ: "Government Executive Officer", company: "Government of Maharashtra", sector: "Government / PSU", inc: "10-15 Lakhs" }
];

const GOTHRA_LIST = ["Kashyap", "Vashishta", "Bharadwaj", "Sandilya", "Gautam", "Jamadagni", "Atri", "Agastya", "Kaushik"];
const RASHI_LIST = ["Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", "Kark (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchik (Scorpio)", "Dhanu (Sagittarius)", "Makar (Capricorn)", "Kumbha (Aquarius)", "Meen (Pisces)"];
const MANGAL_LIST = ["No", "No", "No", "Anshik Mangal", "Yes"];
const DIET_LIST = ["Vegetarian", "Vegetarian", "Non-Vegetarian", "Eggetarian"];
const HOBBIES_LIST = [
  "Sahyadri Trekking, Photography, Classical Music & Reading",
  "Cooking Maharashtrian Cuisine, Traveling, Badminton & Yoga",
  "Reading Non-Fiction, Music, Fitness Training & Exploring Cafes",
  "Watercolor Painting, Gardening, Swimming & Financial Investments",
  "Photography, Playing Guitar, Cycling & Watching Sci-Fi Movies"
];
const SURNAMES_LIST = ["Pawar", "Patil", "Deshmukh", "Kulkarni", "Joshi", "Shinde", "More", "Jadhav", "Gaikwad", "Bhosale", "Kamble", "Sawant", "Wagh", "Kadam", "Salunkhe", "Thorat", "Rane", "Mane", "Mhatre", "Kale"];

const MALE_HEIGHTS = ["5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\""];
const FEMALE_HEIGHTS = ["5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\""];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate Male Profiles
function generateMaleProfiles(count = 50) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const fullName = MAHARASHTRIAN_MALE_NAMES[i % MAHARASHTRIAN_MALE_NAMES.length];
    const surname = fullName.split(' ')[1];
    const phone = `+91981000${String(i + 1).padStart(4, '0')}`;
    const email = `${fullName.toLowerCase().replace(/ /g, '.')}.m${i + 1}@barivivah.test`;

    const cityObj = CITIES[i % CITIES.length];
    const eduObj = EDUCATIONS[i % EDUCATIONS.length];
    const profObj = PROFESSIONS[i % PROFESSIONS.length];

    const age = getRandomInt(25, 34);
    const birthYear = 2026 - age;
    const dob = new Date(`${birthYear}-${String(getRandomInt(1, 12)).padStart(2, '0')}-${String(getRandomInt(1, 28)).padStart(2, '0')}`);
    const heightStr = getRandomItem(MALE_HEIGHTS);

    const photoUrl = MALE_PHOTOS[i % MALE_PHOTOS.length];

    list.push({
      name: fullName,
      phone,
      email,
      gender: "Male",
      dob,
      height: heightStr,
      religion: "Hindu",
      caste: i % 10 === 0 ? "Maratha" : (i % 12 === 0 ? "Brahmin" : "Bari"),
      subCaste: "Bari / Maratha",
      gothra: getRandomItem(GOTHRA_LIST),
      currentCity: cityObj.name,
      state: "Maharashtra",
      education: eduObj.edu,
      fieldOfStudy: eduObj.field,
      college: eduObj.college,
      occupation: profObj.occ,
      company: profObj.company,
      workSector: profObj.sector,
      income: profObj.inc,
      permanentAddress: `Flat 40${i + 1}, Residency Complex, ${cityObj.name}, Maharashtra`,
      bloodGroup: getRandomItem(["A+", "B+", "O+", "AB+"]),
      wearsLens: getRandomItem(["No", "No", "Yes"]),
      bio: `Hello! I am ${fullName}, working as a ${profObj.occ} in ${cityObj.name}. I am a down-to-earth person balancing traditional family values with modern professional aspirations. Looking for a compatible life partner to share life's joyful journey.`,
      about: `Family oriented, career driven and passionate about ${getRandomItem(['trekking', 'reading', 'traveling'])}. Values open communication and mutual respect.`,
      diet: getRandomItem(DIET_LIST),
      motherTongue: "Marathi",
      maritalStatus: "Unmarried",
      createdFor: getRandomItem(["Self", "Parents", "Self"]),
      familyType: getRandomItem(["Nuclear Family", "Joint Family"]),
      familyFinancialStatus: getRandomItem(["Middle Class", "Upper Middle Class", "Upper Middle Class"]),
      fatherName: `Shri ${getRandomItem(MAHARASHTRIAN_MALE_NAMES.map(n => n.split(' ')[0]))} ${surname}`,
      fatherOccupation: getRandomItem(["Retired Government Officer", "Business Owner", "Senior Civil Engineer", "School Headmaster", "Agricultural Owner"]),
      parentOccupation: "Father in Service / Mother Homemaker",
      mother: `Smt. ${getRandomItem(MAHARASHTRIAN_FEMALE_NAMES.map(n => n.split(' ')[0]))} ${surname}`,
      motherOccupation: getRandomItem(["Homemaker", "Homemaker", "Retired School Teacher"]),
      brothers: getRandomInt(0, 2),
      marriedBrothers: getRandomInt(0, 1),
      sisters: getRandomInt(0, 2),
      marriedSisters: getRandomInt(0, 1),
      nativePlace: cityObj.name,
      nativeDistrict: cityObj.name,
      nativeCity: cityObj.name,
      parentResidenceCity: cityObj.name,
      mamaSurname: getRandomItem(SURNAMES_LIST),
      relativeSurname: [getRandomItem(SURNAMES_LIST), getRandomItem(SURNAMES_LIST)],
      rashi: getRandomItem(RASHI_LIST),
      mangal: getRandomItem(MANGAL_LIST),
      birthPlace: cityObj.name,
      birthTime: `${getRandomInt(6, 11)}:${getRandomInt(10, 55)} AM`,
      hobbies: getRandomItem(HOBBIES_LIST),
      expectedCaste: "Bari / Open",
      expectedEducation: "Graduate / Post Graduate",
      expectedProfession: "Working Professional / Doctor / Engineer",
      expectedLocation: "Pune / Mumbai / Anywhere in Maharashtra",
      expectedHeight: "5'2\" to 5'8\"",
      expectedIncome: "6+ Lakhs per annum",
      isVerified: true,
      phoneIsVerified: true,
      verificationStatus: "Verified",
      profileCompletion: getRandomInt(88, 98),
      profilePhoto: photoUrl,
      photos: [
        { url: photoUrl, isPrimary: true }
      ],
      subscription: {
        plan: i % 4 === 0 ? 'platinum' : (i % 2 === 0 ? 'gold' : 'free'),
        isSubscribed: i % 2 === 0
      },
      location: {
        latitude: cityObj.lat + (Math.random() * 0.04 - 0.02),
        longitude: cityObj.lng + (Math.random() * 0.04 - 0.02),
        currentCity: cityObj.name,
        state: "Maharashtra",
        country: "India",
        permissionGranted: true,
        lastUpdated: new Date()
      }
    });
  }
  return list;
}

// Generate Female Profiles
function generateFemaleProfiles(count = 50) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const fullName = MAHARASHTRIAN_FEMALE_NAMES[i % MAHARASHTRIAN_FEMALE_NAMES.length];
    const surname = fullName.split(' ')[1];
    const phone = `+91982000${String(i + 1).padStart(4, '0')}`;
    const email = `${fullName.toLowerCase().replace(/ /g, '.')}.f${i + 1}@barivivah.test`;

    const cityObj = CITIES[(i + 3) % CITIES.length];
    const eduObj = EDUCATIONS[(i + 2) % EDUCATIONS.length];
    const profObj = PROFESSIONS[(i + 1) % PROFESSIONS.length];

    const age = getRandomInt(23, 31);
    const birthYear = 2026 - age;
    const dob = new Date(`${birthYear}-${String(getRandomInt(1, 12)).padStart(2, '0')}-${String(getRandomInt(1, 28)).padStart(2, '0')}`);
    const heightStr = getRandomItem(FEMALE_HEIGHTS);

    const photoUrl = FEMALE_PHOTOS[i % FEMALE_PHOTOS.length];

    list.push({
      name: fullName,
      phone,
      email,
      gender: "Female",
      dob,
      height: heightStr,
      religion: "Hindu",
      caste: i % 10 === 0 ? "Maratha" : (i % 12 === 0 ? "Brahmin" : "Bari"),
      subCaste: "Bari / Maratha",
      gothra: getRandomItem(GOTHRA_LIST),
      currentCity: cityObj.name,
      state: "Maharashtra",
      education: eduObj.edu,
      fieldOfStudy: eduObj.field,
      college: eduObj.college,
      occupation: profObj.occ,
      company: profObj.company,
      workSector: profObj.sector,
      income: profObj.inc,
      permanentAddress: `Plot 12B, Green Park Colony, ${cityObj.name}, Maharashtra`,
      bloodGroup: getRandomItem(["A+", "B+", "O+", "AB+"]),
      wearsLens: getRandomItem(["No", "No", "Yes"]),
      bio: `Namaste! I am ${fullName}, based in ${cityObj.name}. Working as a ${profObj.occ}. I value family, cultural roots, and personal growth. Looking for an educated, understanding, and supportive partner.`,
      about: `Caring, optimistic and family-oriented. Enjoy ${getRandomItem(['classical music', 'painting', 'reading', 'cooking'])} and spending time with loved ones.`,
      diet: getRandomItem(DIET_LIST),
      motherTongue: "Marathi",
      maritalStatus: "Unmarried",
      createdFor: getRandomItem(["Self", "Parents", "Parents"]),
      familyType: getRandomItem(["Nuclear Family", "Joint Family"]),
      familyFinancialStatus: getRandomItem(["Middle Class", "Upper Middle Class", "Upper Middle Class"]),
      fatherName: `Shri ${getRandomItem(MAHARASHTRIAN_MALE_NAMES.map(n => n.split(' ')[0]))} ${surname}`,
      fatherOccupation: getRandomItem(["Bank Manager", "Business Owner", "Senior Executive Officer", "Advocate", "Professor"]),
      parentOccupation: "Father in Business / Mother Teacher",
      mother: `Smt. ${getRandomItem(MAHARASHTRIAN_FEMALE_NAMES.map(n => n.split(' ')[0]))} ${surname}`,
      motherOccupation: getRandomItem(["Homemaker", "School Teacher", "Homemaker"]),
      brothers: getRandomInt(0, 2),
      marriedBrothers: getRandomInt(0, 1),
      sisters: getRandomInt(0, 2),
      marriedSisters: getRandomInt(0, 1),
      nativePlace: cityObj.name,
      nativeDistrict: cityObj.name,
      nativeCity: cityObj.name,
      parentResidenceCity: cityObj.name,
      mamaSurname: getRandomItem(SURNAMES_LIST),
      relativeSurname: [getRandomItem(SURNAMES_LIST), getRandomItem(SURNAMES_LIST)],
      rashi: getRandomItem(RASHI_LIST),
      mangal: getRandomItem(MANGAL_LIST),
      birthPlace: cityObj.name,
      birthTime: `${getRandomInt(1, 10)}:${getRandomInt(10, 55)} PM`,
      hobbies: getRandomItem(HOBBIES_LIST),
      expectedCaste: "Bari / Open",
      expectedEducation: "B.E. / B.Tech / MBA / Post Graduate",
      expectedProfession: "Software Engineer / Doctor / Corporate Officer / Business",
      expectedLocation: "Pune / Mumbai / Nashik / Thane / Maharashtra",
      expectedHeight: "5'6\" to 6'2\"",
      expectedIncome: "10+ Lakhs per annum",
      isVerified: true,
      phoneIsVerified: true,
      verificationStatus: "Verified",
      profileCompletion: getRandomInt(90, 98),
      profilePhoto: photoUrl,
      photos: [
        { url: photoUrl, isPrimary: true }
      ],
      subscription: {
        plan: i % 3 === 0 ? 'gold' : 'free',
        isSubscribed: i % 3 === 0
      },
      location: {
        latitude: cityObj.lat + (Math.random() * 0.04 - 0.02),
        longitude: cityObj.lng + (Math.random() * 0.04 - 0.02),
        currentCity: cityObj.name,
        state: "Maharashtra",
        country: "India",
        permissionGranted: true,
        lastUpdated: new Date()
      }
    });
  }
  return list;
}

// Master Seeding Execution
async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    const males = generateMaleProfiles(50);
    const females = generateFemaleProfiles(50);

    const allProfiles = [...males, ...females];

    console.log(`Preparing to seed ${allProfiles.length} profiles (50 Males & 50 Females)...`);

    // Remove any previous test profiles with @barivivah.test emails or matching test phone numbers
    const deleteResult = await User.deleteMany({
      $or: [
        { email: { $regex: /@barivivah\.test$/i } },
        { phone: { $regex: /^\+9198100/ } },
        { phone: { $regex: /^\+9198200/ } }
      ]
    });
    console.log(`Cleaned up ${deleteResult.deletedCount} existing test seed profiles.`);

    // Insert 100 profiles cleanly
    const inserted = await User.insertMany(allProfiles);
    console.log(`✅ Successfully seeded ${inserted.length} candidate profiles into database!`);

    const maleCount = await User.countDocuments({ gender: 'Male' });
    const femaleCount = await User.countDocuments({ gender: 'Female' });
    const totalCount = await User.countDocuments();

    console.log('\n--- DATABASE USERS SUMMARY ---');
    console.log(`Total Candidates in Database: ${totalCount}`);
    console.log(`Total Male Profiles: ${maleCount}`);
    console.log(`Total Female Profiles: ${femaleCount}`);
    console.log('-------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seedDatabase();
