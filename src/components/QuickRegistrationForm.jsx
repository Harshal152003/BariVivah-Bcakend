"use client"
import { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';

export default function QuickRegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    lookingFor: '',
    dob: '',
    email: '',
    mobile: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.length < 2) error = 'Name is too short';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = 'Invalid email format';
        break;
      case 'mobile':
        if (!value.trim()) error = 'Mobile is required';
        else if (!/^\d{10,15}$/.test(value)) error = 'Invalid mobile number';
        break;
      case 'dob':
        if (!value) error = 'Date of birth is required';
        else {
          const dobDate = new Date(value);
          const minDate = new Date();
          minDate.setFullYear(minDate.getFullYear() - 100);
          const maxDate = new Date();
          maxDate.setFullYear(maxDate.getFullYear() - 18);

          if (dobDate < minDate) error = 'Invalid date (too old)';
          else if (dobDate > maxDate) error = 'You must be at least 18 years old';
        }
        break;
      case 'gender':
      case 'lookingFor':
        if (!value) error = 'This field is required';
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Submit form
      console.log('Form submitted:', formData);
      // Here you would typically send data to your backend
      setTimeout(() => {
        setIsSubmitting(false);
        alert('Registration successful!');
      }, 1000);
    } else {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    let isValid = true;
    const currentStepFields = step === 1 ? ['name', 'gender', 'lookingFor'] : ['dob', 'email', 'mobile'];

    currentStepFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        isValid = false;
      }
    });

    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className="w-full lg:w-auto lg:pl-8">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-primary/10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Find Your Match Today
        </h2>

        {/* Stepper */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200 text-[#5C3F43]'} 
                ${step === stepNumber ? 'ring-4 ring-primary/20' : ''}`}>
                {step > stepNumber ? <Check size={16} /> : stepNumber}
              </div>
              <span className={`text-xs mt-1 ${step >= stepNumber ? 'text-primary font-medium' : 'text-[#5C3F43]'}`}>
                Step {stepNumber}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#5C3F43] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5C3F43] mb-1">Gender *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Male', 'Female'].map((gender) => (
                    <label key={gender} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span className="text-[#5C3F43]">{gender}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5C3F43] mb-1">Looking For *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Male', 'Female'].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="lookingFor"
                        value={option}
                        checked={formData.lookingFor === option}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span className="text-[#5C3F43]">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.lookingFor && <p className="mt-1 text-sm text-red-600">{errors.lookingFor}</p>}
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
              >
                <span className="font-medium">Continue</span>
                <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-[#5C3F43] mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.dob ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                />
                {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#5C3F43] mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-[#5C3F43] mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                  placeholder="+1 123 456 7890"
                />
                {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-md flex items-center justify-center border border-gray-200"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-70"
                >
                  {isSubmitting ? 'Processing...' : 'Start Finding Matches'}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="text-xs text-[#5C3F43] mt-6 text-center">
          By registering, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}
