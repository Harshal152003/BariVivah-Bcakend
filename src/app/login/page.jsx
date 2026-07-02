// "use client"
// import { useState, useEffect } from 'react';
// import { ArrowRight, Phone, Shield, RotateCcw, Edit } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useSession } from '@/context/SessionContext'

// export default function MatrimonialLogin() {
//   const router = useRouter()
//   const [step, setStep] = useState(1); // 1: Phone Number, 2: OTP
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [countryCode, setCountryCode] = useState('+91');
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [isLoading, setIsLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const [error, setError] = useState('');
//   const [isLoaded, setIsLoaded] = useState(false);
//   const { login, user } = useSession()

//   useEffect(() => {
//     setIsLoaded(true);

//     // Check if user is already logged in
//     if (user) {
//       router.push(`/dashboard`);
//     }
//   }, [user, router]);

//   // Resend timer countdown
//   useEffect(() => {
//     if (resendTimer > 0) {
//       const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [resendTimer]);

//   const validatePhoneNumber = (phone) => {
//     const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
//     return phoneRegex.test(phone.replace(/\s/g, ''));
//   };

//   const handleSendOTP = async () => {
//     setError('');

//     if (!validatePhoneNumber(phoneNumber)) {
//       setError('Please enter a valid 10-digit mobile number');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch('http://172.24.192.1:3000/api/send-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           phoneNumber: phoneNumber.replace(/\s/g, '') // Remove spaces
//         }),
//       });

//       const data = await response.json();
//       console.log(data)
//       if (data.success) {
//         setStep(2);
//         setResendTimer(30);
//       } else {
//         setError(data.message || 'Failed to send OTP');
//       }
//     } catch (error) {
//       setError('Network error. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOTPChange = (index, value) => {
//     if (value.length > 1) return; // Prevent multiple characters

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 5) {
//       const nextInput = document.getElementById(`otp-${index + 1}`);
//       if (nextInput) nextInput.focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     // Handle backspace to go to previous input
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       const prevInput = document.getElementById(`otp-${index - 1}`);
//       if (prevInput) prevInput.focus();
//     }
//   };

//   const handleVerifyOTP = async () => {
//     const otpString = otp.join('');

//     if (otpString.length !== 6) {
//       setError('Please enter complete 6-digit OTP');
//       return;
//     }

//     setIsLoading(true);
//     setError(''); // Clear previous errors

//     try {
//       const response = await fetch('/api/verify-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           phoneNumber: phoneNumber.replace(/\s/g, ''),
//           otp: otpString
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'OTP verification failed');
//       }

//       if (data.success) {
//         await login(data.userId);
//         console.log(data)
//         // Redirect based on user status
//         router.push(`/dashboard/${data.userId}`);
//       } else {
//         setError(data.error || 'OTP verification failed');
//       }
//     } catch (error) {
//       console.error('Verification error:', error);
//       setError(error.message || 'Network error. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setOtp(['', '', '', '', '', '']);
//     setError('');
//     setResendTimer(30);

//     try {
//       const response = await fetch('/api/send-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           phoneNumber: phoneNumber.replace(/\s/g, '') // Remove spaces
//         }),
//       });

//       const data = await response.json();

//       if (!data.success) {
//         setError(data.message || 'Failed to resend OTP');
//         setResendTimer(0); // Reset timer on error
//       }
//     } catch (error) {
//       setError('Network error. Please try again.');
//       setResendTimer(0); // Reset timer on error
//     }
//   };

//   const formatPhoneDisplay = (phone) => {
//     return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
//   };

//   // If user exists and component is loaded, don't render the login form
//   if (user && isLoaded) {
//     return null; // or a loading spinner
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center px-4 py-8 sm:px-6">
//       {/* Decorative elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-24 h-24 sm:w-40 sm:h-40 rounded-full bg-rose-100 blur-xl sm:blur-2xl opacity-30"></div>
//         <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-32 h-32 sm:w-56 sm:h-56 rounded-full bg-amber-100 blur-xl sm:blur-2xl opacity-40"></div>
//       </div>

//       <div className={`relative w-full max-w-md transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//         {/* Main Card */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl border border-white/50 overflow-hidden">
//           {/* Header */}
//           <div className="text-center px-6 sm:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
//             <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transform rotate-3 hover:rotate-0 transition-all duration-300">
//               <span className="text-white text-xl sm:text-2xl font-bold">💕</span>
//             </div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Welcome Back</h1>
//             <p className="text-sm sm:text-base text-gray-600">Find your perfect match</p>
//           </div>

//           {/* Content */}
//           <div className="px-6 sm:px-8 pb-8 sm:pb-12">
//             {step === 1 ? (
//               // Phone Number Step
//               <div className="space-y-4 sm:space-y-6">
//                 <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
//                     <Phone size={14} className="mr-2 text-rose-500" />
//                     Enter Mobile Number
//                   </label>

