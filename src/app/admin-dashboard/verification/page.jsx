"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X, ChevronDown, ChevronUp, Edit, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from '@/context/SessionContext';

const EditProfileModal = ({
  profile,
  onSave,
  onClose,
  isSaving
}) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ""]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isSaving}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info Section - Updated with new fields */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob || ''}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <select
                    value={formData.height || ''}
                    onChange={(e) => handleChange('height', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Height</option>
                    {Array.from({ length: 24 }, (_, i) => {
                      const feet = 4 + Math.floor((i + 6) / 12);
                      const inches = (i + 6) % 12;
                      const cm = Math.round((feet * 30.48) + (inches * 2.54));
                      return (
                        <option key={i} value={`${feet}'${inches}" (${cm} cm)`}>
                          {feet}'{inches}" ({cm} cm)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <select
                    value={formData.maritalStatus || ''}
                    onChange={(e) => handleChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Unmarried">Unmarried</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother Tongue</label>
                  <input
                    type="text"
                    value={formData.motherTongue || ''}
                    onChange={(e) => handleChange('motherTongue', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current City</label>
                  <input
                    type="text"
                    value={formData.currentCity || ''}
                    onChange={(e) => handleChange('currentCity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                  <input
                    type="text"
                    value={formData.permanentAddress || ''}
                    onChange={(e) => handleChange('permanentAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wears Lens</label>
                  <select
                    value={formData.wearsLens ? 'Yes' : 'No'}
                    onChange={(e) => handleChange('wearsLens', e.target.value === 'Yes')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup || ''}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diet</label>
                  <select
                    value={formData.diet || ''}
                    onChange={(e) => handleChange('diet', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Religious Info Section - Updated */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">Religious Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <input
                    type="text"
                    value={formData.religion || ''}
                    onChange={(e) => handleChange('religion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caste</label>
                  <input
                    type="text"
                    value={formData.caste || ''}
                    onChange={(e) => handleChange('caste', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Caste</label>
                  <input
                    type="text"
                    value={formData.subCaste || ''}
                    onChange={(e) => handleChange('subCaste', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gothra</label>
                  <select
                    value={formData.gothra || ''}
                    onChange={(e) => handleChange('gothra', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Gothra</option>
                    {["Kashyap", "Bharadwaj", "Vashishta", "Vishwamitra", "Gautam", "Jamadagni", "Atri", "Agastya", "Angiras", "Bhrigu", "Garg", "Haritas", "Kaundinya", "Sandilya", "Shandilya", "Upamanyu", "Vatsa", "Mudgala", "Parashar", "Kaushik", "Don't know"].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Info Section - Updated */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <input
                    type="text"
                    value={formData.education || ''}
                    onChange={(e) => handleChange('education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={formData.fieldOfStudy || ''}
                    onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College/University</label>
                  <input
                    type="text"
                    value={formData.college || ''}
                    onChange={(e) => handleChange('college', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation || ''}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Sector</label>
                  <select
                    value={formData.workSector || ''}
                    onChange={(e) => handleChange('workSector', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Work Sector</option>
                    {['Private Company', 'Government', 'Defence / Civil Services', 'Business', 'Farmer', 'Not Working'].map((sect) => (
                      <option key={sect} value={sect}>{sect}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Income</label>
                  <input
                    type="text"
                    value={formData.income || ''}
                    onChange={(e) => handleChange('income', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Family Info Section - Updated */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">Family Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={formData.fatherName || ''}
                    onChange={(e) => handleChange('fatherName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={formData.mother || ''}
                    onChange={(e) => handleChange('mother', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brothers</label>
                  <input
                    type="number"
                    value={formData.brothers || ''}
                    onChange={(e) => handleChange('brothers', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Married Brothers</label>
                  <input
                    type="number"
                    value={formData.marriedBrothers || ''}
                    onChange={(e) => handleChange('marriedBrothers', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sisters</label>
                  <input
                    type="number"
                    value={formData.sisters || ''}
                    onChange={(e) => handleChange('sisters', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Married Sisters</label>
                  <input
                    type="number"
                    value={formData.marriedSisters || ''}
                    onChange={(e) => handleChange('marriedSisters', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Residence City</label>
                  <input
                    type="text"
                    value={formData.parentResidenceCity || ''}
                    onChange={(e) => handleChange('parentResidenceCity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Native District</label>
                  <input
                    type="text"
                    value={formData.nativeDistrict || ''}
                    onChange={(e) => handleChange('nativeDistrict', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Native City</label>
                  <input
                    type="text"
                    value={formData.nativeCity || ''}
                    onChange={(e) => handleChange('nativeCity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Occupation</label>
                  <input
                    type="text"
                    value={formData.parentOccupation || ''}
                    onChange={(e) => handleChange('parentOccupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mamekul (mama's surname)</label>
                  <input
                    type="text"
                    value={formData.mamaSurname || ''}
                    onChange={(e) => handleChange('mamaSurname', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relative Surnames</label>
                  {(formData.relativeSurname || []).map((surname, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={surname}
                        onChange={(e) => handleArrayChange('relativeSurname', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('relativeSurname', index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('relativeSurname')}
                    className="mt-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                  >
                    Add Surname
                  </button>
                </div>
              </div>
            </div>

            {/* New Horoscope Info Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">Horoscope Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rashi</label>
                  <select
                    value={formData.rashi || ''}
                    onChange={(e) => handleChange('rashi', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Rashi</option>
                    {["Mesh", "Vrishabh", "Mithun", "Kark", "Simha", "Kanya", "Tula", "Vrishchik", "Dhanu", "Makar", "Kumbh", "Meen", "Don't know"].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mangal</label>
                  <select
                    value={formData.mangal || 'No'}
                    onChange={(e) => handleChange('mangal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="Don't know">Don't know</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                  <input
                    type="text"
                    value={formData.birthPlace || ''}
                    onChange={(e) => handleChange('birthPlace', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Time</label>
                  <input
                    type="time"
                    value={formData.birthTime || ''}
                    onChange={(e) => handleChange('birthTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

              </div>
            </div>

            {/* New Expectations Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">Partner Expectations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Caste</label>
                  <input
                    type="text"
                    value={formData.expectedCaste || ''}
                    onChange={(e) => handleChange('expectedCaste', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred City</label>
                  <input
                    type="text"
                    value={formData.preferredCity || ''}
                    onChange={(e) => handleChange('preferredCity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Age Difference</label>
                  <select
                    value={formData.expectedAgeDifference || ''}
                    onChange={(e) => handleChange('expectedAgeDifference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="±1 year">±1 year</option>
                    <option value="±2 years">±2 years</option>
                    <option value="±3 years">±3 years</option>
                    <option value="±5 years">±5 years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Education</label>
                  <select
                    value={formData.expectedEducation || ''}
                    onChange={(e) => handleChange('expectedEducation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accept Divorcee</label>
                  <select
                    value={formData.divorcee ? 'Yes' : 'No'}
                    onChange={(e) => handleChange('divorcee', e.target.value === 'Yes')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Height</label>
                  <select
                    value={formData.expectedHeight || ''}
                    onChange={(e) => handleChange('expectedHeight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="5'0&quot; - 5'5&quot;">5'0" - 5'5"</option>
                    <option value="5'5&quot; - 5'10&quot;">5'5" - 5'10"</option>
                    <option value="5'10&quot; - 6'0&quot;">5'10" - 6'0"</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Income</label>
                  <select
                    value={formData.expectedIncome || ''}
                    onChange={(e) => handleChange('expectedIncome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="₹5-10 Lakhs">₹5-10 Lakhs</option>
                    <option value="₹10-15 Lakhs">₹10-15 Lakhs</option>
                    <option value="₹15-20 Lakhs">₹15-20 Lakhs</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2 disabled:opacity-50"
            >
              <X size={16} /> Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-rose-500 rounded-md hover:bg-rose-600 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
function DetailItem({ label, value, field, profile, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  if (!value && value !== 0 && value !== false) return null;

  const handleSave = () => {
    onEdit(field, editValue);
    setIsEditing(false);
  };

  // Special handling for boolean fields
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;

  return (
    <div className="space-y-1 group">
      <div className="flex justify-between items-start">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        {onEdit && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit size={14} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          {typeof value === 'boolean' ? (
            <select
              value={editValue ? 'Yes' : 'No'}
              onChange={(e) => setEditValue(e.target.value === 'Yes')}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          ) : (
            <input
              type={field === 'dob' ? 'date' : 'text'}
              value={editValue || ''}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
            />
          )}
          <button
            onClick={handleSave}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <p className="text-sm font-semibold text-gray-800">
          {displayValue || <span className="text-gray-400 italic">Not specified</span>}
        </p>
      )}
    </div>
  );
}

export default function Verification() {
  const { session } = useSession();
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [submissionProfiles, setSubmissionProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    family: true,
    horoscope: true,
    expectations: true
  });
  const [showFullImage, setShowFullImage] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    const fetchPendingProfiles = async () => {
      try {
        const res = await fetch("/api/admin/pendingProfile");
        const data = await res.json();
        if (res.ok) {
          const profilesWithAge = data.users.map(profile => ({
            ...profile,
            age: calculateAge(profile.dob) || profile.age
          }));
          setPendingProfiles(profilesWithAge);
        } else {
          console.error("Fetch failed:", data.error);
        }
      } catch (err) {
        console.error("Error fetching pending profiles:", err);
      }
    };

    const fetchAdminSetupProfiles = async () => {
      try {
        const res = await fetch("/api/admin/adminSetupProfiles");
        const data = await res.json();
        if (res.ok) {
          const profilesWithAge = data.users.map(profile => ({
            ...profile,
            age: calculateAge(profile.dob) || profile.age
          }));
          setSubmissionProfiles(profilesWithAge);
        } else {
          console.error("Fetch failed:", data.error);
        }
      } catch (err) {
        console.error("Error fetching admin setup profiles:", err);
      }
    };

    fetchPendingProfiles();
    fetchAdminSetupProfiles();
  }, []);

  const handleVerification = async (userId, action) => {
    try {
      const res = await fetch('/api/admin/verifyProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      if (res.ok) {
        setPendingProfiles(prev => prev.filter(user => user._id !== userId));
        setSubmissionProfiles(prev => prev.filter(user => user._id !== userId));
        setSelectedProfile(null);
        alert(`User ${action.toLowerCase()} successfully!`);
      }
    } catch (error) {
      alert('Failed to update verification status');
    }
  };

  const handleEditProfile = async (profileData) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profileData._id,
          ...profileData
        }),
      });

      if (res.ok) {
        const updatedProfile = await res.json();

        if (activeTab === 'pending') {
          setPendingProfiles(prev =>
            prev.map(p => p._id === updatedProfile._id ? updatedProfile : p)
          );
        } else {
          setSubmissionProfiles(prev =>
            prev.map(p => p._id === updatedProfile._id ? updatedProfile : p)
          );
        }

        if (selectedProfile && selectedProfile._id === updatedProfile._id) {
          setSelectedProfile(updatedProfile);
        }

        setEditingProfile(null);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderProfileCards = (profiles) => (

    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
    >
      {profiles.map((u) => (
        <motion.div
          key={u._id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 relative"
        >
          <div className="absolute top-3 right-3 text-amber-600 text-sm font-medium">
            {activeTab === 'pending' ? 'Pending Verification' : 'Requires Admin Setup'}
          </div>

          <div className="p-5 flex flex-col gap-4 relative">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer relative"
                onClick={() => setSelectedProfile(u)}
              >
                <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden relative">
                  <img
                    src={u.profilePhoto}
                    alt={u.name}
                    className="w-full h-full object-cover"

                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-full" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </motion.div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">{u.name}</h2>
                <p className="text-sm text-gray-600 truncate">{u.email || u.phone}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                    {u.age} yrs
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    {u.gender}
                  </span>
                  {u.currentCity && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full truncate max-w-[80px]">
                      {u.currentCity}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-500">Profile Completion</span>
                <span className="text-xs font-bold text-rose-600">
                  {u.profileCompletion}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-rose-400 to-indigo-500"
                  style={{ width: `${u.profileCompletion}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProfile(u)}
                className="flex-1 bg-gradient-to-r from-rose-50 to-white hover:from-rose-100 hover:to-white text-rose-600 px-3 py-2 rounded-lg text-sm font-medium border border-rose-200 transition-all flex items-center justify-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                View Details
              </motion.button>
              {
                u?.profileSetup?.willAdminFill && <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditingProfile(u)}
                  className="flex-1 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-white text-gray-600 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 transition-all flex items-center justify-center gap-1"
                >
                  <Edit size={16} />
                  Edit
                </motion.button>
              }
              {activeTab === 'pending' ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVerification(u._id, 'APPROVE')}
                  className="flex-1 bg-gradient-to-r from-green-50 to-white hover:from-green-100 hover:to-white text-green-600 px-3 py-2 rounded-lg text-sm font-medium border border-green-200 transition-all flex items-center justify-center gap-1"
                >
                  <CheckCircle size={16} />
                  Approve
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVerification(u._id, 'COMPLETE_SETUP')}
                  className="flex-1 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-white text-blue-600 px-3 py-2 rounded-lg text-sm font-medium border border-blue-200 transition-all flex items-center justify-center gap-1"
                >
                  <Save size={16} />
                  Complete
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {activeTab === 'pending'
              ? `${pendingProfiles.length} pending verifications`
              : `${submissionProfiles.length} profiles need setup`}
          </span>
        </div>


        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Pending Verification
          </button>
          <button
            onClick={() => setActiveTab('submission')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'submission' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Admin Setup Required
          </button>
        </div>

        {/* Profile Cards */}
        {activeTab === 'pending' ? (
          pendingProfiles.length > 0 ? (
            renderProfileCards(pendingProfiles)
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No pending verifications</h3>
              <p className="text-gray-500">All profiles are verified and up to date.</p>
            </div>
          )
        ) : submissionProfiles.length > 0 ? (
          renderProfileCards(submissionProfiles)
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">All profiles are set up</h3>
            <p className="text-gray-500">No admin setup required at this time.</p>
          </div>
        )}

        {/* Profile Detail Modal */}
        <AnimatePresence>
          {selectedProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{selectedProfile.name}'s Profile</h2>
                    <button
                      onClick={() => setSelectedProfile(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="sticky top-4 space-y-4">
                        <div
                          className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square cursor-pointer"
                          onClick={() => setShowFullImage(true)}
                        >
                          <img
                            src={selectedProfile.profilePhoto}
                            alt={selectedProfile.name}
                            className="w-full h-full object-cover"

                          />
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-700">Verification Status</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedProfile.isVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                              }`}>
                              {selectedProfile.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-700">Profile Completion</h3>
                            <span className="text-sm font-bold text-rose-600">
                              {selectedProfile.profileCompletion}%
                            </span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-rose-400 to-indigo-500"
                              style={{ width: `${selectedProfile.profileCompletion}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-6 space-y-4">
                          {activeTab === 'pending' ? (
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => handleVerification(selectedProfile._id, 'REJECT')}
                                className="px-4 py-2 text-sm font-medium text-rose-700 bg-rose-100 rounded-md hover:bg-rose-200 flex items-center justify-center gap-2"
                              >
                                <XCircle size={16} /> Reject
                              </button>
                              <button
                                onClick={() => handleVerification(selectedProfile._id, 'APPROVE')}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                              >
                                <CheckCircle size={16} /> Approve
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => setEditingProfile(selectedProfile)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                              >
                                <Edit size={16} /> Edit Profile
                              </button>
                              <button
                                onClick={() => handleVerification(selectedProfile._id, 'COMPLETE_SETUP')}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                              >
                                <Save size={16} /> Complete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                      {/* Basic Information Section */}
                      <div className="space-y-4">
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection('basic')}
                        >
                          <h3 className="font-medium text-gray-700">Basic Information</h3>
                          {expandedSections.basic ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>

                        <AnimatePresence>
                          {expandedSections.basic && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <DetailItem
                                label="Name"
                                value={selectedProfile.name}
                                field="name"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Date of Birth"
                                value={new Date(selectedProfile.dob).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })} // outputs: 29 Feb 2004
                                field="dob"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />

                              <DetailItem
                                label="Age"
                                value={selectedProfile.age}
                                field="age"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Height"
                                value={selectedProfile.height}
                                field="height"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />

                              <DetailItem
                                label="Gender"
                                value={selectedProfile.gender}
                                field="gender"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Marital Status"
                                value={selectedProfile.maritalStatus}
                                field="maritalStatus"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Mother Tongue"
                                value={selectedProfile.motherTongue}
                                field="motherTongue"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Current Location"
                                value={selectedProfile.currentCity}
                                field="currentCity"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Permanent Address"
                                value={selectedProfile.permanentAddress}
                                field="permanentAddress"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Wears Lens"
                                value={selectedProfile.wearsLens}
                                field="wearsLens"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Blood Group"
                                value={selectedProfile.bloodGroup}
                                field="bloodGroup"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Diet"
                                value={selectedProfile.diet}
                                field="diet"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />

                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Religious Information Section - Updated */}
                      <div className="space-y-4">
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection('religious')}
                        >
                          <h3 className="font-medium text-gray-700">Religious & Community</h3>
                          {expandedSections.religious ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>

                        <AnimatePresence>
                          {expandedSections.religious && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <DetailItem
                                label="Religion"
                                value={selectedProfile.religion}
                                field="religion"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Caste"
                                value={selectedProfile.caste}
                                field="caste"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Sub Caste"
                                value={selectedProfile.subCaste}
                                field="subCaste"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Gothra"
                                value={selectedProfile.gothra}
                                field="gothra"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Professional Information Section - Updated */}
                      <div className="space-y-4">
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection('professional')}
                        >
                          <h3 className="font-medium text-gray-700">Education & Profession</h3>
                          {expandedSections.professional ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>

                        <AnimatePresence>
                          {expandedSections.professional && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <DetailItem
                                label="Education"
                                value={selectedProfile.education}
                                field="education"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Field of Study"
                                value={selectedProfile.fieldOfStudy}
                                field="fieldOfStudy"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="College/University"
                                value={selectedProfile.college}
                                field="college"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Occupation"
                                value={selectedProfile.occupation}
                                field="occupation"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Work Sector"
                                value={selectedProfile.workSector}
                                field="workSector"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Income"
                                value={selectedProfile.income}
                                field="income"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Family Information Section - Updated */}
                      <div className="space-y-4">
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection('family')}
                        >
                          <h3 className="font-medium text-gray-700">Family Information</h3>
                          {expandedSections.family ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>

                        <AnimatePresence>
                          {expandedSections.family && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <DetailItem
                                label="Father's Name"
                                value={selectedProfile.fatherName}
                                field="fatherName"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Mother's Name"
                                value={selectedProfile.mother}
                                field="mother"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Brothers"
                                value={selectedProfile.brothers}
                                field="brothers"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Married Brothers"
                                value={selectedProfile.marriedBrothers}
                                field="marriedBrothers"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Sisters"
                                value={selectedProfile.sisters}
                                field="sisters"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Married Sisters"
                                value={selectedProfile.marriedSisters}
                                field="marriedSisters"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Parent Residence City"
                                value={selectedProfile.parentResidenceCity}
                                field="parentResidenceCity"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Native District"
                                value={selectedProfile.nativeDistrict}
                                field="nativeDistrict"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Native City"
                                value={selectedProfile.nativeCity}
                                field="nativeCity"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />

                              <DetailItem
                                label="Parent Occupation"
                                value={selectedProfile.parentOccupation}
                                field="parentOccupation"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Mamekul (mama's surname)"
                                value={selectedProfile.mamaSurname}
                                field="mamaSurname"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              {selectedProfile.relativeSurname?.map((surname, index) => (
                                <DetailItem
                                  key={index}
                                  label={`Relative Surname ${index + 1}`}
                                  value={surname}
                                  field={`relativeSurname[${index}]`}
                                  profile={selectedProfile}
                                  onEdit={(field, value) => {
                                    const newSurnames = [...selectedProfile.relativeSurname];
                                    newSurnames[index] = value;
                                    handleEditProfile({ ...selectedProfile, relativeSurname: newSurnames });
                                  }}
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* New Horoscope Information Section */}
                      <div className="space-y-4">
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection('horoscope')}
                        >
                          <h3 className="font-medium text-gray-700">Horoscope Information</h3>
                          {expandedSections.horoscope ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>

                        <AnimatePresence>
                          {expandedSections.horoscope && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <DetailItem
                                label="Rashi"
                                value={selectedProfile.rashi}
                                field="rashi"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />

                              <DetailItem
                                label="Mangal"
                                value={selectedProfile.mangal}
                                field="mangal"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Birth Place"
                                value={selectedProfile.birthPlace}
                                field="birthPlace"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Birth Time"
                                value={selectedProfile.birthTime}
                                field="birthTime"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />

                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* New Partner Expectations Section */}
                      <div className="space-y-4">
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection('expectations')}
                        >
                          <h3 className="font-medium text-gray-700">Partner Expectations</h3>
                          {expandedSections.expectations ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>

                        <AnimatePresence>
                          {expandedSections.expectations && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <DetailItem
                                label="Expected Caste"
                                value={selectedProfile.expectedCaste}
                                field="expectedCaste"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Preferred City"
                                value={selectedProfile.preferredCity}
                                field="preferredCity"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Expected Age Difference"
                                value={selectedProfile.expectedAgeDifference}
                                field="expectedAgeDifference"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Expected Education"
                                value={selectedProfile.expectedEducation}
                                field="expectedEducation"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Accept Divorcee"
                                value={selectedProfile.divorcee}
                                field="divorcee"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Expected Height"
                                value={selectedProfile.expectedHeight}
                                field="expectedHeight"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                              <DetailItem
                                label="Expected Income"
                                value={selectedProfile.expectedIncome}
                                field="expectedIncome"
                                profile={selectedProfile}
                                onEdit={(field, value) => handleEditProfile({ ...selectedProfile, [field]: value })}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Profile Modal */}
        {editingProfile && (
          <EditProfileModal
            profile={editingProfile}
            onSave={handleEditProfile}
            onClose={() => setEditingProfile(null)}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}