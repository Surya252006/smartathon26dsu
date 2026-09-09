import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Camera, 
  CheckCircle2, 
  Building2, 
  Save, 
  ShieldCheck, 
  Upload, 
  Trash2,
  Sparkles,
  MapPin
} from 'lucide-react';
import { TN_DISTRICTS } from './ProfileForm';
import { saveProfileToCluster } from '../utils/cloudSync';

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  profile, 
  onSave, 
  currentLang = 'en' 
}) {
  const fileInputRef = useRef(null);

  // Form states initialized with existing profile values
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [gender, setGender] = useState(profile?.gender || 'male');
  const [community, setCommunity] = useState(profile?.community || 'BC');
  const [district, setDistrict] = useState(profile?.district || 'Chennai');
  const [annualIncome, setAnnualIncome] = useState(profile?.annualIncome || 140000);
  const [boardPercentage, setBoardPercentage] = useState(profile?.boardPercentage || 88.5);
  const [currentCourse, setCurrentCourse] = useState(profile?.currentCourse || 'B.E. Computer Science & Engineering (B.E CSE)');
  const [isFirstGraduate, setIsFirstGraduate] = useState(profile?.isFirstGraduate !== undefined ? profile.isFirstGraduate : true);
  const [schoolingType, setSchoolingType] = useState(profile?.schoolingType || 'tn_govt_school_6_to_12');
  const [avatar, setAvatar] = useState(profile?.avatar || null);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Please choose a photo under 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setAvatar(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updated = {
      fullName: fullName.trim() || 'Student Candidate',
      gender,
      community,
      district,
      annualIncome: parseFloat(annualIncome) || 140000,
      boardPercentage: parseFloat(boardPercentage) || 88.5,
      currentCourse,
      isFirstGraduate: Boolean(isFirstGraduate),
      schoolingType,
      avatar,
      isGuest: false
    };

    // Save to session storage for fresh per-session persistence and auto-signout on tab close
    try {
      sessionStorage.setItem('tn_student_profile', JSON.stringify(updated));
      if (avatar) {
        sessionStorage.setItem('tn_student_avatar', avatar);
      } else {
        sessionStorage.removeItem('tn_student_avatar');
      }

      // Also update currentUser object if present in sessionStorage
      let userObj = null;
      const savedUser = sessionStorage.getItem('tn_scholarship_user');
      if (savedUser) {
        userObj = JSON.parse(savedUser);
        userObj.profile = {
          ...(userObj.profile || {}),
          full_name: updated.fullName,
          gender: updated.gender,
          community: updated.community,
          district: updated.district,
          annual_income: updated.annualIncome,
          board_percentage: updated.boardPercentage,
          current_course: updated.currentCourse,
          is_first_graduate: updated.isFirstGraduate,
          schooling_type: updated.schoolingType,
          avatar: updated.avatar
        };
        sessionStorage.setItem('tn_scholarship_user', JSON.stringify(userObj));
      }

      // Persist profile to Cloud Firestore Cluster
      saveProfileToCluster(updated, userObj).catch(err =>
        console.warn("[EditProfileModal] Cloud sync notice:", err)
      );

      // Broadcast events so Navbar & other components re-render immediately
      window.dispatchEvent(new Event('avatarUpdated'));
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err) {
      console.warn("Storage error", err);
    }

    setIsSaved(true);
    if (onSave) onSave(updated);

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0f2942] text-white p-5 sm:p-6 relative shrink-0">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <ShieldCheck size={14} />
            <span>Government of Tamil Nadu • e-Vidya Citizen Profile</span>
          </div>

          <h2 className="text-xl font-bold text-white">
            {currentLang === 'ta' ? 'மாணவர் விவரங்களைத் திருத்துக' : 'Edit Student Profile'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Update your academic records, category, and photo. Scholarship matching will automatically re-optimize based on your changes.
          </p>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700 flex-1">
          
          {/* 1. Photo Upload Section */}
          <div className="flex items-center space-x-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            
            <div className="relative shrink-0">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-white border-2 border-dashed border-slate-300 hover:border-emerald-600 flex flex-col items-center justify-center overflow-hidden cursor-pointer transition relative group shadow-2xs"
                title="Click to choose a photo from your computer"
              >
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <User size={30} className="text-slate-400 group-hover:text-emerald-700 transition" />
                    <span className="text-[8px] font-bold text-slate-500 font-mono mt-0.5">ADD PHOTO</span>
                  </>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[9px] font-semibold">
                  <Camera size={16} />
                </div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />

              {avatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                  title="Remove image"
                >
                  ×
                </button>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs">Profile Photo / பாஸ்போர்ட் புகைப்படம்</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Upload your passport photo or portrait. Stored securely and displayed across your Candidate Snapshot and Top Masthead.
              </p>
              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-md font-semibold text-[11px] transition cursor-pointer flex items-center space-x-1"
                >
                  <Upload size={11} className="text-emerald-700" />
                  <span>Browse Device</span>
                </button>
                {avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md font-semibold text-[11px] transition cursor-pointer flex items-center space-x-1"
                  >
                    <Trash2 size={11} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* 2. Candidate Personal Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-slate-800 font-semibold mb-1">
                Full Name (மாணவர் பெயர்) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="e.g. Surya Suresh"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-slate-800 font-semibold mb-1">
                Gender (பாலினம்) <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
              >
                <option value="male">Male (ஆண்)</option>
                <option value="female">Female (பெண்)</option>
                <option value="transgender">Transgender (திருநங்கை)</option>
              </select>
            </div>

            {/* Community / Caste Category */}
            <div>
              <label className="block text-slate-800 font-semibold mb-1">
                Community Category (சமூகப் பிரிவு) <span className="text-red-500">*</span>
              </label>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium font-mono"
              >
                <option value="BC">BC (Backward Class)</option>
                <option value="BCM">BCM (Backward Class Muslim)</option>
                <option value="MBC">MBC / DNC (Most Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="SCA">SCA (Scheduled Caste Arunthathiyar)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="OC">OC / General (Open Competition)</option>
              </select>
            </div>

            {/* Home District (Tamil Nadu - All 38 Districts) */}
            <div>
              <label className="block text-slate-800 font-semibold mb-1">
                Home District (சொந்த மாவட்டம்) <span className="text-red-500">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
              >
                {TN_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name_en} ({d.name_ta})
                  </option>
                ))}
              </select>
            </div>

            {/* Annual Family Income */}
            <div>
              <label className="block text-slate-800 font-semibold mb-1">
                Annual Family Income (ஆண்டு வருமானம்) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  min="0"
                  max="5000000"
                  step="5000"
                  required
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono font-semibold"
                />
              </div>
            </div>

            {/* 12th Board Exam Marks (%) */}
            <div>
              <label className="block text-slate-800 font-semibold mb-1">
                12th Board Marks % (12-ஆம் வகுப்பு மதிப்பெண்) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={boardPercentage}
                  onChange={(e) => setBoardPercentage(e.target.value)}
                  min="35"
                  max="100"
                  step="0.1"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono font-semibold"
                />
                <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
              </div>
            </div>

            {/* Current Course */}
            <div>
              <label className="block text-slate-800 font-semibold mb-1">
                Enrolled Course (படிப்பு) <span className="text-red-500">*</span>
              </label>
              <select
                value={currentCourse}
                onChange={(e) => setCurrentCourse(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
              >
                <option value="B.E. Computer Science & Engineering (B.E CSE)">B.E CSE (Computer Science)</option>
                <option value="B.E. Electronics & Communication (ECE)">B.E ECE (Electronics & Comm)</option>
                <option value="B.E. Mechanical / Civil Engineering">B.E Mechanical / Civil</option>
                <option value="MBBS / BDS (Medical)">MBBS / BDS (Medical)</option>
                <option value="B.Sc Computer Science / IT">B.Sc Computer Science / IT</option>
                <option value="B.Com / BBA (Commerce)">B.Com / BBA (Commerce)</option>
                <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                <option value="B.Sc Agriculture">B.Sc Agriculture</option>
                <option value="BA / MA Tamil Literature">BA / MA Tamil Literature</option>
              </select>
            </div>

          </div>

          {/* 3. Welfare Entitlement Flags (First Graduate & Govt Schooling) */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
            
            <div className="flex items-center space-x-2 font-bold text-emerald-950 text-xs">
              <Sparkles size={14} className="text-emerald-700" />
              <span>Special Welfare Entitlement Parameters (தமிழ்நாடு அரசு சிறப்பு சலுகைகள்)</span>
            </div>

            {/* First Graduate Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-semibold text-slate-900 block">First Graduate in Family (முதல் பட்டதாரி)?</span>
                <span className="text-[11px] text-slate-500">Qualifies for ₹25,000/yr tuition concession via Single Window</span>
              </div>
              <div className="flex space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFirstGraduate(true)}
                  className={`px-3 py-1 rounded-md font-semibold text-xs border transition cursor-pointer ${
                    isFirstGraduate 
                      ? 'bg-[#006a4e] text-white border-[#006a4e]' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Yes (ஆம்)
                </button>
                <button
                  type="button"
                  onClick={() => setIsFirstGraduate(false)}
                  className={`px-3 py-1 rounded-md font-semibold text-xs border transition cursor-pointer ${
                    !isFirstGraduate 
                      ? 'bg-slate-800 text-white border-slate-800' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  No (இல்லை)
                </button>
              </div>
            </div>

            {/* Schooling Background */}
            <div className="pt-2 border-t border-emerald-200/60">
              <label className="block text-slate-800 font-semibold mb-1">
                Schooling Background 6th - 12th (பள்ளி கல்வி பின்னணி)
              </label>
              <select
                value={schoolingType}
                onChange={(e) => setSchoolingType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium"
              >
                <option value="tn_govt_school_6_to_12">6th to 12th Tamil Nadu Government School (புதுமைப் பெண் / தமிழ் புதல்வன் தகுதி)</option>
                <option value="govt_aided">Government-Aided School (அரசு உதவிபெறும் பள்ளி)</option>
                <option value="private">Private Matriculation / CBSE School (தனியார் பள்ளி)</option>
              </select>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#006a4e] hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Save size={14} />
              <span>{isSaved ? "Saved!" : "Save & Recalculate Benefits"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
