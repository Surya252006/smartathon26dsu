import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  Sparkles, 
  Bot, 
  X, 
  Minus, 
  Send, 
  Mic, 
  MicOff, 
  ExternalLink, 
  Clock, 
  FileText, 
  ShieldCheck, 
  User, 
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  Trash2,
  Pencil,
  Edit3,
  LogIn,
  Sliders,
  Cpu,
  FileCheck,
  Database,
  Server,
  Cloud,
  HardDrive,
  HeartHandshake,
  BookOpen,
  GraduationCap,
  Bike,
  School
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';
import EditProfileModal from './EditProfileModal';
import { saveAvatarToCluster, saveProfileToCluster } from '../utils/cloudSync';

export default function HomePage({ 
  onStartMatcher, 
  onViewSchemes, 
  currentLang = 'en',
  currentUser = null,
  onNavigateTab = null,
  onOpenGrievance = null,
  onOpenAuth = null,
  onOpenRegister = null,
  onOpenScanner = null,
  onOpenDbConfig = null,
  dbStatus = null
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);

  // Student Profile State (Persisted in sessionStorage for fresh sessions & auto-signout on tab close)
  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      if (currentUser?.profile) {
        const u = currentUser;
        return {
          fullName: u.profile.full_name || u.full_name || '',
          gender: u.profile.gender || 'male',
          community: u.profile.community || 'BC',
          district: u.profile.district || 'Chennai',
          annualIncome: u.profile.annual_income || '',
          boardPercentage: u.profile.board_percentage || '',
          currentCourse: u.profile.current_course || '',
          isFirstGraduate: u.profile.is_first_graduate !== undefined ? u.profile.is_first_graduate : false,
          schoolingType: u.profile.schooling_type || 'tn_govt_school_6_to_12',
          avatar: u.profile.avatar || null,
          isGuest: false
        };
      }
      const saved = sessionStorage.getItem('tn_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      fullName: '',
      gender: 'male',
      community: 'BC',
      district: 'Chennai',
      annualIncome: '',
      boardPercentage: '',
      currentCourse: '',
      isFirstGraduate: false,
      schoolingType: 'tn_govt_school_6_to_12',
      avatar: null,
      isGuest: true
    };
  });

  // Student Profile Image State (Persisted in sessionStorage)
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(() => {
    try {
      return sessionStorage.getItem('tn_student_avatar') || currentUser?.profile?.avatar || null;
    } catch (e) {
      return null;
    }
  });

  // Sync state when currentUser changes (e.g. login, switch, or logout)
  useEffect(() => {
    if (currentUser?.profile) {
      const up = currentUser.profile;
      setStudentProfile({
        fullName: up.full_name || currentUser.full_name || '',
        gender: up.gender || 'male',
        community: up.community || 'BC',
        district: up.district || 'Chennai',
        annualIncome: up.annual_income || '',
        boardPercentage: up.board_percentage || '',
        currentCourse: up.current_course || '',
        isFirstGraduate: up.is_first_graduate !== undefined ? up.is_first_graduate : false,
        schoolingType: up.schooling_type || 'tn_govt_school_6_to_12',
        avatar: up.avatar || null,
        isGuest: false
      });
      if (up.avatar) setProfileImage(up.avatar);
    } else {
      const sessionSaved = sessionStorage.getItem('tn_student_profile');
      if (sessionSaved) {
        setStudentProfile(JSON.parse(sessionSaved));
      } else {
        setStudentProfile({
          fullName: '',
          gender: 'male',
          community: 'BC',
          district: 'Chennai',
          annualIncome: '',
          boardPercentage: '',
          currentCourse: '',
          isFirstGraduate: false,
          schoolingType: 'tn_govt_school_6_to_12',
          avatar: null,
          isGuest: true
        });
        setProfileImage(null);
      }
    }
  }, [currentUser]);

  // Keep state synced across edits and modal updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const saved = sessionStorage.getItem('tn_student_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          setStudentProfile(parsed);
          if (parsed.avatar !== undefined) {
            setProfileImage(parsed.avatar);
          }
        }
      } catch (e) {}
    };

    const handleAvatarUpdate = () => {
      try {
        const av = sessionStorage.getItem('tn_student_avatar');
        setProfileImage(av || null);
      } catch (e) {}
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Please choose a photo smaller than 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setProfileImage(base64Data);
        try {
          sessionStorage.setItem('tn_student_avatar', base64Data);
          
          // Also update studentProfile avatar
          const savedProfile = sessionStorage.getItem('tn_student_profile');
          const p = savedProfile ? JSON.parse(savedProfile) : { ...studentProfile };
          p.avatar = base64Data;
          p.isGuest = false;
          sessionStorage.setItem('tn_student_profile', JSON.stringify(p));
          setStudentProfile(p);
          
          window.dispatchEvent(new Event('avatarUpdated'));
          
          const savedUser = sessionStorage.getItem('tn_scholarship_user');
          let userObj = currentUser;
          if (savedUser) {
            userObj = JSON.parse(savedUser);
            userObj.profile = { ...(userObj.profile || {}), avatar: base64Data };
            sessionStorage.setItem('tn_scholarship_user', JSON.stringify(userObj));
          }

          // Persist directly to MongoDB and Cloud Firestore cluster so signout -> signin preserves photo!
          const clusterId = userObj?.email || userObj?.user_id || p.fullName || 'student_avatar';
          saveAvatarToCluster(clusterId, base64Data);
          saveProfileToCluster({ ...p, avatar: base64Data }, userObj);
        } catch (err) {
          console.warn("Storage quota note", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setProfileImage(null);
    try {
      sessionStorage.removeItem('tn_student_avatar');
      const savedProfile = sessionStorage.getItem('tn_student_profile');
      let p = { ...studentProfile };
      if (savedProfile) {
        p = JSON.parse(savedProfile);
        p.avatar = null;
        sessionStorage.setItem('tn_student_profile', JSON.stringify(p));
        setStudentProfile(p);
      }
      window.dispatchEvent(new Event('avatarUpdated'));
      const savedUser = sessionStorage.getItem('tn_scholarship_user');
      let userObj = currentUser;
      if (savedUser) {
        userObj = JSON.parse(savedUser);
        if (userObj.profile) delete userObj.profile.avatar;
        sessionStorage.setItem('tn_scholarship_user', JSON.stringify(userObj));
      }
      const clusterId = userObj?.email || userObj?.user_id || p.fullName || 'student_avatar';
      saveAvatarToCluster(clusterId, null);
    } catch (err) {}
  };

  // Toggleable Welfare View (School vs College) with smart auto-detection from profile
  const [homeWelfareView, setHomeWelfareView] = useState('auto'); // 'auto' | 'school' | 'college'

  const courseLower = String(studentProfile.currentCourse || '').toLowerCase();
  const isSchoolProfile = /class|school|primary|middle|sslc|hsc|grade|வகுப்பு|பள்ளி|std/i.test(courseLower);
  const effectiveView = homeWelfareView === 'auto'
    ? (isSchoolProfile ? 'school' : 'college')
    : homeWelfareView;

  const isTa = currentLang === 'ta';
  const isFemale = (studentProfile.gender || '').toLowerCase() === 'female';
  const isGovtSchool = studentProfile.schoolingType === 'tn_govt_school_6_to_12' || studentProfile.schooling_type === 'tn_govt_school_6_to_12';

  let primaryScheme = {};
  let secondaryScheme = {};
  let primaryValue = 0;
  let secondaryValue = 0;

  if (effectiveView === 'school') {
    const gradeMatch = courseLower.match(/(?:class|std|grade|வகுப்பு)\s*(\d+)/i);
    let schoolGrade = gradeMatch ? parseInt(gradeMatch[1], 10) : (courseLower.includes('primary') ? 3 : (courseLower.includes('middle') ? 7 : (courseLower.includes('11') || courseLower.includes('12') || courseLower.includes('higher secondary') ? 11 : 10)));

    if (schoolGrade >= 11) {
      primaryScheme = {
        name: isTa ? 'இலவச மிதிவண்டி திட்டம் (11 & 12-ஆம் வகுப்பு)' : 'Free Bicycle Scheme (Classes 11 & 12)',
        amount: isTa ? '₹4,800 மதிப்பு (நேரடி பொருள்)' : '₹4,800 Value (In-Kind Asset)',
        deliveryBadge: isTa ? '🚲 பள்ளியில் நேரடி விநியோகம்' : '🚲 Delivered at School',
        description: isTa
          ? '11 மற்றும் 12-ஆம் வகுப்பு பயிலும் அரசு மற்றும் அரசு உதவிபெறும் பள்ளி மாணவ-மாணவியருக்கு போக்குவரத்து வசதிக்காக புதிய மிதிவண்டி பள்ளியிலேயே வழங்கப்படுகிறது.'
          : 'Brand new roadster bicycle handed over directly at school premises to Class 11 & 12 students in Govt/Govt-aided schools for safe daily commute.'
      };
      primaryValue = 4800;

      if (['SC', 'SCA', 'ST'].includes(studentProfile.community)) {
        secondaryScheme = {
          name: isTa ? 'முன்-மெட்ரிக் கல்வி உதவித்தொகை (SC/ST)' : 'Pre-Matric Scholarship (SC/ST Welfare)',
          amount: isTa ? '₹4,000/ஆண்டு' : '₹4,000/yr',
          deliveryBadge: isTa ? '💸 நேரடி வங்கி DBT' : '💸 Direct Bank DBT',
          description: isTa
            ? 'ஆதிதிராவிடர் & பழங்குடியினர் நலத்துறையின் கீழ் இடைநிற்றலைத் தடுக்க மாணவர் வங்கிக் கணக்கில் நேரடியாக செலுத்தப்படும் உதவித்தொகை.'
            : 'Pre-Matric state welfare scholarship directly credited via DBT to prevent dropouts and cover secondary school expenses.'
        };
        secondaryValue = 4000;
      } else {
        secondaryScheme = {
          name: isTa ? 'இலவச பாடநூல்கள், நோட்டுகள் & சீருடைத் தொகுப்பு' : 'Free Textbooks, Notebooks & Samagra Shiksha Uniforms',
          amount: isTa ? '₹3,500 மதிப்பு (நேரடி உபகரணங்கள்)' : '₹3,500 Value (In-Kind Asset)',
          deliveryBadge: isTa ? '📚 பள்ளி துவக்க நாளிலேயே விநியோகம்' : '📚 Issued on Opening Day',
          description: isTa
            ? 'தமிழ்நாடு பள்ளிக் கல்வித் துறையின் கீழ் அனைத்து அரசுப் பள்ளி மாணவர்களுக்கும் பாடநூல்கள், 4 ஜோடி சீருடைகள் மற்றும் எழுதுபொருட்கள் இலவசம்.'
            : 'Complete set of textbooks, notebooks, 4 sets of uniforms, school bag, and footwear distributed free with zero fees.'
        };
        secondaryValue = 3500;
      }
    } else if (schoolGrade <= 5) {
      primaryScheme = {
        name: isTa ? 'முதலமைச்சரின் காலை உணவுத் திட்டம்' : "Chief Minister's Breakfast Scheme",
        amount: isTa ? '₹6,000/ஆண்டு ஊட்டச்சத்து மதிப்பு' : '₹6,000/yr Nutrition Value',
        deliveryBadge: isTa ? '🥣 சூடான சத்தான காலை உணவு' : '🥣 Morning Hot Breakfast',
        description: isTa
          ? '1 முதல் 5-ஆம் வகுப்பு வரை பயிலும் தொடக்கப் பள்ளி குழந்தைகளுக்கு காலையில் சூடான, சத்தான சிற்றுண்டி (உப்புமா, பொங்கல், கிச்சடி & சாம்பார்) இலவசம்.'
          : 'Fresh hot cooked morning breakfast served daily before school hours across all Tamil Nadu Government primary schools.'
      };
      primaryValue = 6000;

      secondaryScheme = {
        name: isTa ? 'இலவச பாடநூல்கள், நோட்டுகள் & சீருடைத் தொகுப்பு' : 'Free Textbooks, Notebooks & 4 Uniform Sets',
        amount: isTa ? '₹3,500 மதிப்பு (கல்வி தொகுப்பு)' : '₹3,500 Value (School Kit)',
        deliveryBadge: isTa ? '🎒 பள்ளிப் பை & காலணிகள்' : '🎒 Uniforms, Bag & Footwear',
        description: isTa
          ? 'தொடக்கப் பள்ளி மாணவர்களுக்கு புத்தகப் பை, காலணிகள், பாடநூல்கள் மற்றும் நான்கு ஜோடி சீருடைகள் 100% இலவசமாக வழங்கப்படுகின்றன.'
          : 'Free school kit including textbooks, notebooks, 4 pairs of stitched uniforms, footwear, and school bag issued directly.'
      };
      secondaryValue = 3500;
    } else {
      // Class 6 to 10 (Middle / SSLC)
      primaryScheme = {
        name: isTa ? 'அரசு பொதுத்தேர்வு வினா வங்கி & மாதிரி கையேடுகள்' : 'SSLC Board Exam Question Banks & Model Guides',
        amount: isTa ? '₹2,500 மதிப்பு (கல்வி தொகுப்பு)' : '₹2,500 Value (Study Kit)',
        deliveryBadge: isTa ? '📖 மாதிரி வினாத்தாள் புத்தகம்' : '📖 Printed Question Banks & Keys',
        description: isTa
          ? '10-ஆம் வகுப்பு பொதுத்தேர்வு எழுதும் மாணவர்களுக்கு அரசு வெளியிடும் மாதிரி வினா வங்கிகள் மற்றும் தீர்வு கையேடுகள் இலவசமாக வழங்கப்படுகின்றன.'
          : 'Official state-curated SSLC Board question banks, model papers, and solved guides distributed free to every registered high school student.'
      };
      primaryValue = 2500;

      secondaryScheme = {
        name: isTa ? 'முதலமைச்சரின் சத்துணவுத் திட்டம் (PM POSHAN)' : 'PM POSHAN / Nutritious Meal Programme',
        amount: isTa ? '₹7,200/ஆண்டு சத்துணவு மதிப்பு' : '₹7,200/yr Nutrition Value',
        deliveryBadge: isTa ? '🍲 சூடான மதிய உணவு & முட்டை' : '🍲 Daily Hot Lunch & Boiled Eggs',
        description: isTa
          ? 'பள்ளி நாட்களில் மதிய வேளையில் சூடான சுவையான சத்துணவு, வேகவைத்த முட்டை அல்லது வாழைப்பழம் மற்றும் சுண்டல் இலவசமாக வழங்கப்படுகின்றன.'
          : 'Wholesome hot cooked noon meal with boiled eggs/bananas and pulses served daily on all school working days.'
      };
      secondaryValue = 7200;
    }
  } else {
    // Collegiate view
    primaryScheme = isFemale
      ? {
          name: isTa ? 'புதுமைப் பெண் திட்டம்' : 'Pudhumai Penn Thittam',
          amount: isTa ? '₹12,000/ஆண்டு' : '₹12,000/yr',
          deliveryBadge: isTa ? '💸 மாதம் ₹1,000 வங்கி DBT' : '💸 ₹1,000/mo Direct Bank DBT',
          description: isTa
            ? 'அரசுப் பள்ளிகளில் (6-12) பயின்ற மாணவிகளுக்கு மாதம் ₹1,000 ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கில் நேரடியாக (DBT) செலுத்தப்படுகிறது.'
            : 'Monthly financial assistance of ₹1,000 directly credited via Direct Benefit Transfer (DBT) to student Aadhaar-seeded bank account for girls from TN Govt Schools (6-12).'
        }
      : {
          name: isTa ? 'தமிழ் புதல்வன் திட்டம்' : 'Tamil Pudhalvan Thittam',
          amount: isTa ? '₹12,000/ஆண்டு' : '₹12,000/yr',
          deliveryBadge: isTa ? '💸 மாதம் ₹1,000 வங்கி DBT' : '💸 ₹1,000/mo Direct Bank DBT',
          description: isTa
            ? 'அரசுப் பள்ளிகளில் (6-12) பயின்ற மாணவர்களுக்கு மாதம் ₹1,000 வங்கிக் கணக்கில் நேரடியாக DBT மூலம் செலுத்தப்படுகிறது.'
            : 'Monthly financial stipend of ₹1,000 credited directly to student bank account via DBT for boys who studied in TN Government Schools (6-12).'
        };
    primaryValue = 12000;

    secondaryScheme = studentProfile.isFirstGraduate
      ? {
          name: isTa ? 'முதல் பட்டதாரி கல்விக் கட்டணச் சலுகை' : 'First Graduate Fee Concession',
          amount: isTa ? '₹25,000/ஆண்டு' : '₹25,000/yr',
          deliveryBadge: isTa ? '🎓 கல்லூரிக் கட்டணம் 100% தள்ளுபடி' : '🎓 100% College Tuition Waived',
          description: isTa
            ? 'ஒற்றைச் சாளர கலந்தாய்வு மூலம் சேர்க்கை பெறும் முதல் தலைமுறை பட்டதாரிகளுக்கு 100% கல்விக் கட்டண விலக்கு.'
            : '100% Tuition Fee Concession automatically credited directly to the college academic cell via Single Window Counseling.'
        }
      : (['SC', 'SCA', 'ST'].includes(studentProfile.community)
          ? {
              name: isTa ? 'போஸ்ட்-மெட்ரிக் கல்வி உதவித்தொகை (SC/SCA/ST)' : 'Post-Matric Scholarship (SC/SCA/ST)',
              amount: isTa ? '₹50,000/ஆண்டு' : '₹50,000/yr',
              deliveryBadge: isTa ? '🏛️ கட்டண விலக்கு + விடுதிப் படி' : '🏛️ Full Fee Waiver + Hostel Grant',
              description: isTa
                ? 'ஆதிதிராவிடர் & பழங்குடியினர் நலத்துறையின் கீழ் 100% கட்டண தள்ளுபடி மற்றும் பராமரிப்புப் படி.'
                : '100% Compulsory Tuition Fee waiver and hostel maintenance allowance under Adi Dravidar & Tribal Welfare.'
            }
          : {
              name: isTa ? 'BC/MBC போஸ்ட்-மெட்ரிக் கல்விக் கட்டண உதவி' : 'BC/MBC Post-Matric Tuition Assistance',
              amount: isTa ? '₹15,000/ஆண்டு' : '₹15,000/yr',
              deliveryBadge: isTa ? '📜 தேர்வு & கட்டண மானியம்' : '📜 Tuition & Exam Grant',
              description: isTa
                ? 'பிற்படுத்தப்பட்டோர் மற்றும் சிறுபான்மையினர் நலத்துறையின் கீழ் சிறப்பு தேர்வு & கல்விக் கட்டண உதவி.'
                : 'Special fee & examination grant assistance under Department of Backward Classes & Minorities Welfare.'
            }
        );
    secondaryValue = studentProfile.isFirstGraduate 
      ? 25000 
      : (['SC', 'SCA', 'ST'].includes(studentProfile.community) ? 50000 : 15000);
  }

  const recommendedTotal = primaryValue + secondaryValue;

  // Floating AI Advisor state
  const [isAiOpen, setIsAiOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState(() => [
    {
      sender: 'user',
      text: isTa ? 'NSP உதவித்தொகை விண்ணப்ப விதிகள் என்ன?' : 'NSP applying rules?'
    },
    {
      sender: 'bot',
      text: isTa
        ? 'மத்திய துறை திட்டத்திற்கு (NSP CSSS) 12-ஆம் வகுப்பில் 80%-க்கு மேல் மதிப்பெண்களும், குடும்ப வருமானம் ₹4.50 லட்சத்திற்குள்ளும் இருக்க வேண்டும்.\n\n⚠️ முக்கிய விதி முரண்பாடு: பிரிவு 4(c) வழிகாட்டுதலின்படி, NSP பெறுவது உங்கள் முதல் பட்டதாரி கட்டண விலக்குடன் (₹25,000) நேரடியாக முரண்படுகிறது. சட்டவிரோத இரட்டைப் பலனைத் தடுக்க MWIS அல்காரிதம் உகந்த அதிகபட்ச தொகுப்பை (₹37,000/ஆண்டு) தேர்ந்தெடுத்துள்ளது.'
        : 'For the Central Sector Scheme (NSP CSSS), you must be in the top 20th percentile in your 12th Board (>80%) with family annual income under ₹4.50 Lakh.\n\n⚠️ Important Policy Constraint: Under Section 4(c) guidelines, claiming NSP directly conflicts with your First Graduate fee waiver (₹25,000). The MWIS optimization engine selected your optimal package (₹37,000/yr) to prevent legal claim collisions.'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Application Success Confirmation Modal State
  const [appliedScheme, setAppliedScheme] = useState(null);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      const lower = userText.toLowerCase();
      if (lower.includes('pudhumai') || lower.includes('girl') || lower.includes('1000') || lower.includes('பெண்') || lower.includes('புதுமை')) {
        reply = isTa 
          ? "அரசாணை 47/2026-ன் படி, 6 முதல் 12-ஆம் வகுப்பு வரை அரசுப் பள்ளிகளில் படித்த மாணவிகளுக்கு புதுமைப் பெண் திட்டத்தின் கீழ் மாதம் ₹1,000 (ஆண்டுக்கு ₹12,000) DBT மூலம் நேரடியாக வழங்கப்படுகிறது. இதற்கு பெற்றோரின் வருமான வரம்பு இல்லை!"
          : "Under G.O. (Ms) No. 47/2026, Pudhumai Penn provides ₹1,000/month (₹12,000/yr) via DBT for students who studied in TN Government schools from classes 6 to 12. No parental income ceiling applies!";
      } else if (lower.includes('first graduate') || lower.includes('fg') || lower.includes('முதல் பட்டதாரி')) {
        reply = isTa
          ? "முதல் பட்டதாரி கட்டணச் சலுகை மூலம் தொழிற்கல்விக்கு ஆண்டுக்கு ₹25,000 வரை கட்டண விலக்கு பெறலாம். குடும்பத்தில் வேறு யாரும் இதற்கு முன் இச்சலுகை பெற்றிருக்கக் கூடாது."
          : "First Graduate Tuition Concession waives up to ₹25,000/yr for professional courses through Single Window Counseling, provided no sibling has previously availed the benefit.";
      } else if (lower.includes('income') || lower.includes('certificate') || lower.includes('வருமானம்') || lower.includes('சான்றிதழ்')) {
        reply = isTa
          ? "வருமானச் சான்றிதழை தமிழ்நாடு இ-சேவை தளம் (REV-INC-01) மூலம் பதிவிறக்கம் செய்யலாம். இதன் செல்லுபடியாகும் காலம் 1 வருடம் ஆகும்."
          : "Income certificates can be downloaded from Tamil Nadu e-District portal with code REV-INC-01. The validity is 1 year from the date of issue.";
      } else {
        reply = isTa
          ? "உங்கள் விவரங்கள் தமிழ்நாடு உயர்கல்வி நலத்திட்ட தரவுத்தளத்துடன் ஒப்பிடப்பட்டது. புதுமைப் பெண் மற்றும் முதல் பட்டதாரி சலுகைகளின் கீழ் 100% சட்டபூர்வ சலுகைகளுக்கு நீங்கள் தகுதி பெற்றுள்ளீர்கள்!"
          : "I am cross-referencing your candidate profile (BC, ₹1.40L, 88.5% Board marks) with the Tamil Nadu Higher Education welfare database. You qualify for 100% legal coverage under Pudhumai Penn and First Graduate fee waivers!";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 700);
  };

  const handleApply = (schemeName, schemeAmount) => {
    setAppliedScheme({ name: schemeName, amount: schemeAmount, refId: 'TNEV-2026-849204' });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      
      {/* ========================================================================= */}
      {/* SECTION 19: LANDING PAGE HERO & KEY DIFFERENTIATOR                        */}
      {/* ========================================================================= */}
      <section className="bg-[#0f2942] text-white border-b-2 border-emerald-600 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10 space-y-8">
          
          {/* Main Hero Header & Visual Reference Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column (7 cols): Text, Subtitle, CTAs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-950/90 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-700/80 shadow-xs">
                <Sparkles size={14} className="text-emerald-400" />
                <span>{t.hero_decision_system || "AI-Powered Decision System • Government of Tamil Nadu"}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {t.hero_headline || "Find the Scholarships You Actually Qualify For"}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                {t.hero_desc || "Enter your profile once. Our intelligent scholarship matcher checks eligibility, detects policy conflicts, and identifies the highest-benefit combination for you."}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onStartMatcher}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer border border-emerald-400"
                >
                  <Sparkles size={16} className="text-amber-300" />
                  <span>
                    {currentUser?.profile?.full_name || studentProfile.fullName
                      ? (t.btn_find_saved || '⚡ Find My Scholarships (Saved Bio-Data)')
                      : (t.btn_register_find || '📝 Register Bio-Data & Find Scholarships')}
                  </span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href="#how-it-works"
                  className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm rounded-xl border border-slate-700 transition flex items-center space-x-2 cursor-pointer"
                >
                  <span>{t.btn_how_it_works || "How It Works"}</span>
                </a>
              </div>

              {/* Saved bio-data confirmation pill */}
              {(currentUser?.profile?.full_name || studentProfile.fullName) && (
                <div className="flex items-center space-x-2 text-xs text-emerald-300 bg-emerald-950/70 px-3.5 py-1.5 rounded-lg border border-emerald-800/80 w-fit">
                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                  <span>
                    {t.saved_profile_badge || 'Saved Profile'}: <strong>{currentUser?.profile?.full_name || studentProfile.fullName}</strong> ({currentUser?.profile?.community || studentProfile.community} • {currentUser?.profile?.district || studentProfile.district}) — <em>{t.zero_repeated_form || 'Zero Repeated Form Filling'}</em>
                  </span>
                </div>
              )}
            </div>

            {/* Right Column (5 cols): Visual Showcase Card with Temple Emblem & Campus Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-2xl bg-slate-900 group">
                <img 
                  src="/tn_students_campus.jpg" 
                  alt="Tamil Nadu University Students on Campus" 
                  className="w-full h-64 sm:h-72 object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Floating Official Temple Emblem Logo Badge */}
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md rounded-full pl-1.5 pr-3.5 py-1 border border-amber-400/80 shadow-lg flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 bg-emerald-950 shrink-0">
                    <img src="/tn_temple_emblem.jpg" alt="TN Temple Seal" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-300 tracking-wide">
                    {t.official_seal_text || "தமிழ்நாடு அரசு Official Seal"}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-md rounded-xl p-3 border border-slate-700/80 text-xs text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-[11px]">{t.dbt_label || "Direct Benefit Transfer (DBT)"}</span>
                    <span className="bg-emerald-800/90 text-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded">G.O. Ms 47/2026</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    {t.statewide_coverage || "Higher Education Welfare covering 1.2 Lakh rural & first-generation college students statewide."}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Section 23: Key Differentiator Card */}
          <div className="bg-gradient-to-r from-emerald-950/90 to-slate-900 border-2 border-emerald-600/80 rounded-2xl p-5 sm:p-6 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 block">
                  {t.key_innovation_badge || "THE KEY INNOVATION"}
                </span>
                <p className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                  {t.key_innovation_quote || "\"We don't just tell students what scholarships they are eligible for. We calculate which valid combination gives them the maximum possible benefit and explain why.\""}
                </p>
              </div>
              <div className="shrink-0 flex items-center space-x-2 bg-emerald-900/60 px-4 py-2 rounded-xl border border-emerald-700 text-xs font-semibold text-emerald-200">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>{t.zero_conflict_badge || "Zero Conflict Collisions"}</span>
              </div>
            </div>
          </div>

          {/* Section 19: Visual Decision Flow Diagram */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block text-center sm:text-left">
              {t.decision_flow_title || "Decision Support Flow:"}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              {[
                { step: "1", title: t.flow_step_1_title || "Your Profile", desc: t.flow_step_1_desc || "Single entry" },
                { step: "2", title: t.flow_step_2_title || "Smart Eligibility", desc: t.flow_step_2_desc || "Rule engine" },
                { step: "3", title: t.flow_step_3_title || "Conflict Detection", desc: t.flow_step_3_desc || "Matrix filter" },
                { step: "4", title: t.flow_step_4_title || "Benefit Optimization", desc: t.flow_step_4_desc || "MWIS solver" },
                { step: "5", title: t.flow_step_5_title || "Best Combination", desc: t.flow_step_5_desc || "Highest benefit" },
                { step: "6", title: t.flow_step_6_title || "Application Roadmap", desc: t.flow_step_6_desc || "Action plan" }
              ].map((flow, fIdx) => (
                <div key={fIdx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 text-center space-y-1 relative">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase block">{isTa ? `படி 0${flow.step}` : `Step 0${flow.step}`}</span>
                  <div className="font-bold text-white text-xs leading-tight">{flow.title}</div>
                  <div className="text-[10px] text-slate-400">{flow.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* LIVE FULLSTACK & CLUSTER ARCHITECTURE STATUS BAR                          */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Database size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                  {t.fullstack_ecosystem_title || "Fullstack Cloud Ecosystem"}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
                  {t.all_systems_live || "ALL SYSTEMS LIVE & CONNECTED"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.fullstack_desc || "Multi-driver persistence mirroring student dossiers and eligibility decisions across cloud and local nodes."}
              </p>
            </div>
          </div>

          {/* 3 Live Indicator Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            {/* MongoDB Atlas */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-800">MongoDB Atlas:</span>
              <code className="text-emerald-700 font-mono text-[11px]">cluster0.fzucldr</code>
            </div>

            {/* Cloud Firestore */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs">
              <Cloud size={13} className="text-emerald-600" />
              <span className="font-bold text-slate-800">Firestore:</span>
              <span className="text-emerald-700 font-semibold text-[11px]">tnscheme-ai-dsu</span>
            </div>

            {/* SQLite */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs">
              <HardDrive size={13} className="text-emerald-600" />
              <span className="font-bold text-slate-800">SQLite:</span>
              <span className="text-emerald-700 font-semibold text-[11px]">app.db</span>
            </div>

            {/* Inspect Button */}
            {onOpenDbConfig && (
              <button
                type="button"
                onClick={onOpenDbConfig}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
              >
                {t.inspect_btn || "Inspect"}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 20: HOW IT WORKS SECTION                                          */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-4 gap-2">
          <div>
            <span className="text-xs font-bold text-[#006a4e] uppercase tracking-wider block mb-1">
              {isTa ? 'செயல்முறை வரைபடம்' : 'Section 20 • Process Blueprint'}
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isTa ? 'எவ்வாறு செயல்படுகிறது: அறிவார்ந்த முடிவு ஆதரவு' : 'How It Works: Intelligent Decision Support'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            {t.how_it_works_subtitle || "Deterministic rule-based evaluation ensures complete transparency with zero black-box bias."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: isTa ? "சுயவிவரத்தை உள்ளிடுங்கள்" : "Build Your Profile",
              desc: isTa ? "உங்கள் கல்வி, வருமானம், சமூகப் பிரிவு விவரங்களை எளிதாக ஒருமுறை உள்ளிடுங்கள்." : "Tell us about your education, income, category, and eligibility once in a clean 5-step wizard.",
              badge: t.step1_badge || "Single Input"
            },
            {
              step: "02",
              title: isTa ? "தகுதி விதிகள் சரிபார்ப்பு" : "Match Criteria",
              desc: isTa ? "சமூக இடஒதுக்கீடு, குடும்ப வருமான வரம்பு மற்றும் கல்வித் தகுதிகளை எங்கள் விதித் தொகுப்பு சரிபார்க்கிறது." : "The rule engine checks community quota, family income caps, and academic criteria.",
              badge: t.step2_badge || "Smart Filtering"
            },
            {
              step: "03",
              title: isTa ? "சட்டபூர்வ சலுகையை உகப்பாக்குதல்" : "Optimize Legitimate Benefit",
              desc: isTa ? "ஒன்றையொன்று முரண்படும் திட்டங்கள் நீக்கப்பட்டு, அதிகபட்ச பலனளிக்கும் சேர்க்கை கணக்கிடப்படுகிறது." : "Conflicting schemes are removed and the highest-benefit valid combination is mathematically calculated.",
              badge: t.step3_badge || "Conflict Free"
            },
            {
              step: "04",
              title: isTa ? "வழிகாட்டியுடன் விண்ணப்பிக்கவும்" : "Apply with Roadmap",
              desc: isTa ? "அதிகாரப்பூர்வ அரசு இணையதளங்களுக்கான ஆவண சரிபார்ப்பு பட்டியல் மற்றும் 7-படி வழிகாட்டியைப் பெறுங்கள்." : "Get a personalized document checklist and 7-step roadmap pointing to official government gateways.",
              badge: t.step4_badge || "Ready Checklist"
            }
          ].map((card, cIdx) => (
            <div key={cIdx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#006a4e] font-mono">{card.step}</span>
                <span className="text-[10px] font-bold bg-emerald-50 text-[#006a4e] px-2 py-0.5 rounded-full border border-emerald-200">
                  {card.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Section 21: Trust & Transparency Callout */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#006a4e] flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{t.why_different_title || "Why This System Is Different"}</h4>
              <p className="text-slate-600 text-xs">
                {t.why_different_desc || "No false \"100% guarantees\". All calculations are deterministic, backed by Government Orders (G.O.), and explainable down to the rupee."}
              </p>
            </div>
          </div>
          <button
            onClick={onStartMatcher}
            className="px-4 py-2 bg-[#006a4e] hover:bg-[#00523d] text-white font-bold rounded-lg transition shrink-0 cursor-pointer shadow-xs"
          >
            {t.launch_checker_btn || "Launch Eligibility Checker →"}
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VISUAL REFERENCES SHOWCASE GALLERY (Temple Emblem, Campuses, Awards)      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-3 gap-2">
          <div>
            <span className="text-xs font-bold text-[#006a4e] uppercase tracking-wider block mb-1">
              {isTa ? "அதிகாரப்பூர்வ அரசு அடையாளங்கள்" : "Visual References & Official Insignia"}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isTa ? "அரசு திட்டங்கள் மற்றும் பயனாளிகளின் குறிப்புகள்" : "Official State Scheme & Beneficiary References"}
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            {isTa ? "தமிழ்நாடு அரசு முத்திரை, கல்லூரி கல்வி நிறுவனங்கள் மற்றும் ஆணை ஆவணங்களின் புகைப்படங்கள்." : "Visual references for Tamil Nadu state government emblems, college institutions, and sanction documentation."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Reference Card 1: Official Temple Emblem */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition group">
            <div className="h-48 bg-[#004d38] flex items-center justify-center p-4 relative overflow-hidden">
              <img 
                src="/tn_temple_emblem.jpg" 
                alt="Government of Tamil Nadu Srivilliputhur Andal Temple Gopuram Seal" 
                className="h-40 w-40 object-contain rounded-full shadow-lg border-2 border-amber-400 transition duration-300 group-hover:scale-105"
              />
              <span className="absolute top-2.5 right-2.5 bg-emerald-950/80 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40">
                {isTa ? "அரசு சின்னம்" : "Official Web Logo"}
              </span>
            </div>
            <div className="p-4 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wide">
                {isTa ? "மாநில அரசு சின்னம்" : "State Government Emblem"}
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                {isTa ? "ஸ்ரீவில்லிபுத்தூர் ஆண்டாள் கோவில் கோபுர முத்திரை" : "Srivilliputhur Andal Temple Gopuram Seal"}
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {isTa ? "தமிழ்நாடு அரசின் அதிகாரப்பூர்வ முத்திரை, சட்டபூர்வ அரசு அங்கீகாரம் மற்றும் நிதி ஒதுக்கீட்டை உறுதி செய்கிறது." : "The statutory seal of the Government of Tamil Nadu (தமிழ்நாடு அரசு), guaranteeing authentic departmental sanction and legal welfare coverage."}
              </p>
            </div>
          </div>

          {/* Reference Card 2: Campus Collegiate Hubs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="/tn_students_campus.jpg" 
                alt="Collegiate Students on Campus in Tamil Nadu" 
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute top-2.5 right-2.5 bg-slate-900/80 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                {isTa ? "கல்லூரி பயனாளிகள்" : "Campus Beneficiaries"}
              </span>
            </div>
            <div className="p-4 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wide">
                {isTa ? "உயர்கல்வி வளாகங்கள்" : "Higher Education Campuses"}
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                {isTa ? "பொறியியல், கலை & அறிவியல் மற்றும் பாலிடெக்னிக்" : "Engineering, Arts & Science, and Polytechnics"}
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {isTa ? "அண்ணா பல்கலைக்கழகம் மற்றும் அரசு கல்லூரிகளில் பயிலும் முதல் தலைமுறை மற்றும் கிராமப்புற மாணவர்களுக்கு அதிகாரமளித்தல்." : "Empowering first-generation and rural scholars across Anna University, Government Colleges, and approved institutions statewide."}
              </p>
            </div>
          </div>

          {/* Reference Card 3: Scholarship Award Sanction */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="/tn_scholarship_award.jpg" 
                alt="Students holding Government Scholarship Sanction Letter" 
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute top-2.5 right-2.5 bg-slate-900/80 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40">
                {isTa ? "ஒப்புதல் குறிப்பு" : "Sanction Reference"}
              </span>
            </div>
            <div className="p-4 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wide">
                {isTa ? "நேரடிப் பலன் மற்றும் நலத்திட்ட ஆணைகள்" : "DBT & Welfare Sanctions"}
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                {isTa ? "புதுமைப் பெண் & முதல் பட்டதாரி ஒப்புதல் கடிதங்கள்" : "Pudhumai Penn & First Graduate Sanctions"}
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {isTa ? "இ-சேவை வருவாய்த்துறை தரவுகளுடன் சரிபார்க்கப்பட்டு, ஆண்டிற்கு ₹50,000 வரை முரண்பாடின்றி பெற்றுத்தரும் அரசாணைகள்." : "Verifiable sanction letters cross-referenced against e-Sevai revenue databases, delivering up to ₹50,000/yr with zero collision risk."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN GRID LAYOUT: max-w-7xl mx-auto p-6 */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN (4/12 span): Candidate Snapshot               */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* White card with subtle border and shadow */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {t.candidate_snapshot_title || "Candidate Snapshot"}
                  </span>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center space-x-1 text-[10px] font-bold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-1.5 py-0.5 rounded border border-slate-200 hover:border-emerald-300 transition cursor-pointer"
                    title="Edit candidate profile, income, marks & upload photo"
                  >
                    <Pencil size={10} />
                    <span>{t.btn_edit || "Edit"}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-1.5">
                  {onOpenAuth && (
                    <button
                      onClick={onOpenAuth}
                      className="inline-flex items-center space-x-1 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 transition cursor-pointer"
                      title="Sign in with your Student ID or Switch User"
                    >
                      <LogIn size={10} />
                      <span>{currentUser ? (isTa ? 'மாற்று' : 'Switch') : (isTa ? 'உள்நுழைவு' : 'Sign In')}</span>
                    </button>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                    currentUser || studentProfile.fullName
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {currentUser || studentProfile.fullName ? (t.verified_badge || 'Verified') : (t.guest_mode_badge || 'Guest Mode')}
                  </span>
                </div>
              </div>

              {/* Guest banner if not signed in and profile empty */}
              {(!currentUser && !studentProfile.fullName) && (
                <div className="mb-4 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-2 shadow-2xs">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-900 text-xs">
                    <Sparkles size={14} className="text-emerald-600 shrink-0" />
                    <span>{t.new_reg_card_title || "New Student Registration • 1-Time Bio-Data Setup"}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {t.new_reg_card_desc || "Register your complete bio-data once. All scholarships will automatically pull from your saved profile without needing to fill the form again."}
                  </p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      onClick={onOpenRegister || onStartMatcher}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-xs flex items-center space-x-1"
                    >
                      <span>{t.btn_register_biodata || "📝 Register Bio-Data"}</span>
                    </button>
                    {onOpenAuth && (
                      <button
                        onClick={onOpenAuth}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs border border-slate-200 transition cursor-pointer"
                      >
                        {isTa ? 'உள்நுழைவு' : 'Sign In / உள்நுழைவு'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Profile section: square photo placeholder on left, compact list on right */}
              <div className="flex items-start space-x-4">
                
                {/* Square Profile Photo with 1-Click Upload */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-md bg-slate-100 border-2 border-dashed border-slate-300 hover:border-emerald-600 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition shadow-2xs"
                      title="Click to choose a photo (JPG / PNG) from your device"
                    >
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt={studentProfile.fullName || 'Student'} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <>
                          <User size={34} className="text-slate-400 group-hover:text-emerald-700 transition mb-0.5" />
                          <span className="text-[8px] font-bold text-slate-500 font-mono group-hover:text-emerald-800">
                            {isTa ? 'புகைப்படம்' : 'ADD PHOTO'}
                          </span>
                        </>
                      )}

                      {/* Hover Camera Overlay */}
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[9px] font-semibold">
                        <Camera size={16} className="mb-0.5 text-emerald-300" />
                        <span>{profileImage ? (isTa ? 'மாற்றுக' : 'Change') : (isTa ? 'பதிவேற்றுக' : 'Upload')}</span>
                      </div>

                      <div className="absolute bottom-0 inset-x-0 bg-slate-900/85 text-[8px] font-mono text-center text-white py-0.5">
                        {currentUser?.user_id ? `ID: ${currentUser.user_id.slice(-6)}` : (studentProfile.fullName ? 'ID: 849204' : 'GUEST-TN')}
                      </div>
                    </div>

                    {/* Quick Remove Button if image exists */}
                    {profileImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer z-10"
                        title="Remove photo"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />

                  <div className="flex flex-col items-center space-y-0.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer hover:underline flex items-center space-x-1"
                      title="Upload photo from your device"
                    >
                      <Camera size={11} />
                      <span>{profileImage ? (t.change_photo || 'Change Photo') : (t.upload_photo || 'Upload Photo')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowEditModal(true)}
                      className="text-[9px] text-slate-500 hover:text-slate-700 font-medium cursor-pointer hover:underline flex items-center space-x-0.5"
                      title="Edit all credentials"
                    >
                      <Edit3 size={9} />
                      <span>{t.edit_info || "Edit Info"}</span>
                    </button>
                  </div>
                </div>

                {/* Compact List of Credentials */}
                <div className="flex-1 min-w-0 space-y-1 text-xs">
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">{t.label_name || "Name"}</span>
                    <strong className="text-slate-900 font-semibold truncate ml-2">
                      {studentProfile.fullName || (isTa ? 'விருந்தினர் மாணவர்' : 'Guest Student')}
                    </strong>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">{t.label_gender_tag || "Gender"}</span>
                    <span className="text-slate-800 font-medium capitalize">
                      {studentProfile.gender === 'female' ? (isTa ? 'பெண்' : 'Female') : (studentProfile.gender === 'male' ? (isTa ? 'ஆண்' : 'Male') : (studentProfile.gender || '--'))}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">{t.label_community_tag || "Community"}</span>
                    <span className="text-slate-800 font-semibold bg-slate-100 px-1.5 py-0.2 rounded font-mono uppercase">
                      {studentProfile.community || 'BC'}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">{t.label_income_tag || "Income"}</span>
                    <span className="text-slate-900 font-semibold font-mono">
                      {studentProfile.annualIncome ? `₹${Number(studentProfile.annualIncome).toLocaleString('en-IN')}` : (isTa ? '-- (குறிப்பிடப்படவில்லை)' : '-- (Not Set)')}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">{t.label_marks_tag || "12th Marks"}</span>
                    <span className="text-emerald-700 font-bold font-mono">
                      {studentProfile.boardPercentage ? `${studentProfile.boardPercentage}%` : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-medium">{t.label_course_tag || "Course"}</span>
                    <span className="text-slate-800 font-medium truncate ml-2" title={studentProfile.currentCourse}>
                      {studentProfile.currentCourse || (isTa ? '-- (தேர்வு செய்யப்படவில்லை)' : '-- (Select Course)')}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-500 font-medium">{t.label_fg_tag || "FG"}</span>
                    <span className={`inline-flex items-center font-bold ${studentProfile.isFirstGraduate ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {studentProfile.isFirstGraduate ? (t.yes || 'Yes') : (t.no || 'No')}
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom half: "Verification Status" title with a divider */}
              <hr className="my-4 border-slate-200" />

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  <span>{t.verification_status_title || "Verification Status"}</span>
                </h4>

                {/* List with green CheckCircle icons */}
                <ul className="space-y-2.5 text-xs">
                  <li className="flex items-center justify-between p-2 rounded-md bg-emerald-50/50 border border-emerald-200/60">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800">{isTa ? 'ஆதார் சரிபார்ப்பு' : 'Aadhaar'}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {currentUser || studentProfile.fullName ? (isTa ? 'UIDAI e-KYC சரிபார்க்கப்பட்டது' : 'UIDAI e-KYC Verified') : (isTa ? 'ஆதார் e-KYC தயார்' : 'Aadhaar e-KYC Ready')}
                    </span>
                  </li>

                  <li className="flex items-center justify-between p-2 rounded-md bg-emerald-50/50 border border-emerald-200/60">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800">{isTa ? 'வருமானச் சான்றிதழ்' : 'Income Cert'}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                      {currentUser || studentProfile.annualIncome ? (isTa ? 'REV-INC-01 சரிபார்க்கப்பட்டது' : 'REV-INC-01 Verified') : (isTa ? 'இ-சேவை இணைக்கப்பட்டது' : 'e-Sevai Linked')}
                    </span>
                  </li>

                  <li className="flex items-center justify-between p-2 rounded-md bg-emerald-50/50 border border-emerald-200/60">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800">{isTa ? 'சாதிச் சான்றிதழ்' : 'Community Cert'}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                      {currentUser || studentProfile.fullName ? (isTa ? 'REV-COM-02 சரிபார்க்கப்பட்டது' : 'REV-COM-02 Verified') : (isTa ? 'வருவாய்த்துறை' : 'Revenue Department')}
                    </span>
                  </li>
                </ul>

                {/* e-Sevai Smart Document Scanner Action */}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={onOpenScanner}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-md transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs border border-emerald-600"
                    title="Launch Tamil Nadu e-Sevai Document Scanner & Multi-Field Cross-Verification"
                  >
                    <FileCheck size={14} className="text-amber-300" />
                    <span>{t.scan_cross_verify_btn || "Scan & Cross-Verify with e-Sevai"}</span>
                  </button>
                </div>
              </div>

              {/* Quick Action to Check Different Profile */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={onStartMatcher}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs font-bold rounded-lg transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs border border-emerald-600"
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>
                    {currentUser || studentProfile.fullName
                      ? (t.btn_run_instant_calc || '⚡ Run Instant Calculation (Saved Bio-Data)')
                      : (t.btn_register_find || '📝 Register Bio-Data & Check Eligibility')}
                  </span>
                  <ArrowRight size={13} />
                </button>

                {(currentUser || studentProfile.fullName) && (
                  <button
                    onClick={() => onNavigateTab ? onNavigateTab('profile') : onStartMatcher()}
                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Edit3 size={11} />
                    <span>{t.btn_view_edit_biodata || "View / Edit Bio-Data Form"}</span>
                  </button>
                )}
              </div>

            </div>

            {/* Helpline quick card */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs text-xs text-slate-600 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-slate-800">
                <HelpCircle size={14} className="text-emerald-700" />
                <span>{t.dbt_cell_title || "Student Direct Benefit Transfer (DBT) Cell"}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t.dbt_cell_desc || "Stipends and college fee waivers are sanctioned under statutory Government Orders. Inquiries can be lodged directly at the Helpdesk."}
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-semibold">
                <span className="text-emerald-700">{t.toll_free_number || "Toll Free: 14417"}</span>
                <button 
                  onClick={onOpenGrievance}
                  className="text-slate-800 hover:underline cursor-pointer"
                >
                  {t.file_grievance_btn || "File Grievance →"}
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN (8/12 span): Schemes Area                    */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Lifecourse Segment Switcher: School Education vs Higher Education */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">{isTa ? 'கல்வி நிலை தேர்வு:' : 'Welfare Stream:'}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-emerald-800 text-[11px]">
                  {effectiveView === 'school' ? (isTa ? '🎒 பள்ளி கல்வி நலத்திட்டங்கள்' : '🎒 School Education') : (isTa ? '🎓 கல்லூரி & உயர்கல்வி' : '🎓 Higher Education')}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setHomeWelfareView('school')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    effectiveView === 'school'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <School size={14} />
                  <span>{isTa ? 'பள்ளி மாணவர்கள் (1-12)' : 'School Students (Class 1-12)'}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${effectiveView === 'school' ? 'bg-amber-800 text-white' : 'bg-slate-200 text-slate-700'}`}>21</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHomeWelfareView('college')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    effectiveView === 'college'
                      ? 'bg-[#006a4e] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <GraduationCap size={14} />
                  <span>{isTa ? 'கல்லூரி & உயர்கல்வி' : 'College & Higher Ed'}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${effectiveView === 'college' ? 'bg-emerald-900 text-white' : 'bg-slate-200 text-slate-700'}`}>26</span>
                </button>
              </div>
            </div>

            {/* Human Civic Counselor Advisory Card */}
            <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-emerald-50/80 border-2 border-amber-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-amber-200/60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
                        {isTa ? 'மக்கள் நல அலுவலர் வழிகாட்டுதல்' : 'Human Welfare Counselor Desk'}
                      </span>
                      <span className="text-xs text-slate-500">• {isTa ? 'மாவட்ட சமூக நலப் பிரிவு' : 'District Welfare Cell'}</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                      {effectiveView === 'school'
                        ? (isTa ? 'பெற்றோர்கள் & பள்ளி ஆசிரியர்களுக்கான மனிதநேய வழிகாட்டல்' : 'Empathetic Guidance for Parents & School Teachers')
                        : (isTa ? 'முதல் தலைமுறை கல்லூரி மாணவர்களுக்கான மக்கள் நல வழிகாட்டல்' : 'Civic Guidance for First-Generation College Students')}
                    </h4>
                  </div>
                </div>
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs shrink-0">
                  <CheckCircle size={13} className="text-emerald-600" />
                  <span>{isTa ? 'இடைத்தரகர்கள் இன்றி 100% இலவசம்' : 'Zero Middlemen • 100% Free'}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3.5 text-xs">
                <div className="bg-white/95 p-3 rounded-xl border border-amber-200/60 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>{effectiveView === 'school' ? (isTa ? 'பள்ளியிலேயே நேரடி வழங்கல்' : 'Direct School Handover') : (isTa ? 'ஒற்றைச் சாளர கலந்தாய்வு' : 'Single Window Counseling')}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {effectiveView === 'school'
                      ? (isTa ? 'இலவச மிதிவண்டி, பாடநூல்கள், நோட்டுகள் மற்றும் காலை/மதிய உணவு அரசுப் பள்ளியில் தலைமையாசிரியரால் நேரடியாக வழங்கப்படுகிறது.' : 'School bicycles, uniforms, textbooks, and hot noon meals are distributed directly at school without any fee or external paperwork.')
                      : (isTa ? 'முதல் பட்டதாரி சான்றிதழை TNEA சேர்க்கையின் போதே சமர்ப்பிக்க வேண்டும். கல்லூரி கட்டணத்தை அரசே நேரடியாக செலுத்தும்.' : 'Submit your First Graduate Certificate during TNEA engineering/arts counseling to get tuition fees waived 100% upfront.')}
                  </p>
                </div>

                <div className="bg-white/95 p-3 rounded-xl border border-amber-200/60 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>{isTa ? 'ஆதார் வங்கி கணக்கு (DBT)' : 'Aadhaar NPCI Bank Link'}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {isTa
                      ? 'புதுமைப் பெண், தமிழ்ப் புதல்வன் மற்றும் உதவித்தொகை தொகைகள் ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கிற்கு மட்டுமே (DBT) நேரடியாக அனுப்பப்படும்.'
                      : 'Ensure student bank account is NPCI-seeded to Aadhaar. Monthly ₹1,000 stipends and pre-matric funds are deposited straight to the student.'}
                  </p>
                </div>

                <div className="bg-white/95 p-3 rounded-xl border border-amber-200/60 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>{isTa ? 'இலவச உதவி எண் 14417' : 'Toll-Free Helpline 14417'}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {isTa
                      ? 'ஏதேனும் சந்தேகம் அல்லது சான்றிதழ் உதவி தேவைப்பட்டால் தமிழக அரசின் இலவச உதவி எண் 14417-க்கு எந்நேரமும் அழைக்கலாம்.'
                      : 'Reach the Tamil Nadu School & Higher Education grievance desk anytime at 14417 with zero charges or consultation fees.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Column Title */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>{effectiveView === 'school' ? (isTa ? '🎒 பள்ளி மாணவர் உகந்த தொகுப்பு' : '🎒 School Student Matching Package') : (t.my_matching_schemes || "My Matching Schemes")}</span>
              </h2>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                {t.mwis_solver_tag || "MWIS Solver Verified • Zero Collision"}
              </span>
            </div>

            {/* HERO CARD: Solid Forest Green background (bg-emerald-700 / #006a4e) */}
            <div className="bg-[#006a4e] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-500/50">
              
              {/* Title with star icons: Dynamic Optimal Stacking Recommendation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-emerald-600/60">
                <div className="flex items-center space-x-2">
                  <Sparkles size={20} className="text-amber-300 fill-amber-300 shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                    {t.optimal_stacking_prefix || "Optimal Stacking Recommendation (Max Benefit):"} <span className="text-amber-200 font-mono">₹{recommendedTotal.toLocaleString('en-IN')} {isTa ? '/ஆண்டு' : '/yr'}</span>
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-200 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-700 w-fit">
                  {effectiveView === 'school' ? (isTa ? 'பள்ளியில் வழங்கப்படும் நலன்' : 'School Delivered Welfare') : (isTa ? 'உயர்கல்வி நலன்' : 'Higher Education Aid')}
                </span>
              </div>

              {/* Inside green card, two schemes separated by faint borders */}
              <div className="divide-y divide-emerald-600/50">
                
                {/* Scheme 1 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        1. {primaryScheme.name} ({primaryScheme.amount})
                      </h4>
                      {primaryScheme.deliveryBadge && (
                        <span className="bg-emerald-950/90 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300/40">
                          {primaryScheme.deliveryBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-100/90 pl-3.5 leading-relaxed">
                      {primaryScheme.description}
                    </p>
                  </div>

                  {/* White "Apply Now" button with green text */}
                  <button
                    onClick={() => handleApply(primaryScheme.name, primaryScheme.amount)}
                    className="bg-white hover:bg-emerald-50 text-[#006a4e] font-bold px-4 py-2 rounded-lg text-xs transition shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    {t.apply_now_btn || "Apply Now"}
                  </button>
                </div>

                {/* Scheme 2 */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        2. {secondaryScheme.name} ({secondaryScheme.amount})
                      </h4>
                      {secondaryScheme.deliveryBadge && (
                        <span className="bg-emerald-950/90 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300/40">
                          {secondaryScheme.deliveryBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-100/90 pl-3.5 leading-relaxed">
                      {secondaryScheme.description}
                    </p>
                  </div>

                  {/* White "Apply Now" button with green text */}
                  <button
                    onClick={() => handleApply(secondaryScheme.name, secondaryScheme.amount)}
                    className="bg-white hover:bg-emerald-50 text-[#006a4e] font-bold px-4 py-2 rounded-lg text-xs transition shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    {t.apply_now_btn || "Apply Now"}
                  </button>
                </div>

              </div>

            </div>

            {/* OTHER SCHEMES SECTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  {effectiveView === 'school' 
                    ? (isTa ? 'பள்ளி மாணவர்களுக்கான பிற சிறப்பு நலத்திட்டங்கள்' : 'Other School Welfare Initiatives')
                    : (t.other_potential_schemes || "Other Potential Schemes")}
                </h3>
                <button
                  onClick={onViewSchemes}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition flex items-center space-x-1 cursor-pointer"
                >
                  <span>{effectiveView === 'school' ? (isTa ? 'அனைத்து 21 பள்ளி திட்டங்களையும் காண்க' : 'Browse All 21 School Schemes') : (t.browse_all_catalog_btn || "Browse All 47+ Catalog")}</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Grid with two white outline cards side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {effectiveView === 'school' ? (
                  <>
                    {/* School Card 1: NMMS Scholarship */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4.5 hover:border-amber-300 transition shadow-xs flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            {isTa ? 'தேசிய வருவாய்வழி திறன் உதவித்தொகை (NMMS)' : 'National Means-cum-Merit Scholarship (NMMS)'}
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded whitespace-nowrap font-mono border border-emerald-200">
                            ₹12,000 / {isTa ? 'ஆண்டு' : 'yr'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          {isTa 
                            ? '8-ஆம் வகுப்பு NMMS தேர்வு எழுதி தேர்ச்சி பெறும் அரசு & அரசு உதவிபெறும் பள்ளி மாணவர்களுக்கு 9 முதல் 12-ஆம் வகுப்பு வரை மாதம் ₹1,000 வங்கி DBT மூலம் வழங்கப்படுகிறது.'
                            : 'Students qualifying the Class 8 NMMS state exam receive ₹1,000/month (₹12,000/yr) from Class 9 to 12 directly via National Scholarship Portal DBT.'}
                        </p>

                        <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-[11px] text-emerald-900 font-medium">
                          {isTa 
                            ? '✓ தகுதி: அரசு/உதவிபெறும் பள்ளி மாணவர்கள், குடும்ப ஆண்டு வருமானம் ₹3.50 லட்சத்திற்குள்.' 
                            : '✓ Eligibility: Govt/Govt-aided school candidates with family income under ₹3.50 Lakh.'}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-slate-400">{isTa ? 'வகுப்பு 9 - 12' : 'Classes 9 to 12'}</span>
                        <a
                          href="https://scholarships.gov.in"
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:text-emerald-900 font-medium flex items-center space-x-1 text-[11px]"
                        >
                          <span>{isTa ? 'NSP இணையதளம்' : 'NSP Portal'}</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>

                    {/* School Card 2: Vetri Paadhai Coaching */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4.5 hover:border-amber-300 transition shadow-xs flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            {isTa ? 'வெற்றிப் பாதை (NEET / JEE சிறப்பு பயிற்சி)' : 'Vetri Paadhai (NEET / JEE Entrance Coaching)'}
                          </h4>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded whitespace-nowrap font-mono border border-amber-200">
                            {isTa ? '100% இலவச பயிற்சி' : '100% Free Coaching'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          {isTa
                            ? 'அரசு மேல்நிலைப் பள்ளி மாணவர்களுக்கு மருத்துவ (NEET) மற்றும் பொறியியல் (JEE) நுழைவுத் தேர்வுகளுக்கான மாதிரி வகுப்புகள் மற்றும் டிஜிட்டல் பயிற்சி தொகுப்புகள் இலவசம்.'
                            : 'Comprehensive entrance coaching, model test series, and residential crash courses conducted for Govt school students aiming for premier professional institutes.'}
                        </p>

                        <div className="bg-amber-50 border border-amber-200 rounded p-2 text-[11px] text-amber-800 font-medium">
                          {isTa
                            ? 'ℹ️ 7.5% அரசுப் பள்ளி இடஒதுக்கீட்டின் கீழ் மருத்துவ & பொறியியல் சேர்க்கைக்கு கூடுதல் பலன்.'
                            : 'ℹ️ Equips students to benefit from 7.5% preferential reservation in professional admissions.'}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-slate-400">{isTa ? 'வகுப்பு 11 & 12' : 'Classes 11 & 12'}</span>
                        <button
                          onClick={onViewSchemes}
                          className="text-slate-600 hover:text-slate-900 font-medium flex items-center space-x-1 text-[11px]"
                        >
                          <span>{isTa ? 'திட்ட விவரம்' : 'Scheme Details'}</span>
                          <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Outline Card 1: Central Sector Scheme (NSP) */}
                    <div className="bg-white rounded-lg border border-slate-200 p-4.5 hover:border-slate-300 transition shadow-xs flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            {isTa ? 'மத்திய துறை உதவித்தொகை (NSP)' : 'Central Sector Scheme (NSP)'}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded whitespace-nowrap font-mono">
                            ₹12,000 / {isTa ? 'ஆண்டு' : 'yr'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          {isTa 
                            ? '12-ஆம் வகுப்பு பொதுத்தேர்வில் முதல் 20% சதவீதத்திற்குள் இருக்க வேண்டும் (>80%). குடும்ப ஆண்டு வருமானம் ₹4.50 லட்சத்திற்குள் இருக்க வேண்டும்.'
                            : 'Requires 80th percentile in Class 12 Board exams (>80%). Family annual income must be under ₹4.50 Lakh. Subject to Central Ministry quota allocation.'}
                        </p>

                        <div className="bg-amber-50 border border-amber-200 rounded p-2 text-[11px] text-amber-800 font-medium">
                          {isTa 
                            ? '⚠️ ஒன்றுக்கொன்று முரண்பாடானது: மாநில முதல் பட்டதாரி கட்டண சலுகையுடன் சேர்த்து பெற முடியாது.' 
                            : '⚠️ Mutually Exclusive: Cannot co-claim with state First Graduate tuition concession.'}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-slate-400">{isTa ? 'ஒற்றை நல விதி' : 'Single Welfare Rule'}</span>
                        <a
                          href="https://scholarships.gov.in"
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-600 hover:text-slate-900 font-medium flex items-center space-x-1 text-[11px]"
                        >
                          <span>{isTa ? 'NSP வழிகாட்டி' : 'NSP Guidelines'}</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>

                    {/* Outline Card 2: AICTE Pragati */}
                    <div className="bg-white rounded-lg border border-slate-200 p-4.5 hover:border-slate-300 transition shadow-xs flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            {isTa ? 'AICTE பிரகதி உதவித்தொகை' : 'AICTE Pragati'}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded whitespace-nowrap font-mono">
                            ₹50,000 / {isTa ? 'ஆண்டு' : 'yr'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          {isTa
                            ? 'AICTE அங்கீகாரம் பெற்ற பொறியியல் கல்லூரிகளில் படிக்கும் மாணவிகளுக்கான தொழில்நுட்ப பட்டப்படிப்பு உதவித்தொகை (வருமானம் ₹8.00 லட்சத்திற்குள்).'
                            : 'Technical degree scholarship for eligible female candidates in AICTE approved engineering institutes with family income under ₹8.00 Lakh.'}
                        </p>

                        <div className="bg-slate-100 border border-slate-200 rounded p-2 text-[11px] text-slate-600 font-medium">
                          {isTa
                            ? 'ℹ️ ஒதுக்கீடு வரம்பு: ஒரு குடும்பத்திற்கு 2 மாணவிகள் வரை மட்டுமே. மாநில ஒதுக்கீட்டுடன் முரண்படும்.'
                            : 'ℹ️ Category Quota: Limited to 2 girl students per family. Excludes state quota waivers.'}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-slate-400">{isTa ? 'ஒதுக்கீடு கட்டுப்பாடு' : 'Quota Restricted'}</span>
                        <a
                          href="https://www.aicte-india.org"
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-600 hover:text-slate-900 font-medium flex items-center space-x-1 text-[11px]"
                        >
                          <span>{isTa ? 'AICTE தளம்' : 'AICTE Portal'}</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* Policy Guarantee Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 flex items-center justify-between gap-3 text-xs text-emerald-900">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                <span className="font-medium">
                  {t.go_guarantee_text || "All recommendations are backed by Government of Tamil Nadu Welfare Orders (G.O. 47/2026)."}
                </span>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('tracker')}
                className="font-bold text-emerald-800 hover:underline whitespace-nowrap cursor-pointer"
              >
                {t.track_my_status_btn || "Track My Status →"}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* FLOATING AI ADVISOR: fixed bottom-20 right-6               */}
      {/* ========================================================= */}
      {isAiOpen && (
        <div className={`fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 transition-all duration-200 ${
          isMinimized ? 'h-13' : 'max-h-[500px]'
        }`}>
          
          {/* Forest green header: "AI Advisor (Tamil/EN)" with close/minimize icons */}
          <div className="bg-[#006a4e] text-white px-4 py-3 flex items-center justify-between shadow-xs select-none">
            <div className="flex items-center space-x-2">
              <Bot size={18} className="text-emerald-200" />
              <span className="font-bold text-xs sm:text-sm">
                {t.ai_advisor_title || "AI Advisor (Tamil/EN)"}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="flex items-center space-x-1">
              {/* Minimize Icon */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-emerald-800 rounded transition cursor-pointer text-emerald-100 hover:text-white"
                title={isMinimized ? (isTa ? "விரிவாக்கு" : "Expand") : (isTa ? "சிறிதாக்கு" : "Minimize")}
              >
                <Minus size={15} />
              </button>
              {/* Close Icon */}
              <button
                onClick={() => setIsAiOpen(false)}
                className="p-1 hover:bg-emerald-800 rounded transition cursor-pointer text-emerald-100 hover:text-white"
                title={isTa ? "மூடு" : "Close"}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* White chat body showing grey user bubble */}
          {!isMinimized && (
            <div className="flex flex-col h-80 bg-white">
              
              {/* Chat Messages Log */}
              <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs bg-slate-50/50">
                
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'user' ? (
                      /* Grey user bubble */
                      <div className="bg-slate-200 text-slate-800 px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-[85%] font-medium">
                        {msg.text}
                      </div>
                    ) : (
                      /* Bot counselor bubble */
                      <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-xs shadow-xs max-w-[90%] space-y-1.5">
                        <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-800">
                          <Sparkles size={12} />
                          <span>{isTa ? 'தமிழ்நாடு இ-வித்யா ஆலோசகர்' : 'TN e-Vidya Counselor'}</span>
                        </div>
                        <p className="whitespace-pre-line leading-relaxed text-slate-700">
                          {msg.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 text-slate-500 text-[11px] px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                      <span>{isTa ? 'ஆலோசகர் பதில் எழுதுகிறார்...' : 'Counselor is composing reply...'}</span>
                    </div>
                  </div>
                )}

              </div>

              {/* Chat Input Bar */}
              <form 
                onSubmit={handleSendMessage}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t.ask_question_placeholder || "Ask policy, document, or scheme question..."}
                  className="flex-1 px-3 py-1.5 bg-slate-100 focus:bg-white text-xs text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-1.5 bg-[#006a4e] hover:bg-emerald-800 disabled:opacity-40 text-white rounded-lg transition cursor-pointer"
                  title="Send message"
                >
                  <Send size={14} />
                </button>
              </form>

            </div>
          )}

        </div>
      )}

      {/* Floating Circular Chat Toggle Button anchored to bottom-5 right-6 */}
      <button
        onClick={() => {
          setIsAiOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-5 right-6 z-50 w-13 h-13 rounded-full bg-[#006a4e] hover:bg-emerald-800 text-white shadow-xl flex items-center justify-center cursor-pointer transition transform hover:scale-105 border-2 border-white"
        title="Open AI Counselor"
      >
        <Bot size={24} />
        {!isAiOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse"></span>
        )}
      </button>

      {/* ========================================================= */}
      {/* APPLICATION CONFIRMATION MODAL (Civic Feedback)           */}
      {/* ========================================================= */}
      {appliedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 space-y-4">
            
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={28} />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                {t.official_receipt_tnega || "Official Receipt • TNeGA"}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {t.app_submitted_title || "Application Successfully Submitted!"}
              </h3>
              <p className="text-xs text-slate-500">
                {isTa
                  ? `உங்கள் ${appliedScheme.name} (${appliedScheme.amount}) விண்ணப்பம் நேரடி நிதி வழங்கல் வரிசையில் பதிவு செய்யப்பட்டுள்ளது.`
                  : `Your application for ${appliedScheme.name} (${appliedScheme.amount}) has been registered into the direct disbursement queue.`}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.ack_ref_no || "Ack Reference No:"}</span>
                <strong className="font-mono text-emerald-800">{appliedScheme.refId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.candidate_name || "Candidate Name:"}</span>
                <span className="text-slate-800 font-semibold">{studentProfile.fullName || (isTa ? 'மாணவர்' : 'Student Candidate')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.sanction_category || "Sanction Category:"}</span>
                <span className="text-slate-800">{studentProfile.community} Welfare & {studentProfile.isFirstGraduate ? (isTa ? 'முதல் பட்டதாரி' : 'First Graduate') : (isTa ? 'தகுதிப் பட்டியல்' : 'Merit')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.disbursement_mode || "Disbursement Mode:"}</span>
                <span className="text-slate-800 font-medium">{isTa ? 'நேரடிப் பலன் பரிமாற்றம் (DBT)' : 'Direct Benefit Transfer (DBT)'}</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setAppliedScheme(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                {t.modal_close_btn || "Close"}
              </button>
              <button
                onClick={() => {
                  setAppliedScheme(null);
                  if (onNavigateTab) onNavigateTab('tracker');
                }}
                className="flex-1 py-2 bg-[#006a4e] hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Clock size={13} />
                <span>{t.track_my_status_btn || "Track My Status"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={studentProfile}
        onSave={(updated) => {
          setStudentProfile(updated);
          if (updated.avatar !== undefined) {
            setProfileImage(updated.avatar);
          }
        }}
        currentLang={currentLang}
      />

    </div>
  );
}
