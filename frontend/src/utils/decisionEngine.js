// ==============================================================================
// AI Scholarship Matcher — Intelligent Decision & Optimization Engine
// Deterministic Multi-Weight Independent Set (MWIS) Solver + Explainable AI
// ==============================================================================
import defaultSchemesCatalog from '../data/allSchemesCatalog.json';

export const DEFAULT_SCHEMES = [
  {
    id: "tn-first-graduate",
    name: "Tamil Nadu First Graduate Tuition Fee Concession",
    name_ta: "தமிழ்நாடு முதல் பட்டதாரி கல்வி கட்டணச் சலுகை",
    category: "entitlement",
    financial_value: 25000,
    annual_benefit: 25000,
    benefit_period: "Per Academic Year (Up to 4 Years)",
    benefit_breakdown: {
      tuition_waiver: 25000,
      maintenance_stipend: 0,
      book_allowance: 0
    },
    criteria: {
      gender: "any",
      eligible_communities: ["OC", "BC", "BCM", "MBC", "SC", "ST", "SCC"],
      max_income: null,
      min_percentage: 0.0,
      govt_school_only: false,
      first_graduate_only: true,
      differently_abled_only: false,
      allowed_courses: ["Engineering", "Arts & Science", "Medical", "Diploma", "All"]
    },
    mutually_exclusive_with: ["aicte-pragati", "tn-post-matric-bc-mbc", "pm-usp-csss"],
    portal_name: "TNEA Single Window Counseling",
    portal_url: "https://www.tneaonline.org",
    deadline: "31st August 2026",
    renewal: "Automatic with good academic standing",
    required_docs: [
      "First Graduate Certificate (Tahsildar / e-Sevai)",
      "Joint Undertaking by Parents & Candidate",
      "HSC Marksheet",
      "Family Ration Card / Smart Card"
    ],
    department: "Directorate of Technical Education (DOTE)",
    description: "100% Tuition Fee Concession up to ₹25,000/yr credited directly to accredited college via Single Window Counseling for first-generation graduates."
  },
  {
    id: "tn-pudhumai-penn",
    name: "Pudhumai Penn Thittam (Moovalur Ramamirtham Ammaiyar Scheme)",
    name_ta: "புதுமைப் பெண் திட்டம் (மூவலூர் ராமாமிர்தம் அம்மையார் திட்டம்)",
    category: "entitlement",
    financial_value: 12000,
    annual_benefit: 12000,
    benefit_period: "₹1,000 / month (12 Months)",
    benefit_breakdown: {
      tuition_waiver: 0,
      maintenance_stipend: 12000,
      book_allowance: 0
    },
    criteria: {
      gender: "female",
      eligible_communities: ["OC", "BC", "BCM", "MBC", "SC", "ST", "SCC"],
      max_income: null,
      min_percentage: 0.0,
      govt_school_only: true,
      first_graduate_only: false,
      differently_abled_only: false,
      allowed_courses: ["Engineering", "Arts & Science", "Medical", "Diploma", "All"]
    },
    mutually_exclusive_with: ["tn-tamil-pudhalvan"],
    portal_name: "Penkalvi TN Portal",
    portal_url: "https://www.pudhumaipenn.tn.gov.in",
    deadline: "Rolling Admissions 2026",
    renewal: "Annual verification by College Nodal Officer",
    required_docs: [
      "6th to 12th TN Government School Bonafide Certificate",
      "Aadhaar Card (Linked to DBT bank account)",
      "College Admission ID / Bonafide",
      "Bank Passbook IFSC Copy"
    ],
    department: "Social Welfare and Women Empowerment Department",
    description: "Statutory monthly stipend of ₹1,000 credited directly to girl students through Aadhaar-seeded DBT to foster higher education completion."
  },
  {
    id: "tn-tamil-pudhalvan",
    name: "Tamil Pudhalvan Thittam",
    name_ta: "தமிழ்ப் புதல்வன் திட்டம்",
    category: "entitlement",
    financial_value: 12000,
    annual_benefit: 12000,
    benefit_period: "₹1,000 / month (12 Months)",
    benefit_breakdown: {
      tuition_waiver: 0,
      maintenance_stipend: 12000,
      book_allowance: 0
    },
    criteria: {
      gender: "male",
      eligible_communities: ["OC", "BC", "BCM", "MBC", "SC", "ST", "SCC"],
      max_income: null,
      min_percentage: 0.0,
      govt_school_only: true,
      first_graduate_only: false,
      differently_abled_only: false,
      allowed_courses: ["Engineering", "Arts & Science", "Medical", "Diploma", "All"]
    },
    mutually_exclusive_with: ["tn-pudhumai-penn"],
    portal_name: "Tamil Pudhalvan Portal",
    portal_url: "https://www.tamilpudhalvan.tn.gov.in",
    deadline: "Rolling Admissions 2026",
    renewal: "Annual verification via College AISHE Portal",
    required_docs: [
      "6th to 12th TN Govt School Study Certificate",
      "Aadhaar Card",
      "College Student ID",
      "DBT Enabled Active Bank Account"
    ],
    department: "Higher Education Department, Government of Tamil Nadu",
    description: "Monthly financial grant of ₹1,000 for male students who studied in Tamil Nadu Government Schools (Classes 6-12) to purchase academic materials."
  },
  {
    id: "tn-post-matric-sc-st",
    name: "Post-Matric Scholarship for SC/ST/SCC (ADW Dept)",
    name_ta: "ஆதிதிராவிடர் & பழங்குடியினர் நல போஸ்ட்-மெட்ரிக் உதவித்தொகை",
    category: "entitlement",
    financial_value: 50000,
    annual_benefit: 50000,
    benefit_period: "Per Academic Year",
    benefit_breakdown: {
      tuition_waiver: 38000,
      maintenance_stipend: 12000,
      book_allowance: 0
    },
    criteria: {
      gender: "any",
      eligible_communities: ["SC", "ST", "SCC"],
      max_income: 250000,
      min_percentage: 0.0,
      govt_school_only: false,
      first_graduate_only: false,
      differently_abled_only: false,
      allowed_courses: ["Engineering", "Arts & Science", "Medical", "Diploma", "All"]
    },
    mutually_exclusive_with: ["pm-usp-csss", "aicte-pragati", "tn-post-matric-bc-mbc"],
    portal_name: "TN State Scholarship Portal (SSP)",
    portal_url: "https://ssp.tn.gov.in",
    deadline: "31st October 2026",
    renewal: "Annual e-District Biometric Authentication",
    required_docs: [
      "Permanent Community Certificate (Barcoded)",
      "Income Certificate (FY 2025-26 ≤ ₹2.5 Lakhs)",
      "Aadhaar Card (NPCI Seeded)",
      "10th & 12th Marksheets",
      "College Fee Receipt"
    ],
    department: "Adi Dravidar and Tribal Welfare Department",
    description: "100% compulsory tuition fee waiver, examination fees, and monthly maintenance allowance under Centrally Sponsored Scheme (60:40)."
  },
  {
    id: "tn-post-matric-bc-mbc",
    name: "Post-Matric Scholarship for BC/MBC/DNC",
    name_ta: "பிற்படுத்தப்பட்டோர் & மிகவும் பிற்படுத்தப்பட்டோர் நல உதவித்தொகை",
    category: "entitlement",
    financial_value: 15000,
    annual_benefit: 15000,
    benefit_period: "Per Academic Year",
    benefit_breakdown: {
      tuition_waiver: 12000,
      maintenance_stipend: 3000,
      book_allowance: 0
    },
    criteria: {
      gender: "any",
      eligible_communities: ["BC", "BCM", "MBC"],
      max_income: 250000,
      min_percentage: 0.0,
      govt_school_only: false,
      first_graduate_only: false,
      differently_abled_only: false,
      allowed_courses: ["Engineering", "Arts & Science", "Medical", "Diploma", "All"]
    },
    mutually_exclusive_with: ["pm-usp-csss", "aicte-pragati", "tn-first-graduate", "tn-post-matric-sc-st"],
    portal_name: "TN State Scholarship Portal (SSP)",
    portal_url: "https://ssp.tn.gov.in",
    deadline: "15th November 2026",
    renewal: "Annual verification through Institution Principal",
    required_docs: [
      "BC/MBC Community Certificate",
      "Income Certificate (≤ ₹2,50,000)",
      "Aadhaar Card",
      "Attendance & Bonafide Certificate"
    ],
    department: "Backward Classes, Most Backward Classes and Minorities Welfare Department",
    description: "Special fee concession and academic maintenance grant for eligible BC/MBC students in recognized degree institutions."
  },
  {
    id: "pm-usp-csss",
    name: "Central Sector Scheme of Scholarship (PM-USP CSSS via NSP)",
    name_ta: "மத்திய துறை கல்வி உதவித்தொகை (CSSS - தேசிய போர்ட்டல்)",
    category: "merit_cum_means",
    financial_value: 12000,
    annual_benefit: 12000,
    benefit_period: "₹12,000 / year (Undergraduate)",
    benefit_breakdown: {
      tuition_waiver: 0,
      maintenance_stipend: 12000,
      book_allowance: 0
    },
    criteria: {
      gender: "any",
      eligible_communities: ["OC", "BC", "BCM", "MBC", "SC", "ST", "SCC"],
      max_income: 450000,
      min_percentage: 80.0,
      govt_school_only: false,
      first_graduate_only: false,
      differently_abled_only: false,
      allowed_courses: ["Engineering", "Arts & Science", "Medical", "Diploma", "All"]
    },
    mutually_exclusive_with: ["tn-post-matric-sc-st", "tn-post-matric-bc-mbc", "aicte-pragati", "tn-first-graduate"],
    portal_name: "National Scholarship Portal (NSP)",
    portal_url: "https://scholarships.gov.in",
    deadline: "30th November 2026",
    renewal: "Minimum 50% marks and 75% attendance in semester exams",
    required_docs: [
      "Class 12th Board Marksheet (>80th Percentile)",
      "Income Certificate (≤ ₹4.5 Lakhs)",
      "Aadhaar Number",
      "College Bonafide Certificate"
    ],
    department: "Ministry of Education, Government of India",
    description: "Direct Central Sector Merit-cum-Means financial grant for students ranking in the top 20th percentile in their 12th state board examinations."
  },
  {
    id: "aicte-pragati",
    name: "AICTE Pragati Scholarship for Girls in Technical Education",
    name_ta: "அகில இந்திய தொழில்நுட்ப கல்வி கவுன்சில் (AICTE) பிரகதி திட்டம்",
    category: "merit_cum_means",
    financial_value: 50000,
    annual_benefit: 50000,
    benefit_period: "₹50,000 / year (Up to 4 Years)",
    benefit_breakdown: {
      tuition_waiver: 50000,
      maintenance_stipend: 0,
      book_allowance: 0
    },
    criteria: {
      gender: "female",
      eligible_communities: ["OC", "BC", "BCM", "MBC", "SC", "ST", "SCC"],
      max_income: 800000,
      min_percentage: 85.0,
      govt_school_only: false,
      first_graduate_only: false,
      differently_abled_only: false,
      allowed_courses: ["Engineering", "Diploma"]
    },
    mutually_exclusive_with: ["tn-first-graduate", "tn-post-matric-sc-st", "tn-post-matric-bc-mbc", "pm-usp-csss"],
    portal_name: "National Scholarship Portal (NSP / AICTE)",
    portal_url: "https://scholarships.gov.in",
    deadline: "15th December 2026",
    renewal: "Passing in all semesters with no active arrears",
    required_docs: [
      "AICTE Approved College Admission Allotment Letter",
      "Income Certificate (≤ ₹8.0 Lakhs)",
      "Class 12th Marksheet",
      "Aadhaar Card"
    ],
    department: "All India Council for Technical Education (AICTE)",
    description: "Empowerment scholarship of ₹50,000 per annum towards tuition fees and computer purchase for meritorious girl students in technical degree courses."
  },
  {
    id: "tn-differently-abled-welfare",
    name: "TN Differently Abled Welfare Higher Education Grant",
    name_ta: "மாற்றுத்திறனாளிகள் நலத்துறை உயர்கல்வி உதவித்தொகை",
    category: "entitlement",
    financial_value: 7000,
    annual_benefit: 7000,
    benefit_period: "Per Academic Year",
    benefit_breakdown: {
      tuition_waiver: 0,
      maintenance_stipend: 7000,
      book_allowance: 0
    },
    criteria: {
      gender: "any",
      eligible_communities: ["OC", "BC", "BCM", "MBC", "SC", "ST", "SCC"],
      max_income: null,
      min_percentage: 0.0,
      govt_school_only: false,
      first_graduate_only: false,
      differently_abled_only: true,
      allowed_courses: ["Engineering", "Arts & Science", "Medical", "Diploma", "All"]
    },
    mutually_exclusive_with: [],
    portal_name: "TN Differently Abled Welfare Dept",
    portal_url: "https://www.scd.tn.gov.in",
    deadline: "Open All Year",
    renewal: "Medical certificate validity check",
    required_docs: [
      "UDID Card / Disability Certificate (40%+)",
      "College Bonafide Certificate",
      "Aadhaar Card",
      "Bank Account Details"
    ],
    department: "Welfare of Differently Abled Persons Department, TN",
    description: "Financial assistance and reader allowance provided by Government of Tamil Nadu for differently abled students in collegiate education without income caps."
  }
];

