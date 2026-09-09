import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Building2, PhoneCall, ShieldCheck } from 'lucide-react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ProfileForm from './components/ProfileForm';
import ResultsDashboard from './components/ResultsDashboard';
import SchemesDirectory from './components/SchemesDirectory';
import ProfilePage from './components/ProfilePage';
import AuthModal from './components/AuthModal';
import SideAiChat from './components/SideAiChat';
import DbConfigModal from './components/DbConfigModal';
import ApplicationTracker from './components/ApplicationTracker';
import NoticeBoardModal from './components/NoticeBoardModal';
import GrievanceModal from './components/GrievanceModal';
import AdminDashboard from './components/AdminDashboard';
import EsevaiScannerModal from './components/EsevaiScannerModal';
import { evaluateProfileIntelligently } from './utils/decisionEngine';
import { DEMO_PERSONAS } from './data/demoPersonas';
import { TRANSLATIONS } from './utils/translations';
import { saveProfileToCluster, saveEvaluationToCluster, getProfileFromCluster } from './utils/cloudSync';

function App() {
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'matcher', 'results', 'schemes'
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);

  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // e-Sevai Document Scanner Modal State
  const [showScannerModal, setShowScannerModal] = useState(false);

  // Regional Language State (Handwritten Note Item #5)
  const [currentLang, setCurrentLang] = useState('en');

  // Global Scheme Search State (Handwritten Note Item #6)
  const [searchQuery, setSearchQuery] = useState('');

  // Database Connection State (MongoDB Atlas & SQLite)
  const [dbStatus, setDbStatus] = useState(null);
  const [showDbModal, setShowDbModal] = useState(false);

  // Persistent AI Side Assistant state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Official Government Gazette & Notice Board Modal State
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // Citizen Grievance & Student Helpdesk Modal State
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);

  // Load saved student session from sessionStorage (Fresh per browser session / auto-signout on tab close)
  useEffect(() => {
    try {
      // Clean up legacy localStorage if any exists so fresh shared links never default to Surya
      localStorage.removeItem('tn_scholarship_user');
      localStorage.removeItem('tn_student_profile');
      localStorage.removeItem('tn_student_avatar');

      // Check sessionStorage for current session
      const sessionUser = sessionStorage.getItem('tn_scholarship_user');
      if (sessionUser) {
        setCurrentUser(JSON.parse(sessionUser));
      } else {
        setCurrentUser(null);
      }

      const savedLang = localStorage.getItem('tn_portal_lang');
      if (savedLang) {
        setCurrentLang(savedLang);
      }
    } catch (e) {
      console.warn("Could not parse saved storage", e);
    }

    // Fetch initial database status
    fetch('http://localhost:8000/api/db/status')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(err => console.warn("Database status check notice", err));
  }, []);

  const handleSelectLang = (lang) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('tn_portal_lang', lang);
    } catch (e) {}
  };

  const handleAuthSuccess = (user) => {
    let resolvedUser = { ...user };
    const lookupId = user.email || user.user_id;
    const cleanId = String(lookupId).toLowerCase().trim().replace(/[^a-z0-9]/g, '_');

    // Immediate local cache check for avatar and profile (0ms)
    try {
      const cachedAvatar = localStorage.getItem(`tn_avatar_${cleanId}`);
      if (cachedAvatar) {
        resolvedUser.profile = { ...(resolvedUser.profile || {}), avatar: cachedAvatar };
        sessionStorage.setItem('tn_student_avatar', cachedAvatar);
      }
      const cachedProf = localStorage.getItem(`tn_profile_${cleanId}`);
      if (cachedProf) {
        const parsed = JSON.parse(cachedProf);
        resolvedUser.profile = { ...(resolvedUser.profile || {}), ...parsed };
      }
    } catch (e) {}

    setCurrentUser(resolvedUser);
    if (resolvedUser.profile) {
      setCurrentProfile(resolvedUser.profile);
      try {
        sessionStorage.setItem('tn_student_profile', JSON.stringify(resolvedUser.profile));
      } catch (e) {}
    }

    try {
      sessionStorage.setItem('tn_scholarship_user', JSON.stringify(resolvedUser));
      if (resolvedUser.profile) {
        saveProfileToCluster(resolvedUser.profile, resolvedUser).catch(() => {});
      }
      window.dispatchEvent(new Event('profileUpdated'));
      window.dispatchEvent(new Event('avatarUpdated'));
    } catch (e) {}

    // Background cloud check from MongoDB Atlas 'profiles' & 'profile' collections
    getProfileFromCluster(lookupId).then((remoteData) => {
      if (remoteData) {
        const mergedProfile = { ...(resolvedUser.profile || {}), ...remoteData };
        resolvedUser.profile = mergedProfile;
        setCurrentUser({ ...resolvedUser });
        setCurrentProfile(mergedProfile);
        try {
          sessionStorage.setItem('tn_scholarship_user', JSON.stringify(resolvedUser));
          sessionStorage.setItem('tn_student_profile', JSON.stringify(mergedProfile));
          if (remoteData.avatar) {
            sessionStorage.setItem('tn_student_avatar', remoteData.avatar);
            window.dispatchEvent(new Event('avatarUpdated'));
          }
          window.dispatchEvent(new Event('profileUpdated'));
        } catch (e) {}
      }
    }).catch(() => {});
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentProfile(null);
    try {
      sessionStorage.removeItem('tn_scholarship_user');
      sessionStorage.removeItem('tn_student_profile');
      sessionStorage.removeItem('tn_student_avatar');
      localStorage.removeItem('tn_scholarship_user');
      localStorage.removeItem('tn_student_profile');
      localStorage.removeItem('tn_student_avatar');
      window.dispatchEvent(new Event('profileUpdated'));
      window.dispatchEvent(new Event('avatarUpdated'));
    } catch (e) {}
  };

  const handleEvaluate = async (formData) => {
    setCurrentProfile(formData);
    setIsEvaluating(true);
    setCurrentTab('matcher');

    // 1. Sync student profile to Cloud Cluster (Firestore & MongoDB)
    saveProfileToCluster(formData, currentUser).catch(err =>
      console.warn("[App] Cloud cluster profile sync notice:", err)
    );

    // Persist to currentUser and session storage
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        profile: {
          ...(currentUser.profile || {}),
          ...formData
        }
      };
      setCurrentUser(updatedUser);
      try {
        sessionStorage.setItem('tn_scholarship_user', JSON.stringify(updatedUser));
        if (currentUser.user_id) {
          fetch('http://localhost:8000/api/auth/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: currentUser.user_id,
              profile_data: formData
            })
          }).catch(() => {});
        }
      } catch (e) {}
    }

    try {
      const response = await fetch('http://localhost:8000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      const localEnriched = evaluateProfileIntelligently(formData);
      const combinedResult = { ...localEnriched, ...data };
      setResult(combinedResult);
      setCurrentTab('results');

      // 2. Persist evaluation audit to Cloud Cluster
      saveEvaluationToCluster(combinedResult, formData).catch(err =>
        console.warn("[App] Cloud cluster evaluation log notice:", err)
      );
    } catch (err) {
      console.warn("Backend API not reachable (running in client-mode / Firebase Hosting). Using intelligent decision engine.", err);
      const data = evaluateProfileIntelligently(formData);
      setResult(data);
      setCurrentTab('results');

      // Persist client evaluation result to Cloud Cluster
      saveEvaluationToCluster(data, formData).catch(err =>
        console.warn("[App] Cloud cluster evaluation log notice:", err)
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCurrentProfile(null);
    setCurrentTab('matcher');
  };

  const injectPersona = async (personaId) => {
    const persona = DEMO_PERSONAS.find(p => p.id === personaId);
    if (persona) {
      await handleEvaluate(persona.payload);
    }
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. Official Government Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onToggleChat={() => setIsChatOpen(prev => !prev)}
        isChatOpen={isChatOpen}
        currentLang={currentLang}
        onSelectLang={handleSelectLang}
        searchQuery={searchQuery}
        onSearch={(q) => {
          setSearchQuery(q);
          if (currentTab !== 'schemes') setCurrentTab('schemes');
        }}
        dbStatus={dbStatus}
        onOpenDbConfig={() => setShowDbModal(true)}
        onOpenNotices={() => setShowNoticeModal(true)}
        onOpenGrievance={() => setShowGrievanceModal(true)}
        onOpenAdmin={() => setCurrentTab('admin')}
        onOpenScanner={() => setShowScannerModal(true)}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 w-full mx-auto bg-slate-50">
        
        {/* VIEW A: Official TN e-Vidya Dashboard (Home Page) */}
        {currentTab === 'home' && (
          <HomePage
            onStartMatcher={() => setCurrentTab('matcher')}
            onInjectPersona={injectPersona}
            onViewSchemes={() => setCurrentTab('schemes')}
            onOpenAuth={() => setShowAuthModal(true)}
            currentLang={currentLang}
            currentUser={currentUser}
            onNavigateTab={setCurrentTab}
            onOpenGrievance={() => setShowGrievanceModal(true)}
            onOpenScanner={() => setShowScannerModal(true)}
          />
        )}

        {/* Other Views wrapped in structured container */}
        {currentTab !== 'home' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
            
            {/* VIEW B: Eligibility Matcher / Form */}
            {currentTab === 'matcher' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                    Step 1 of 2 • Student Profile
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Check Higher Education Scheme Eligibility
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Fill in your accurate academic credentials and community certificates. Our MWIS constraint solver cross-references 18+ welfare rules to find the highest legal payout.
                  </p>
                </div>

                {isEvaluating ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xs border border-slate-200">
                    <div className="relative mb-4">
                      <Loader2 className="animate-spin text-emerald-700" size={54} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Optimizing Scholarship Allocation...
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 text-center max-w-sm">
                      Checking mutual exclusivity matrices, quota provisions, and scoring merit-cum-means probabilities...
                    </p>
                  </div>
                ) : (
                  <ProfileForm 
                    onSubmit={handleEvaluate} 
                    currentLang={currentLang} 
                    currentUser={currentUser}
                    currentProfile={currentProfile}
                    onOpenAuth={() => setShowAuthModal(true)}
                    onOpenScanner={() => setShowScannerModal(true)}
                  />
                )}
              </div>
            )}

            {/* VIEW C: Results Dashboard */}
            {currentTab === 'results' && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentTab('home')}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition flex items-center space-x-1 cursor-pointer"
                  >
                    <span>← Back to Portal Home</span>
                  </button>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Official Result • Policy Compliant
                  </span>
                </div>
                <ResultsDashboard 
                  result={result} 
                  profile={currentProfile} 
                  currentUser={currentUser}
                  onReset={handleReset} 
                  currentLang={currentLang}
                />
              </div>
            )}

            {/* VIEW D: Schemes Directory */}
            {currentTab === 'schemes' && (
              <SchemesDirectory
                onBackToHome={() => setCurrentTab('home')}
                onApplyWithProfile={() => setCurrentTab('matcher')}
                searchQuery={searchQuery}
                onSearchChange={(q) => setSearchQuery(q)}
                currentLang={currentLang}
              />
            )}

            {/* VIEW E: Dedicated Student Profile Page */}
            {currentTab === 'profile' && (
              <ProfilePage
                user={currentUser}
                profile={currentProfile || currentUser?.profile}
                result={result}
                onNavigateTab={setCurrentTab}
                currentLang={currentLang}
                onLogout={handleLogout}
                onOpenAuth={() => setShowAuthModal(true)}
                onOpenScanner={() => setShowScannerModal(true)}
              />
            )}

            {/* VIEW F: Application & DBT Status Tracker */}
            {currentTab === 'tracker' && (
              <ApplicationTracker
                currentUser={currentUser}
                currentProfile={currentProfile || currentUser?.profile}
                currentLang={currentLang}
                onBackToHome={() => setCurrentTab('home')}
                onOpenGrievance={() => setShowGrievanceModal(true)}
              />
            )}

            {/* VIEW G: Future-Ready Admin & Scholarship Rule Builder (Strictly Admin Access Only) */}
            {currentTab === 'admin' && (
              currentUser?.role === 'admin' ? (
                <AdminDashboard
                  onBackToHome={() => setCurrentTab('home')}
                  currentLang={currentLang}
                />
              ) : (
                <div className="max-w-lg mx-auto my-12 bg-white rounded-2xl border border-red-200 p-8 text-center shadow-xs space-y-4">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
                    <ShieldCheck size={30} />
                  </div>
                  <span className="text-[11px] font-bold text-red-700 uppercase tracking-widest block">
                    Access Prohibited • நிர்வாகி அனுமதி தேவை
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    Nodal Administrator Access Only
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The Rule Builder and Scheme Matrix configurations are strictly reserved for verified Government of Tamil Nadu Welfare Administrators. Normal students cannot access or modify state allocation rules.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentTab('home')}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Return to Portal Home
                    </button>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Sign In as Admin
                    </button>
                  </div>
                </div>
              )
            )}

          </div>
        )}

      </main>

      {/* 3. Persistent Side AI Chatbox (Available across other pages) */}
      {currentTab !== 'home' && (
        <SideAiChat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(prev => !prev)}
          currentProfile={currentProfile}
          currentResult={result}
          currentLang={currentLang}
          currentUser={currentUser}
          onNavigateTab={setCurrentTab}
          onOpenGrievance={() => setShowGrievanceModal(true)}
          onOpenNotices={() => setShowNoticeModal(true)}
        />
      )}

      {/* 4. Student Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 5. Cloud Database Modal (MongoDB Atlas & SQLite Dual-Sync) */}
      <DbConfigModal
        isOpen={showDbModal}
        onClose={() => setShowDbModal(false)}
        dbStatus={dbStatus}
        onUpdateStatus={(newStatus) => setDbStatus(newStatus)}
      />

      {/* 6. Official Government Orders & Notice Board Drawer Modal */}
      <NoticeBoardModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        currentLang={currentLang}
      />

      {/* 7. Citizen Grievance & Student Helpdesk Petition Modal */}
      <GrievanceModal
        isOpen={showGrievanceModal}
        onClose={() => setShowGrievanceModal(false)}
        currentUser={currentUser}
        currentProfile={currentProfile || currentUser?.profile}
        currentLang={currentLang}
      />

      {/* 8. e-Sevai Document Scanner & Live Multi-Field Cross-Verification Modal */}
      <EsevaiScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        studentProfile={currentProfile || currentUser?.profile}
        currentUser={currentUser}
        onVerificationComplete={(updatedProf) => {
          setCurrentProfile(updatedProf);
          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              profile: { ...(currentUser.profile || {}), ...updatedProf }
            };
            setCurrentUser(updatedUser);
            try {
              sessionStorage.setItem('tn_scholarship_user', JSON.stringify(updatedUser));
            } catch (e) {}
          }
        }}
      />

      {/* 6. Official Civic Portal Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs mt-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Building2 size={16} className="text-emerald-400" />
                <span>{t.portal_name} • {t.dept_title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-md">
                An official Tamil Nadu e-Governance initiative designed to bridge the accessibility gap for 1.2 Lakh rural and first-generation college students across Tamil Nadu with zero entitlement collisions.
              </p>
              <div className="flex items-center space-x-3 text-[11px] text-emerald-400 font-medium pt-1">
                <span>Direct Benefit Transfer (DBT) Enabled</span>
                <span>•</span>
                <span>TNeGA Aligned</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Portals & Services</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => setCurrentTab('tracker')} className="hover:text-white transition cursor-pointer text-left">Track DBT & Application Status</button></li>
                <li><button onClick={() => setShowNoticeModal(true)} className="hover:text-white transition cursor-pointer text-left">Official Government Orders (G.O.)</button></li>
                <li><button onClick={() => setShowGrievanceModal(true)} className="hover:text-white transition cursor-pointer text-left">Citizen Grievance & Helpdesk</button></li>
                <li><a href="https://www.pudhumaipenn.tn.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition">Penkalvi (Pudhumai Penn)</a></li>
                <li><a href="https://ssp.tn.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition">TN SSP Post-Matric Portal</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Citizen Helplines</h4>
              <p className="text-[11px] text-slate-400">Toll-free Student Guidance:</p>
              <p className="text-sm font-bold text-emerald-400">14417 / 1800-425-1333</p>
              <p className="text-[10px] text-slate-500">Available Mon-Sat 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
            <p>© 2026 Government of Tamil Nadu. Department of Higher Education & Tamil Nadu e-Governance Agency (TNeGA). All rights reserved.</p>
            <div className="flex space-x-4">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Entitlement</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">e-District Guidelines</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
