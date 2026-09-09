/**
 * SMARTATHON'26 - Problem Statement #6: AI Scholarship Eligibility Matcher
 * Fast Demo Injector Personas for Jury Evaluation & Real-World Testing
 * Covers both Collegiate Higher Education & School Education (Class 1 to 12)
 */

export const DEMO_PERSONAS = [
  {
    id: "priya",
    name: "Priya — Rural Govt School First Graduate",
    shortName: "Priya (Govt Stacking)",
    category: "collegiate",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    showcase: "Showcases Maximum Legal Stacking & Guaranteed Entitlements",
    expectedOutcome: "Stacks Pudhumai Penn (₹12,000/yr) + First Graduate Concession (₹25,000) = ₹37,000/yr (98% Guaranteed).",
    payload: {
      full_name: "Priya M (Rural Govt School)",
      gender: "female",
      community: "BC",
      annual_income: 120000,
      is_first_graduate: true,
      schooling_type: "tn_govt_school_6_to_12",
      board_percentage: 86.5,
      admission_mode: "govt_counseling_single_window",
      degree: "B.E. / B.Tech (Undergraduate)",
      current_course: "Engineering",
      is_differently_abled: false,
      available_docs: ["income_certificate", "community_certificate", "marksheet", "bonafide_certificate"]
    }
  },
  {
    id: "kavitha",
    name: "Kavitha — Class 10 Govt High School (Thanjavur)",
    shortName: "🎒 Kavitha (Class 10 SSLC)",
    category: "school",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    showcase: "School SSLC Board Prep: Books, Question Banks, Mid-Day Meal & Pre-Matric Aid",
    expectedOutcome: "Eligible for Class 10 Board Exam Question Banks, PM-POSHAN Hot Noon Meal, Free Textbooks & Special SSLC Coaching. Avoids collegiate collisions.",
    payload: {
      full_name: "Kavitha S (Govt High School, Thanjavur)",
      gender: "female",
      community: "BC",
      annual_income: 85000,
      is_first_graduate: false,
      schooling_type: "tn_govt_school_6_to_12",
      board_percentage: 88.0,
      admission_mode: "govt_counseling_single_window",
      degree: "High School (Class 9 - 10)",
      current_course: "Class 10 (SSLC Secondary)",
      is_differently_abled: false,
      available_docs: ["income_certificate", "community_certificate", "aadhaar"]
    }
  },
  {
    id: "anbarasan",
    name: "Anbarasan — Class 11 Govt Higher Secondary (Salem)",
    shortName: "🚲 Anbarasan (Class 11 HSC)",
    category: "school",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-400",
    showcase: "Higher Secondary Welfare: Free Bicycle Scheme + Pre-Matric SC Scholarship",
    expectedOutcome: "Free Bicycle Scheme (Direct delivery at school) + Pre-Matric SC State Aid + Uniforms & Textbooks + Vetri Paadhai NEET/JEE Coaching.",
    payload: {
      full_name: "Anbarasan K (Govt Model HSS, Salem)",
      gender: "male",
      community: "SC",
      annual_income: 95000,
      is_first_graduate: false,
      schooling_type: "tn_govt_school_6_to_12",
      board_percentage: 84.5,
      admission_mode: "govt_counseling_single_window",
      degree: "Higher Secondary (Class 11 - 12)",
      current_course: "Class 11 (Higher Secondary - Bio-Maths)",
      is_differently_abled: false,
      available_docs: ["income_certificate", "community_certificate", "marksheet", "aadhaar"]
    }
  },
  {
    id: "karthik",
    name: "Karthik — High Merit Conflict Case",
    shortName: "Karthik (Merit Conflict)",
    category: "collegiate",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    showcase: "Showcases Mutual Exclusivity Resolution & High Merit Scoring",
    expectedOutcome: "Eligible for PM-USP Central Sector Scheme (₹12,000/yr) with 88% Merit Probability. Excludes State Post-Matric & Tamil Pudhalvan due to private school & quota rules.",
    payload: {
      full_name: "Karthik R (Private CBSE)",
      gender: "male",
      community: "OC",
      annual_income: 210000,
      is_first_graduate: false,
      schooling_type: "private_cbse",
      board_percentage: 94.8,
      admission_mode: "management_quota",
      degree: "B.E. / B.Tech (Undergraduate)",
      current_course: "Engineering",
      is_differently_abled: false,
      available_docs: ["marksheet", "aadhaar"]
    }
  },
  {
    id: "ananya",
    name: "Ananya — Capped Tech Scholarship",
    shortName: "Ananya (Tech Merit)",
    category: "collegiate",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    showcase: "Showcases Competitive Merit Probability Scoring (~83%)",
    expectedOutcome: "AICTE Pragati (₹50,000/yr) with calculated selection chance (83.4%) based on merit cutoff delta, female quota, and MBC equity weighting.",
    payload: {
      full_name: "Ananya S (Govt-Aided Tech)",
      gender: "female",
      community: "MBC",
      annual_income: 340000,
      is_first_graduate: false,
      schooling_type: "govt_aided",
      board_percentage: 91.0,
      admission_mode: "govt_counseling_single_window",
      degree: "B.E. / B.Tech (Undergraduate)",
      current_course: "Engineering",
      is_differently_abled: false,
      available_docs: ["income_certificate", "community_certificate", "marksheet"]
    }
  }
];
