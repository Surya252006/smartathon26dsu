import React, { useState } from 'react';
import { 
  X, 
  Landmark, 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Building2,
  Bell
} from 'lucide-react';

const OFFICIAL_NOTICES = [
  {
    id: 'GO-47-2026',
    category: 'go',
    badge: 'G.O. (Ms) No. 47/2026',
    title: 'Revision of First Graduate Tuition Concession & Direct Government College Fee Reimbursement',
    titleTa: 'முதல் பட்டதாரி கல்விக் கட்டணச் சலுகை மற்றும் நேரடி அரசு கல்லூரி கட்டணத் திருப்பிச் செலுத்துதல் அரசாணை',
    department: 'Department of Higher Education, Govt of Tamil Nadu',
    date: '15 August 2026',
    status: 'Active Policy',
    highlight: 'Covers up to ₹25,000/yr for Engineering & Medical courses via Single Window Counseling without income cap.',
    downloadName: 'GO_Ms_47_First_Graduate_2026.pdf'
  },
  {
    id: 'NOT-DEADLINE-2026',
    category: 'deadline',
    badge: 'IMPORTANT DEADLINE',
    title: 'Moovalur Ramamirtham Pudhumai Penn & Tamil Pudhalvan Phase-III Registration Window',
    titleTa: 'புதுமைப் பெண் & தமிழ் புதல்வன் கட்டம்-3 விண்ணப்பங்களுக்கான கடைசி தேதி அறிவிப்பு',
    department: 'Social Welfare & Women Empowerment Department',
    date: '31 October 2026',
    status: 'Closing Soon',
    highlight: 'Last date for 1st year UG students who studied 6th to 12th in TN Government schools to submit UDISE / EMIS verification.',
    downloadName: 'Pudhumai_Penn_Phase3_Circular.pdf'
  },
  {
    id: 'NSP-CSSS-2026',
    category: 'deadline',
    badge: 'CENTRAL PORTAL',
    title: 'National Scholarship Portal (NSP 2.0) Central Sector Scheme of Scholarship (CSSS) 2026-27',
    titleTa: 'மத்திய அரசு கல்வி உதவித்தொகை (NSP 2.0 - CSSS) 2026-27 விண்ணப்பங்கள் தொடக்கம்',
    department: 'Ministry of Education, Government of India',
    date: '15 November 2026',
    status: 'Open for Fresh & Renewal',
    highlight: 'Eligible for students scoring above 80th percentile in 12th Board examinations with annual family income under ₹4.5 Lakh.',
    downloadName: 'NSP_CSSS_Guidelines_2026.pdf'
  },
  {
    id: 'CIRC-AADHAAR-NPCI',
    category: 'guideline',
    badge: 'DBT MANDATE',
    title: 'Mandatory Aadhaar-NPCI Seeding in Bank Accounts for Error-Free Direct Benefit Transfer (DBT)',
    titleTa: 'உதவித்தொகை தடையின்றி வங்கி கணக்கில் வரவு வைக்க ஆதார்-NPCI இணைப்பு கட்டாயம்',
    department: 'Tamil Nadu e-Governance Agency (TNeGA) & Public Financial Management System',
    date: '01 September 2026',
    status: 'Mandatory Action',
    highlight: 'Students must verify bank seeding status via UIDAI / NPCI portal to avoid treasury rejection of monthly ₹1,000 stipends.',
    downloadName: 'NPCI_Aadhaar_DBT_Seeding_Guide.pdf'
  },
  {
    id: 'GO-118-ADW',
    category: 'go',
    badge: 'G.O. (Ms) No. 118/2026',
    title: 'Centrally Sponsored Post-Matric Scholarship for SC/ST Students - Online Free Education Scheme',
    titleTa: 'ஆதிதிராவிடர் & பழங்குடியினர் போஸ்ட்-மெட்ரிக் கல்வி உதவித்தொகை அரசாணை',
    department: 'Adi Dravidar & Tribal Welfare Department',
    date: '20 July 2026',
    status: 'Active Policy',
    highlight: '100% compulsory non-refundable fees waived for government quota students with family income under ₹2.50 Lakh.',
    downloadName: 'GO_118_ADW_PostMatric.pdf'
  }
];

export default function NoticeBoardModal({ isOpen, onClose, currentLang = 'en' }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredNotices = OFFICIAL_NOTICES.filter(notice => {
    const matchesFilter = activeFilter === 'all' || notice.category === activeFilter;
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notice.titleTa.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notice.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Bell size={14} />
            <span>Official Government Gazette & Notice Board</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold">
            {currentLang === 'ta' ? 'அதிகாரப்பூர்வ அரசாணைகள் & சுற்றறிக்கைகள்' : 'Government Orders (G.O.) & Official Circulars'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {currentLang === 'ta'
              ? 'தமிழ்நாடு உயர்கல்வித் துறை மற்றும் சமூக நலத்துறையின் நடப்பு அரசாணைகள், உதவித்தொகை காலக்கெடு மற்றும் சுற்றறிக்கைகள்.'
              : 'Official publications, circulars, and active welfare policy amendments released by the Government of Tamil Nadu.'}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex space-x-1.5 w-full sm:w-auto text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeFilter === 'all' 
                  ? 'bg-[#006a4e] text-white shadow-xs' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Notices
            </button>
            <button
              onClick={() => setActiveFilter('deadline')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeFilter === 'deadline' 
                  ? 'bg-[#006a4e] text-white shadow-xs' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Deadlines (கடைசி தேதிகள்)
            </button>
            <button
              onClick={() => setActiveFilter('go')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeFilter === 'go' 
                  ? 'bg-[#006a4e] text-white shadow-xs' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Government Orders (G.O.)
            </button>
            <button
              onClick={() => setActiveFilter('guideline')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeFilter === 'guideline' 
                  ? 'bg-[#006a4e] text-white shadow-xs' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Guidelines
            </button>
          </div>

          <div className="relative w-full sm:w-60 text-xs">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006a4e]"
            />
          </div>
        </div>

        {/* Notices Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredNotices.map((notice) => (
            <div 
              key={notice.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#006a4e]/50 hover:shadow-xs transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border ${
                    notice.category === 'deadline' 
                      ? 'bg-amber-50 text-amber-900 border-amber-300' 
                      : notice.category === 'go' 
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                        : 'bg-blue-50 text-blue-900 border-blue-300'
                  }`}>
                    {notice.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {notice.date}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#006a4e] transition leading-snug">
                  {currentLang === 'ta' && notice.titleTa ? notice.titleTa : notice.title}
                </h3>

                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {notice.highlight}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                <span className="flex items-center">
                  <Building2 size={12} className="mr-1 text-slate-400" />
                  {notice.department}
                </span>

                <button
                  type="button"
                  onClick={() => alert(`Downloading official gazette notification: ${notice.downloadName}`)}
                  className="flex items-center space-x-1 font-semibold text-[#006a4e] hover:underline cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Official Circular (PDF)</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <span>Published by Directorate of Collegiate Education, Chennai 600 005.</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