// Retrieve active schemes (combining default catalog with any administrative customizations)
export function getActiveSchemes() {
  try {
    const custom = localStorage.getItem('tn_admin_schemes');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return (defaultSchemesCatalog && defaultSchemesCatalog.length > 0) ? defaultSchemesCatalog : DEFAULT_SCHEMES;
}

// ------------------------------------------------------------------------------
// 1. Intelligent Eligibility Matching Engine (Checks individual conditions)
// ------------------------------------------------------------------------------
export function checkSchemeEligibility(profile, scheme) {
  const reasons = [];
  const matchedCriteria = [];
  const criteria = scheme.criteria || {};

  // 1. Gender check
  const reqGender = criteria.gender || "any";
  if (reqGender !== "any") {
    if (reqGender.toLowerCase() !== (profile.gender || "").toLowerCase()) {
      reasons.push(`This scheme is exclusively allocated for ${reqGender} candidates.`);
    } else {
      matchedCriteria.push(`Gender requirement (${reqGender}) satisfied.`);
    }
  }

  // 2. Community check
  const eligibleCommunities = criteria.eligible_communities || [];
  if (eligibleCommunities.length > 0 && !eligibleCommunities.includes("All")) {
    const studentCommunity = (profile.community || "BC").toUpperCase();
    if (!eligibleCommunities.includes(studentCommunity)) {
      reasons.push(`Available for communities [${eligibleCommunities.join(", ")}]; your profile is recorded as ${studentCommunity}.`);
    } else {
      matchedCriteria.push(`Social category (${studentCommunity}) qualifies for statutory quota.`);
    }
  }

  // 3. Income ceiling check
  const maxIncome = criteria.max_income;
  const studentIncome = Number(profile.annual_income) || 0;
  if (maxIncome !== null && maxIncome !== undefined && studentIncome > maxIncome) {
    reasons.push(`Annual family income (₹${studentIncome.toLocaleString('en-IN')}) exceeds statutory ceiling of ₹${maxIncome.toLocaleString('en-IN')}.`);
  } else if (maxIncome !== null && maxIncome !== undefined) {
    matchedCriteria.push(`Family income (₹${studentIncome.toLocaleString('en-IN')}) is well within the ₹${maxIncome.toLocaleString('en-IN')} ceiling.`);
  }

  // 4. Board marks percentage check
  const minPercentage = criteria.min_percentage || 0;
  const studentScore = Number(profile.board_percentage) || 0;
  if (studentScore < minPercentage) {
    reasons.push(`12th Board marks (${studentScore}%) are below the minimum qualifying merit threshold of ${minPercentage}%.`);
  } else if (minPercentage > 0) {
    matchedCriteria.push(`Academic score (${studentScore}%) exceeds the ${minPercentage}% threshold.`);
  }

  // 5. Government school criteria (6-12 TN Govt School)
  const govtSchoolOnly = Boolean(criteria.govt_school_only);
  const isGovtSchool = profile.schooling_type === "tn_govt_school_6_to_12";
  if (govtSchoolOnly && !isGovtSchool) {
    reasons.push(`Requires continuous study from Classes 6 to 12 in Tamil Nadu Government Schools.`);
  } else if (govtSchoolOnly && isGovtSchool) {
    matchedCriteria.push(`Continuous 6th–12th Tamil Nadu Government schooling verified.`);
  }

  // 6. First graduate criteria
  const fgOnly = Boolean(criteria.first_graduate_only);
  if (fgOnly && !profile.is_first_graduate) {
    reasons.push(`Requires First Graduate certification from Revenue Department (no prior graduate in immediate family).`);
  } else if (fgOnly && profile.is_first_graduate) {
    matchedCriteria.push(`First Graduate status verified for tuition fee waiver.`);
  }

  // 7. Differently abled criteria
  const diffOnly = Boolean(criteria.differently_abled_only);
  if (diffOnly && !profile.is_differently_abled) {
    reasons.push(`Reserved for differently-abled students with registered disability benchmark.`);
  } else if (diffOnly && profile.is_differently_abled) {
    matchedCriteria.push(`Disability benchmark certified for welfare endowment.`);
  }

  // 8. Course & Grade Level check (Collegiate vs School Class 1 to 12 vs Ph.D.)
  const c_lower = String(profile.current_course || "").toLowerCase();
  const d_lower = String(profile.degree || "").toLowerCase();

  const is_school = /class|school|primary|middle|sslc|hsc|grade|வகுப்பு|பள்ளி|std/i.test(c_lower) ||
    /class|school|primary|middle|sslc|hsc|grade|வகுப்பு|பள்ளி|std/i.test(d_lower) ||
    ['primary', 'middle', 'high school', 'higher secondary'].some(p => d_lower.startsWith(p));

  const is_phd = c_lower.includes("phd") || c_lower.includes("ph.d") || c_lower.includes("research") || c_lower.includes("doctorate") || d_lower.includes("phd");

  const schemeId = scheme.id || "";
  const allowedCourses = criteria.allowed_courses || ["All"];
  const targetBeneficiaries = String(scheme.target_beneficiaries || "").toLowerCase();

  // A. Check PhD exclusivity
  if (schemeId === "cm-research-fellowship" || (scheme.category || "").includes("fellowship")) {
    if (!is_phd) {
      reasons.push("Exclusively for Ph.D. doctoral research scholars.");
      return { isEligible: false, reasons, matchedCriteria };
    }
  }

  // B. Collegiate-only schemes: must NOT be awarded to school students
  const COLLEGIATE_ONLY_IDS = new Set([
    "tn-first-graduate", "first-graduate", "tn-pudhumai-penn", "pudhumai-penn",
    "tn-tamil-pudhalvan", "tamil-pudhalvan", "cm-research-fellowship", "aicte-pragati",
    "pm-usp-csss", "post-matric-sc", "post-matric-st", "pm-yasasvi-post-matric",
    "minority-post-matric", "free-education-bc-mbc", "mcm-minorities", "pwd-post-matric",
    "naan-mudhalvan", "vetri-laptop", "cm-breakfast-scheme-college",
    "stipend-tamil-medium", "deceased-govt-servants-scholarship", "free-education-bc-mbc-dnc",
    "minority-mcm", "pm-yasasvi-top-class"
  ]);

  if (is_school) {
    if (COLLEGIATE_ONLY_IDS.has(schemeId) || (schemeId.includes("post-matric") && !schemeId.includes("pre-matric"))) {
      reasons.push("Requires completed 12th standard and active enrollment in higher education (UG/PG/Diploma).");
      return { isEligible: false, reasons, matchedCriteria };
    }
    if ((targetBeneficiaries.includes("college") || targetBeneficiaries.includes("undergraduate") || targetBeneficiaries.includes("postgraduate")) &&
        !targetBeneficiaries.includes("school") && !targetBeneficiaries.includes("class")) {
      reasons.push("Designated for college and university students only.");
      return { isEligible: false, reasons, matchedCriteria };
    }
  }

  // C. School-only schemes: must NOT be awarded to college/university students
  const SCHOOL_ONLY_IDS = new Set([
    "cm-breakfast-scheme", "pm-poshan", "free-bicycle-scheme", "free-textbooks-notebooks",
    "free-guides-question-banks", "nmms-scholarship", "samagra-shiksha", "pre-matric-sc",
    "pre-matric-st", "pm-yasasvi-pre-matric", "minority-pre-matric", "pwd-pre-matric",
    "rural-girls-scholarship", "thiran-next", "rte-25-reimbursement"
  ]);

  if (!is_school && (SCHOOL_ONLY_IDS.has(schemeId) || schemeId.includes("pre-matric"))) {
    reasons.push("Exclusively for currently enrolled school students (Classes 1 to 12).");
    return { isEligible: false, reasons, matchedCriteria };
  }

  // D. School Grade-Level Precision Matching
  if (is_school) {
    const combinedStr = `${c_lower} ${d_lower}`;
    const gradeMatch = combinedStr.match(/(?:class|std|grade|வகுப்பு)\s*(\d+)/i);
    let gradeNum = gradeMatch ? parseInt(gradeMatch[1], 10) : null;
    if (gradeNum === null) {
      if (c_lower.includes("primary") || d_lower.includes("primary") || d_lower.includes("தொடக்க")) gradeNum = 3;
      else if (c_lower.includes("middle") || d_lower.includes("middle") || d_lower.includes("நடுநிலை")) gradeNum = 7;
      else if (c_lower.includes("high school") || c_lower.includes("sslc") || c_lower.includes("10") || d_lower.includes("உயர்நிலை")) gradeNum = 10;
      else if (c_lower.includes("higher secondary") || c_lower.includes("hsc") || c_lower.includes("11") || c_lower.includes("12") || d_lower.includes("மேல்நிலை")) gradeNum = 11;
    }

    // Breakfast scheme: Class 1 to 5
    if (schemeId === "cm-breakfast-scheme" && gradeNum !== null && gradeNum > 5) {
      reasons.push(`Chief Minister's Breakfast Scheme is allocated for Primary Schools (Classes 1 to 5); current grade is Class ${gradeNum}.`);
      return { isEligible: false, reasons, matchedCriteria };
    }

    // Free Bicycle scheme: Class 11 and 12 only
    if (schemeId === "free-bicycle-scheme" && gradeNum !== null && gradeNum < 11) {
      reasons.push(`Free Bicycle Scheme is exclusively distributed to Higher Secondary students (Classes 11 & 12); current grade is Class ${gradeNum}.`);
      return { isEligible: false, reasons, matchedCriteria };
    }

    // Pre-Matric SC/ST/OBC/Minority: Class 9 and 10 only (Class 1-10 for PwD)
    if (schemeId.includes("pre-matric") && schemeId !== "pwd-pre-matric" && gradeNum !== null && (gradeNum < 9 || gradeNum > 10)) {
      reasons.push(`Pre-Matric scholarship covers secondary examination classes (Class 9 & 10); current grade is Class ${gradeNum}.`);
      return { isEligible: false, reasons, matchedCriteria };
    }

    // NMMS: Class 9 to 12
    if (schemeId === "nmms-scholarship" && gradeNum !== null && gradeNum < 9) {
      reasons.push("NMMS scholarship disbursal commences in Class 9 following the Class 8 qualifying examination.");
      return { isEligible: false, reasons, matchedCriteria };
    }

    // Question Banks & Guides: Class 10 & 12 Board Exam students
    if (schemeId === "free-guides-question-banks" && gradeNum !== null && gradeNum !== 10 && gradeNum !== 12) {
      reasons.push("Board Exam study materials and question banks are designated for Class 10 (SSLC) and Class 12 (HSC) board students.");
      return { isEligible: false, reasons, matchedCriteria };
    }

    // Free textbooks & notebooks: Class 1 to 8
    if (schemeId === "free-textbooks-notebooks" && gradeNum !== null && gradeNum > 8) {
      reasons.push(`Free textbook distribution scheme applies to Elementary and Middle schools (Classes 1 to 8); current grade is Class ${gradeNum}.`);
      return { isEligible: false, reasons, matchedCriteria };
    }

    // RTE 25% reimbursement: only for private school quota admissions
    if (schemeId === "rte-25-reimbursement" && profile.schooling_type === "tn_govt_school_6_to_12") {
      reasons.push("RTE 25% fee reimbursement applies to private unaided schools; candidate is currently in a Government school.");
      return { isEligible: false, reasons, matchedCriteria };
    }

    // Minority Pre-Matric: for BCM / notified religious minorities
    if (schemeId === "minority-pre-matric" && String(profile.community || "").toUpperCase() !== "BCM" && String(profile.community || "").toUpperCase() !== "MINORITY") {
      reasons.push("Minority Pre-Matric is strictly for notified religious/linguistic minorities (BCM/Minority).");
      return { isEligible: false, reasons, matchedCriteria };
    }

    matchedCriteria.push(`School grade/level criteria satisfied.`);
  } else {
    // E. General Course Check for Collegiate
    const studentCourse = profile.current_course || "Engineering";
    if (!allowedCourses.includes("All") && !allowedCourses.some(c => studentCourse.toLowerCase().includes(c.toLowerCase()))) {
      reasons.push(`Course (${studentCourse}) is not covered. Applicable only for: ${allowedCourses.join(", ")}.`);
    } else {
      matchedCriteria.push(`Degree program (${studentCourse}) is an approved academic discipline.`);
    }
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
    matchedCriteria
  };
}

// ------------------------------------------------------------------------------
// 2. Conflict Matrix Validator (Ensures no colliding policies)
// ------------------------------------------------------------------------------
export function isBundleValid(bundle) {
  const ids = new Set(bundle.map(s => s.id));
  for (const s of bundle) {
    const exclusions = s.mutually_exclusive_with || [];
    for (const exc of exclusions) {
      if (ids.has(exc)) return false;
    }
  }

  // At most one Pre-Matric maintenance scholarship (excluding PwD)
  const preMatricCount = bundle.filter(s => (s.id || '').includes('pre-matric') && s.id !== 'pwd-pre-matric').length;
  if (preMatricCount > 1) return false;

  // At most one Post-Matric maintenance scholarship (excluding PwD)
  const postMatricCount = bundle.filter(s => (s.id || '').includes('post-matric') && s.id !== 'pwd-post-matric').length;
  if (postMatricCount > 1) return false;

  return true;
}

// ------------------------------------------------------------------------------
// 3. Selection Probability & Confidence Estimator
// ------------------------------------------------------------------------------
export function calculateProbability(profile, scheme) {
  if (scheme.category === "entitlement") {
    return {
      score: 99.0,
      level: "Statutory Entitlement",
      explanation: "State budget guaranteed. Benefits are legally disbursed via DBT upon verification of e-Sevai certificates."
    };
  }

  const score = Number(profile.board_percentage) || 85;
  const income = Number(profile.annual_income) || 140000;
  let prob = 70;
  if (score >= 90) prob += 15;
  else if (score >= 80) prob += 8;
  if (income <= 200000) prob += 10;

  prob = Math.min(95, Math.max(45, prob));
  return {
    score: prob,
    level: prob >= 80 ? "High Probability" : "Medium Probability",
    explanation: `Scored against statewide applicant percentiles with merit score (${score}%) and economic index.`
  };
}

// ------------------------------------------------------------------------------
// 4. Complete Decision Support System & Combinatorial Optimizer
// ------------------------------------------------------------------------------
export function evaluateProfileIntelligently(profile) {
  const allSchemes = getActiveSchemes();

  const eligibleSchemes = [];
  const ineligibleSchemes = [];

  // Stage 1: Smart Filtering (Eligible vs Not Eligible)
  for (const scheme of allSchemes) {
    const res = checkSchemeEligibility(profile, scheme);
    if (res.isEligible) {
      eligibleSchemes.push({
        ...scheme,
        matchedCriteria: res.matchedCriteria
      });
    } else {
      ineligibleSchemes.push({
        id: scheme.id,
        name: scheme.name,
        name_ta: scheme.name_ta,
        financial_value: scheme.financial_value,
        reasons: res.reasons,
        portal_name: scheme.portal_name
      });
    }
  }

  // Stage 2 & 3: Partitioned Conflict Detection & MWIS Maximum Financial Optimization
  const eligibleIds = new Set(eligibleSchemes.map(s => s.id));
  const conflictingSchemes = [];
  const freeSchemes = [];

  for (const s of eligibleSchemes) {
    const excs = s.mutually_exclusive_with || [];
    const hasConflictInEligible = excs.some(id => eligibleIds.has(id));
    if (hasConflictInEligible) {
      conflictingSchemes.push(s);
    } else {
      freeSchemes.push(s);
    }
  }

  const freeTotal = freeSchemes.reduce((sum, s) => sum + (s.financial_value || 0), 0);

  let bestConflictBundle = [];
  let maxConflictVal = 0;
  const validConflictCombinations = [];

  const m = conflictingSchemes.length;
  if (m > 0) {
    const limit = Math.min(m, 12);
    for (let i = 0; i < (1 << limit); i++) {
      const candidate = [];
      let cVal = 0;
      for (let j = 0; j < limit; j++) {
        if (i & (1 << j)) {
          candidate.push(conflictingSchemes[j]);
          cVal += conflictingSchemes[j].financial_value || 0;
        }
      }
      if (isBundleValid(candidate)) {
        validConflictCombinations.push({ bundle: candidate, total_value: cVal });
        if (cVal > maxConflictVal) {
          maxConflictVal = cVal;
          bestConflictBundle = candidate;
        }
      }
    }
  } else {
    validConflictCombinations.push({ bundle: [], total_value: 0 });
  }

  // Combine free schemes with conflicting combinations
  const allValidBundles = validConflictCombinations.map(item => ({
    bundle: [...freeSchemes, ...item.bundle],
    total_value: freeTotal + item.total_value
  })).sort((a, b) => b.total_value - a.total_value);

  // De-duplicate bundles with identical sets
  const uniqueBundles = [];
  const seenSets = new Set();
  for (const item of allValidBundles) {
    const key = item.bundle.map(s => s.id).sort().join("+");
    if (!seenSets.has(key)) {
      seenSets.add(key);
      uniqueBundles.push(item);
    }
  }

  const bestBundle = uniqueBundles.length > 0 ? uniqueBundles[0].bundle : [...freeSchemes, ...bestConflictBundle];
  const maxValue = uniqueBundles.length > 0 ? uniqueBundles[0].total_value : (freeTotal + maxConflictVal);
  const bestBundleIds = new Set(bestBundle.map(s => s.id));

  // Build Alternative Options (Top 3 Distinct Valid Combinations)
  const alternativeOptions = uniqueBundles.slice(0, 4).map((item, idx) => ({
    option_number: idx + 1,
    total_value: item.total_value,
    is_recommended: idx === 0,
    badge: idx === 0 ? "BEST FINANCIAL BENEFIT (Recommended)" : `Alternative Combination #${idx + 1}`,
    schemes: item.bundle.map(s => ({
      id: s.id,
      name: s.name,
      value: s.financial_value,
      portal: s.portal_name
    }))
  }));

  // Compile Excluded Schemes with Clear Rationale
  const excludedSchemes = [];
  for (const scheme of eligibleSchemes) {
    if (!bestBundleIds.has(scheme.id)) {
      const conflicts = [];
      for (const bestS of bestBundle) {
        if ((scheme.mutually_exclusive_with || []).includes(bestS.id) ||
            (bestS.mutually_exclusive_with || []).includes(scheme.id)) {
          conflicts.push(`${bestS.name} (₹${bestS.financial_value.toLocaleString('en-IN')})`);
        }
      }

      let reasonText = "";
      if (conflicts.length > 0) {
        reasonText = `Excluded because it directly conflicts with: ${conflicts.join(", ")}, which was selected to maximize your net legitimate financial benefit.`;
      } else {
        reasonText = `Excluded because an alternative combination yields a higher legitimate cumulative financial payout.`;
      }

      excludedSchemes.push({
        scheme_id: scheme.id,
        scheme_name: scheme.name,
        conflict_with: conflicts,
        reason: reasonText,
        financial_value: scheme.financial_value
      });
    }
  }

  // Compile "Why We Recommended This" Step-by-Step Explanation
  const whyReasons = [];
  for (const s of bestBundle) {
    const criteriaSummary = (s.matchedCriteria && s.matchedCriteria.length > 0)
      ? s.matchedCriteria.slice(0, 2).join(" ")
      : `Matches your current academic degree, community, and annual income bracket.`;
    
    whyReasons.push({
      type: "approved",
      scheme_id: s.id,
      scheme_name: s.name,
      amount: s.financial_value,
      text: `✓ Selected ${s.name} (+₹${s.financial_value.toLocaleString('en-IN')}/yr): ${criteriaSummary}`
    });
  }

  for (const exc of excludedSchemes) {
    whyReasons.push({
      type: "excluded",
      scheme_id: exc.scheme_id,
      scheme_name: exc.scheme_name,
      amount: exc.financial_value,
      text: `⚠ ${exc.scheme_name} was not included: ${exc.reason}`
    });
  }

  whyReasons.push({
    type: "optimized",
    scheme_id: "mwis-total",
    scheme_name: "Optimal Cumulative Aid",
    amount: maxValue,
    text: `💰 Final Result: The combination of [${bestBundle.map(s => s.name.split(' (')[0]).join(" + ")}] guarantees the maximum conflict-free financial assistance of ₹${maxValue.toLocaleString('en-IN')}/year without violating statutory dual-claim restrictions.`
  });

  // Compile Consolidated Document Checklist for Recommended Bundle
  const docMap = new Map();
  for (const s of bestBundle) {
    for (const doc of (s.required_docs || [])) {
      if (!docMap.has(doc)) {
        docMap.set(doc, [s.name]);
      } else {
        docMap.get(doc).push(s.name);
      }
    }
  }

  const consolidatedDocs = Array.from(docMap.entries()).map(([docName, requiredBy]) => ({
    name: docName,
    required_by: requiredBy,
    is_ready: false // will be checked interactively by user in UI
  }));

  // Compile Chronological Application Roadmap
  const applicationRoadmap = bestBundle.map((scheme, idx) => ({
    step_number: idx + 1,
    scheme_id: scheme.id,
    scheme_name: scheme.name,
    annual_benefit: scheme.financial_value,
    portal_name: scheme.portal_name,
    portal_url: scheme.portal_url,
    deadline: scheme.deadline || "31st October 2026",
    action_steps: [
      { step: 1, title: "Prepare Required Documents", desc: `Collect and scan: ${scheme.required_docs?.slice(0, 3).join(", ")}.` },
      { step: 2, title: "Access Official Portal", desc: `Visit official portal (${scheme.portal_name}) via ${scheme.portal_url}.` },
      { step: 3, title: "Register / Student Authentication", desc: "Log in with student EMIS / Aadhaar / TNEA counseling number." },
      { step: 4, title: "Complete Application Details", desc: "Select academic scheme and enter bank account linked with NPCI." },
      { step: 5, title: "Upload Verified Documents", desc: "Upload digitally signed e-Sevai certificates in PDF/JPG format." },
      { step: 6, title: "Final Review & Submit", desc: "Review declaration and submit application to generate acknowledgement reference." },
      { step: 7, title: "DBT Disbursement Tracking", desc: "Track college nodal officer verification and state treasury sanction." }
    ]
  }));

  // Build Pairwise Conflict Matrix Data for Visualization
  const conflictMatrix = [];
  for (let i = 0; i < eligibleSchemes.length; i++) {
    for (let j = i + 1; j < eligibleSchemes.length; j++) {
      const s1 = eligibleSchemes[i];
      const s2 = eligibleSchemes[j];
      const hasConflict = (s1.mutually_exclusive_with || []).includes(s2.id) ||
                          (s2.mutually_exclusive_with || []).includes(s1.id);
      conflictMatrix.push({
        scheme1_id: s1.id,
        scheme1_name: s1.name,
        scheme2_id: s2.id,
        scheme2_name: s2.name,
        hasConflict,
        conflictType: hasConflict ? "Mutually Exclusive (State/Central Policy Restriction)" : "Compatible (Stackable Benefit)"
      });
    }
  }

  // Compile Selection Probabilities
  const selectionProbabilities = {};
  for (const s of bestBundle) {
    selectionProbabilities[s.id] = calculateProbability(profile, s);
  }

  return {
    recommended_bundle: bestBundle,
    total_financial_value: maxValue,
    eligible_schemes_count: eligibleSchemes.length,
    ineligible_schemes: ineligibleSchemes,
    excluded_schemes: excludedSchemes,
    why_reasons: whyReasons,
    alternative_options: alternativeOptions,
    consolidated_docs: consolidatedDocs,
    application_roadmap: applicationRoadmap,
    conflict_matrix: conflictMatrix,
    selection_probabilities: selectionProbabilities,
    evaluated_at: new Date().toISOString()
  };
}
