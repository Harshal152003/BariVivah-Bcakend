import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

  name: String,
  profileId: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    index: true,
    trim: true,
  },
  phone: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\+91\d{10}$/.test(v); // Validates Indian phone numbers with +91 prefix
      },
      message: props => `${props.value} is not a valid Indian phone number!`
    }
  },

  // Photos Array
  photos: [{
    url: String,
    isPrimary: { type: Boolean, default: false }
  }],

  // Verification status
  isVerified: {
    type: Boolean,
    default: false, // Overall account verification status
    description:
      "Indicates if the user has completed full profile verification",
  },
  phoneIsVerified: {
    type: Boolean,
    default: false, // Specific phone verification status
    description: "Indicates if the phone number has been verified via OTP",
  },
  verificationRequested: {
    type: Boolean,
    default: false, // Profile verification request status
    description: "Indicates if user has requested profile verification",
  },
  verificationStatus: {
    type: String,
    enum: ["Unverified", "Pending", "Verified", "Rejected"],
    default: "Unverified",
  },
  verificationSelfieUrl: { type: String, default: null },
  verificationDocType: { type: String, default: null },
  verificationDocUrl: { type: String, default: null },
  verificationRejectReason: { type: String, default: null },
  verificationSubmittedAt: { type: Date, default: null },
  verificationApprovedAt: { type: Date, default: null },
  profileCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Profile information
  gender: {
    type: String,
    // enum: ["Male", "Female", "Other", null],
    default: null,
  },
  dob: Date, // Date of Birth
  height: String,
  religion: { type: String, default: "Hindu" },
  currentCity: String,
  state: String,
  education: String,

  profilePhoto: String,
  maritalStatus: {
    type: String,
    // enum: ["Unmarried", "Divorced", "Widowed"],
    default: "Unmarried",
  },
  divorceDate: { type: Date, default: null },
  motherTongue:
  {
    type: String,
    // enum:['Hindi', 'English', 'Marathi', null],
    default: null
  },
  caste: { type: String, default: "Bari" },
  subCaste: String,
  gothra: String,
  fieldOfStudy: String,
  college: String,
  occupation: String,
  company: String,
  permanentAddress: String,

  income: { type: String, default: null },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        // Allow null/undefined/empty string
        if (!v) return true;
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    default: null
  },
  bloodGroup: {
    type: String,
    // enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
    default: null
  },
  wearsLens: {
    type: String,
  },
  bio: String,
  about: String,
  description: String,
  familyType: String,
  fatherOccupation: String,
  motherOccupation: String,
  siblings: String,
  nativePlace: String,
  diet: String,
  createdFor: { type: String, default: 'Self' },
  workSector: { type: String, default: 'Private Sector' },
  livesWithFamily: { type: String, default: 'Yes' },
  familyFinancialStatus: { type: String, default: 'Middle Class' },
  smokingDrinking: String,
  hobbies: String,
  expectedProfession: String,
  expectedLocation: String,
  expectedCommunity: String,
  // Relative Info
  fatherName: String,
  parentResidenceCity: String,
  mother: String,
  brothers: { type: Number, default: 0 },
  marriedBrothers: { type: Number, default: 0 },
  sisters: { type: Number, default: 0 },
  marriedSisters: { type: Number, default: 0 },
  nativeDistrict: String,
  nativeCity: String,
  familyWealth: String,
  relativeSurname: {
    type: [String],
  },
  parentOccupation: String,
  mamaSurname: String,
  mamaContact: String,

  // Horoscope Info
  rashi: String,
  mangal: { type: String },
  birthPlace: String,
  birthTime: String,
  kundali: { type: String, default: null },
  //sample
  // Expectations
  expectedCaste: { type: String, default: "Bari" },
  expectedSubCaste: { type: String, default: null },
  preferredCity: { type: String, default: null },
  expectedAgeDifference: { type: String, default: null },
  expectedEducation: { type: String, default: null },
  expectedWorkingStatus: { type: String, default: null }, // "Yes", "No", "Doesn't Matter"
  divorcee: { type: String, default: null }, // "Yes" or "No"
  expectedHeight: { type: String, default: null },
  expectedIncome: { type: String, default: null },

  // Preferences
  preferences: {
    ageRange: {
      min: { type: Number, min: 18, max: 100 },
      max: { type: Number, min: 18, max: 100 },
    },
    religion: String,
    caste: String,
    city: String,
  },

  // GPS & Location Info
  location: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    currentCity: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: 'India' },
    formattedAddress: { type: String, default: null },
    permissionGranted: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: null }
  },

  // Privacy settings
  privacySettings: {
    showname: { type: Boolean, default: false },
    showPhoto: { type: Boolean, default: false },
    showContact: { type: Boolean, default: false },
  },

  // Subscription
  subscription: {
    plan: {
      type: String,
      default: 'free'
    },
    isSubscribed: {
      type: Boolean,
      default: false, // Indicates if the user has an active subscription
    },
    expiresAt: Date,
    startDate: Date,
    transactionId: String, // ID from payment gateway
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    // Entitlement snapshots
    contactUnlockLimit: { type: Number, default: 0 },
    contactsUsed: { type: Number, default: 0 },
    chatEnabled: { type: Boolean, default: false },
    visitorHistory: { type: Boolean, default: false },
    profileBoosts: { type: Number, default: 0 },
    advancedFilters: { type: Boolean, default: false }
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: Date,


  //form fillup option for user 
  profileSetup: {
    willAdminFill: Boolean,  // true if admin should fill, false if user will fill
    dontAskAgain: Boolean,   // true if we shouldn't show popup again
  },
});

// Auto-generate standardized profileId (BV-XXXXXX) if not explicitly set
UserSchema.pre('save', function (next) {
  if (!this.profileId && this._id) {
    this.profileId = `BV-${this._id.toString().slice(-6).toUpperCase()}`;
  }
  next();
});

// --- HIGH PERFORMANCE DATABASE INDEXES (Scale to 10,000+ Users) ---
UserSchema.index({ profileId: 1 });
UserSchema.index({ gender: 1, isVerified: 1, createdAt: -1 });
UserSchema.index({ caste: 1, currentCity: 1, isVerified: 1 });
UserSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

delete mongoose.models.User; // Remove existing model if it exists
export default mongoose.models.User || mongoose.model("User", UserSchema);
