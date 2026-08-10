"use client"
import React, { useState, useEffect } from 'react';
import { ArrowRight, Phone, Shield, RotateCcw, Edit, User, Mail, Lock, UserCheck, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import Image from 'next/image';

export default function AuthModal({ isOpen, onClose }) {
  const router = useRouter();
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
  
  // Terms & Conditions States
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [termsModalType, setTermsModalType] = useState('terms'); // 'terms' or 'privacy'
  
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');
  const { login, refreshUser } = useSession();

  // Reset states on open/close
  useEffect(() => {
    if (!isOpen) {
      setError('');
      setStep(1);
      setPhoneNumber('');
      setOtp(['', '', '', '', '', '']);
      setSignupName('');
      setSignupPhone('');
      setSignupEmail('');
      setSignupPassword('');
      setAcceptTerms(false);
    }
  }, [isOpen]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  if (!isOpen) return null;

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

    // Simulate success
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
      const nextInput = document.getElementById(`modal-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`modal-otp-${index - 1}`);
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
      const success = await login(cleanedPhone);
      if (success) {
        onClose();
        router.push('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
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
    if (!acceptTerms) {
      setError('Please accept the Terms & Conditions and Privacy Policy to proceed');
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
        onClose();
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

  const openTerms = (type) => {
    setTermsModalType(type);
    setTermsModalVisible(true);
  };

  const formatPhoneDisplay = (phone) => {
    return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Click outside backdrop closes modal */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Main Card Container */}
      <div className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 scale-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 text-gray-400 hover:text-[#5C3F43] transition-colors z-30 p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center px-6 sm:px-8 pt-8 sm:pt-10 pb-4 sm:pb-6">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo.png" 
              width={160} 
              height={48} 
              className="h-10 sm:h-12 w-auto object-contain" 
              alt="BariVivah Logo" 
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-[#5C3F43]">
            {activeTab === 'login' ? 'Find your perfect match' : 'Register to find your perfect match'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 px-6 sm:px-8">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            type="button"
            className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'login'
                ? 'border-primary text-primary'
                : 'border-transparent text-[#5C3F43] hover:text-[#5C3F43]'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setError(''); }}
            type="button"
            className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'signup'
                ? 'border-primary text-primary'
                : 'border-transparent text-[#5C3F43] hover:text-[#5C3F43]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Content Container */}
        <div className="px-6 sm:px-8 pb-8 pt-6">
          {activeTab === 'login' ? (
            step === 1 ? (
              // Phone Number Step
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#5C3F43] mb-2 flex items-center">
                    <Phone size={14} className="mr-2 text-primary" />
                    Enter Mobile Number
                  </label>

                  <div className="flex space-x-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-20 px-2 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
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
                      className="flex-1 px-3 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm sm:text-base"
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
                  type="button"
                  className="w-full py-3 bg-primary text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group text-sm font-medium"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              // OTP Step
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield size={16} className="text-green-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Verify OTP</h3>
                  <p className="text-xs text-[#5C3F43]">
                    OTP sent to {countryCode} {formatPhoneDisplay(phoneNumber)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5C3F43] mb-2 text-center">
                    Enter 6-digit OTP
                  </label>

                  <div className="flex justify-center space-x-1.5">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`modal-otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-9 h-9 text-center text-sm font-bold border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        maxLength={1}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-xs bg-red-50 p-2 rounded-lg border border-red-100 text-center">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  type="button"
                  className="w-full py-3 bg-primary text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group text-sm font-medium"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Verify OTP</span>
                      <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>

                <div className="flex flex-col space-y-2 pt-2 text-center">
                  <button
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    type="button"
                    className="text-primary hover:text-primary/80 text-xs font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <RotateCcw size={12} className="mr-1.5" />
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </button>

                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    type="button"
                    className="text-[#5C3F43] hover:text-[#5C3F43] text-xs font-medium flex items-center justify-center"
                  >
                    <Edit size={12} className="mr-1.5" />
                    Change Number
                  </button>
                </div>
              </div>
            )
          ) : (
            // Sign Up Step Form
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-[#5C3F43] mb-1 flex items-center">
                  <User size={12} className="mr-1.5 text-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-medium text-[#5C3F43] mb-1 flex items-center">
                  <Phone size={12} className="mr-1.5 text-primary" />
                  Mobile Number
                </label>
                <div className="flex space-x-2">
                  <span className="px-2.5 py-2 border border-gray-200 bg-gray-50 rounded-lg sm:rounded-xl text-sm flex items-center justify-center font-medium text-[#5C3F43]">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-medium text-[#5C3F43] mb-1 flex items-center">
                  <Mail size={12} className="mr-1.5 text-primary" />
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-[#5C3F43] mb-1 flex items-center">
                  <Lock size={12} className="mr-1.5 text-primary" />
                  Password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
                  required
                />
              </div>

              {/* Gender Dropdown */}
              <div>
                <label className="block text-xs font-medium text-[#5C3F43] mb-1 flex items-center">
                  <UserCheck size={12} className="mr-1.5 text-primary" />
                  Gender
                </label>
                <select
                  value={signupGender}
                  onChange={(e) => setSignupGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm bg-white"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start space-x-2 my-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                  required
                />
                <label htmlFor="acceptTerms" className="text-xs text-[#5C3F43] cursor-pointer select-none leading-relaxed">
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

              {/* Error Banner */}
              {error && (
                <div className="text-red-500 text-xs bg-red-50 p-2.5 rounded-lg border border-red-100 text-center">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group text-sm font-medium"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Terms & Conditions Modal Overlay */}
      {termsModalVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">
                {termsModalType === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
              </h3>
              <button 
                onClick={() => setTermsModalVisible(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              >
                <X size={20} className="text-[#5C3F43]" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#5C3F43] leading-relaxed max-h-[60vh] text-left">
              {termsModalType === 'terms' ? (
                <>
                  <h4 className="font-semibold text-gray-900">1. Minimum Eligibility Criteria</h4>
                  <p>
                    To register as a member of BariVivah, you must be of legal marriageable age as per the laws of India (currently 21 years for males and 18 years for females) and legally single/divorced/widowed.
                  </p>
                  
                  <h4 className="font-semibold text-gray-900">2. Accuracy of Profile Information</h4>
                  <p>
                    You agree to provide true, accurate, and complete information. Providing fake credentials, educational statuses, or uploading photos of other people will result in permanent account termination.
                  </p>

                  <h4 className="font-semibold text-gray-900">3. Background Verification Disclaimer</h4>
                  <p>
                    BariVivah facilitates phone and photo identification check verification. However, users are strongly advised to perform independent background checks, legal inquiries, and family visits before finalizing a marriage. The platform is not liable for character issues or misrepresentation of matches.
                  </p>

                  <h4 className="font-semibold text-gray-900">4. Strict Code of Conduct</h4>
                  <p>
                    No commercial advertisement or commercial matches are allowed. Any financial request (asking match for loans, cash, or deposits) is strictly prohibited. Violating this will lead to a permanent ban and local law enforcement reports.
                  </p>

                  <h4 className="font-semibold text-gray-900">5. Premium Subscription Policy</h4>
                  <p>
                    All premium unlock tokens or contact plans are non-refundable once matches are viewed or contacts are revealed.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-gray-900">1. Collection of Information</h4>
                  <p>
                    We collect personal data (Name, Date of Birth, Gender, Photos, Caste, Income, and Education parameters) to generate matching profiles. Contact details are verified via secure OTP.
                  </p>

                  <h4 className="font-semibold text-gray-900">2. Information Visibility</h4>
                  <p>
                    Your match-making profile is visible to registered users of BariVivah. Phone numbers and emails are hidden by default and are only revealed if you explicitly approve contact exchange or unlock matches.
                  </p>

                  <h4 className="font-semibold text-gray-900">3. Secure Cloud Storage</h4>
                  <p>
                    We use industry-standard secure cloud servers to encrypt and protect your files and passwords. Your password is securely encrypted at rest.
                  </p>

                  <h4 className="font-semibold text-gray-900">4. Data Deletion</h4>
                  <p>
                    You hold full rights to permanently delete your account profile at any time. When deleted, all your active records are immediately wiped from our active databases.
                  </p>
                </>
              )}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setTermsModalVisible(false)}
                className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/95 transition-colors focus:outline-none"
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
