import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Sliders, Plus, Save, RotateCcw,
  AlertTriangle, CheckCircle2, Lock, Search, Cpu,
  Database, Users, GraduationCap,
  BarChart3, TrendingUp, TrendingDown, IndianRupee, Clock,
  Download, RefreshCw, Activity, PieChart,
  Map, School, LogOut, Zap
} from 'lucide-react';
import { DEFAULT_SCHEMES, getActiveSchemes } from '../utils/decisionEngine';

const MOCK_STATS = {
  totalStudents: 12847, schoolStudents: 7234, collegeStudents: 5613,
  pendingApplications: 1892, approvedApplications: 9124, rejectedApplications: 1831,
  totalDisbursed: 284700000, activeSchemes: 18, fraudAlerts: 23,
};

const MOCK_RECENT_ACTIVITY = [
  { id: 1, type: 'approved', student: 'Priya Lakshmi (SC - Madurai)', scheme: 'Pudhumai Penn', amount: 25000, time: '2 min ago', stream: 'college' },
  { id: 2, type: 'pending', student: 'Karthikeyan R (BC - Chennai)', scheme: 'TN First Graduate', amount: 20000, time: '8 min ago', stream: 'college' },
  { id: 3, type: 'approved', student: 'Kavitha S (MBC - Coimbatore)', scheme: 'NMMS', amount: 12000, time: '15 min ago', stream: 'school' },
  { id: 4, type: 'fraud', student: 'Rajan M (OC - Trichy)', scheme: 'NSP CSSS + First Graduate', amount: 45000, time: '22 min ago', stream: 'college' },
  { id: 5, type: 'approved', student: 'Anitha D (SC - Salem)', scheme: 'Pre-Matric (Class 9)', amount: 7500, time: '34 min ago', stream: 'school' },
  { id: 6, type: 'rejected', student: 'Suresh K (BC - Vellore)', scheme: 'Post-Matric Scholarship', amount: 15000, time: '1 hr ago', stream: 'college' },
  { id: 7, type: 'approved', student: 'Meenakshi P (ST - Nilgiris)', scheme: 'Free Bicycle Scheme', amount: 3500, time: '1 hr ago', stream: 'school' },
  { id: 8, type: 'pending', student: 'Vijay K (BCM - Tirunelveli)', scheme: 'NSP Post-Matric', amount: 18000, time: '2 hrs ago', stream: 'college' },
];

const MOCK_DISTRICT_DATA = [
  { district: 'Chennai', count: 1842, amount: 42000000 },
  { district: 'Coimbatore', count: 1203, amount: 29700000 },
  { district: 'Madurai', count: 987, amount: 24000000 },
  { district: 'Salem', count: 876, amount: 21200000 },
  { district: 'Trichy', count: 834, amount: 20100000 },
  { district: 'Tirunelveli', count: 723, amount: 17600000 },
  { district: 'Vellore', count: 654, amount: 15900000 },
  { district: 'Erode', count: 612, amount: 14800000 },
];

const COMMUNITY_BREAKDOWN = [
  { community: 'SC', count: 3854, pct: 30, color: '#6366f1' },
  { community: 'MBC', count: 2953, pct: 23, color: '#f59e0b' },
  { community: 'BC', count: 2953, pct: 23, color: '#10b981' },
  { community: 'ST', count: 1285, pct: 10, color: '#ef4444' },
  { community: 'OC', count: 1028, pct: 8, color: '#3b82f6' },
  { community: 'BCM', count: 774, pct: 6, color: '#8b5cf6' },
];

const SAMPLE_STUDENTS = [
  { name: 'Priya Lakshmi', stream: 'college', community: 'SC', district: 'Madurai', schemes: 2, benefit: 43000, status: 'approved' },
  { name: 'Karthikeyan R', stream: 'college', community: 'BC', district: 'Chennai', schemes: 1, benefit: 20000, status: 'pending' },
  { name: 'Kavitha S', stream: 'school', community: 'MBC', district: 'Coimbatore', schemes: 1, benefit: 12000, status: 'approved' },
  { name: 'Anitha D', stream: 'school', community: 'SC', district: 'Salem', schemes: 2, benefit: 19500, status: 'approved' },
  { name: 'Suresh K', stream: 'college', community: 'BC', district: 'Vellore', schemes: 0, benefit: 0, status: 'rejected' },
  { name: 'Meenakshi P', stream: 'school', community: 'ST', district: 'Nilgiris', schemes: 1, benefit: 3500, status: 'approved' },
  { name: 'Vijay K', stream: 'college', community: 'BCM', district: 'Tirunelveli', schemes: 1, benefit: 18000, status: 'pending' },
  { name: 'Rajan M', stream: 'college', community: 'OC', district: 'Trichy', schemes: 2, benefit: 45000, status: 'fraud' },
];

