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
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors z-30 p-1 hover:bg-gray-100 rounded-full"
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
          <p className="text-sm text-gray-600">
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
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center">
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
                  className="w-full py-3 bg-gradient-to-r from-secondary to-primary text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group text-sm font-medium"
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
                  <p className="text-xs text-gray-600">
                    OTP sent to {countryCode} {formatPhoneDisplay(phoneNumber)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2 text-center">
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
                  className="w-full py-3 bg-gradient-to-r from-secondary to-primary text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group text-sm font-medium"
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
                    className="text-gray-600 hover:text-gray-700 text-xs font-medium flex items-center justify-center"
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
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
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
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                  <Phone size={12} className="mr-1.5 text-primary" />
                  Mobile Number
                </label>
                <div className="flex space-x-2">
                  <span className="px-2.5 py-2 border border-gray-200 bg-gray-50 rounded-lg sm:rounded-xl text-sm flex items-center justify-center font-medium text-gray-500">
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
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
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
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
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
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
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
                  <option value="Other">Other</option>
                </select>
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
                className="w-full py-3 bg-gradient-to-r from-secondary to-primary text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group text-sm font-medium"
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
    </div>
  );
}
