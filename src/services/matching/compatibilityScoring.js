// Education level hierarchy
export const EDUCATION_LEVELS = [
  'High School',
  'Diploma',
  'Other',
  "Bachelor's",
  "Master's",
  'Doctorate'
];

// Degree to tier mapping for normalization
export const DEGREE_TIER_MAP = {
  'high school': 'High School',
  '10th': 'High School',
  '12th': 'High School',
  'diploma': 'Diploma',
  'b.tech': "Bachelor's",
  'btech': "Bachelor's",
  'be': "Bachelor's",
  'b.e.': "Bachelor's",
  'b.sc': "Bachelor's",
  'bsc': "Bachelor's",
  'b.com': "Bachelor's",
  'bcom': "Bachelor's",
  'ba': "Bachelor's",
  'b.a.': "Bachelor's",
  'bba': "Bachelor's",
  'bca': "Bachelor's",
  'mbbs': "Bachelor's",
  'bds': "Bachelor's",
  'llb': "Bachelor's",
  'bachelor': "Bachelor's",
  "bachelor's": "Bachelor's",
  'm.tech': "Master's",
  'mtech': "Master's",
  'me': "Master's",
  'm.e.': "Master's",
  'm.sc': "Master's",
  'msc': "Master's",
  'm.com': "Master's",
  'mcom': "Master's",
  'mba': "Master's",
  'mca': "Master's",
  'md': "Master's",
  'ms': "Master's",
  'llm': "Master's",
  'master': "Master's",
  "master's": "Master's",
  'phd': 'Doctorate',
  'ph.d': 'Doctorate',
  'doctorate': 'Doctorate'
};

export function normalizeEducation(eduStr) {
  if (!eduStr) return null;
  const lower = eduStr.trim().toLowerCase();
  if (DEGREE_TIER_MAP[lower]) return DEGREE_TIER_MAP[lower];

  for (const [key, tier] of Object.entries(DEGREE_TIER_MAP)) {
    if (lower.includes(key)) return tier;
  }

  // Fallback check against known education levels
  const matchedLevel = EDUCATION_LEVELS.find(l => l.toLowerCase() === lower);
  return matchedLevel || 'Other';
}

export function calculateAge(dob) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;
  const ageDiff = Date.now() - birthDate.getTime();
  return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
}

export function parseHeightToInches(heightStr) {
  if (!heightStr) return null;
  const str = String(heightStr).trim();

  // Match "5'5"" or "5'5" or "5' 5""
  const ftInMatch = str.match(/(\d+)\s*'\s*(\d+)?/);
  if (ftInMatch) {
    const feet = parseInt(ftInMatch[1], 10);
    const inches = ftInMatch[2] ? parseInt(ftInMatch[2], 10) : 0;
    return feet * 12 + inches;
  }

  // Match "165 cm" or "165cm"
  const cmMatch = str.match(/(\d+)\s*cm/i);
  if (cmMatch) {
    return Math.round(parseInt(cmMatch[1], 10) / 2.54);
  }

  return null;
}

export function parseIncomeToLakhs(incomeStr) {
  if (!incomeStr) return null;
  const str = String(incomeStr).trim();

  // Range match e.g. "18-25 Lakhs" or "10 - 15"
  const rangeMatch = str.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return (parseInt(rangeMatch[1], 10) + parseInt(rangeMatch[2], 10)) / 2;
  }

  // Plus match e.g. "35+ Lakhs"
  const plusMatch = str.match(/(\d+)\s*\+/);
  if (plusMatch) {
    return parseInt(plusMatch[1], 10);
  }

  // Single number extract
  const numMatch = str.match(/(\d+)/);
  if (numMatch) {
    return parseInt(numMatch[1], 10);
  }

  return null;
}

