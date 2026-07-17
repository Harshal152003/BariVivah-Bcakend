'use client'
import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { User, Heart, Eye, CheckCircle, Edit3, Crown, Camera, MapPin, Calendar, Award, Star, Gift, Sparkles, Settings, EyeOff, UserCheck, Upload, Briefcase, GraduationCap, Home, Users, Search, Clock, Bell, Shield, ChevronRight, Plus, X, AlertCircle, ToggleLeft, ToggleRight, XCircle, Phone } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Link from 'next/link';

const DynamicProfileForm = () => {
  const { user } = useSession();
  const [formSections, setFormSections] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({});
  const [adminWillFill, setAdminWillFill] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('Unverified');
  const [photos, setPhotos] = useState([
    { id: 1, url: null, isPrimary: true },
    { id: 2, url: null, isPrimary: false },
    { id: 3, url: null, isPrimary: false },
    { id: 4, url: null, isPrimary: false },
  ]);

  // Field name mappings between form sections and user data
  const fieldNameMappings = {
    // Basic Information
    'Full Name': 'name',
    'Height': 'height',
    'Weight': 'weight',
    'Date of Birth': 'dob',
    'Marital Status': 'maritalStatus',
    'Mother Tongue': 'motherTongue',
    'Current City': 'currentCity',
    'Email Address': 'email',
    'Permanent Address': 'permanentAddress',
    'Gender': 'gender',
    'Blood Group': 'bloodGroup',
    'Wears Lens': 'wearsLens',
    'Complexion': 'complexion',

    // Education & Profession
    'Highest Education': 'education',
    'Occupation': 'occupation',
    'Field of Study': 'fieldOfStudy',
    'Company': 'company',
    'College/University': 'college',
    'Annual Income': 'income',

    // Relative Information
    "Father's Name": 'fatherName',
    "Mother's Name": 'mother',
    "Parent's Residence City": 'parentResidenceCity',
    "Number of Brothers": 'brothers',
    "Number of Sisters": 'sisters',
    "Married Brothers": 'marriedBrothers',
    "Married Sisters": 'marriedSisters',
    "Native District": 'nativeDistrict',
    "Native City": 'nativeCity',
    "Family Wealth": 'familyWealth',
    "Mama's Surname": 'mamaSurname',
    "Parent's Occupation": 'parentOccupation',
    "Relative Surnames": 'relativeSurname',

    // Religious & Community
    "Religion": 'religion',
    "Sub Caste": 'subCaste',
    "Caste": 'caste',
    "Gothra": 'gothra',

    // Horoscope Information
    "Rashi": 'rashi',
    "Nadi": 'nadi',
    "Nakshira": 'nakshira',
    "Mangal Dosha": 'mangal',
    "Charan": 'charan',
    "Birth Place": 'birthPlace',
    "Birth Time": 'birthTime',
    "Gan": 'gan',
    "Gotra Devak": 'gotraDevak',

    // Expectations
    "Expected Caste": 'expectedCaste',
    "Preferred City": 'preferredCity',
    "Expected Age Difference": 'expectedAgeDifference',
    "Expected Education": 'expectedEducation',
    "Accept Divorcee": 'divorcee',
    "Expected Height": 'expectedHeight',
    "Expected Income": 'expectedIncome',
    "Expected Sub-caste": 'expectedSubCaste',
    "Partner Working Status": 'expectedWorkingStatus',

    // Explicit Field Name Mappings (for robust handling of different DB versions)
    'motherName': 'mother',
    'mangaldosha': 'mangal',
    'nativeState': 'state',
    'state': 'state',
    'familyWealth': 'familyWealth'
  };

  // Helper function to normalize field names for comparison
  const normalizeFieldName = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch form sections structure
        const sectionsRes = await fetch('/api/admin/form-sections');
        const sectionsData = await sectionsRes.json();
        console.log("Loaded Form Sections:", sectionsData); // Added log as requested

        // Transform sections data to match our expected format
        const transformedSections = sectionsData.map(section => ({
          ...section,
          id: section._id,
          fields: section.fields.map(field => ({
            ...field,
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required,
            options: field.options || [],
            placeholder: field.placeholder || ''
          }))
        }));

        setFormSections(transformedSections);

        // Set active tab to first section if available
        if (transformedSections.length > 0) {
          setActiveTab(transformedSections[0]._id);
        }

        // Fetch user data
        const userRes = await fetch('/api/users/me');
        const userData = await userRes.json();

        // Create initial form data state by mapping user data to form fields
        const initialFormData = {};

        // Map user data to form fields using field mappings
        transformedSections.forEach(section => {
          section.fields.forEach(field => {
            // Try to find matching field in user data
            const mappingEntry = Object.entries(fieldNameMappings).find(
              ([key]) => normalizeFieldName(key) === normalizeFieldName(field.name)
            );

            if (mappingEntry) {
              const [_, backendField] = mappingEntry;
              if (userData[backendField] !== undefined) {
                initialFormData[field.name] = userData[backendField];
              }
            } else if (userData[field.name] !== undefined) {
              initialFormData[field.name] = userData[field.name];
            }
          });
        });

        // Include any additional user data fields not in form sections
        Object.keys(userData).forEach(key => {
          if (!initialFormData[key]) {
            initialFormData[key] = userData[key];
          }
        });

        setFormData(initialFormData);

        // Update photos with profile photo if exists
        if (userData.profilePhoto) {
          setPhotos(prevPhotos =>
            prevPhotos.map(photo =>
              photo.id === 1 ? { ...photo, url: userData.profilePhoto } : photo
            )
          );
        }

        // Set admin fill preference
        if (userData.profileSetup?.willAdminFill !== undefined) {
          setAdminWillFill(userData.profileSetup.willAdminFill);
        }

        // Set verification status
        if (userData.verificationStatus) {
          setVerificationStatus(userData.verificationStatus);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (Object.keys(formData).length > 0 && formSections.length > 0) {
      setProfileCompletion(calculateProfileCompletion());
    }
  }, [formData, formSections]);

  const calculateProfileCompletion = (formDataToCheck = formData) => {
    if (!formSections.length) return 0;

    let totalPercentage = 0;

    formSections.forEach(section => {
      const sectionFields = section.fields;
      if (sectionFields.length === 0) return;

      let filledCount = 0;
      sectionFields.forEach(field => {
        const val = formDataToCheck[field.name];
        // Check for non-empty values
        if (val !== undefined && val !== null && val !== '') {
          if (Array.isArray(val)) {
            if (val.length > 0) filledCount++;
          } else {
            filledCount++;
          }
        }
      });

      const sectionCompletion = (filledCount / sectionFields.length) * 100;
      totalPercentage += sectionCompletion;
    });

    // Handle Photos as an implicit "section" or bonus? 
    // User specifically asked for "per profile slot ui", implying the tabs.
    // Let's average the sections.
    let overall = Math.round(totalPercentage / formSections.length);

    // Ensure we don't exceed 100
    return Math.min(overall, 100);
  };

  const transformFormDataForBackend = (formData) => {
    const transformed = {};

    // First pass - map all fields that have direct mappings
    Object.keys(formData).forEach(formField => {
      // Skip internal fields we don't want to send
      if (formField === 'profileSetup' || formField === 'subscription') {
        return;
      }

      // Check if the formField is already a valid schema key
      const isSchemaKey = Object.values(fieldNameMappings).includes(formField);

      if (isSchemaKey) {
        transformed[formField] = formData[formField];
      } else {
        // Find if this form field has a mapping
        const mappingEntry = Object.entries(fieldNameMappings).find(
          ([key]) => normalizeFieldName(key) === normalizeFieldName(formField)
        );

        if (mappingEntry) {
          const [_, backendField] = mappingEntry;
          transformed[backendField] = formData[formField];
        } else {
          // If no mapping found, pass it through (it might be a schema key already or custom field)
          transformed[formField] = formData[formField];
        }
      }
    });

    // Ensure relativeSurname is an array
    if (transformed.relativeSurname && typeof transformed.relativeSurname === 'string') {
      transformed.relativeSurname = transformed.relativeSurname.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Include photos
    transformed.photos = photos;

    return transformed;
  };

  const handleInputChange = (fieldName, value) => {
    console.log("field Name = ", fieldName)
    setFormData(prev => {
      const newData = {
        ...prev,
        [fieldName]: value
      };

      // Recalculate completion whenever form data changes
      setProfileCompletion(calculateProfileCompletion(newData));

      return newData;
    });
  };
  console.log("Input change form data = ", formData)

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      // Calculate latest completion
      const currentCompletion = calculateProfileCompletion(formData);

      const updateData = {
        userId: user?.user?.id || user?.id,
        ...transformFormDataForBackend(formData),
        photos: photos.map(p => ({
          url: p.url,
          isPrimary: p.isPrimary
        })),
        profileCompletion: currentCompletion,
        profileSetup: {
          willAdminFill: adminWillFill,
          dontAskAgain: formData?.profileSetup?.dontAskAgain
        }
      };

      console.log("Sending payload:", updateData);

      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      setProfileCompletion(currentCompletion);
      alert('Profile updated successfully!');

    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };


  const handleVerificationSubmit = async () => {
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.user?.id,
          verificationStatus: 'Pending',
          verificationSubmittedAt: new Date(),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit verification');

      const result = await response.json();
      setVerificationStatus('Pending');
      alert('Verification submitted successfully!');
    } catch (error) {
      console.error("Error submitting verification:", error);
      alert(`Error submitting verification: ${error.message}`);
    }
  };

  const handlePhotoUploadSuccess = (result, photoId) => {
    const url = result.info.secure_url;

    setPhotos(prevPhotos =>
      prevPhotos.map(photo =>
        photo.id === photoId
          ? { ...photo, url }
          : photo
      )
    );

    if (photoId === 1) {
      handleInputChange('profilePhoto', url);
    }
  };

  const handleMakePrimary = (photoId) => {
    setPhotos(photos.map(photo => ({
      ...photo,
      isPrimary: photo.id === photoId
    })));
  };

  const handleAdminFillToggle = async (enabled) => {
    setAdminWillFill(enabled);

    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.user?.id || user?.id,
          profileSetup: {
            willAdminFill: enabled,
            dontAskAgain: formData.profileSetup?.dontAskAgain || false
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to update admin fill setting');

      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        profileSetup: {
          ...prev.profileSetup,
          willAdminFill: enabled
        }
      }));
    } catch (error) {
      console.error("Error updating admin fill setting:", error);
      // Revert if failed
      setAdminWillFill(!enabled);
    }
  };

  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const renderFieldInput = (field) => {
    const value = formData[field.name] ?? '';

    switch (field.type.toLowerCase()) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <select
            value={value ? 'Yes' : 'No'}
            onChange={(e) => handleInputChange(field.name, e.target.value === 'Yes')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={formatDateToYYYYMMDD(value)}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        );

      case 'number':
        return (
          <div className="relative">
            <input
              type="number"
              min="0"
              onKeyDown={(e) => {
                if (['-', 'e', 'E'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              value={value}
              onChange={(e) => {
                const val = e.target.value;
                // If empty, allow it (let user delete)
                if (val === '') {
                  handleInputChange(field.name, '');
                  return;
                }
                // Otherwise clamp to 0 if negative (double safety)
                const num = parseFloat(val);
                if (num < 0) {
                  handleInputChange(field.name, 0);
                } else {
                  handleInputChange(field.name, val);
                }
              }}
              placeholder={field.placeholder || 'Enter Number'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <span className="absolute right-3 top-2 text-xs text-gray-400 pointer-events-none">
              (Numeric)
            </span>
            {field.placeholder && (
              <p className="text-xs text-gray-500 mt-1">{field.placeholder}</p>
            )}
          </div>
        );

      case 'text':
      case 'email':
        return (
          <div className="relative">
            <input
              type={field.type.toLowerCase()}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {field.placeholder && (
              <p className="text-xs text-gray-500 mt-1">{field.placeholder}</p>
            )}
          </div>
        );
    }
  };

  const VerificationBadge = ({ status }) => {
    const statusConfig = {
      Unverified: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: null,
        label: 'Unverified'
      },
      Pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className="w-3 h-3 mr-1" />,
        label: 'Pending Verification'
      },
      Verified: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <Shield className="w-3 h-3 mr-1" />,
        label: 'Verified Profile'
      },
      Rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="w-3 h-3 mr-1" />,
        label: 'Verification Rejected'
      }
    };

    const config = statusConfig[status] || statusConfig.Unverified;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const renderTabContent = () => {
    const currentSection = formSections.find(s => s._id === activeTab);

    if (!currentSection) return null;

    // Debug log for section rendering
    console.log(`Rendering Section: ${currentSection.label}`, {
      fields: currentSection.fields.map(f => f.name),
      expectationsData: {
        expectedSubCaste: formData.expectedSubCaste,
        expectedWorkingStatus: formData.expectedWorkingStatus
      }
    });

    if (currentSection.label.toLowerCase().includes('photo')) {
      return (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-amber-800 font-medium">Add more photos to increase profile visibility</p>
                <p className="text-xs text-amber-700 mt-1">Profiles with 3+ photos get 5x more interest!</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative">
                <CldUploadWidget
                  uploadPreset="shivbandhan"
                  options={{ multiple: false, sources: ['local'], maxFiles: 1 }}
                  onSuccess={(result) => handlePhotoUploadSuccess(result, photo.id)}
                >
                  {({ open }) => (
                    <div>
                      <div
                        className="aspect-[4/5] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden cursor-pointer"
                        onClick={() => open()}
                      >
                        {photo.url ? (
                          <img
                            src={photo.url}
                            alt={`Photo ${photo.id}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Add Photo</p>
                          </div>
                        )}
                        {photo.isPrimary && photo.url && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                            Primary
                          </div>
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        <button
                          onClick={() => open()}
                          className="w-full bg-primary/10 text-primary py-1 px-2 rounded text-xs font-medium hover:bg-primary/20 transition-colors"
                        >
                          {photo.url ? 'Change' : 'Upload'}
                        </button>
                        {photo.url && !photo.isPrimary && (
                          <button
                            onClick={() => handleMakePrimary(photo.id)}
                            className="w-full bg-gray-50 text-gray-600 py-1 px-2 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
                          >
                            Make Primary
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </CldUploadWidget>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentSection.fields
            .filter(f => f.name !== 'religion' && f.name !== 'caste' && f.name !== 'expectedCaste')
            .map((field) => (
              <div key={field._id} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-primary ml-1">*</span>}
                </label>
                {renderFieldInput(field)}
              </div>
            ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-secondary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }
  //sample
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-white to-primary/5">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="xs:flex-col lg:flex-row flex items-center space-x-6 mb-6 lg:mb-0">
                <div className="relative">
                  {/* Fixed CldUploadWidget with minimal styling */}
                  <CldUploadWidget
                    uploadPreset="shivbandhan"
                    options={{
                      multiple: false,
                      sources: ['local', 'camera'],
                      maxFiles: 1
                    }}
                    onSuccess={(result) => handlePhotoUploadSuccess(result, 1)}
                  >
                    {({ open }) => (
                      <div className="inline-block relative"> {/* Added inline-block container */}
                        {formData?.profilePhoto ? (
                          <div
                            onClick={() => open()}
                            className="cursor-pointer"
                          >
                            <img
                              src={formData.profilePhoto}
                              alt="Profile"
                              className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-24 h-24 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-md"
                            onClick={() => open()}
                          >
                            <User className="w-12 h-12 text-primary" />
                          </div>
                        )}
                        <button
                          className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm z-20"
                          onClick={(e) => {
                            e.stopPropagation();
                            open();
                          }}
                        >
                          <Camera className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    )}
                  </CldUploadWidget>

                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{formData?.name || 'Your Name'}</h1>
                    {verificationStatus === 'Verified' && <Award className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex items-center space-x-4 text-sm">
                      {formData?.height && <span>{formData?.height}</span>}
                      {formData?.religion && <span>{formData?.religion}</span>}
                    </div>
                    {formData?.currentCity && (
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {formData?.currentCity}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center mt-2">
                    <VerificationBadge status={verificationStatus} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <div className="bg-primary/5 rounded-lg p-4 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm font-bold text-primary">
                      {profileCompletion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={handleProfileUpdate}
                    className="w-full bg-gradient-to-r from-secondary to-primary text-white py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:scale-[1.02] transition-all"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : "Save Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Sidebar - Profile Sections */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-primary/20">
              <h3 className="font-bold text-gray-900 mb-4">Profile Sections</h3>
              <div className="space-y-2">
                {formSections.map((section) => {
                  const Icon = getIconComponent(section.icon || 'User');
                  const label = section.label.split(' ')[0] === 'Education'
                    ? 'Education & Profession'
                    : section.label.split(' ')[0] === 'Religious'
                      ? 'Religious & Community'
                      : section.label;

                  return (
                    <button
                      key={section._id}
                      onClick={() => setActiveTab(section._id)}
                      className={`w-full px-4 flex items-center p-3 rounded-lg transition-all duration-200 ${activeTab === section._id
                        ? 'bg-gradient-to-r from-secondary/10 to-primary/10 text-primary border border-primary/20 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center whitespace-nowrap">
                        <Icon className={`w-4 h-4 mr-2 flex-shrink-0 ${activeTab === section._id ? 'text-primary' : 'text-gray-400'}`} />
                        <span className="text-xs font-medium truncate">{label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary to-primary rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{formData.subscription?.plan || 'Free Plan'}</h3>
                <Crown className="w-5 h-5 text-yellow-200" />
              </div>
              <div className="space-y-4 text-sm w-full">
                <div className="flex justify-between">
                  <span className="text-white/80">Status:</span>
                  <span className="font-medium">
                    {formData.subscription?.isSubscribed ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Expires:</span>
                  <span className="font-medium">
                    {formData.subscription?.expiresAt ?
                      new Date(formData.subscription.expiresAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) :
                      'Never'}
                  </span>
                </div>
                <Link href="/dashboard/subscription" className="w-full cursor-pointer bg-white/20 text-white p-3 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors mt-3">
                  Manage Plan
                </Link>
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-primary/20">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {formSections.find(s => s._id === activeTab)?.label || 'Profile Section'}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                {renderTabContent()}
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setActiveTab(formSections[0]?._id)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    disabled={isSaving}
                    className="px-6 py-2 bg-gradient-to-r from-secondary to-primary text-white rounded-lg font-medium hover:shadow-lg hover: from-secondary/90 hover:to-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get icon component by name
function getIconComponent(iconName) {
  const icons = {
    User, Heart, Eye, CheckCircle, Edit3, Crown, Camera, MapPin,
    Calendar, Award, Star, Gift, Sparkles, Settings, EyeOff,
    UserCheck, Upload, Briefcase, GraduationCap, Home, Users,
    Search, Clock, Bell, Shield, ChevronRight, Plus, X,
    AlertCircle, ToggleLeft, ToggleRight, XCircle, Phone
  };
  return icons[iconName] || User;
}

export default DynamicProfileForm;