import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Compass, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Building2, 
  Landmark, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  PhoneCall,
  ExternalLink,
  Award,
  Zap,
  TrendingUp,
  Laptop
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

export default function HomePage({ 
  onStartMatcher, 
  onInjectPersona, 
  onViewSchemes, 
  onOpenAuth,
  currentLang = 'en'
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // AI Prediction Quick Widget State (Handwritten Note Item #7)
  const [predCommunity, setPredCommunity] = useState('BC');
  const [predGender, setPredGender] = useState('female');
  const [predIncome, setPredIncome] = useState(120000);
  const [predFirstGrad, setPredFirstGrad] = useState(true);
  const [predGovtSchool, setPredGovtSchool] = useState(true);
  const [predLoading, setPredLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    setPredLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/predict-entitlement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          community: predCommunity,
          gender: predGender,
          annual_income: predIncome,
          board_percentage: 85.0,
          schooling_type: predGovtSchool ? 'tn_govt_school_6_to_12' : 'private',
          is_first_graduate: predFirstGrad,
          current_course: 'Engineering'
        })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error("Prediction error", err);
    } finally {
      setPredLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-300">
      
      {/* 1. HERO BANNER - INSTITUTIONAL, SPLIT-LAYOUT WITH AUTHENTIC STUDENT PHOTOGRAPHY */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white shadow-2xl border border-emerald-800/40">
        
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Official Policy Text & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Official Seal / Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{t.hero_badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {t.hero_title}
              </h1>

              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
                {t.hero_subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={onStartMatcher}
                  className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-lg flex items-center justify-center space-x-2 text-sm cursor-pointer"
                >
                  <Compass size={18} />
                  <span>{t.btn_check_eligibility}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={onViewSchemes}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition border border-white/20 text-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <FileText size={18} />
                  <span>{t.btn_browse_schemes}</span>
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                  <div className="text-[11px]">
                    <strong className="block text-white font-bold">100% Legal</strong>
                    <span className="text-emerald-200/70">No double-claims</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Landmark size={18} className="text-emerald-400 shrink-0" />
                  <div className="text-[11px]">
                    <strong className="block text-white font-bold">State & Central</strong>
                    <span className="text-emerald-200/70">TNeGA + NSP</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={18} className="text-emerald-400 shrink-0" />
                  <div className="text-[11px]">
                    <strong className="block text-white font-bold">All 38 Districts</strong>
                    <span className="text-emerald-200/70">Rural focus</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Award size={18} className="text-emerald-400 shrink-0" />
                  <div className="text-[11px]">
                    <strong className="block text-white font-bold">e-Sevai Ready</strong>
                    <span className="text-emerald-200/70">PDF roadmap</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Authentic Human Student Photo Banner (Generated Photo Reference) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group bg-slate-900">
                <img 
                  src="/hero_students.jpg" 
                  alt="Tamil Nadu college students on campus" 
                  className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-102 transition duration-500"
                  onError={(e) => {
                    // Fallback to stylized card if image is loading
                    e.target.style.display = 'none';
                  }}
                />
                
                {/* Floating Institutional Badge */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 text-left">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold text-white tracking-wide uppercase">
                      Higher Education Welfare Beneficiaries
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Supporting students across Anna University, Government Engineering Colleges, Arts & Science Institutes in Tamil Nadu.
                  </p>
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-300 font-semibold">
                    <span>18+ Active Welfare Schemes</span>
                    <span>₹37,000+ Average Payout</span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-emerald-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-400/40 text-[10px] font-bold text-white">
                  Tamil Nadu e-Governance
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 3. INSTANT AI PREDICTION FORECAST (Handwritten Note Item #7) */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Zap size={18} className="text-amber-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {t.ai_predictor_title}
                </h2>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                  Instant Forecast
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {t.ai_predictor_desc}
              </p>
            </div>

            <button
              onClick={onStartMatcher}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1 transition"
            >
              <span>Full Application Flow</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <form onSubmit={handlePredict} className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Community</label>
              <select
                value={predCommunity}
                onChange={(e) => setPredCommunity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="BC">BC (Backward Class)</option>
                <option value="MBC">MBC / DNC</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="OC">OC (General)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gender</label>
              <select
                value={predGender}
                onChange={(e) => setPredGender(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="female">Female (பெண்)</option>
                <option value="male">Male (ஆண்)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Annual Family Income</label>
              <select
                value={predIncome}
                onChange={(e) => setPredIncome(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value={120000}>Under ₹1.5 Lakhs</option>
                <option value={220000}>₹1.5L – ₹2.5 Lakhs</option>
                <option value={400000}>₹2.5L – ₹4.5 Lakhs</option>
                <option value={700000}>Above ₹4.5 Lakhs</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">First Graduate?</label>
              <select
                value={predFirstGrad ? 'yes' : 'no'}
                onChange={(e) => setPredFirstGrad(e.target.value === 'yes')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="yes">Yes (முதல் பட்டதாரி)</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-end">
              <button
                type="submit"
                disabled={predLoading}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                {predLoading ? (
                  <span>Predicting...</span>
                ) : (
                  <>
                    <TrendingUp size={14} />
                    <span>Run AI Forecast</span>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Prediction Result Display */}
          {prediction && (
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                    Forecast Result
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2">
                    <span>₹{prediction.estimated_annual_entitlement.toLocaleString('en-IN')}</span>
                    <span className="text-xs font-normal text-slate-400">/ estimated annual grants</span>
                  </div>
                </div>

                <button
                  onClick={onStartMatcher}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <span>Verify with Full Solver →</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-300">Likely Qualifying Schemes:</span>
                <div className="flex flex-wrap gap-2">
                  {prediction.likely_schemes.map((s, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-emerald-300 rounded-lg text-xs flex items-center space-x-1"
                    >
                      <CheckCircle2 size={11} className="text-emerald-400" />
                      <span>{s.name} (₹{s.financial_value.toLocaleString('en-IN')})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 4. HOW THE OPTIMIZER WORKS (3 HUMAN STEPS) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
            {t.how_it_works_badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.how_it_works_title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            No more browsing 40-page PDFs or risking disqualification from accidental double-claiming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">{t.step1_title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.step1_desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-sm mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">{t.step2_title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.step2_desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">{t.step3_title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.step3_desc}
            </p>
          </div>

        </div>
      </section>

      {/* 5. KEY SCHEMES SHOWCASE (INCORPORATING PDF SCHEMES) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
              Coverage & Schemes
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              {t.featured_schemes_title}
            </h2>
          </div>
          <button
            onClick={onViewSchemes}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>{t.btn_browse_schemes}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Pudhumai Penn */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ₹12,000 / Year
              </span>
              <span className="text-[11px] text-slate-400">Girls Only</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Pudhumai Penn Thittam</h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Monthly stipend of ₹1,000 directly into student bank accounts for girl students who studied Classes 6–12 in TN Government Schools.
            </p>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
              <span>Portal: Penkalvi</span>
              <span className="text-emerald-700 font-semibold">100% Guaranteed</span>
            </div>
          </div>

          {/* Vetri Laptop Scheme (PDF) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                ₹30,000 Laptop
              </span>
              <span className="text-[11px] text-slate-400">College Students</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Vetri Laptop Scheme</h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Tamil Nadu State Government allocation of ₹2,000 crore providing free high-performance laptops to Arts, Science, and Engineering college students.
            </p>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
              <span>ELCOT Distribution</span>
              <span className="text-indigo-700 font-semibold">In-Kind Entitlement</span>
            </div>
          </div>

          {/* Tamil Nadu First Graduate */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                ₹25,000 / Year
              </span>
              <span className="text-[11px] text-slate-400">All Communities</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">TN First Graduate Concession</h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Complete tuition fee waiver of ₹25,000 per year for students who are the first in their immediate family to earn a degree.
            </p>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
              <span>Portal: TNEA Counseling</span>
              <span className="text-purple-700 font-semibold">Tuition Waiver</span>
            </div>
          </div>

          {/* Post-Matric SC/ST */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                ₹50,000 / Year
              </span>
              <span className="text-[11px] text-slate-400">SC / ST / SCC</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Post-Matric Scholarship (ADW)</h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Full tuition fee reimbursement and maintenance allowance for SC/ST students with family income under ₹2.5 Lakhs.
            </p>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
              <span>Portal: TN SSP e-District</span>
              <span className="text-blue-700 font-semibold">ADW Dept</span>
            </div>
          </div>

          {/* Vettri Payana Thittam (Free Bus Travel) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ₹10,000 Savings
              </span>
              <span className="text-[11px] text-slate-400">Free Commute</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Vettri Payana Thittam (Bus)</h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              State-wide zero-fare public bus transport across TNSTC & MTC routes for female and transgender higher education students.
            </p>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
              <span>TNSTC Smart Card</span>
              <span className="text-emerald-700 font-semibold">Commute Waiver</span>
            </div>
          </div>

          {/* AICTE Pragati */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                ₹50,000 / Year
              </span>
              <span className="text-[11px] text-slate-400">AICTE Colleges</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">AICTE Pragati for Girls</h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Central scholarship grant of ₹50,000 per year for meritorious girls pursuing Degree or Diploma in Engineering courses.
            </p>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
              <span>Portal: scholarships.gov.in</span>
              <span className="text-indigo-700 font-semibold">National Quota</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. REAL STUDENT EXPERIENCES */}
      <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            Real Student Experiences
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            {t.testimonials_title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
              "I studied in a government higher secondary school in Pudukkottai. Nobody in my family knew I could claim both the First Graduate fee concession and the Pudhumai Penn monthly stipend together. This system gave me the official roadmap in seconds."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                P
              </div>
              <div>
                <strong className="block text-xs text-slate-900 font-bold">Priya M.</strong>
                <span className="text-[11px] text-slate-500">1st Year B.E. Computer Science, Anna University</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
              "I almost applied for both Central CSSS and the State scholarship on the National Portal. The advisor warned me about the mutual exclusivity rule and selected the state package that gave me ₹25,000 more with zero rejection risk."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                K
              </div>
              <div>
                <strong className="block text-xs text-slate-900 font-bold">Karthikeyan R.</strong>
                <span className="text-[11px] text-slate-500">2nd Year B.Tech, Coimbatore</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION - BOTTOM BANNER */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">
            {t.cta_title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            No registration fee. No agent commission. 100% transparent algorithmic matching for students across Tamil Nadu.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartMatcher}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md cursor-pointer"
            >
              {t.cta_btn}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