//                   <div className="flex space-x-2 sm:space-x-3">
//                     <select 
//                       value={countryCode}
//                       onChange={(e) => setCountryCode(e.target.value)}
//                       className="w-20 sm:w-24 px-2 sm:px-3 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
//                     >
//                       <option value="+91">🇮🇳 +91</option>
//                       <option value="+1">🇺🇸 +1</option>
//                       <option value="+44">🇬🇧 +44</option>
//                     </select>

//                     <input
//                       type="tel"
//                       value={phoneNumber}
//                       onChange={(e) => setPhoneNumber(e.target.value)}
//                       placeholder="98765 43210"
//                       className="flex-1 px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg"
//                       maxLength={10}
//                     />
//                   </div>
//                 </div>

//                 {error && (
//                   <div className="text-red-500 text-xs sm:text-sm bg-red-50 p-2 sm:p-3 rounded-md sm:rounded-lg border border-red-100">
//                     {error}
//                   </div>
//                 )}

//                 <button
//                   onClick={handleSendOTP}
//                   disabled={isLoading}
//                   className="w-full py-3 sm:py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg sm:rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg sm:shadow-lg sm:hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
//                 >
//                   {isLoading ? (
//                     <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   ) : (
//                     <>
//                       <span className="text-sm sm:text-base font-medium">Send OTP</span>
//                       <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
//                     </>
//                   )}
//                 </button>
//               </div>
//             ) : (
//               // OTP Step
//               <div className="space-y-4 sm:space-y-6">
//                 <div className="text-center">
//                   <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
//                     <Shield size={18} className="text-green-600 sm:text-xl" />
//                   </div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Verify OTP</h3>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     OTP sent to {countryCode} {formatPhoneDisplay(phoneNumber)}
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 text-center">
//                     Enter 6-digit OTP
//                   </label>

//                   <div className="flex justify-center space-x-2 sm:space-x-3">
//                     {otp.map((digit, index) => (
//                       <input
//                         key={index}
//                         id={`otp-${index}`}
//                         type="text"
//                         value={digit}
//                         onChange={(e) => handleOTPChange(index, e.target.value)}
//                         onKeyDown={(e) => handleKeyDown(index, e)}
//                         className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-bold border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
//                         maxLength={1}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {error && (
//                   <div className="text-red-500 text-xs sm:text-sm bg-red-50 p-2 sm:p-3 rounded-md sm:rounded-lg border border-red-100 text-center">
//                     {error}
//                   </div>
//                 )}

//                 <button
//                   onClick={handleVerifyOTP}
//                   disabled={isLoading}
//                   className="w-full py-3 sm:py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg sm:rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg sm:shadow-lg sm:hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
//                 >
//                   {isLoading ? (
//                     <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   ) : (
//                     <>
//                       <span className="text-sm sm:text-base font-medium">Verify OTP</span>
//                       <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
//                     </>
//                   )}
//                 </button>

//                 <div className="flex flex-col space-y-2 sm:space-y-3 pt-2 sm:pt-4">
//                   <button
//                     onClick={handleResendOTP}
//                     disabled={resendTimer > 0}
//                     className="text-rose-600 hover:text-rose-700 text-xs sm:text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
//                   >
//                     <RotateCcw size={14} className="mr-1 sm:mr-2" />
//                     {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
//                   </button>

