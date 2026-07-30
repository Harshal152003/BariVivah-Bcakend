"use client"
import { useState, useEffect } from 'react';
import {
  ArrowRight, Phone, Shield, RotateCcw, Edit, User, Mail, Lock,
  UserCheck, Check, Camera, Image as ImageIcon, MapPin, Calendar,
  Heart, Eye, EyeOff, X, Sparkles, ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import Image from 'next/image';

// Data lists for the registration steps
const stateList = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh',
  'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const cityMap = {
  'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Sri Potti Sriramulu Nellore', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa', 'Eluru', 'Kakinada', 'Nandyal', 'Bapatla', 'NTR District', 'Palnadu', 'Manyam', 'Anakapalli', 'Konaseema', 'Tirupati', 'Sri Satya Sai', 'Annamayya'],
  'Arunachal Pradesh': ['Tawang', 'West Kameng', 'East Kameng', 'Papum Pare', 'Kurung Kumey', 'Kra Daadi', 'Lower Subansiri', 'Upper Subansiri', 'West Siang', 'East Siang', 'Siang', 'Upper Siang', 'Lower Siang', 'Lower Dibang Valley', 'Dibang Valley', 'Anjaw', 'Lohit', 'Namsai', 'Changlang', 'Tirap', 'Longding', 'Kamle', 'Lepa Rada', 'Pakke Kessang', 'Shi Yomi'],
  'Assam': ['Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong', 'Tamulpur', 'Bajali'],
  'Bihar': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'],
  'Chhattisgarh': ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja', 'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki', 'Sakti', 'Sarangarh-Bilaigarh', 'Khairagarh-Chhuikhadan-Gandai'],
  'Goa': ['North Goa', 'South Goa'],
  'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Dahod', 'Devbhumi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'The Dangs', 'Vadodara', 'Valsad', 'Botad', 'Chhota Udepur'],
  'Haryana': ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'],
  'Himachal Pradesh': ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'],
  'Jharkhand': ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribag', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Saraikela-Kharsawan', 'Simdega', 'West Singhbhum'],
  'Karnataka': ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir', 'Vijayanagara'],
  'Kerala': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'],
  'Madhya Pradesh': ['Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha', 'Niwari', 'Mauganj'],
  'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
  'Manipur': ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Ukhrul'],
  'Meghalaya': ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'],
  'Mizoram': ['Aizawl', 'Champhai', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Serchhip', 'Hnahthial', 'Khawzawl', 'Saitual'],
  'Nagaland': ['Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Noklak', 'Peren', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto', 'Chümoukedima', 'Niuland', 'Tseminyu'],
  'Odisha': ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Sonepur', 'Sundargarh'],
  'Punjab': ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar (Mohali)', 'Sangrur', 'Shahid Bhagat Singh Nagar', 'Tarn Taran', 'Malerkotla'],
  'Rajasthan': ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur', 'Anupgarh', 'Balotra', 'Beawar', 'Deeg', 'Didwana-Kuchaman', 'Dudu', 'Gangapur City', 'Kekri', 'Khairthal-Tijara', 'Neem Ka Thana', 'Phalodi', 'Salumber', 'Sanchore', 'Shahpura'],
  'Sikkim': ['Gangtok', 'Gyalshing', 'Pakyong', 'Soreng', 'Mangan', 'Namchi'],
  'Tamil Nadu': ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tuvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'],
  'Telangana': ['Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Hanamkonda', 'Yadadri Bhuvanagiri'],
  'Tripura': ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'],
  'Uttarakhand': ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'],
  'Uttar Pradesh': ['Agra', 'Aligarh', 'Prayagraj (Allahabad)', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Buldhana', 'Buxar', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'],
  'West Bengal': ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'],
  'Andaman and Nicobar Islands': ['Nicobar', 'North and Middle Andaman', 'South Andaman'],
  'Chandigarh': ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Dadra and Nagar Haveli', 'Daman', 'Diu'],
  'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
  'Jammu and Kashmir': ['Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua', 'Kishnagar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur', 'Kishtwar'],
  'Ladakh': ['Kargil', 'Leh'],
  'Lakshadweep': ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Bitra', 'Chetlat', 'Kadmat', 'Kalpeni', 'Kiltan', 'Minicoy'],
  'Puducherry': ['Karaikal', 'Mahe', 'Puducherry', 'Yanam']
};

const heightList = [
  "4'8\"", "4'9\"", "4'10\"", "4'11\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"",
  "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\""
];

const dietList = ['Veg', 'Non-Veg'];

const qualificationList = [
  'B.E / B.Tech', 'M.E / M.Tech', 'MBA / PGDM', 'MCA', 'B.Sc', 'M.Sc',
  'B.Com', 'M.Com', 'B.A', 'M.A', 'BCA', 'BCS', 'BBA', 'MBBS',
  'MD / MS (Medical)', 'BDS / MDS', 'B.Pharm / M.Pharm', 'B.Arch',
  'M.Arch', 'LL.B / LL.M', 'CA / CS / ICWA', 'Ph.D / Doctorate',
  'Diploma', '12th Pass (HSC)', '10th Pass (SSC)', 'Other'
];

const incomeList = [
  '₹0 - 3 LPA', '₹3 - 6 LPA', '₹6 - 10 LPA', '₹10 - 15 LPA', '₹15 - 20 LPA',
  '₹20 - 25 LPA', '₹25 - 30 LPA', '₹30 - 35 LPA', '₹35 - 40 LPA',
  '₹40 - 50 LPA', '₹50+ LPA'
];

const workSectorList = [
  'Private Company', 'Government', 'Defence / Civil Services', 'Business',
  'Farmer', 'Not Working'
];

const relationList = [
  { label: 'Myself', val: 'Self' },
  { label: 'My Brother', val: 'Brother' },
  { label: 'My Sister', val: 'Sister' },
  { label: 'My Son', val: 'Son' },
  { label: 'My Daughter', val: 'Daughter' },
  { label: 'My Relative', val: 'Relative' }
];

const familyTypeList = ['Joint', 'Nuclear'];
const familyValuesList = ['Traditional', 'Moderate', 'Liberal'];

export default function MatrimonialLogin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [currentStep, setCurrentStep] = useState(1); // 1 to 9 for register wizard
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const { login, user, refreshUser } = useSession();

  // Login inputs
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form states - Step 1: For Whom + Gender
  const [createdFor, setCreatedFor] = useState('Self');
  const [gender, setGender] = useState('Male');

  // Form states - Step 2: Basic credentials
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState('');

  // Form states - Step 3: Profile attributes
  const [heightVal, setHeightVal] = useState("5'5\"");
  const [maritalStatus, setMaritalStatus] = useState('Never Married');
  const [divorceDate, setDivorceDate] = useState('');
  const [motherTongue, setMotherTongue] = useState('Hindi');
  const [religion, setReligion] = useState('Hindu');
  const [sect, setSect] = useState('');
  const [caste, setCaste] = useState('Bari');
  const [subcaste, setSubcaste] = useState('');
  const [manglik, setManglik] = useState('No');
  const [gotra, setGotra] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthTime, setBirthTime] = useState('');

  // Form states - Step 4: Career & About
  const [education, setEducation] = useState('B.E / B.Tech');
  const [customEducation, setCustomEducation] = useState('');
  const [profession, setProfession] = useState('');
  const [income, setIncome] = useState('₹3 - 6 LPA');
  const [workSector, setWorkSector] = useState('Private Company');
  const [occupation, setOccupation] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Form states - Step 6: Photos
  const [photoUri, setPhotoUri] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form states - Step 7: OTP validation
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [registeredUserId, setRegisteredUserId] = useState('');

  // Form states - Step 8: Family details
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [brothers, setBrothers] = useState(0);
  const [sisters, setSisters] = useState(0);
  const [marriedBrothers, setMarriedBrothers] = useState(0);
  const [marriedSisters, setMarriedSisters] = useState(0);
  const [mamaSurname, setMamaSurname] = useState('');
  const [familyType, setFamilyType] = useState('Joint');
  const [familyValues, setFamilyValues] = useState('Traditional');
  const [familyNativePlace, setFamilyNativePlace] = useState('');

  // Form states - Step 9: Partner preferences
  const [partnerAgeMin, setPartnerAgeMin] = useState(21);
  const [partnerAgeMax, setPartnerAgeMax] = useState(30);
  const [partnerHeightMin, setPartnerHeightMin] = useState("5'0\"");
  const [partnerHeightMax, setPartnerHeightMax] = useState("6'0\"");
  const [partnerMaritalStatus, setPartnerMaritalStatus] = useState('Never Married');
  const [partnerReligion, setPartnerReligion] = useState('Hindu');
  const [partnerMotherTongue, setPartnerMotherTongue] = useState('Hindi');
  const [partnerSect, setPartnerSect] = useState('');
  const [partnerCaste, setPartnerCaste] = useState('Bari');
  const [partnerManglik, setPartnerManglik] = useState('No');
  const [partnerEducation, setPartnerEducation] = useState('B.E / B.Tech');
  const [partnerIncomeMin, setPartnerIncomeMin] = useState('₹3 - 6 LPA');

  // Terms modal
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [termsModalType, setTermsModalType] = useState('terms');

  // States & Cities lists for search autocomplete dropdowns
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [state, setState] = useState('');

  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [city, setCity] = useState('');

  useEffect(() => {
    setIsLoaded(true);
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Resend OTP countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle slide transitions and auto OTP trigger
  useEffect(() => {
    if (currentStep === 5) {
      const timer = setTimeout(() => {
        setCurrentStep(6);
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (currentStep === 7 && !isOtpSent) {
      handleSendRegisterOTP();
    }
  }, [currentStep]);

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!loginPhone.trim()) {
      setError('Please enter your mobile number');
      return;
    }
    const cleanPhone = loginPhone.replace(/\s/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          password: loginPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await login(data.user.phone);
        await refreshUser();
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid mobile number or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP triggers
  const handleSendRegisterOTP = async () => {
    setError('');
    const cleanPhone = phone.replace(/\s/g, '');
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: cleanPhone })
      });
      const data = await response.json();
      if (data.success) {
        setIsOtpSent(true);
        setResendTimer(30);
      } else {
        setError(data.message || 'Failed to send OTP code.');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleVerifyRegisterOTP = async () => {
    setError('');
    const otpString = otpCode.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const cleanPhone = phone.replace(/\s/g, '');
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: cleanPhone, otp: otpString })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        await registerUserRecord();
      } else {
        setError(data.error || 'Invalid OTP code. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('OTP verify error:', err);
      setError('Verification network failure. Please check server.');
      setIsLoading(false);
    }
  };

  const registerUserRecord = async () => {
    try {
      const cleanPhone = phone.replace(/\s/g, '');
      const registerData = {
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        password: password,
        gender: gender,
        createdFor: createdFor,
        state: state,
        currentCity: city,
        religion: religion,
        caste: caste,
        sect: sect || undefined,
        subcaste: subcaste || undefined,
        gotra: gotra || undefined,
        birthPlace: birthPlace || undefined,
        birthTime: birthTime || undefined,
        manglik: manglik,
        maritalStatus: maritalStatus,
        divorceDate: maritalStatus === 'Divorced' && divorceDate ? divorceDate : undefined,
        height: heightVal,
        diet: 'Veg',
        education: education === 'Other' ? customEducation.trim() : education,
        income: income,
        workSector: workSector,
        occupation: occupation.trim() || undefined,
        profilePhoto: photoUri || undefined,
        dob: dob
      };

      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setRegisteredUserId(data.user.id || data.user._id);
        await login(cleanPhone);
        await refreshUser();
        setCurrentStep(8);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration API error:', err);
      setError('Registration failed due to connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload Photo
  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data })
        });
        const data = await response.json();
        if (response.ok && data.url) {
          setPhotoUri(data.url);
        } else {
          setError(data.error || 'Failed to upload photo');
        }
      } catch (err) {
        console.error('Upload photo error:', err);
        setError('Network failure uploading image file.');
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Family Details (Step 8)
  const handleFamilyDetailsSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: registeredUserId,
          fatherOccupation: fatherOccupation.trim() || undefined,
          motherOccupation: motherOccupation.trim() || undefined,
          brothers: Number(brothers),
          sisters: Number(sisters),
          marriedBrothers: Number(marriedBrothers),
          marriedSisters: Number(marriedSisters),
          mamekul: mamaSurname.trim() || undefined, // SurName matches mamekul under industry standard Surname Label
          familyType,
          familyValues,
          familyNativePlace: familyNativePlace.trim() || undefined
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCurrentStep(9);
      } else {
        setError(data.message || 'Failed to update family details. You can skip this step.');
        setCurrentStep(9);
      }
    } catch (err) {
      console.error('Family update error:', err);
      setCurrentStep(9);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Partner Preferences (Step 9)
  const handlePreferencesSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: registeredUserId,
          partnerPreferences: {
            ageMin: Number(partnerAgeMin),
            ageMax: Number(partnerAgeMax),
            heightMin: partnerHeightMin,
            heightMax: partnerHeightMax,
            maritalStatus: partnerMaritalStatus,
            religion: partnerReligion,
            motherTongue: partnerMotherTongue,
            sect: partnerSect || undefined,
            caste: partnerCaste,
            manglik: partnerManglik,
            education: partnerEducation,
            incomeMin: partnerIncomeMin
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        await refreshUser();
        router.push('/dashboard');
      } else {
        setError(data.message || 'Failed to save preferences.');
      }
    } catch (err) {
      console.error('Preferences update error:', err);
      setError('Connection failed. Redirecting you to home.');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Steps Navigations Validation
  const validateStep2 = () => {
    setError('');
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!email.trim() || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.toLowerCase().trim())) {
      setError('Please enter a valid email address');
      return;
    }
    if (!dob) {
      setError('Please select/enter your Date of Birth');
      return;
    }
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
      setError('Please enter a valid Date of Birth (YYYY-MM-DD)');
      return;
    }
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const requiredAge = gender === 'Male' ? 21 : 18;
    if (age < requiredAge) {
      setError(`Legal age for registration is ${requiredAge} for ${gender} candidates`);
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setCurrentStep(3);
  };

  const validateStep3 = () => {
    setError('');
    if (!state) {
      setError('Please select your state');
      return;
    }
    if (!city) {
      setError('Please select your city');
      return;
    }
    if (maritalStatus === 'Divorced') {
      if (!divorceDate) {
        setError('Please select/enter the Date of Divorce');
        return;
      }
      const parsedDiv = new Date(divorceDate);
      if (isNaN(parsedDiv.getTime()) || parsedDiv > Date.now()) {
        setError('Please select a valid past Date of Divorce');
        return;
      }
    }
    setCurrentStep(4);
  };

  const validateStep4 = () => {
    setError('');
    if (education === 'Other' && !customEducation.trim()) {
      setError('Please specify your Highest Qualification');
      return;
    }
    if (!acceptTerms) {
      setError('You must accept the Terms & Conditions and Privacy Policy');
      return;
    }
    setCurrentStep(5);
  };

  const handleStepBack = () => {
    setError('');
    if (currentStep === 6) {
      setCurrentStep(4);
    } else if (currentStep === 8) {
      setCurrentStep(6);
    } else if (currentStep === 9) {
      setCurrentStep(8);
    } else {
      setCurrentStep(prev => Math.max(1, prev - 1));
    }
  };

  const handleOTPInput = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value && index < 5) {
      const nextIn = document.getElementById(`otp-${index + 1}`);
      if (nextIn) nextIn.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevIn = document.getElementById(`otp-${index - 1}`);
      if (prevIn) prevIn.focus();
    }
  };

  const formatPhoneDisplay = (p) => {
    return p.replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  // State search list filter
  const filteredStates = stateList.filter(s =>
    s.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );

  // City search list filter based on selected state
  const filteredCities = (state && cityMap[state])
    ? cityMap[state].filter(c => c.toLowerCase().includes(citySearchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-white to-primary/5 flex items-center justify-center px-4 py-8 sm:px-6 relative overflow-hidden select-none">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-secondary/10 blur-3xl opacity-40 animate-pulse"></div>
      </div>

      <div className={`relative w-full max-w-lg transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>

        {/* Registration Progress Indicator */}
        {activeTab === 'signup' && currentStep !== 5 && (
          <div className="mb-6 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/50 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">Onboarding Wizard</span>
              <span className="text-xs font-bold text-gray-500">Step {currentStep} of 9</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 9) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 overflow-hidden">

          {/* Header Block */}
          {currentStep !== 5 && (
            <div className="text-center px-8 pt-8 pb-4">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logo.png"
                  width={200}
                  height={60}
                  className="h-12 w-auto object-contain"
                  alt="BariVivah Logo"
                  priority
                />
              </div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                {activeTab === 'login' ? 'Welcome Back' : (
                  currentStep === 8 ? 'Family Profile' :
                    currentStep === 9 ? 'Partner Preferences' : 'Create Account'
                )}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {activeTab === 'login' ? 'Sign in to access matches' : 'Register to find your perfect match'}
              </p>
            </div>
          )}

          {/* Switch Tab (Only Step 1 to 4) */}
          {activeTab === 'signup' && currentStep > 4 ? null : (
            currentStep === 1 && (
              <div className="flex border-b border-gray-100/80 px-8">
                <button
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'login'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setActiveTab('signup'); setError(''); }}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'signup'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Register
                </button>
              </div>
            )
          )}

          {/* Form Content */}
          <div className="px-8 py-6">

            {activeTab === 'login' ? (
              /* LOGIN TAB */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center">
                    <Phone size={14} className="mr-2 text-primary" />
                    Mobile Number
                  </label>
                  <div className="flex space-x-2">
                    <span className="px-3 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm flex items-center justify-center font-bold text-gray-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center">
                    <Lock size={14} className="mr-2 text-primary" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-xs font-semibold bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-secondary to-primary hover:from-secondary/95 hover:to-primary/95 text-white rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Login to Profile</span>
                      <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* SIGNUP TAB (9-STEP WIZARD) */
              <div className="space-y-5">

                {/* Error Banner */}
                {error && currentStep !== 5 && (
                  <div className="text-red-500 text-xs font-semibold bg-red-50 p-3 rounded-xl border border-red-100 text-center animate-shake">
                    {error}
                  </div>
                )}

                {/* STEP 1: Created For + Gender */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-3">Who is this profile for?</label>
                      <div className="grid grid-cols-2 gap-3">
                        {relationList.map((rel) => {
                          const isActive = createdFor === rel.val;
                          return (
                            <button
                              key={rel.val}
                              type="button"
                              onClick={() => setCreatedFor(rel.val)}
                              className={`py-3 px-4 text-xs font-semibold rounded-xl border transition-all flex items-center space-x-2 ${isActive
                                ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                {isActive && <Check size={10} className="text-white" strokeWidth={3} />}
                              </div>
                              <span>{rel.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-3">Gender</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setGender('Male')}
                          className={`py-4 rounded-2xl border transition-all flex flex-col items-center space-y-2 ${gender === 'Male'
                            ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'
                            }`}
                        >
                          <div className={`p-2.5 rounded-full ${gender === 'Male' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <User size={20} className={gender === 'Male' ? 'text-blue-600' : 'text-gray-400'} />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider">Male</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setGender('Female')}
                          className={`py-4 rounded-2xl border transition-all flex flex-col items-center space-y-2 ${gender === 'Female'
                            ? 'border-pink-500 bg-pink-50/50 text-pink-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'
                            }`}
                        >
                          <div className={`p-2.5 rounded-full ${gender === 'Female' ? 'bg-pink-100' : 'bg-gray-100'}`}>
                            <User size={20} className={gender === 'Female' ? 'text-pink-600' : 'text-gray-400'} />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider">Female</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full py-3.5 bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white rounded-xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* STEP 2: Credentials & Birth */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name of candidate"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Mobile Number</label>
                      <div className="flex space-x-2">
                        <span className="px-3 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm flex items-center justify-center font-bold text-gray-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="candidate@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={handleStepBack}
                        className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-bold text-sm transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={validateStep2}
                        className="flex-1 py-3 bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white rounded-xl font-bold text-sm shadow-md transition-all"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Profile Attributes */}
                {currentStep === 3 && (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Height</label>
                        <select
                          value={heightVal}
                          onChange={(e) => setHeightVal(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          {heightList.map((h) => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Marital Status</label>
                        <select
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          <option value="Never Married">Never Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Awaiting Divorce">Awaiting Divorce</option>
                        </select>
                      </div>
                    </div>

                    {maritalStatus === 'Divorced' && (
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Date of Divorce</label>
                        <input
                          type="date"
                          value={divorceDate}
                          onChange={(e) => setDivorceDate(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        />
                      </div>
                    )}

                    {/* State Selector Autocomplete */}
                    <div className="relative">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">State</label>
                      <div
                        onClick={() => { setShowStateDropdown(true); setShowCityDropdown(false); }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium bg-white flex justify-between items-center cursor-pointer"
                      >
                        <span className={state ? 'text-gray-800' : 'text-gray-400'}>
                          {state || 'Search and select State'}
                        </span>
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>

                      {showStateDropdown && (
                        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto p-2 space-y-2">
                          <input
                            type="text"
                            placeholder="Type to filter..."
                            value={stateSearchQuery}
                            onChange={(e) => setStateSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary"
                          />
                          {filteredStates.map((s) => (
                            <div
                              key={s}
                              onClick={() => {
                                setState(s);
                                setCity(''); // Reset city on state change
                                setStateSearchQuery('');
                                setShowStateDropdown(false);
                              }}
                              className="px-3 py-2 hover:bg-rose-50 text-xs rounded-lg cursor-pointer transition-colors"
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* City Selector Autocomplete */}
                    <div className="relative">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">City</label>
                      <div
                        onClick={() => {
                          if (state) {
                            setShowCityDropdown(true);
                            setShowStateDropdown(false);
                          } else {
                            setError('Please select a state first');
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium bg-white flex justify-between items-center cursor-pointer"
                      >
                        <span className={city ? 'text-gray-800' : 'text-gray-400'}>
                          {city || 'Search and select City'}
                        </span>
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>

                      {showCityDropdown && state && (
                        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto p-2 space-y-2">
                          <input
                            type="text"
                            placeholder="Type to filter..."
                            value={citySearchQuery}
                            onChange={(e) => setCitySearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary"
                          />
                          {filteredCities.map((c) => (
                            <div
                              key={c}
                              onClick={() => {
                                setCity(c);
                                setCitySearchQuery('');
                                setShowCityDropdown(false);
                              }}
                              className="px-3 py-2 hover:bg-rose-50 text-xs rounded-lg cursor-pointer transition-colors"
                            >
                              {c}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Religion</label>
                        <select
                          value={religion}
                          onChange={(e) => setReligion(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          <option value="Hindu">Hindu</option>
                          <option value="Buddhist">Buddhist</option>
                          <option value="Jain">Jain</option>
                          <option value="Sikh">Sikh</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Caste</label>
                        <select
                          value={caste}
                          onChange={(e) => setCaste(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          <option value="Bari">Bari</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Sect</label>
                        <input
                          type="text"
                          value={sect}
                          onChange={(e) => setSect(e.target.value)}
                          placeholder="e.g. Swaminarayan"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Subcaste</label>
                        <input
                          type="text"
                          value={subcaste}
                          onChange={(e) => setSubcaste(e.target.value)}
                          placeholder="e.g. Koknastha"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Mother Tongue</label>
                        <select
                          value={motherTongue}
                          onChange={(e) => setMotherTongue(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          <option value="Marathi">Marathi</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Gujarati">Gujarati</option>
                          <option value="English">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Manglik</label>
                        <select
                          value={manglik}
                          onChange={(e) => setManglik(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                          <option value="Anshik">Anshik</option>
                          <option value="Don't Know">Don't Know</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Gotra</label>
                        <input
                          type="text"
                          value={gotra}
                          onChange={(e) => setGotra(e.target.value)}
                          placeholder="e.g. Kashyap"
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Birth Time</label>
                        <input
                          type="time"
                          value={birthTime}
                          onChange={(e) => setBirthTime(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium bg-white"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Birth Place</label>
                        <input
                          type="text"
                          value={birthPlace}
                          onChange={(e) => setBirthPlace(e.target.value)}
                          placeholder="e.g. Mumbai"
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={handleStepBack}
                        className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-bold text-sm transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={validateStep3}
                        className="flex-1 py-3 bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white rounded-xl font-bold text-sm shadow-md transition-all"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Career & About */}
                {currentStep === 4 && (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Highest Qualification</label>
                      <select
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                      >
                        {qualificationList.map((q) => <option key={q} value={q}>{q}</option>)}
                      </select>
                    </div>

                    {education === 'Other' && (
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Specify Qualification</label>
                        <input
                          type="text"
                          value={customEducation}
                          onChange={(e) => setCustomEducation(e.target.value)}
                          placeholder="e.g. BA Fine Arts"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Work Sector</label>
                        <select
                          value={workSector}
                          onChange={(e) => setWorkSector(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          {workSectorList.map((w) => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Annual Income</label>
                        <select
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          {incomeList.map((i) => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Occupation / Job Title</label>
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">About Me</label>
                      <textarea
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        placeholder="Describe the candidate's personality, hobbies, family background, etc..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium h-20 resize-none"
                      />
                    </div>

                    {/* Terms checkbox */}
                    <div className="flex items-start space-x-2 my-2">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                        required
                      />
                      <label htmlFor="acceptTerms" className="text-xs text-gray-500 cursor-pointer select-none leading-relaxed">
                        I agree to the{' '}
                        <button type="button" onClick={() => openTerms('terms')} className="text-primary hover:underline font-semibold focus:outline-none">
                          Terms & Conditions
                        </button>{' '}
                        and{' '}
                        <button type="button" onClick={() => openTerms('privacy')} className="text-primary hover:underline font-semibold focus:outline-none">
                          Privacy Policy
                        </button>
                      </label>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={handleStepBack}
                        className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-bold text-sm transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={validateStep4}
                        className="flex-1 py-3 bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white rounded-xl font-bold text-sm shadow-md transition-all"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: Success Transition Slide */}
                {currentStep === 5 && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-500/20 text-green-500 animate-bounce">
                      <Check size={40} strokeWidth={3} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Credentials Validated!</h2>
                    <p className="text-sm text-gray-500 text-center max-w-xs">
                      Onboarding profile credentials have been verified. Next, let's upload a profile photo.
                    </p>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 animate-pulse" style={{ width: '70%' }} />
                    </div>
                  </div>
                )}

                {/* STEP 6: Profile Photo */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <h2 className="text-center font-bold text-gray-800 text-base">Add Profile Photo</h2>
                    <p className="text-xs text-gray-500 text-center mb-4">Profiles with photos get up to 10x higher response rates</p>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-8 px-4 bg-gray-50/50 hover:bg-rose-50/10 transition-colors relative">
                      {photoUri ? (
                        <div className="relative group">
                          <Image
                            src={photoUri}
                            width={160}
                            height={160}
                            className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-md"
                            alt="Preview Profile Photo"
                          />
                          <button
                            type="button"
                            onClick={() => setPhotoUri('')}
                            className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center space-y-3">
                          <div className="p-4 bg-white border border-gray-100 rounded-full shadow-sm text-primary">
                            <Camera size={26} />
                          </div>
                          <div className="text-center">
                            <span className="text-xs font-bold text-primary block hover:underline">Choose Photo</span>
                            <span className="text-[10px] text-gray-400 block mt-1">PNG, JPG up to 5MB</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden"
                          />
                        </label>
                      )}

                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center space-y-2 rounded-2xl">
                          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                          <span className="text-xs font-medium text-gray-500">Uploading to cloud...</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={handleStepBack}
                        className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-bold text-sm transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(7)}
                        className="flex-1 py-3 bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white rounded-xl font-bold text-sm shadow-md transition-all"
                      >
                        {photoUri ? 'Next' : 'Skip & Continue'}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 7: OTP verification */}
                {currentStep === 7 && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield size={22} className="text-green-600 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold text-gray-800">Phone Verification</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        OTP sent to verified number: +91 {formatPhoneDisplay(phone)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-3 text-center">
                        Enter 6-digit OTP code
                      </label>
                      <div className="flex justify-center space-x-2">
                        {otpCode.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            value={digit}
                            onChange={(e) => handleOTPInput(index, e.target.value)}
                            onKeyDown={(e) => handleOTPKeyDown(index, e)}
                            className="w-10 h-11 text-center text-lg font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            maxLength={1}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyRegisterOTP}
                      disabled={isLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white rounded-xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <span>Verify and Register</span>
                      )}
                    </button>

                    <div className="flex flex-col space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={handleSendRegisterOTP}
                        disabled={resendTimer > 0}
                        className="text-primary hover:text-primary/90 text-xs font-semibold disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <RotateCcw size={14} className="mr-1.5" />
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 8: Family Details */}
                {currentStep === 8 && (
                  <form onSubmit={handleFamilyDetailsSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Father's Occupation</label>
                        <input
                          type="text"
                          value={fatherOccupation}
                          onChange={(e) => setFatherOccupation(e.target.value)}
                          placeholder="e.g. Business/Government"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Mother's Occupation</label>
                        <input
                          type="text"
                          value={motherOccupation}
                          onChange={(e) => setMotherOccupation(e.target.value)}
                          placeholder="e.g. Homemaker"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Brothers</label>
                        <input
                          type="number"
                          min="0"
                          value={brothers}
                          onChange={(e) => setBrothers(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Married Brothers</label>
                        <input
                          type="number"
                          min="0"
                          value={marriedBrothers}
                          onChange={(e) => setMarriedBrothers(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Sisters</label>
                        <input
                          type="number"
                          min="0"
                          value={sisters}
                          onChange={(e) => setSisters(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Married Sisters</label>
                        <input
                          type="number"
                          min="0"
                          value={marriedSisters}
                          onChange={(e) => setMarriedSisters(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Mamekul (mama's Fullname)</label>
                      <input
                        type="text"
                        value={mamaSurname}
                        onChange={(e) => setMamaSurname(e.target.value)}
                        placeholder="Enter maternal uncle's surname"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Family Type</label>
                        <select
                          value={familyType}
                          onChange={(e) => setFamilyType(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          {familyTypeList.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Family Values</label>
                        <select
                          value={familyValues}
                          onChange={(e) => setFamilyValues(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          {familyValuesList.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Family Native Place</label>
                      <input
                        type="text"
                        value={familyNativePlace}
                        onChange={(e) => setFamilyNativePlace(e.target.value)}
                        placeholder="e.g. Pune, Maharashtra"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                      />
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(9)}
                        className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-bold text-sm transition-all"
                      >
                        Skip
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3 bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <span>Continue</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 9: Partner Preferences */}
                {currentStep === 9 && (
                  <form onSubmit={handlePreferencesSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-2">Partner Preferences</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Min Partner Age</label>
                        <input
                          type="number"
                          min="18"
                          value={partnerAgeMin}
                          onChange={(e) => setPartnerAgeMin(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Max Partner Age</label>
                        <input
                          type="number"
                          min="18"
                          value={partnerAgeMax}
                          onChange={(e) => setPartnerAgeMax(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Min Height</label>
                        <select
                          value={partnerHeightMin}
                          onChange={(e) => setPartnerHeightMin(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          {heightList.map((h) => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Max Height</label>
                        <select
                          value={partnerHeightMax}
                          onChange={(e) => setPartnerHeightMax(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          {heightList.map((h) => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Partner Religion</label>
                        <select
                          value={partnerReligion}
                          onChange={(e) => setPartnerReligion(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          <option value="Hindu">Hindu</option>
                          <option value="Buddhist">Buddhist</option>
                          <option value="Jain">Jain</option>
                          <option value="Sikh">Sikh</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Partner Caste</label>
                        <select
                          value={partnerCaste}
                          onChange={(e) => setPartnerCaste(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          <option value="Bari">Bari</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Mother Tongue</label>
                        <select
                          value={partnerMotherTongue}
                          onChange={(e) => setPartnerMotherTongue(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          <option value="Marathi">Marathi</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Gujarati">Gujarati</option>
                          <option value="English">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Manglik</label>
                        <select
                          value={partnerManglik}
                          onChange={(e) => setPartnerManglik(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                          <option value="Anshik">Anshik</option>
                          <option value="Don't Know">Don't Know</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-bold text-sm transition-all"
                      >
                        Skip & Finish
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3 bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <span>Submit & Finish</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}
          </div>
        </div>

        {/* Footnotes / Admin portals */}
        {currentStep !== 5 && (
          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                Secure 256-bit Login
              </span>
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                Trusted by 10,000+
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200/50">
              <a
                href="/admin-login"
                className="text-xs text-primary hover:underline font-bold transition-all"
              >
                Are you an Admin or Employee? Access Portal
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Terms & Conditions Modal Overlay */}
      {termsModalVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-800">
                {termsModalType === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
              </h3>
              <button
                onClick={() => setTermsModalVisible(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-600 leading-relaxed max-h-[50vh] text-left">
              {termsModalType === 'terms' ? (
                <>
                  <h4 className="font-bold text-gray-900">1. Minimum Eligibility Criteria</h4>
                  <p>
                    To register as a member of BariVivah, you must be of legal marriageable age as per the laws of India (currently 21 years for males and 18 years for females) and legally single/divorced/widowed.
                  </p>

                  <h4 className="font-bold text-gray-900">2. Accuracy of Profile Information</h4>
                  <p>
                    You agree to provide true, accurate, and complete information. Providing fake credentials, educational statuses, or uploading photos of other people will result in permanent account termination.
                  </p>

                  <h4 className="font-bold text-gray-900">3. Background Verification Disclaimer</h4>
                  <p>
                    BariVivah facilitates phone and photo identification check verification. However, users are strongly advised to perform independent background checks, legal inquiries, and family visits before finalizing a marriage. The platform is not liable for character issues or misrepresentation of matches.
                  </p>

                  <h4 className="font-bold text-gray-900">4. Strict Code of Conduct</h4>
                  <p>
                    No commercial advertisement or commercial matches are allowed. Any financial request (asking match for loans, cash, or deposits) is strictly prohibited. Violating this will lead to a permanent ban and local law enforcement reports.
                  </p>

                  <h4 className="font-bold text-gray-900">5. Premium Subscription Policy</h4>
                  <p>
                    All premium unlock tokens or contact plans are non-refundable once matches are viewed or contacts are revealed.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-gray-900">1. Collection of Information</h4>
                  <p>
                    We collect personal data (Name, Date of Birth, Gender, Photos, Caste, Income, and Education parameters) to generate matching profiles. Contact details are verified via secure OTP.
                  </p>

                  <h4 className="font-bold text-gray-900">2. Information Visibility</h4>
                  <p>
                    Your match-making profile is visible to registered users of BariVivah. Phone numbers and emails are hidden by default and are only revealed if you explicitly approve contact exchange or unlock matches.
                  </p>

                  <h4 className="font-bold text-gray-900">3. Secure Cloud Storage</h4>
                  <p>
                    We use industry-standard secure cloud servers to encrypt and protect your files and passwords. Your password is securely encrypted at rest.
                  </p>

                  <h4 className="font-bold text-gray-900">4. Data Deletion</h4>
                  <p>
                    You hold full rights to permanently delete your account profile at any time. When deleted, all your active records are immediately wiped from our active databases.
                  </p>
                </>
              )}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setTermsModalVisible(false)}
                className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition-colors focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}