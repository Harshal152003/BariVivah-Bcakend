export const calculateProfileCompletion = (user) => {
  const requiredFields = [
    'name',
    'phone',
    'gender',
    'dob',
    'height',
    'maritalStatus',
    'religion',
    'caste',
    'motherTongue',
    'education',
    'occupation',
    'income',
    'currentCity',
    'profilePhoto',
    'fatherName',
    'mother',
    'brothers',
    'sisters',
    'nativeCity',
    'permanentAddress',
    'rashi',
    'gothra'
  ];

  const importantFields = [
    'email',
    'weight',
    'complexion',
    'bloodGroup',
    'company',
    'fieldOfStudy',
    'college',
    'parentOccupation',
    'parentResidenceCity',
    'nativeDistrict',
    'familyWealth',
    'mamaSurname',
    'relativeSurname',
    'birthPlace',
    'birthTime',
    'nakshira',
    'charan',
    'gan',
    'nadi',
    'gotraDevak',
    'mangal',
    'expectedCaste',
    'expectedEducation',
    'expectedHeight',
    'expectedIncome',
    'preferredCity',
    'expectedAgeDifference'
  ];

  // Calculate completion
  let completedCount = 0;
  let totalCount = requiredFields.length + (importantFields.length * 0.5);

  // Check required fields (1 point each)
  requiredFields.forEach(field => {
    if (field === 'religion' || field === 'caste') {
      completedCount += 1;
      return;
    }
    if (user[field] !== null && user[field] !== undefined && user[field] !== '') {
      completedCount += 1;
    }
  });

  // Check important fields (0.5 point each)
  importantFields.forEach(field => {
    if (field === 'expectedCaste') {
      completedCount += 0.5;
      return;
    }
    if (user[field] !== null && user[field] !== undefined && user[field] !== '') {
      completedCount += 0.5;
    }
  });

  // Calculate percentage
  const completionPercentage = Math.round((completedCount / totalCount) * 100);
  return Math.min(completionPercentage, 100); // Cap at 100%
};