//                   <button
//                     onClick={() => {
//                       setStep(1);
//                       setOtp(['', '', '', '', '', '']);
//                       setError('');
//                     }}
//                     className="text-gray-600 hover:text-gray-700 text-xs sm:text-sm font-medium flex items-center justify-center"
//                   >
//                     <Edit size={14} className="mr-1 sm:mr-2" />
//                     Change Number
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Trust Indicators */}
//         <div className="mt-6 sm:mt-8 text-center">
//           <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
//             <div className="flex items-center">
//               <div className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
//               Secure Login
//             </div>
//             <div className="flex items-center">
//               <div className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
//               Trusted by 10,000+
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client"
import { useState, useEffect } from 'react';
import { ArrowRight, Phone, Shield, RotateCcw, Edit, User, Mail, Lock, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext'
import Image from 'next/image';

export default function MatrimonialLogin() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [step, setStep] = useState(1); // 1: Phone Number, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Signup fields state
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupGender, setSignupGender] = useState('Male');
  
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const { login, user, refreshUser } = useSession()

  useEffect(() => {
    setIsLoaded(true);

    // Check if user is already logged in
    if (user) {
      router.push(`/dashboard`);
    }
  }, [user, router]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSendOTP = () => {
    setError('');

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    // Simulate success without API
    setStep(2);
    setResendTimer(30);

    setIsLoading(false);
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(''); // Clear previous errors

    const cleanedPhone = phoneNumber.replace(/\s/g, '');

    if (otpString === '123456') {
      await login(cleanedPhone);
    } else {
      setError('Invalid OTP');
    }

    setIsLoading(false);
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendTimer(30);
  };

  const handleSignUp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    // Validation
    if (!signupName.trim()) {
      setError('Please enter your full name');
      return;
    }
    const cleanPhone = signupPhone.replace(/\s/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!signupGender) {
      setError('Please select your gender');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          phone: cleanPhone,
          email: signupEmail.trim() || null,
          password: signupPassword,
          gender: signupGender,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh context to load the new user session
        await refreshUser();
        router.push('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneDisplay = (phone) => {
    return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  // If user exists and component is loaded, don't render the login form
  if (user && isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-white to-primary/5 flex items-center justify-center px-4 py-8 sm:px-6">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-24 h-24 sm:w-40 sm:h-40 rounded-full bg-primary/20 blur-xl sm:blur-2xl opacity-30"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-32 h-32 sm:w-56 sm:h-56 rounded-full bg-secondary/20 blur-xl sm:blur-2xl opacity-40"></div>
      </div>

      <div className={`relative w-full max-w-md transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="text-center px-6 sm:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <Image 
                src="/logo.png" 
                width={200} 
                height={60} 
                className="h-14 sm:h-16 w-auto object-contain" 
                alt="BariVivah Logo" 
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {activeTab === 'login' ? 'Find your perfect match' : 'Register to find your perfect match'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-gray-100 px-6 sm:px-8">
            <button
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 pb-4 text-sm font-semibold transition-all border-b-2 ${
                activeTab === 'login'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); }}
              className={`flex-1 pb-4 text-sm font-semibold transition-all border-b-2 ${
                activeTab === 'signup'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 pb-8 sm:pb-12 pt-6">
            {activeTab === 'login' ? (
              step === 1 ? (
                // Phone Number Step
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                      <Phone size={14} className="mr-2 text-primary" />
                      Enter Mobile Number
                    </label>

                    <div className="flex space-x-2 sm:space-x-3">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-20 sm:w-24 px-2 sm:px-3 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm sm:text-base"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                      </select>

                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98765 43210"
                        className="flex-1 px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-base sm:text-lg"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-xs sm:text-sm bg-red-50 p-2 sm:p-3 rounded-md sm:rounded-lg border border-red-100">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-secondary to-primary text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="text-sm sm:text-base font-medium">Send OTP</span>
                        <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                // OTP Step
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Shield size={18} className="text-green-600 sm:text-xl" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Verify OTP</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      OTP sent to {countryCode} {formatPhoneDisplay(phoneNumber)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 text-center">
                      Enter 6-digit OTP
                    </label>

                    <div className="flex justify-center space-x-2 sm:space-x-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleOTPChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-bold border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                          maxLength={1}
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-xs sm:text-sm bg-red-50 p-2 sm:p-3 rounded-md sm:rounded-lg border border-red-100 text-center">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleVerifyOTP}
                    disabled={isLoading}
                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-secondary to-primary text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="text-sm sm:text-base font-medium">Verify OTP</span>
                        <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>

                  <div className="flex flex-col space-y-2 sm:space-y-3 pt-2 sm:pt-4">
                    <button
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0}
                      className="text-primary hover:text-primary/80 text-xs sm:text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <RotateCcw size={14} className="mr-1 sm:mr-2" />
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>

                    <button
                      onClick={() => {
                        setStep(1);
                        setOtp(['', '', '', '', '', '']);
                        setError('');
                      }}
                      className="text-gray-600 hover:text-gray-700 text-xs sm:text-sm font-medium flex items-center justify-center"
                    >
                      <Edit size={14} className="mr-1 sm:mr-2" />
                      Change Number
                    </button>
                  </div>
                </div>
              )
            ) : (
              // Sign Up Step
              <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User size={14} className="mr-2 text-primary" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 sm:px-4 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone size={14} className="mr-2 text-primary" />
                    Mobile Number
                  </label>
                  <div className="flex space-x-2">
                    <span className="px-3 py-3 border border-gray-200 bg-gray-50 rounded-lg sm:rounded-xl text-sm sm:text-base flex items-center justify-center font-medium text-gray-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="flex-1 px-3 sm:px-4 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm sm:text-base"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail size={14} className="mr-2 text-primary" />
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 sm:px-4 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Lock size={14} className="mr-2 text-primary" />
                    Password
                  </label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 sm:px-4 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Gender Dropdown */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <UserCheck size={14} className="mr-2 text-primary" />
                    Gender
                  </label>
                  <select
                    value={signupGender}
                    onChange={(e) => setSignupGender(e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm sm:text-base bg-white"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="text-red-500 text-xs sm:text-sm bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-secondary to-primary text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-sm sm:text-base font-medium">Create Account</span>
                      <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 sm:mt-8 text-center space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
              Secure Login
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
              Trusted by 10,000+
            </div>
          </div>
          <div className="pt-2 border-t border-gray-200/50">
            <a 
              href="/admin-login" 
              className="text-xs text-primary hover:text-primary-light font-semibold transition-colors"
            >
              Are you an Admin or Employee? Access Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}