function StatCard({ icon: Icon, label, value, sub, trend, color = 'emerald', badge }) {
  const colorMap = {
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100', val: 'text-emerald-700' },
    blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    border: 'border-blue-100',    val: 'text-blue-700'    },
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   border: 'border-amber-100',   val: 'text-amber-700'   },
    red:     { bg: 'bg-red-50',     icon: 'text-red-600',     border: 'border-red-100',     val: 'text-red-700'     },
    purple:  { bg: 'bg-purple-50',  icon: 'text-purple-600',  border: 'border-purple-100',  val: 'text-purple-700'  },
  };
  const c = colorMap[color] || colorMap.emerald;
  return (
    <div className={`bg-white rounded-2xl border ${c.border} p-5 shadow-xs hover:shadow-sm transition-all duration-200 relative overflow-hidden group`}>
      <div className={`absolute inset-0 ${c.bg} opacity-0 group-hover:opacity-30 transition-opacity`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl ${c.bg} ${c.icon}`}><Icon size={18} /></div>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
          {badge && <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full border border-amber-200">{badge}</span>}
        </div>
        <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
        <p className={`text-2xl font-black ${c.val}`}>{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function ActivityBadge({ type }) {
  const map = {
    approved: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    pending:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700 border-red-200' },
    fraud:    { label: 'Fraud Alert', cls: 'bg-red-50 text-red-800 border-red-300 font-black' },
  };
  const m = map[type] || map.pending;
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.cls}`}>{m.label}</span>;
}

