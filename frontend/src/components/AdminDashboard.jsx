import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Sliders, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Landmark, 
  Lock, 
  Search, 
  ExternalLink,
  Cpu,
  ArrowRight,
  Database,
  Eye,
  Check
} from 'lucide-react';
import { DEFAULT_SCHEMES, getActiveSchemes } from '../utils/decisionEngine';

export default function AdminDashboard({ onBackToHome, currentLang = 'en' }) {
  const [schemes, setSchemes] = useState(() => getActiveSchemes());
  const [selectedSchemeId, setSelectedSchemeId] = useState(schemes[0]?.id || 'tn-first-graduate');
  const [toastMsg, setToastMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'rule_builder', 'conflicts', 'fraud_prevention'

  // Edit form state for selected scheme
  const [editFormData, setEditFormData] = useState(null);

  // Visual Rule Builder state (Section 15)
  const [builderCondition, setBuilderCondition] = useState({
    name: "Special Meritorious Girl Child Assistance",
    community: "BC",
    maxIncome: 250000,
    minPercentage: 80,
    gender: "female",
    degree: "Engineering",
    govtSchoolOnly: true,
    firstGraduateOnly: false,
    benefitAmount: 20000,
    conflictsWith: ["pm-usp-csss"]
  });

  // Fraud prevention simulation state (Section 16)
  const [fraudQuery, setFraudQuery] = useState({
    aadhaarNumber: "9823-4412-8871",
    bankAccount: "62384910294 (SBI Guindy)",
    collegeAishe: "C-24819 (Anna University CEG)"
  });
  const [fraudAuditResult, setFraudAuditResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    const s = schemes.find(item => item.id === selectedSchemeId) || schemes[0];
    if (s) {
      setEditFormData(JSON.parse(JSON.stringify(s)));
    }
  }, [selectedSchemeId, schemes]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSaveScheme = (e) => {
    e.preventDefault();
    if (!editFormData) return;

    const updated = schemes.map(s => s.id === editFormData.id ? editFormData : s);
    setSchemes(updated);
    try {
      localStorage.setItem('tn_admin_schemes', JSON.stringify(updated));
      window.dispatchEvent(new Event('adminSchemesUpdated'));
      showToast(`Rule updated for "${editFormData.name}"!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = (schemeId) => {
    const updated = schemes.map(s => {
      if (s.id === schemeId) {
        return { ...s, is_disabled: !s.is_disabled };
      }
      return s;
    });
    setSchemes(updated);
    try {
      localStorage.setItem('tn_admin_schemes', JSON.stringify(updated));
      window.dispatchEvent(new Event('adminSchemesUpdated'));
      const target = updated.find(s => s.id === schemeId);
      showToast(`${target.name} is now ${target.is_disabled ? 'DISABLED' : 'ACTIVE'}.`);
    } catch (err) {}
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all scholarship criteria, conflict rules, and income caps to Official Tamil Nadu Government Defaults?")) {
      try {
        localStorage.removeItem('tn_admin_schemes');
        setSchemes(DEFAULT_SCHEMES);
        setSelectedSchemeId(DEFAULT_SCHEMES[0].id);
        window.dispatchEvent(new Event('adminSchemesUpdated'));
        showToast("Restored all schemes to official state Gazette baseline!");
      } catch (err) {}
    }
  };

  const handleAddRuleFromBuilder = (e) => {
    e.preventDefault();
    const newId = `tn-custom-${Date.now()}`;
    const newScheme = {
      id: newId,
      name: builderCondition.name,
      name_ta: builderCondition.name,
      category: "merit_cum_means",
      financial_value: Number(builderCondition.benefitAmount) || 20000,
      annual_benefit: Number(builderCondition.benefitAmount) || 20000,
      benefit_period: "Per Academic Year",
      benefit_breakdown: {
        tuition_waiver: Number(builderCondition.benefitAmount) || 20000,
        maintenance_stipend: 0,
        book_allowance: 0
      },
      criteria: {
        gender: builderCondition.gender,
        eligible_communities: builderCondition.community === "ALL" ? ["OC", "BC", "BCM", "MBC", "SC", "ST", "SCC"] : [builderCondition.community],
        max_income: Number(builderCondition.maxIncome) || 250000,
        min_percentage: Number(builderCondition.minPercentage) || 0,
        govt_school_only: Boolean(builderCondition.govtSchoolOnly),
        first_graduate_only: Boolean(builderCondition.firstGraduateOnly),
        differently_abled_only: false,
        allowed_courses: [builderCondition.degree, "All"]
      },
      mutually_exclusive_with: builderCondition.conflictsWith || [],
      portal_name: "TN State Scholarship Portal (SSP)",
      portal_url: "https://ssp.tn.gov.in",
      deadline: "31st December 2026",
      renewal: "Annual e-District verification",
      required_docs: [
        "Aadhaar Card",
        "Community Certificate",
        "Income Certificate",
        "College Bonafide"
      ],
      department: "Directorate of Higher Education Welfare",
      description: "Custom rule provision configured via Administrator Decision Engine Builder."
    };

    const updated = [newScheme, ...schemes];
    setSchemes(updated);
    setSelectedSchemeId(newId);
    try {
      localStorage.setItem('tn_admin_schemes', JSON.stringify(updated));
      window.dispatchEvent(new Event('adminSchemesUpdated'));
      showToast(`Rule for "${newScheme.name}" added successfully to decision engine!`);
      setActiveTab('catalog');
    } catch (err) {}
  };

  const handleSimulateFraudCheck = (e) => {
    e.preventDefault();
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setFraudAuditResult({
        aadhaarStatus: "Valid (Aadhaar Vault SHA-256 Tokenized)",
        npciDbtStatus: "Active — NPCI Aadhaar Seeding Linked to SBI Account Ending 294",
        duplicateClaimsDetected: [
          {
            schemeName: "Central Sector Scheme (NSP CSSS)",
            portal: "NSP Portal (scholarships.gov.in)",
            applicationNo: "TN2026-NSP-991048",
            claimStatus: "Pending Nodal Officer Approval",
            conflictWarning: "MUTUAL EXCLUSION DETECTED: Collides with Tamil Nadu First Graduate Tuition Waiver claim!"
          }
        ],
        institutionVerification: "Verified (Anna University CEG, AISHE C-24819, Biometric Attendance: 86.4%)",
        verdict: "INTERCEPT RECOMMENDED",
        actionPlan: "Dual-subsidy alert dispatched to College Nodal Officer. The system automatically withheld NSP CSSS to preserve ₹25,000 First Graduate state sanction."
      });
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 text-slate-800 animate-in fade-in duration-300">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#0f2942] text-white px-5 py-3 rounded-lg shadow-lg border border-slate-700 flex items-center space-x-3 text-xs animate-in slide-in-from-top-3">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMsg}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-[#0f2942] text-white rounded-xl p-6 shadow-sm border-2 border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck size={16} />
            <span>Government Administrator Portal • Data-Driven Policy Control</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Scholarship Rule Builder & Administration Engine
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Configure income limits, community quotas, statutory benefits, and conflict rules as structured data without changing any front-end code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center space-x-1.5 cursor-pointer"
            title="Reset to State Government baseline"
          >
            <RotateCcw size={13} className="text-amber-400" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={onBackToHome}
            className="px-3.5 py-2 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold rounded-lg transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <span>← Back to Student View</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 shadow-2xs gap-1">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-[#006a4e] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders size={14} />
          <span>Scheme Criteria & Income Limits</span>
        </button>

        <button
          onClick={() => setActiveTab('rule_builder')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
            activeTab === 'rule_builder'
              ? 'bg-[#006a4e] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cpu size={14} />
          <span>Visual Rule Builder (IF...THEN)</span>
        </button>

        <button
          onClick={() => setActiveTab('conflicts')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
            activeTab === 'conflicts'
              ? 'bg-[#006a4e] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle size={14} />
          <span>Conflict Matrix Editor</span>
        </button>

        <button
          onClick={() => setActiveTab('fraud_prevention')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
            activeTab === 'fraud_prevention'
              ? 'bg-[#006a4e] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock size={14} />
          <span>Fraud & Double Claim Audit (Future Scope)</span>
        </button>
      </div>

      {/* 3. TAB A: Scheme Criteria & Income Limits Editor */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Scheme List (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Configured Schemes ({schemes.length})
              </span>
              <button
                onClick={() => setActiveTab('rule_builder')}
                className="text-[11px] font-bold text-[#006a4e] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Scheme</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {schemes.map((item) => {
                const isSelected = item.id === selectedSchemeId;
                const isDisabled = Boolean(item.is_disabled);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedSchemeId(item.id)}
                    className={`p-3 rounded-lg border transition cursor-pointer text-left ${
                      isSelected
                        ? 'border-[#006a4e] bg-emerald-50/70 ring-1 ring-[#006a4e]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          {isDisabled && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-700 border border-red-200 shrink-0">
                              DISABLED
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                          {item.id}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#006a4e] font-mono shrink-0">
                        ₹{(item.financial_value || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{item.criteria?.eligible_communities?.join(', ') || 'All'}</span>
                      <span className="font-semibold text-slate-700">
                        {item.criteria?.max_income ? `≤ ₹${(item.criteria.max_income).toLocaleString('en-IN')}` : 'No Income Cap'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Scheme Editor Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
            {editFormData ? (
              <form onSubmit={handleSaveScheme} className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wider block">
                      Editing Scheme Parameters
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {editFormData.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(editFormData.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        editFormData.is_disabled
                          ? 'bg-emerald-50 text-[#006a4e] border-emerald-300 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                      }`}
                    >
                      {editFormData.is_disabled ? 'Enable Scheme' : 'Disable Scheme'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Save size={14} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Scheme Title (English)
                    </label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Annual Financial Benefit (₹ / Year)
                    </label>
                    <input
                      type="number"
                      value={editFormData.financial_value || 0}
                      onChange={(e) => setEditFormData({ 
                        ...editFormData, 
                        financial_value: Number(e.target.value),
                        annual_benefit: Number(e.target.value)
                      })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono font-bold focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Annual Family Income Ceiling (₹) — Leave blank for No Cap
                    </label>
                    <input
                      type="number"
                      value={editFormData.criteria?.max_income || ''}
                      placeholder="e.g. 250000"
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        criteria: {
                          ...editFormData.criteria,
                          max_income: e.target.value ? Number(e.target.value) : null
                        }
                      })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Minimum 12th Board Marks Threshold (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editFormData.criteria?.min_percentage || 0}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        criteria: {
                          ...editFormData.criteria,
                          min_percentage: Number(e.target.value)
                        }
                      })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Gender Eligibility
                    </label>
                    <select
                      value={editFormData.criteria?.gender || 'any'}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        criteria: {
                          ...editFormData.criteria,
                          gender: e.target.value
                        }
                      })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#006a4e] outline-none"
                    >
                      <option value="any">Any Gender (All Students)</option>
                      <option value="female">Female Only (e.g. Pudhumai Penn, AICTE Pragati)</option>
                      <option value="male">Male Only (e.g. Tamil Pudhalvan)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Eligible Social Categories (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={(editFormData.criteria?.eligible_communities || []).join(', ')}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        criteria: {
                          ...editFormData.criteria,
                          eligible_communities: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                        }
                      })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Official Application Portal Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.portal_name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, portal_name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Portal URL (Official External Gateway)
                    </label>
                    <input
                      type="text"
                      value={editFormData.portal_url || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, portal_url: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Application Deadline
                    </label>
                    <input
                      type="text"
                      value={editFormData.deadline || '31st October 2026'}
                      onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Department / Directorate
                    </label>
                    <input
                      type="text"
                      value={editFormData.department || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#006a4e] outline-none"
                    />
                  </div>
                </div>

                {/* Condition checkboxes */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
                  <span className="font-bold text-slate-800 block">Mandatory Qualification Filters:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editFormData.criteria?.govt_school_only)}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          criteria: { ...editFormData.criteria, govt_school_only: e.target.checked }
                        })}
                        className="rounded text-[#006a4e] focus:ring-[#006a4e]"
                      />
                      <span className="text-slate-700 font-medium">TN Govt School (6-12) Only</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editFormData.criteria?.first_graduate_only)}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          criteria: { ...editFormData.criteria, first_graduate_only: e.target.checked }
                        })}
                        className="rounded text-[#006a4e] focus:ring-[#006a4e]"
                      />
                      <span className="text-slate-700 font-medium">First Graduate Only</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editFormData.criteria?.differently_abled_only)}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          criteria: { ...editFormData.criteria, differently_abled_only: e.target.checked }
                        })}
                        className="rounded text-[#006a4e] focus:ring-[#006a4e]"
                      />
                      <span className="text-slate-700 font-medium">Differently Abled Only</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <Save size={14} />
                    <span>Save & Update Decision Engine</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center text-slate-500">
                Select a scholarship scheme to edit rules.
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. TAB B: Visual Scholarship Rule Builder (Section 15) */}
      {activeTab === 'rule_builder' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wider block">
              Section 15 • Human-Readable Logic Compiler
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Visual Scholarship Rule Builder
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Design new government or institution scholarship rules through readable conditional statements. The engine compiles these conditions directly into executable MWIS constraints.
            </p>
          </div>

          {/* Interactive Condition Formulator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Scheme / Rule Name
                </label>
                <input
                  type="text"
                  value={builderCondition.name}
                  onChange={(e) => setBuilderCondition({ ...builderCondition, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#006a4e] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Community Requirement</label>
                  <select
                    value={builderCondition.community}
                    onChange={(e) => setBuilderCondition({ ...builderCondition, community: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none"
                  >
                    <option value="ALL">All Communities (Open)</option>
                    <option value="BC">BC (Backward Classes)</option>
                    <option value="MBC">MBC / DNC</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Annual Income Ceiling (₹)</label>
                  <input
                    type="number"
                    value={builderCondition.maxIncome}
                    onChange={(e) => setBuilderCondition({ ...builderCondition, maxIncome: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Degree Stream</label>
                  <select
                    value={builderCondition.degree}
                    onChange={(e) => setBuilderCondition({ ...builderCondition, degree: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none"
                  >
                    <option value="Engineering">Engineering & Tech</option>
                    <option value="Arts & Science">Arts & Science</option>
                    <option value="Medical">Medical / Paramedical</option>
                    <option value="Diploma">Polytechnic Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Benefit Amount (₹ / Year)</label>
                  <input
                    type="number"
                    value={builderCondition.benefitAmount}
                    onChange={(e) => setBuilderCondition({ ...builderCondition, benefitAmount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono font-bold outline-none text-[#006a4e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minimum 12th Marks (%)</label>
                  <input
                    type="number"
                    value={builderCondition.minPercentage}
                    onChange={(e) => setBuilderCondition({ ...builderCondition, minPercentage: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender Restriction</label>
                  <select
                    value={builderCondition.gender}
                    onChange={(e) => setBuilderCondition({ ...builderCondition, gender: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none"
                  >
                    <option value="any">Any (Male & Female)</option>
                    <option value="female">Female Candidates Only</option>
                    <option value="male">Male Candidates Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-1 text-xs">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builderCondition.govtSchoolOnly}
                    onChange={(e) => setBuilderCondition({ ...builderCondition, govtSchoolOnly: e.target.checked })}
                    className="rounded text-[#006a4e]"
                  />
                  <span className="font-medium text-slate-700">6-12 TN Govt School Required</span>
                </label>

                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builderCondition.firstGraduateOnly}
                    onChange={(e) => setBuilderCondition({ ...builderCondition, firstGraduateOnly: e.target.checked })}
                    className="rounded text-[#006a4e]"
                  />
                  <span className="font-medium text-slate-700">First Graduate Only</span>
                </label>
              </div>
            </div>

            {/* Live Visual Rule Code Preview (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 text-slate-100 p-5 rounded-xl font-mono text-xs space-y-4 flex flex-col justify-between border border-slate-800 shadow-inner">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-emerald-400 uppercase font-bold">
                  <span>Logic Compiler Statement</span>
                  <span>Rule Engine v2.4</span>
                </div>

                <div className="text-amber-300">
                  <span className="text-purple-400">IF</span> (
                </div>
                
                <div className="pl-4 space-y-1 text-slate-300 text-[11px]">
                  <div>Community == <span className="text-emerald-400">"{builderCondition.community}"</span></div>
                  <div><span className="text-purple-400">AND</span> Annual_Income &lt;= <span className="text-amber-400">₹{Number(builderCondition.maxIncome).toLocaleString('en-IN')}</span></div>
                  <div><span className="text-purple-400">AND</span> Degree == <span className="text-emerald-400">"{builderCondition.degree}"</span></div>
                  <div><span className="text-purple-400">AND</span> Marks_12th &gt;= <span className="text-amber-400">{builderCondition.minPercentage}%</span></div>
                  {builderCondition.gender !== 'any' && (
                    <div><span className="text-purple-400">AND</span> Gender == <span className="text-emerald-400">"{builderCondition.gender}"</span></div>
                  )}
                  {builderCondition.govtSchoolOnly && (
                    <div><span className="text-purple-400">AND</span> Schooling_6_to_12 == <span className="text-emerald-400">TRUE</span></div>
                  )}
                  {builderCondition.firstGraduateOnly && (
                    <div><span className="text-purple-400">AND</span> First_Graduate == <span className="text-emerald-400">TRUE</span></div>
                  )}
                </div>

                <div className="text-amber-300">
                  ) <span className="text-purple-400">THEN</span> &#123;
                </div>

                <div className="pl-4 space-y-1 text-[11px]">
                  <div className="text-emerald-400">Eligible = TRUE;</div>
                  <div className="text-emerald-400">Annual_Benefit = ₹{Number(builderCondition.benefitAmount).toLocaleString('en-IN')};</div>
                </div>

                <div className="text-amber-300">&#125;</div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-red-400">
                  CONFLICT: [{builderCondition.name}] CANNOT COMBINE WITH [Central Sector CSSS / First Graduate]
                </div>
              </div>

              <button
                onClick={handleAddRuleFromBuilder}
                className="w-full mt-4 bg-[#006a4e] hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <Plus size={14} />
                <span>Inject Rule into Live Engine</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. TAB C: Conflict Matrix Editor (Section 4) */}
      {activeTab === 'conflicts' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wider block">
              Section 4 • Mutual Exclusion Matrix
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Statutory Conflict Rules & Dual-Claim Restrictions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Define which scholarships cannot be claimed concurrently. If a student qualifies for both schemes, the Maximum Weight Independent Set (MWIS) solver computes the subset with the highest legitimate financial yield.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Primary Scholarship</th>
                  <th className="p-3">Statutory Conflict Rule</th>
                  <th className="p-3">Restricted Incompatible Schemes</th>
                  <th className="p-3">Regulatory Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemes.map((scheme, idx) => {
                  const exclusions = scheme.mutually_exclusive_with || [];

                  return (
                    <tr key={scheme.id || idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">
                        {scheme.name}
                        <span className="block font-mono text-[10px] text-slate-400 font-normal">{scheme.id}</span>
                      </td>
                      <td className="p-3">
                        {exclusions.length > 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                            Mutually Exclusive ({exclusions.length} Conflicts)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Fully Stackable (No Restrictions)
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {exclusions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {exclusions.map(excId => (
                              <span key={excId} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                                ✖ {excId}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600 text-[11px] leading-relaxed max-w-sm">
                        {exclusions.length > 0
                          ? "Government policy prohibits drawing simultaneous tuition fee reimbursements or dual central/state maintenance subsidies."
                          : "Non-conflicting entitlement grant. May be stacked with fee waivers."}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. TAB D: Fraud & Double Claim Prevention (Section 16) */}
      {activeTab === 'fraud_prevention' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center space-x-2 text-emerald-700 mb-1">
              <Lock size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                Future Government Integration
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Cross-Portal Fraud & Double Claim Detection Architecture
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Simulate centralized state treasury validation across NSP, TN-SSP, and Penkalvi portals to intercept duplicate claims and unverified bank accounts prior to payment order disbursement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Simulation Query Form (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Simulate Student Claim Verification
              </h3>

              <form onSubmit={handleSimulateFraudCheck} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Student Aadhaar Number (Tokenized Hash)
                  </label>
                  <input
                    type="text"
                    value={fraudQuery.aadhaarNumber}
                    onChange={(e) => setFraudQuery({ ...fraudQuery, aadhaarNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono text-xs focus:border-[#006a4e] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NPCI DBT Active Bank Account
                  </label>
                  <input
                    type="text"
                    value={fraudQuery.bankAccount}
                    onChange={(e) => setFraudQuery({ ...fraudQuery, bankAccount: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono text-xs focus:border-[#006a4e] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Institution AISHE Code & Enrollment
                  </label>
                  <input
                    type="text"
                    value={fraudQuery.collegeAishe}
                    onChange={(e) => setFraudQuery({ ...fraudQuery, collegeAishe: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono text-xs focus:border-[#006a4e] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuditing}
                  className="w-full py-2.5 rounded-lg bg-[#006a4e] hover:bg-[#00523d] text-white font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Search size={14} />
                  <span>{isAuditing ? 'Interrogating State & Central Portals...' : 'Run Cross-Scheme Fraud Audit'}</span>
                </button>
              </form>
            </div>

            {/* Simulation Results & Architecture Ledger (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Audited System Ledger
              </h3>

              {fraudAuditResult ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-800">Audit Status:</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      {fraudAuditResult.verdict}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-700">
                    <div><strong>Aadhaar Vault:</strong> {fraudAuditResult.aadhaarStatus}</div>
                    <div><strong>NPCI DBT Seeding:</strong> {fraudAuditResult.npciDbtStatus}</div>
                    <div><strong>AISHE Attendance:</strong> {fraudAuditResult.institutionVerification}</div>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg border border-red-200 space-y-1 text-red-900">
                    <span className="font-bold text-[11px] flex items-center">
                      <AlertTriangle size={13} className="mr-1 text-red-600" />
                      Concurrent Claim Detected:
                    </span>
                    {fraudAuditResult.duplicateClaimsDetected.map((claim, cIdx) => (
                      <div key={cIdx} className="text-[10px] space-y-0.5">
                        <div className="font-bold">{claim.schemeName} ({claim.portal})</div>
                        <div className="font-mono text-slate-600">Application: {claim.applicationNo}</div>
                        <div className="text-red-700 font-semibold">{claim.conflictWarning}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                    <strong>Automated Resolution Action:</strong> {fraudAuditResult.actionPlan}
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
                  Click "Run Cross-Scheme Fraud Audit" to execute simulated cross-checking against Central & State scholarship databases.
                </div>
              )}

              {/* 7 Future Capabilities Checklist */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Government Roadmap Capabilities (In Progress):
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Check size={12} className="text-[#006a4e]" />
                    <span>Duplicate Claim Detection</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check size={12} className="text-[#006a4e]" />
                    <span>Aadhaar Vault e-KYC</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check size={12} className="text-[#006a4e]" />
                    <span>NPCI DBT Seeding Mapper</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check size={12} className="text-[#006a4e]" />
                    <span>Cross-Scheme Validator</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check size={12} className="text-[#006a4e]" />
                    <span>AISHE Institution Sync</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check size={12} className="text-[#006a4e]" />
                    <span>Real-time Treasury Disburse</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