// Directional score calculation from source profile preferences to candidate profile attributes
export function evaluateOneWayScore(sourceProfile, targetProfile) {
  if (!sourceProfile || !targetProfile) return 70;

  let matchedPercentage = 0;
  const expectationFields = [
    { expectation: 'expectedCaste', matchField: 'caste' },
    { expectation: 'preferredCity', matchField: 'currentCity' },
    { expectation: 'expectedEducation', matchField: 'education' },
    { expectation: 'expectedHeight', matchField: 'height' },
    { expectation: 'expectedIncome', matchField: 'income' },
    { expectation: 'divorcee', matchField: 'maritalStatus' },
    { expectation: 'expectedAgeDifference', matchField: 'age' }
  ];

  const pointsPerField = 100 / expectationFields.length; // ~14.28 points

  expectationFields.forEach(({ expectation, matchField }) => {
    const expectedValue = sourceProfile[expectation];
    const targetValue = targetProfile[matchField];

    // If source didn't specify an expectation, grant full points (not penalized)
    if (!expectedValue) {
      matchedPercentage += pointsPerField;
      return;
    }

    // If target attribute is missing, 0 points for this criterion
    if (targetValue === null || targetValue === undefined || targetValue === '') {
      return;
    }

    // 1. Caste Match
    if (expectation === 'expectedCaste' && matchField === 'caste') {
      const expCaste = String(expectedValue).trim().toLowerCase();
      const targetCaste = String(targetValue).trim().toLowerCase();

      if (expCaste === targetCaste) {
        matchedPercentage += pointsPerField;
      } else if (targetCaste.startsWith(expCaste) || expCaste === 'bari') {
        // Bari-community default match allowance
        matchedPercentage += pointsPerField;
      }
    }
    // 2. City Match
    else if (expectation === 'preferredCity' && matchField === 'currentCity') {
      const expCity = String(expectedValue).trim().toLowerCase();
      const targetCity = String(targetValue).trim().toLowerCase();

      if (expCity === targetCity || targetCity.includes(expCity) || expCity.includes(targetCity)) {
        matchedPercentage += pointsPerField;
      } else {
        matchedPercentage += pointsPerField / 3; // Regional proximity allowance
      }
    }
    // 3. Education Match
    else if (expectation === 'expectedEducation' && matchField === 'education') {
      const expTier = normalizeEducation(String(expectedValue));
      const targetTier = normalizeEducation(String(targetValue));

      const expIdx = EDUCATION_LEVELS.indexOf(expTier);
      const targetIdx = EDUCATION_LEVELS.indexOf(targetTier);

      if (expIdx !== -1 && targetIdx !== -1) {
        if (targetIdx >= expIdx) {
          matchedPercentage += pointsPerField; // Equal or higher qualification
        } else if (targetIdx === expIdx - 1) {
          matchedPercentage += pointsPerField / 2; // 1 level below
        }
      } else if (expTier === targetTier) {
        matchedPercentage += pointsPerField;
      }
    }
    // 4. Height Match
    else if (expectation === 'expectedHeight' && matchField === 'height') {
      const targetInches = parseHeightToInches(targetValue);
      let minH = 0, maxH = 1000;

      const expStr = String(expectedValue);
      if (expStr.includes('-')) {
        const parts = expStr.split('-');
        minH = parseHeightToInches(parts[0]) || 0;
        maxH = parseHeightToInches(parts[1]) || 1000;
      } else {
        minH = parseHeightToInches(expStr) || 0;
        maxH = minH + 3; // 3-inch allowance
      }

      if (targetInches && minH && targetInches >= minH && targetInches <= maxH) {
        matchedPercentage += pointsPerField;
      } else if (targetInches && minH && Math.abs(targetInches - minH) <= 2) {
        matchedPercentage += pointsPerField / 2;
      }
    }
    // 5. Income Match
    else if (expectation === 'expectedIncome' && matchField === 'income') {
      const expLakhs = parseIncomeToLakhs(expectedValue);
      const targetLakhs = parseIncomeToLakhs(targetValue);

      if (expLakhs !== null && targetLakhs !== null) {
        if (targetLakhs >= expLakhs) {
          matchedPercentage += pointsPerField;
        } else if (targetLakhs >= expLakhs * 0.75) {
          matchedPercentage += pointsPerField / 2;
        }
      }
    }
    // 6. Divorcee / Marital Status
    else if (expectation === 'divorcee' && matchField === 'maritalStatus') {
      const expDivorcee = String(expectedValue).trim().toLowerCase();
      const targetStatus = String(targetValue).trim().toLowerCase();

      if (expDivorcee === 'yes') {
        matchedPercentage += pointsPerField; // Accepts any marital status
      } else if (targetStatus === 'unmarried') {
        matchedPercentage += pointsPerField;
      }
    }
    // 7. Age Difference Match
    else if (expectation === 'expectedAgeDifference') {
      const sourceAge = sourceProfile.dob ? calculateAge(sourceProfile.dob) : sourceProfile.age;
      const targetAge = targetProfile.age !== undefined ? targetProfile.age : calculateAge(targetProfile.dob);

      if (sourceAge && targetAge) {
        const ageDiff = Math.abs(sourceAge - targetAge);
        let minGap = 0, maxGap = 10;

        const expStr = String(expectedValue).replace(/Years/i, '').trim();
        if (expStr.includes('-')) {
          const parts = expStr.split('-');
          minGap = parseInt(parts[0], 10) || 0;
          maxGap = parseInt(parts[1], 10) || 10;
        } else if (expStr.includes('+')) {
          minGap = parseInt(expStr, 10) || 0;
          maxGap = 100;
        }

        if (ageDiff >= minGap && ageDiff <= maxGap) {
          matchedPercentage += pointsPerField;
        } else if (Math.abs(ageDiff - minGap) <= 2 || Math.abs(ageDiff - maxGap) <= 2) {
          matchedPercentage += pointsPerField / 2;
        }
      } else {
        matchedPercentage += pointsPerField / 2;
      }
    }
    // Default equality fallback
    else if (String(expectedValue).toLowerCase() === String(targetValue).toLowerCase()) {
      matchedPercentage += pointsPerField;
    }
  });

  return Math.min(100, Math.round(matchedPercentage));
}

// Compute mutual 2-way score (User -> Candidate and Candidate -> User)
export function calculateMutualCompatibility(user, candidate) {
  if (!user) {
    return Math.min(95, Math.max(60, candidate?.profileCompletion || 70));
  }

  const candidateAge = candidate.dob ? calculateAge(candidate.dob) : candidate.age;
  const candidateObj = {
    ...candidate,
    age: candidateAge
  };

  const userAge = user.dob ? calculateAge(user.dob) : user.age;
  const userObj = {
    ...user,
    age: userAge
  };

  // Direction 1: User's preferences matched against Candidate profile
  const scoreUserToCandidate = evaluateOneWayScore(userObj, candidateObj);

  // Direction 2: Candidate's preferences matched against User profile
  const scoreCandidateToUser = evaluateOneWayScore(candidateObj, userObj);

  // Weighted Mutual Score: 60% User's preference fit + 40% Candidate's preference fit
  const mutualScore = Math.round(scoreUserToCandidate * 0.6 + scoreCandidateToUser * 0.4);

  return Math.min(100, Math.max(0, mutualScore));
}