const NAV_TABS = [
  { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
  { id: 'students', label: 'Student Registry', icon: Users },
  { id: 'catalog', label: 'Scheme Criteria', icon: Sliders },
  { id: 'rule_builder', label: 'Rule Builder', icon: Cpu },
  { id: 'conflicts', label: 'Conflict Matrix', icon: AlertTriangle },
  { id: 'fraud_prevention', label: 'Fraud Audit', icon: Lock },
];

export default function AdminDashboard({ onBackToHome, currentLang = 'en', currentUser }) {
  const [schemes, setSchemes] = useState(() => getActiveSchemes());
  const [selectedSchemeId, setSelectedSchemeId] = useState(schemes[0]?.id || 'tn-first-graduate');
  const [toastMsg, setToastMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editFormData, setEditFormData] = useState(null);
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [builderCondition, setBuilderCondition] = useState({
    name: 'Special Meritorious Girl Child Assistance', community: 'BC', maxIncome: 250000,
    minPercentage: 80, gender: 'female', degree: 'Engineering',
    govtSchoolOnly: true, firstGraduateOnly: false, benefitAmount: 20000,
    conflictsWith: ['pm-usp-csss'],
  });
  const [fraudQuery, setFraudQuery] = useState({
    aadhaarNumber: '9823-4412-8871',
    bankAccount: '62384910294 (SBI Guindy)',
    collegeAishe: 'C-24819 (Anna University CEG)',
  });
  const [fraudAuditResult, setFraudAuditResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    const s = schemes.find(item => item.id === selectedSchemeId) || schemes[0];
    if (s) setEditFormData(JSON.parse(JSON.stringify(s)));
  }, [selectedSchemeId, schemes]);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3500); };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { setIsRefreshing(false); showToast('Dashboard data refreshed!'); }, 1200);
  };

  const handleSaveScheme = (e) => {
    e.preventDefault();
    if (!editFormData) return;
    const updated = schemes.map(s => s.id === editFormData.id ? editFormData : s);
    setSchemes(updated);
    try { localStorage.setItem('tn_admin_schemes', JSON.stringify(updated)); window.dispatchEvent(new Event('adminSchemesUpdated')); showToast('Rule updated!'); } catch (err) {}
  };

  const handleToggleActive = (schemeId) => {
    const updated = schemes.map(s => s.id === schemeId ? { ...s, is_disabled: !s.is_disabled } : s);
    setSchemes(updated);
    try {
      localStorage.setItem('tn_admin_schemes', JSON.stringify(updated));
      window.dispatchEvent(new Event('adminSchemesUpdated'));
      const t = updated.find(s => s.id === schemeId);
      showToast(`${t.name} is now ${t.is_disabled ? 'DISABLED' : 'ACTIVE'}.`);
    } catch (err) {}
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all scholarship criteria to Official Tamil Nadu Government Defaults?')) {
      try {
        localStorage.removeItem('tn_admin_schemes');
        setSchemes(DEFAULT_SCHEMES);
        setSelectedSchemeId(DEFAULT_SCHEMES[0].id);
        window.dispatchEvent(new Event('adminSchemesUpdated'));
        showToast('Restored to official Gazette baseline!');
      } catch (err) {}
    }
  };

  const handleAddRuleFromBuilder = (e) => {
    e.preventDefault();
    const newId = `tn-custom-${Date.now()}`;
    const newScheme = {
      id: newId, name: builderCondition.name, name_ta: builderCondition.name, category: 'merit_cum_means',
      financial_value: Number(builderCondition.benefitAmount) || 20000,
      annual_benefit: Number(builderCondition.benefitAmount) || 20000,
      benefit_period: 'Per Academic Year',
      benefit_breakdown: { tuition_waiver: Number(builderCondition.benefitAmount) || 20000, maintenance_stipend: 0, book_allowance: 0 },
      criteria: {
        gender: builderCondition.gender,
        eligible_communities: builderCondition.community === 'ALL' ? ['OC','BC','BCM','MBC','SC','ST','SCC'] : [builderCondition.community],
        max_income: Number(builderCondition.maxIncome) || 250000,
        min_percentage: Number(builderCondition.minPercentage) || 0,
        govt_school_only: Boolean(builderCondition.govtSchoolOnly),
        first_graduate_only: Boolean(builderCondition.firstGraduateOnly),
        differently_abled_only: false,
        allowed_courses: [builderCondition.degree, 'All'],
      },
      mutually_exclusive_with: builderCondition.conflictsWith || [],
      portal_name: 'TN State Scholarship Portal (SSP)',
      portal_url: 'https://ssp.tn.gov.in',
      deadline: '31st December 2026',
      renewal: 'Annual e-District verification',
      required_docs: ['Aadhaar Card', 'Community Certificate', 'Income Certificate', 'College Bonafide'],
      department: 'Directorate of Higher Education Welfare',
      description: 'Custom rule configured via Administrator Decision Engine Builder.',
    };
    const updated = [newScheme, ...schemes];
    setSchemes(updated); setSelectedSchemeId(newId);
    try { localStorage.setItem('tn_admin_schemes', JSON.stringify(updated)); window.dispatchEvent(new Event('adminSchemesUpdated')); showToast('Rule added!'); setActiveTab('catalog'); } catch (err) {}
  };

  const handleSimulateFraudCheck = (e) => {
    e.preventDefault(); setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setFraudAuditResult({
        aadhaarStatus: 'Valid (Aadhaar Vault SHA-256 Tokenized)',
        npciDbtStatus: 'Active - NPCI Aadhaar Seeding Linked to SBI Account Ending 294',
        duplicateClaimsDetected: [{
          schemeName: 'Central Sector Scheme (NSP CSSS)',
          portal: 'NSP Portal (scholarships.gov.in)',
          applicationNo: 'TN2026-NSP-991048',
          claimStatus: 'Pending Nodal Officer Approval',
          conflictWarning: 'MUTUAL EXCLUSION DETECTED: Collides with Tamil Nadu First Graduate Tuition Waiver claim!',
        }],
        institutionVerification: 'Verified (Anna University CEG, AISHE C-24819, Biometric Attendance: 86.4%)',
        verdict: 'INTERCEPT RECOMMENDED',
        actionPlan: 'Dual-subsidy alert dispatched to College Nodal Officer. System automatically withheld NSP CSSS to preserve Rs.25,000 First Graduate state sanction.',
      });
    }, 900);
  };

  const adminName = currentUser?.name || currentUser?.full_name || 'Administrator';
  const adminEmail = currentUser?.email || 'admin@tnega.tn.gov.in';
  const filteredActivity = activityFilter === 'all' ? MOCK_RECENT_ACTIVITY : MOCK_RECENT_ACTIVITY.filter(a => a.type === activityFilter || a.stream === activityFilter);
  const filteredSchemes = schemeFilter === 'all' ? schemes : schemeFilter === 'active' ? schemes.filter(s => !s.is_disabled) : schemes.filter(s => s.is_disabled);

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-300">

      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#0f2942] text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center space-x-3 text-xs">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a1f35] via-[#0f2942] to-[#0d3b6e] text-white shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">TNeGA - ADMIN PORTAL</span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded border border-emerald-500/30">RESTRICTED</span>
                </div>
                <h1 className="text-xl font-black tracking-tight">Scholarship Administration Engine</h1>
                <p className="text-xs text-slate-300 mt-0.5">Tamil Nadu e-Governance Agency - Higher Education Welfare Division</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleRefresh} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition cursor-pointer">
                <RefreshCw size={15} className={`text-slate-300 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={handleResetDefaults} className="px-3 py-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 text-xs font-bold rounded-lg border border-slate-600/50 transition flex items-center space-x-1.5 cursor-pointer">
                <RotateCcw size={13} className="text-amber-400" /><span>Reset Defaults</span>
              </button>
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-xl border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-black">{adminName.charAt(0).toUpperCase()}</div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-white leading-tight">{adminName}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{adminEmail}</p>
                </div>
              </div>
              <button onClick={onBackToHome} className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg border border-white/10 transition flex items-center space-x-1.5 cursor-pointer">
                <LogOut size={13} /><span className="hidden sm:inline">Exit Admin</span>
              </button>
            </div>
          </div>
          <div className="flex overflow-x-auto mt-5 gap-1 pb-1">
            {NAV_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'bg-white text-[#0f2942]' : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'}`}>
                <tab.icon size={14} /><span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black text-slate-800">Live Statistics</h2>
                <span className="text-[11px] text-slate-400 flex items-center space-x-1"><Clock size={11} /><span>Updated just now</span></span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard icon={Users} label="Total Registered" value={MOCK_STATS.totalStudents.toLocaleString('en-IN')} sub="School + College" color="blue" trend={12} />
                <StatCard icon={School} label="School Students" value={MOCK_STATS.schoolStudents.toLocaleString('en-IN')} sub="Classes 1-12" color="purple" trend={8} />
                <StatCard icon={GraduationCap} label="College Students" value={MOCK_STATS.collegeStudents.toLocaleString('en-IN')} sub="UG / PG / Diploma" color="emerald" trend={15} />
                <StatCard icon={CheckCircle2} label="Approved" value={MOCK_STATS.approvedApplications.toLocaleString('en-IN')} sub="Applications" color="emerald" trend={5} />
                <StatCard icon={Clock} label="Pending Review" value={MOCK_STATS.pendingApplications.toLocaleString('en-IN')} sub="Needs action" color="amber" badge="Action" />
                <StatCard icon={AlertTriangle} label="Fraud Alerts" value={MOCK_STATS.fraudAlerts} sub="Needs intercept" color="red" badge="Urgent" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard icon={IndianRupee} label="Total Disbursed (FY 2025-26)" value={`Rs.${(MOCK_STATS.totalDisbursed/10000000).toFixed(1)} Cr`} sub="Direct Benefit Transfer (DBT)" color="emerald" trend={18} />
              <StatCard icon={Activity} label="Active Schemes" value={MOCK_STATS.activeSchemes} sub={`${schemes.filter(s => s.is_disabled).length} suspended`} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity Feed */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-800 flex items-center space-x-2"><Activity size={15} className="text-[#006a4e]" /><span>Recent Activity Feed</span></h3>
                  <select value={activityFilter} onChange={e => setActivityFilter(e.target.value)} className="text-[11px] font-semibold border border-slate-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer">
                    <option value="all">All Types</option><option value="approved">Approved</option><option value="pending">Pending</option><option value="rejected">Rejected</option><option value="fraud">Fraud</option><option value="school">School</option><option value="college">College</option>
                  </select>
                </div>
                <div className="divide-y divide-slate-50">
                  {filteredActivity.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition">
                      <div className="flex items-start space-x-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.stream === 'school' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                          <span className="text-sm">{item.stream === 'school' ? '🎒' : '🎓'}</span>
                        </div>
                        <div className="min-w-0"><p className="text-xs font-bold text-slate-900 truncate">{item.student}</p><p className="text-[11px] text-slate-500 truncate">{item.scheme}</p></div>
                      </div>
                      <div className="flex items-center space-x-3 shrink-0 ml-3">
                        <ActivityBadge type={item.type} />
                        <div className="text-right hidden sm:block"><p className="text-xs font-black text-emerald-700">Rs.{item.amount.toLocaleString('en-IN')}</p><p className="text-[10px] text-slate-400">{item.time}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community + Stream */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-800 flex items-center space-x-2"><PieChart size={15} className="text-[#006a4e]" /><span>Community Breakdown</span></h3>
                </div>
                <div className="p-5 space-y-3">
                  {COMMUNITY_BREAKDOWN.map(item => (
                    <div key={item.community} className="space-y-1">
                      <div className="flex items-center justify-between text-xs"><span className="font-bold text-slate-700">{item.community}</span><span className="font-black text-slate-900">{item.count.toLocaleString('en-IN')}</span></div>
                      <div className="w-full bg-slate-100 rounded-full h-2"><div className="h-2 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} /></div>
                      <p className="text-[10px] text-slate-400 text-right">{item.pct}%</p>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-5">
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Stream Split</p>
                    {[{ label: 'School', count: MOCK_STATS.schoolStudents, pct: 56, emoji: '🎒', color: 'bg-purple-500' }, { label: 'College', count: MOCK_STATS.collegeStudents, pct: 44, emoji: '🎓', color: 'bg-blue-500' }].map(s => (
                      <div key={s.label} className="flex items-center space-x-2 text-xs">
                        <span className="text-xl">{s.emoji}</span>
                        <div className="flex-1">
                          <div className="flex justify-between font-semibold text-slate-700 mb-0.5"><span>{s.label}</span><span>{s.count.toLocaleString('en-IN')}</span></div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* District Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-800 flex items-center space-x-2"><Map size={15} className="text-[#006a4e]" /><span>District-wise Coverage (Top 8)</span></h3>
                <button className="text-[11px] font-bold text-[#006a4e] flex items-center space-x-1 hover:underline cursor-pointer"><Download size={12} /><span>Export CSV</span></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="text-left px-5 py-3 font-bold text-slate-600">#</th><th className="text-left px-5 py-3 font-bold text-slate-600">District</th><th className="text-right px-5 py-3 font-bold text-slate-600">Students</th><th className="text-right px-5 py-3 font-bold text-slate-600">Disbursed</th><th className="px-5 py-3 font-bold text-slate-600">Coverage</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {MOCK_DISTRICT_DATA.map((row, idx) => (
                      <tr key={row.district} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-5 py-3 font-bold text-slate-900">{row.district}</td>
                        <td className="px-5 py-3 text-right font-semibold text-slate-700">{row.count.toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3 text-right font-black text-emerald-700">Rs.{(row.amount/1000000).toFixed(1)}L</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-24"><div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${Math.round((row.count/MOCK_DISTRICT_DATA[0].count)*100)}%` }} /></div>
                            <span className="text-slate-400 font-mono">{Math.round((row.count/MOCK_DISTRICT_DATA[0].count)*100)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={Users} label="Total Registered" value={MOCK_STATS.totalStudents.toLocaleString('en-IN')} color="blue" trend={12} />
              <StatCard icon={School} label="School Students" value={MOCK_STATS.schoolStudents.toLocaleString('en-IN')} sub="Class 1-12" color="purple" />
              <StatCard icon={GraduationCap} label="College Students" value={MOCK_STATS.collegeStudents.toLocaleString('en-IN')} sub="UG/PG/Diploma" color="emerald" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-slate-100 gap-3">
                <h3 className="text-sm font-black text-slate-800">Student Registry</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search students..." className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#006a4e] w-40" /></div>
                  <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer"><option>All Streams</option><option>School</option><option>College</option></select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="text-left px-5 py-3 font-bold text-slate-600">Student</th><th className="text-left px-5 py-3 font-bold text-slate-600">Stream</th><th className="text-left px-5 py-3 font-bold text-slate-600">Community</th><th className="text-left px-5 py-3 font-bold text-slate-600">District</th><th className="text-left px-5 py-3 font-bold text-slate-600">Schemes</th><th className="text-right px-5 py-3 font-bold text-slate-600">Benefit</th><th className="text-center px-5 py-3 font-bold text-slate-600">Status</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {SAMPLE_STUDENTS.map((student, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-3"><div className="flex items-center space-x-2"><div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${student.stream === 'school' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{student.name.charAt(0)}</div><span className="font-bold text-slate-900">{student.name}</span></div></td>
                        <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${student.stream === 'school' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{student.stream === 'school' ? '🎒 School' : '🎓 College'}</span></td>
                        <td className="px-5 py-3 font-semibold text-slate-700">{student.community}</td>
                        <td className="px-5 py-3 text-slate-600">{student.district}</td>
                        <td className="px-5 py-3 text-slate-700 font-semibold">{student.schemes}</td>
                        <td className="px-5 py-3 text-right font-black text-emerald-700">{student.benefit > 0 ? `Rs.${student.benefit.toLocaleString('en-IN')}` : '-'}</td>
                        <td className="px-5 py-3 text-center"><ActivityBadge type={student.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Showing 8 of {MOCK_STATS.totalStudents.toLocaleString('en-IN')} students</span>
                <div className="flex items-center space-x-2">
                  <button className="px-2.5 py-1 bg-slate-100 rounded-lg font-semibold hover:bg-slate-200 cursor-pointer">Prev</button>
                  <span className="px-2.5 py-1 bg-[#006a4e] text-white rounded-lg font-bold">1</span>
                  <button className="px-2.5 py-1 bg-slate-100 rounded-lg font-semibold hover:bg-slate-200 cursor-pointer">Next</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-black text-slate-800">Scheme Criteria and Income Limits</h2>
              <div className="flex items-center space-x-2">
                <select value={schemeFilter} onChange={e => setSchemeFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer"><option value="all">All Schemes ({schemes.length})</option><option value="active">Active ({schemes.filter(s => !s.is_disabled).length})</option><option value="disabled">Disabled ({schemes.filter(s => s.is_disabled).length})</option></select>
                <button onClick={() => setActiveTab('rule_builder')} className="px-3 py-1.5 bg-[#006a4e] text-white text-xs font-bold rounded-lg flex items-center space-x-1 cursor-pointer hover:bg-[#00523d] transition"><Plus size={13} /><span>Add Scheme</span></button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
                <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                  {filteredSchemes.map(item => {
                    const isSelected = item.id === selectedSchemeId;
                    const isDisabled = Boolean(item.is_disabled);
                    return (
                      <div key={item.id} onClick={() => setSelectedSchemeId(item.id)} className={`p-3 rounded-xl border transition cursor-pointer ${isSelected ? 'border-[#006a4e] bg-emerald-50/70 ring-1 ring-[#006a4e]' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0"><div className="flex items-center space-x-1.5"><h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>{isDisabled && <span className="px-1.5 rounded text-[9px] font-bold bg-red-100 text-red-700 border border-red-200 shrink-0">DISABLED</span>}</div><p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{item.id}</p></div>
                          <span className="text-xs font-black text-emerald-700 font-mono shrink-0">Rs.{(item.financial_value || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500"><span>{item.criteria?.eligible_communities?.join(', ') || 'All'}</span><span className="font-semibold text-slate-700">{item.criteria?.max_income ? `max Rs.${item.criteria.max_income.toLocaleString('en-IN')}` : 'No cap'}</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
                {editFormData ? (
                  <form onSubmit={handleSaveScheme} className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                      <div><span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-wider block">Editing Scheme Parameters</span><h3 className="text-base font-bold text-slate-900">{editFormData.name}</h3></div>
                      <div className="flex items-center space-x-2">
                        <button type="button" onClick={() => handleToggleActive(editFormData.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${editFormData.is_disabled ? 'bg-emerald-50 text-[#006a4e] border-emerald-300 hover:bg-emerald-100' : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'}`}>{editFormData.is_disabled ? 'Enable Scheme' : 'Disable Scheme'}</button>
                        <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"><Save size={14} /><span>Save Changes</span></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div><label className="block font-bold text-slate-700 mb-1">Scheme Title</label><input type="text" value={editFormData.name || ''} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full rounded-lg border border-slate-300 p-2 focus:border-[#006a4e] outline-none" /></div>
                      <div><label className="block font-bold text-slate-700 mb-1">Annual Benefit (Rs.)</label><input type="number" value={editFormData.financial_value || ''} onChange={e => setEditFormData({ ...editFormData, financial_value: Number(e.target.value) })} className="w-full rounded-lg border border-slate-300 p-2 focus:border-[#006a4e] outline-none" /></div>
                      <div><label className="block font-bold text-slate-700 mb-1">Max Annual Income (Rs.)</label><input type="number" value={editFormData.criteria?.max_income || ''} onChange={e => setEditFormData({ ...editFormData, criteria: { ...(editFormData.criteria || {}), max_income: Number(e.target.value) } })} className="w-full rounded-lg border border-slate-300 p-2 focus:border-[#006a4e] outline-none" /></div>
                      <div><label className="block font-bold text-slate-700 mb-1">Min Board Percentage (%)</label><input type="number" value={editFormData.criteria?.min_percentage || 0} onChange={e => setEditFormData({ ...editFormData, criteria: { ...(editFormData.criteria || {}), min_percentage: Number(e.target.value) } })} className="w-full rounded-lg border border-slate-300 p-2 focus:border-[#006a4e] outline-none" /></div>
                      <div><label className="block font-bold text-slate-700 mb-1">Portal URL</label><input type="text" value={editFormData.portal_url || ''} onChange={e => setEditFormData({ ...editFormData, portal_url: e.target.value })} className="w-full rounded-lg border border-slate-300 p-2 focus:border-[#006a4e] outline-none" /></div>
                      <div><label className="block font-bold text-slate-700 mb-1">Application Deadline</label><input type="text" value={editFormData.deadline || ''} onChange={e => setEditFormData({ ...editFormData, deadline: e.target.value })} className="w-full rounded-lg border border-slate-300 p-2 focus:border-[#006a4e] outline-none" /></div>
                    </div>
                    <div><label className="block text-xs font-bold text-slate-700 mb-1">Description</label><textarea value={editFormData.description || ''} onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} rows={3} className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-[#006a4e] outline-none resize-none" /></div>
                  </form>
                ) : <p className="text-xs text-slate-500 text-center py-12">Select a scheme to edit</p>}
              </div>
            </div>
          </div>
        )}

        {/* RULE BUILDER */}
        {activeTab === 'rule_builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
              <div><span className="text-[10px] font-bold text-[#006a4e] uppercase tracking-widest block mb-1">IF... THEN... Visual Rule Builder</span><h3 className="text-base font-bold text-slate-900">Configure a New Eligibility Rule</h3><p className="text-xs text-slate-500 mt-1">Define conditions and benefits without editing code.</p></div>
              <form onSubmit={handleAddRuleFromBuilder} className="space-y-4 text-xs">
                <div><label className="block font-bold text-slate-700 mb-1">Rule / Scheme Name</label><input type="text" value={builderCondition.name} onChange={e => setBuilderCondition(p => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#006a4e] outline-none" /></div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
                  <p className="text-[11px] font-black text-blue-800 uppercase tracking-wider">IF Conditions</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block font-semibold text-slate-600 mb-1">Community</label><select value={builderCondition.community} onChange={e => setBuilderCondition(p => ({ ...p, community: e.target.value }))} className="w-full rounded-lg border border-slate-300 p-2 focus:border-[#006a4e] outline-none cursor-pointer"><option>SC</option><option>ST</option><option>BC</option><option>BCM</option><option>MBC</option><option>OC</option><option>SCC</option><option>ALL</option></select></div>
                    <div><label className="block font-semibold text-slate-600 mb-1">Gender</label><select value={builderCondition.gender} onChange={e => setBuilderCondition(p => ({ ...p, gender: e.target.value }))} className="w-full rounded-lg border border-slate-300 p-2 focus:border-[#006a4e] outline-none cursor-pointer"><option value="any">any</option><option value="female">female</option><option value="male">male</option></select></div>
                    <div><label className="block font-semibold text-slate-600 mb-1">Max Income (Rs.)</label><input type="number" value={builderCondition.maxIncome} onChange={e => setBuilderCondition(p => ({ ...p, maxIncome: e.target.value }))} className="w-full rounded-lg border border-slate-300 p-2 focus:border-[#006a4e] outline-none" /></div>
                    <div><label className="block font-semibold text-slate-600 mb-1">Min Board %</label><input type="number" value={builderCondition.minPercentage} onChange={e => setBuilderCondition(p => ({ ...p, minPercentage: e.target.value }))} className="w-full rounded-lg border border-slate-300 p-2 focus:border-[#006a4e] outline-none" /></div>
                    <div className="col-span-2"><label className="block font-semibold text-slate-600 mb-1">Eligible Degree</label><input type="text" value={builderCondition.degree} onChange={e => setBuilderCondition(p => ({ ...p, degree: e.target.value }))} className="w-full rounded-lg border border-slate-300 p-2 focus:border-[#006a4e] outline-none" /></div>
                    <div className="col-span-2 flex gap-4"><label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={builderCondition.govtSchoolOnly} onChange={e => setBuilderCondition(p => ({ ...p, govtSchoolOnly: e.target.checked }))} className="accent-[#006a4e]" /><span>Govt School Only</span></label><label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={builderCondition.firstGraduateOnly} onChange={e => setBuilderCondition(p => ({ ...p, firstGraduateOnly: e.target.checked }))} className="accent-[#006a4e]" /><span>First Graduate Only</span></label></div>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100"><p className="text-[11px] font-black text-emerald-800 uppercase tracking-wider mb-2">THEN Benefits</p><div><label className="block font-semibold text-slate-600 mb-1">Annual Benefit (Rs.)</label><input type="number" value={builderCondition.benefitAmount} onChange={e => setBuilderCondition(p => ({ ...p, benefitAmount: e.target.value }))} className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-[#006a4e] outline-none" /></div></div>
                <button type="submit" className="w-full py-2.5 bg-[#006a4e] hover:bg-[#00523d] text-white text-xs font-black rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"><Zap size={14} className="text-amber-300" /><span>Add Rule to Decision Engine</span></button>
              </form>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Live Preview</span><h3 className="text-base font-bold text-slate-900">Rule Summary</h3></div>
              <div className="bg-[#0f2942] text-white rounded-xl p-5 font-mono text-xs space-y-1.5">
                <p className="text-emerald-400 font-black">// Generated Eligibility Rule</p>
                <p><span className="text-amber-300">IF</span> student.community == <span className="text-emerald-300">"{builderCondition.community}"</span></p>
                <p>   <span className="text-amber-300">AND</span> student.gender == <span className="text-emerald-300">"{builderCondition.gender}"</span></p>
                <p>   <span className="text-amber-300">AND</span> student.income &lt;= <span className="text-blue-300">Rs.{Number(builderCondition.maxIncome).toLocaleString('en-IN')}</span></p>
                <p>   <span className="text-amber-300">AND</span> student.board_pct &gt;= <span className="text-blue-300">{builderCondition.minPercentage}%</span></p>
                {builderCondition.govtSchoolOnly && <p>   <span className="text-amber-300">AND</span> student.school_type == <span className="text-emerald-300">"government"</span></p>}
                {builderCondition.firstGraduateOnly && <p>   <span className="text-amber-300">AND</span> student.is_first_graduate == <span className="text-emerald-300">true</span></p>}
                <p><span className="text-amber-300">THEN</span></p>
                <p>   student.grant(<span className="text-blue-300">Rs.{Number(builderCondition.benefitAmount).toLocaleString('en-IN')}</span>)</p>
                <p>   scheme.name = <span className="text-emerald-300">"{builderCondition.name}"</span></p>
              </div>
              <div className="space-y-2"><p className="text-xs font-bold text-slate-700">Estimated Impact</p><div className="grid grid-cols-2 gap-3"><div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-lg font-black text-slate-900">~2,340</p><p className="text-[11px] text-slate-500">Eligible Students</p></div><div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-lg font-black text-emerald-700">Rs.{(2340 * Number(builderCondition.benefitAmount)/10000000).toFixed(1)}Cr</p><p className="text-[11px] text-slate-500">Annual Budget</p></div></div></div>
            </div>
          </div>
        )}

        {/* CONFLICTS */}
        {activeTab === 'conflicts' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center space-x-3 mb-4"><div className="p-2.5 bg-amber-50 rounded-xl"><AlertTriangle size={18} className="text-amber-600" /></div><div><h3 className="text-sm font-black text-slate-900">Mutual Exclusivity Conflict Matrix</h3><p className="text-xs text-slate-500">Schemes that cannot be claimed simultaneously by the same student</p></div></div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead><tr><th className="text-left py-2 pr-4 font-bold text-slate-600 border-b border-slate-200">Scheme</th>{schemes.slice(0, 6).map(s => (<th key={s.id} className="py-2 px-2 font-bold text-slate-600 border-b border-slate-200 text-center"><div className="truncate max-w-20 text-[10px]" title={s.name}>{s.name.split(' ').slice(0,2).join(' ')}</div></th>))}</tr></thead>
                  <tbody>
                    {schemes.slice(0, 6).map((rowScheme, ri) => (
                      <tr key={rowScheme.id} className={ri % 2 === 0 ? 'bg-slate-50/40' : ''}>
                        <td className="py-2 pr-4 font-semibold text-slate-800 truncate max-w-48">{rowScheme.name}</td>
                        {schemes.slice(0, 6).map((colScheme, ci) => {
                          const isConflict = ri !== ci && ((rowScheme.mutually_exclusive_with || []).includes(colScheme.id) || (colScheme.mutually_exclusive_with || []).includes(rowScheme.id));
                          const isSelf = ri === ci;
                          return (<td key={colScheme.id} className="py-2 px-2 text-center"><div className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center text-[10px] font-black ${isSelf ? 'bg-slate-200 text-slate-500' : isConflict ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>{isSelf ? '-' : isConflict ? 'X' : 'OK'}</div></td>);
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-4 text-[11px] text-slate-500">
                <div className="flex items-center space-x-1.5"><div className="w-5 h-5 bg-emerald-50 border border-emerald-100 rounded flex items-center justify-center text-emerald-700 font-black text-[10px]">OK</div><span>Compatible</span></div>
                <div className="flex items-center space-x-1.5"><div className="w-5 h-5 bg-red-100 border border-red-200 rounded flex items-center justify-center text-red-700 font-black text-[10px]">X</div><span>Mutually Exclusive</span></div>
              </div>
            </div>
          </div>
        )}

        {/* FRAUD */}
        {activeTab === 'fraud_prevention' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
              <div className="flex items-center space-x-3"><div className="p-2.5 bg-red-50 rounded-xl"><Lock size={18} className="text-red-600" /></div><div><h3 className="text-sm font-black text-slate-900">Fraud and Double Claim Audit</h3><p className="text-xs text-slate-500">Cross-verify Aadhaar, bank, NPCI, and AISHE to detect dual-subsidy fraud</p></div></div>
              <form onSubmit={handleSimulateFraudCheck} className="space-y-4 text-xs">
                {[{ label: 'Aadhaar Number (Tokenized)', key: 'aadhaarNumber' }, { label: 'Bank Account (DBT Seeded)', key: 'bankAccount' }, { label: 'College AISHE Code', key: 'collegeAishe' }].map(f => (
                  <div key={f.key}><label className="block font-bold text-slate-700 mb-1">{f.label}</label><input type="text" value={fraudQuery[f.key]} onChange={e => setFraudQuery(p => ({ ...p, [f.key]: e.target.value }))} className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-red-500 outline-none font-mono" /></div>
                ))}
                <button type="submit" disabled={isAuditing} className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-black rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer">
                  {isAuditing ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}
                  <span>{isAuditing ? 'Running cross-system audit...' : 'Run Cross-Portal Fraud Audit'}</span>
                </button>
              </form>
            </div>
            <div>
              {fraudAuditResult ? (
                <div className={`bg-white rounded-2xl border-2 ${fraudAuditResult.verdict === 'INTERCEPT RECOMMENDED' ? 'border-red-400' : 'border-emerald-400'} shadow-xs p-6 space-y-4`}>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${fraudAuditResult.verdict === 'INTERCEPT RECOMMENDED' ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                    {fraudAuditResult.verdict === 'INTERCEPT RECOMMENDED' ? <AlertTriangle size={16} className="text-red-600 shrink-0" /> : <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                    <span className={`text-xs font-black ${fraudAuditResult.verdict === 'INTERCEPT RECOMMENDED' ? 'text-red-700' : 'text-emerald-700'}`}>VERDICT: {fraudAuditResult.verdict}</span>
                  </div>
                  <div className="space-y-3 text-xs">
                    {[{ label: 'Aadhaar Vault', val: fraudAuditResult.aadhaarStatus }, { label: 'NPCI / DBT', val: fraudAuditResult.npciDbtStatus }, { label: 'Institution', val: fraudAuditResult.institutionVerification }].map(item => (
                      <div key={item.label} className="bg-slate-50 rounded-xl p-3"><p className="font-bold text-slate-700 mb-0.5">{item.label}</p><p className="text-slate-600">{item.val}</p></div>
                    ))}
                    {fraudAuditResult.duplicateClaimsDetected.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2"><p className="font-black text-red-700 text-[11px] uppercase tracking-wider">Duplicate Claims Detected</p>{fraudAuditResult.duplicateClaimsDetected.map((c, i) => (<div key={i} className="bg-white rounded-lg p-2.5 border border-red-100 space-y-1"><p className="font-bold text-slate-900">{c.schemeName}</p><p className="text-slate-600">{c.portal} - {c.applicationNo}</p><p className="text-red-700 font-bold">{c.conflictWarning}</p></div>))}</div>
                    )}
                    <div className="bg-slate-900 text-slate-300 rounded-xl p-3 space-y-1 font-mono"><p className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">Action Plan</p><p className="text-[11px]">{fraudAuditResult.actionPlan}</p></div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-10 text-center"><div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Lock size={24} className="text-slate-400" /></div><p className="text-xs font-bold text-slate-500">Run a fraud audit to see cross-system verification results</p><p className="text-[11px] text-slate-400 mt-1">Checks NSP, PFMS, AISHE and NPCI Aadhaar seeding databases</p></div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
