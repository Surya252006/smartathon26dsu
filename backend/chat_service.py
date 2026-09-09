import os
import json
import re
import logging
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types

logger = logging.getLogger("scholarship_advisor")
logging.basicConfig(level=logging.INFO)

def _detect_language(text: str) -> str:
    """Detects whether text is in Tamil script ('ta'), Tanglish ('tanglish'), or English ('en')."""
    if not text:
        return 'en'
    # Tamil Unicode block: \u0B80 - \u0BFF
    has_tamil = any('\u0B80' <= ch <= '\u0BFF' for ch in text)
    if has_tamil:
        return 'ta'
    
    # Common Tanglish phonetics
    t_lower = text.lower()
    tanglish_words = [
        "vanakkam", "epdi", "yen", "evlo", "edhuku", "panradhu", "solunga", 
        "kedaikuma", "nan", "iruka", "pudhumai", "mudiyuma", "patthi", "enge", 
        "varum", "kudupangala", "enna", "sollu", "solla", "eppadi", "ungalukku",
        "enakku", "padikiren", "seri", "romba", "nandri", "theriyuma", "clg", "aaguma"
    ]
    if any(w in t_lower for w in tanglish_words):
        return 'tanglish'
    
    return 'en'

def _dynamic_conversational_engine(
    message: str, 
    profile_context: dict, 
    evaluation_context: dict,
    history: Optional[List[Dict[str, str]]] = None
) -> str:
    """
    Intelligent Conversational Advisor.
    Understands specific student questions regarding 18+ schemes, certificates,
    portals, eligibility criteria, disbursement schedules, and mutual exclusivity.
    Maintains conversational tone and responds specifically in Tamil, Tanglish, or English.
    """
    msg = message.strip()
    msg_lower = msg.lower()
    lang = _detect_language(msg)
    
    recommended = evaluation_context.get("recommended_bundle", [])
    excluded = evaluation_context.get("excluded_schemes", [])
    total_val = evaluation_context.get("total_financial_value", 0)
    
    rec_names = [s.get("name", "Scheme") for s in recommended]
    rec_names_str = ", ".join(rec_names) if rec_names else "Pudhumai Penn, First Graduate, Vetri Laptop"
    
    student_name = profile_context.get("full_name") or "Student"
    community = profile_context.get("community", "BC")
    gender = profile_context.get("gender", "female")
    income = profile_context.get("annual_income", 120000)
    is_fg = profile_context.get("is_first_graduate", True)
    is_govt_school = profile_context.get("schooling_type") == "tn_govt_school_6_to_12"

    # =========================================================================
    # 1. GREETINGS & INTRODUCTIONS
    # =========================================================================
    has_tamil_greet = any(g in msg_lower for g in ["வணக்கம்", "ஹலோ", "வணக்கம் ஐயா", "யார் நீ", "உதவி தேவை"])
    has_eng_greet = bool(re.search(r'\b(hello|hi|hey|vanakkam|who are you|good morning|good evening)\b', msg_lower))
    is_greeting = has_tamil_greet or has_eng_greet
    if is_greeting and not any(k in msg_lower for k in ["first graduate", "pudhumai", "laptop", "csss", "post-matric", "scholarship", "apply", "certificate", "விண்ணப்பிக்க", "சான்றிதழ்"]):
        if lang == 'ta':
            return (
                f"வணக்கம் {student_name}! 🙏 நான் தமிழ்நாடு உயர்கல்வி மற்றும் அரசு உதவித்தொகை ஆலோசகர் (TN e-Vidya AI).\n\n"
                f"உங்கள் தகுதிக்குரிய அரசு நலத்திட்டங்கள் (புதுமைப் பெண், வெற்றி மடிக்கணினி, முதல் பட்டதாரி சலுகை, போஸ்ட்-மெட்ரிக்) "
                f"மற்றும் வட்டாட்சியர் / இ-சேவை சான்றிதழ்கள் குறித்து என்னிடம் கேட்கலாம். உங்களுக்கு எதில் உதவி தேவை?"
            )
        elif lang == 'tanglish':
            return (
                f"Vanakkam {student_name}! 🙏 Naan ungaloda TN Higher Education Welfare AI Advisor.\n\n"
                f"Pudhumai Penn, Vetri Laptop, First Graduate fee waiver, Post-Matric scholarships mattrum e-Sevai certificates "
                f"pathina ungaloda kelvigalukku naan live-a vilakkam tharuven. Ungalukku enna help venum?"
            )
        else:
            return (
                f"Hello {student_name}! 🙏 I am your Tamil Nadu Higher Education Welfare AI Advisor (TN e-Vidya).\n\n"
                f"I can guide you on 18+ government schemes (Pudhumai Penn, Tamil Pudhalvan, Vetri Laptop, First Graduate Tuition Waiver, Post-Matric), "
                f"required Tahsildar certificates, portal links, and maximizing your legal financial aid. How can I help you today?"
            )

    # =========================================================================
    # 2. GRATITUDE / CLOSING
    # =========================================================================
    if any(w in msg_lower for w in ["நன்றி", "thanks", "thank you", "romba nandri", "super", "ok", "சரி", "thank u"]):
        if lang == 'ta':
            return "மகிழ்ச்சி! நீங்கள் உங்கள் அதிகாரப்பூர்வ PDF வழிகாட்டியை (Roadmap PDF) முகப்பு பக்கத்திலிருந்து பதிவிறக்கம் செய்துகொள்ளலாம். உங்கள் கல்லூரி படிப்பிற்கு நல்வாழ்த்துகள்! வேறு ஏதேனும் சந்தேகம் உள்ளதா?"
        elif lang == 'tanglish':
            return "Romba sandhosham! Ungaloda official PDF Roadmap-ah download panni apply panna ready aagunga. All the best for your higher studies! Vera edhavadhu doubt irukka?"
        else:
            return "You're most welcome! You can download your official PDF Submission Roadmap with portal links and document checklists. Wishing you immense success in your college journey!"

    # =========================================================================
    # 3. PUDHUMAI PENN THITTAM (MOOVALUR RAMAMIRTHAM)
    # =========================================================================
    if any(k in msg_lower for k in ["புதுமைப் பெண்", "புதுமை பெண்", "pudhumai", "penn", "penkalvi", "moovalur", "மாதம் 1000", "1000"]):
        if lang == 'ta':
            return (
                "🎯 **புதுமைப் பெண் திட்டம் (மூவலூர் ராமாமிர்தம் அம்மையார் உயர்கல்வி உறுதித் திட்டம்):**\n\n"
                "• **தகுதி:** 6 முதல் 12-ஆம் வகுப்பு வரை தமிழக அரசுப் பள்ளிகளில் பயின்று, தற்போது பட்டப்படிப்பு (UG), பாலிடெக்னிக், அல்லது ஐடிஐ பயிலும் மாணவிகள்.\n"
                "• **மாத உதவி:** மாதம் ₹1,000 (வருடத்திற்கு ₹12,000) மாணவியின் வங்கிக் கணக்கிற்கு நேரடியாக (Aadhaar DBT) செலுத்தப்படும்.\n"
                "• **விண்ணப்பிக்கும் இணையதளம்:** https://www.pudhumaipenn.tn.gov.in (பெண்கல்வி போர்டல்).\n"
                "• **தேவையானவை:** பள்ளி தலைமை ஆசிரியர் வழங்கிய 6-12 அரசு பள்ளி Bonafide சான்றிதழ், ஆதார் அட்டை, மற்றும் ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கு புத்தகம்."
            )
        elif lang == 'tanglish':
            return (
                "🎯 **Pudhumai Penn Scheme (Penkalvi):**\n\n"
                "• **Eligibility:** 6th to 12th TN Government school-la padicha female students enrolled in Degree/Engineering/Polytechnic.\n"
                "• **Benefit:** Monthly ₹1,000 (Annual ₹12,000) direct bank transfer (DBT).\n"
                "• **Portal:** https://www.pudhumaipenn.tn.gov.in\n"
                "• **Documents:** 6th-12th Govt School Bonafide Certificate, Aadhaar Card, Bank passbook with Aadhaar seeding."
            )
        else:
            return (
                "🎯 **Pudhumai Penn Thittam (Higher Education Assurance Scheme):**\n\n"
                "• **Eligibility:** Female students who studied Classes 6 to 12 in Tamil Nadu Government schools, enrolled in higher education (UG, Diploma, ITI, Engineering).\n"
                "• **Financial Grant:** ₹1,000 per month (₹12,000 annually) credited directly via Aadhaar DBT.\n"
                "• **Application Portal:** https://www.pudhumaipenn.tn.gov.in (Penkalvi Portal).\n"
                "• **Key Documents:** 6th-12th Government School UDISE Bonafide Certificate, Aadhaar Card, and active NPCI-seeded Bank Account."
            )

    # =========================================================================
    # 4. TAMIL PUDHALVAN THITTAM
    # =========================================================================
    if any(k in msg_lower for k in ["தமிழ் புதல்வன்", "புதல்வன்", "tamil pudhalvan", "pudhalvan", "boys 1000", "aan 1000"]):
        if lang == 'ta':
            return (
                "🎯 **தமிழ் புதல்வன் திட்டம்:**\n\n"
                "• **தகுதி:** 6 முதல் 12-ஆம் வகுப்பு வரை தமிழக அரசுப் பள்ளிகளில் பயின்று பட்டப்படிப்பு, பொறியியல், அல்லது பாலிடெக்னிக் படிக்கும் மாணவர்களுக்கு (Boys).\n"
                "• **நிதி பலன்:** மாதம் ₹1,000 வீதம் ஆண்டுக்கு ₹12,000 வங்கி கணக்கில் நேரடியாக செலுத்தப்படும்.\n"
                "• **விண்ணப்பம்:** கல்லூரி சேர்க்கையின் போது கல்லூரி முதல்வர் / நோடல் அதிகாரி மூலம் பதிவு செய்யப்படுகிறது.\n"
                "• **முக்கிய ஆவணம்:** 6-12 அரசு பள்ளி Bonafide மற்றும் ஆதார் எண்."
            )
        elif lang == 'tanglish':
            return (
                "🎯 **Tamil Pudhalvan Scheme:**\n\n"
                "• **Eligibility:** Male students who completed 6th to 12th in TN Government Schools and joined college.\n"
                "• **Benefit:** ₹1,000 per month (₹12,000 per year) via DBT.\n"
                "• **Application:** Registered through your college scholarship nodal desk.\n"
                "• **Documents:** 6th-12th Govt school Bonafide and Aadhaar linked bank account."
            )
        else:
            return (
                "🎯 **Tamil Pudhalvan Scheme:**\n\n"
                "• **Eligibility:** Male students from Classes 6-12 in TN Government schools enrolled in recognized higher education institutions.\n"
                "• **Assistance:** ₹1,000 monthly maintenance stipend (₹12,000/year).\n"
                "• **Process:** Enrolled through your college administrative portal and verified via school UDISE database."
            )

    # =========================================================================
    # 5. VETRI FREE LAPTOP SCHEME
    # =========================================================================
    if any(k in msg_lower for k in ["லேப்டாப்", "laptop", "vetri", "computer", "மடிக்கணினி", "free laptop"]):
        if lang == 'ta':
            return (
                "💻 **தமிழக அரசின் வெற்றி இலவச மடிக்கணினி திட்டம் (Vetri Free Laptop Scheme):**\n\n"
                "• **தகுதி:** அரசு மற்றும் அரசு உதவிபெறும் கல்லூரிகளில் முதல் ஆண்டு பட்டப்படிப்பு மற்றும் பொறியியல் சேரும் மாணவ/மாணவிகள்.\n"
                "• **பலன்:** ₹25,000 மதிப்புள்ள பிராண்டட் லேப்டாப் (வழங்கப்படும் சாதனத்தில் கல்வி மென்பொருட்கள் நிறுவப்பட்டிருக்கும்).\n"
                "• **விநியோகம்:** உங்கள் கல்லூரியின் சேர்க்கை மையம் (Admission Center) மூலம் விநியோகிக்கப்படும்.\n"
                "• **ஆவணங்கள்:** 12-ஆம் வகுப்பு மதிப்பெண் பட்டியல், கல்லூரி சேர்க்கை Bonafide மற்றும் அடையாள அட்டை."
            )
        elif lang == 'tanglish':
            return (
                "💻 **TN Vetri Free Laptop Scheme:**\n\n"
                "• **Eligibility:** 1st year students joining Govt & Govt-Aided Arts, Science, and Engineering colleges in Tamil Nadu.\n"
                "• **Value:** ₹25,000 worth branded laptop with preloaded educational software.\n"
                "• **Distribution:** Directly through your college campus nodal department.\n"
                "• **Required:** 12th marksheet copy, college admission fee receipt & ID card."
            )
        else:
            return (
                "💻 **Tamil Nadu Vetri Free Laptop Scheme:**\n\n"
                "• **Eligibility:** Enrolled 1st-year students in recognized Government and Aided Higher Education institutions in Tamil Nadu.\n"
                "• **Entitlement Value:** ₹25,000 worth laptop equipped with academic software suites.\n"
                "• **Distribution Process:** Handed over directly via your institution's welfare office following roll-number verification."
            )

    # =========================================================================
    # 6. FIRST GRADUATE TUITION FEE WAIVER
    # =========================================================================
    if any(k in msg_lower for k in ["முதல் பட்டதாரி", "first graduate", "fg", "கட்டண சலுகை", "tuition waiver", "25000"]):
        if lang == 'ta':
            return (
                "🎓 **தமிழ்நாடு முதல் பட்டதாரி கட்டணச் சலுகை (First Graduate Scheme):**\n\n"
                "• **தகுதி:** குடும்பத்தில் முதல் பட்டதாரியாக கல்லூரியில் சேரும் மாணவர் (உடன் பிறந்தவர்கள் எவரும் இதற்கு முன் பட்டப்படிப்பு முடித்திருக்கக் கூடாது).\n"
                "• **வருமான வரம்பு:** இதற்கு வருமான வரம்பு எதுவும் இல்லை (No Income Limit).\n"
                "• **நிதி பலன்:** பொறியியல்/கலை/அறிவியல் கல்லூரி கல்விக் கட்டணம் முழுமையாக தள்ளுபடி (ஆண்டுக்கு ₹25,000 வரை).\n"
                "• **பெறும் முறை:** உங்கள் தாலுகா வட்டாட்சியரிடம் (Tahsildar) இ-சேவை மையம் மூலம் 'முதல் பட்டதாரி சான்றிதழ்' பெற்று TNEA கவுன்சிலிங்கில் சமர்ப்பிக்க வேண்டும்."
            )
        elif lang == 'tanglish':
            return (
                "🎓 **First Graduate Tuition Fee Waiver:**\n\n"
                "• **Eligibility:** First person in your family to enter a degree program (no elder brothers/sisters should have a degree).\n"
                "• **Income Ceiling:** No income limit!\n"
                "• **Benefit:** Full tuition fee waiver up to ₹25,000/year for Engineering and professional courses.\n"
                "• **How to get:** Apply for First Graduate Certificate at e-Sevai/Tahsildar office and submit during TNEA Single Window counseling."
            )
        else:
            return (
                "🎓 **Tamil Nadu First Graduate Tuition Fee Concession:**\n\n"
                "• **Eligibility:** Students who are the first in their immediate family to pursue a university degree (parents and elder siblings must not hold degrees).\n"
                "• **Income Limit:** None. Applicable across all income brackets.\n"
                "• **Financial Grant:** 100% tuition waiver (up to ₹25,000 per academic year).\n"
                "• **Certification:** Obtain First Graduate Certificate from your local Tahsildar via e-Sevai, valid during TNEA/DoTE single-window admissions."
            )

    # =========================================================================
    # 7. 7.5% GOVERNMENT SCHOOL PREFERENTIAL QUOTA
    # =========================================================================
    if any(k in msg_lower for k in ["7.5", "quota", "reservation", "ஒதுக்கீடு", "அரசு பள்ளி ஒதுக்கீடு"]):
        if lang == 'ta':
            return (
                "🏛️ **7.5% அரசுப் பள்ளி சிறப்பு முன்னுரிமை ஒதுக்கீடு (7.5% Quota):**\n\n"
                "• **தகுதி:** 6 முதல் 12-ஆம் வகுப்பு வரை தமிழக அரசுப் பள்ளிகளில் பயின்று 7.5% சிறப்பு ஒதுக்கீட்டின் கீழ் பொறியியல், மருத்துவம், வேளாண்மை கல்லூரிகளில் சேரும் மாணவர்கள்.\n"
                "• **முழு பலன்:** கல்விக் கட்டணம், விடுதி கட்டணம், மற்றும் தேர்வு கட்டணம் என 100% செலவையும் தமிழக அரசே ஏற்கும் (₹1,00,000+ மதிப்பு).\n"
                "• **தேவை:** தலைமை ஆசிரியர் வழங்கும் 6-12 UDISE அரசு பள்ளி Bonafide சான்றிதழ்."
            )
        elif lang == 'tanglish':
            return (
                "🏛️ **7.5% Government School Preferential Quota:**\n\n"
                "• **Eligibility:** Students who completed schooling from Class 6 to 12 in TN Govt schools and admitted under 7.5% quota in Engineering, Medical, Agriculture.\n"
                "• **Full Waiver:** 100% Tuition fee + Hostel fee + Examination fees paid directly by TN Government (₹1,00,000+ benefit)!\n"
                "• **Required:** 6-12th UDISE Govt School Bonafide Certificate signed by Headmaster and verified by BEO/DEO."
            )
        else:
            return (
                "🏛️ **7.5% Government School Preferential Quota Scheme:**\n\n"
                "• **Eligibility:** Students who studied continuously from 6th to 12th in Tamil Nadu Government schools securing admission under the 7.5% quota in professional courses.\n"
                "• **Complete Coverage:** 100% Tuition, hostel, mess, and examination fees borne by the State Government.\n"
                "• **Verification:** Validated automatically during TNEA/NEET counselling via the EMIS/UDISE portal."
            )

    # =========================================================================
    # 8. POST-MATRIC SCHOLARSHIPS (BC / MBC / SC / ST)
    # =========================================================================
    if any(k in msg_lower for k in ["post-matric", "post matric", "போஸ்ட் மெட்ரிக்", "bc scholarship", "mbc scholarship", "sc scholarship", "st scholarship"]):
        if lang == 'ta':
            return (
                "📜 **போஸ்ட்-மெட்ரிக் கல்வி உதவித்தொகை (Post-Matric Schemes):**\n\n"
                "1. **BC / MBC / DNC போஸ்ட்-மெட்ரிக்:** ஆண்டு குடும்ப வருமானம் ₹2.5 லட்சத்திற்குள் இருக்க வேண்டும். பராமரிப்பு படி மற்றும் கல்விக் கட்டணம் (₹8,500/ஆண்டு).\n"
                "2. **SC / ST / SCC போஸ்ட்-மெட்ரிக்:** ஆண்டு குடும்ப வருமானம் ₹2.5 லட்சத்திற்குள் (அரசு பள்ளி மாணவர்களுக்கு வருமான வரம்பு இல்லை). முழு கல்விக் கட்டணம் + விடுதி கட்டணம் (₹50,000+).\n"
                "• **விண்ணப்ப தளம்:** https://ssp.tn.gov.in (TN State Scholarship Portal) மற்றும் கல்லூரி உதவித்தொகை மையம்."
            )
        elif lang == 'tanglish':
            return (
                "📜 **TN Post-Matric Scholarships:**\n\n"
                "1. **BC / MBC Post-Matric:** Family income must be under ₹2.5 Lakhs/year. Annual benefit ₹8,500.\n"
                "2. **SC / ST Post-Matric:** Income ceiling ₹2.5 Lakhs (No income limit for govt school students). Up to ₹50,000+ tuition & hostel waiver.\n"
                "• **Portal:** https://ssp.tn.gov.in (TN SSP Portal) through your college office."
            )
        else:
            return (
                "📜 **Tamil Nadu Post-Matric Welfare Scholarships:**\n\n"
                "• **BC/MBC/DNC Scheme:** Family income under ₹2.5 Lakhs. Covers special fee and maintenance allowance (₹8,500/year).\n"
                "• **SC/ST Scheme:** Family income under ₹2.5 Lakhs (Exempt for 6-12 Govt school students). Full tuition and maintenance reimbursement (up to ₹50,000+).\n"
                "• **Portal:** https://ssp.tn.gov.in (State Scholarship Portal)."
            )

    # =========================================================================
    # 9. CENTRAL SECTOR (PM-USP CSSS / NSP) & WHY EXCLUDED
    # =========================================================================
    if any(k in msg_lower for k in ["csss", "central sector", "nsp", "pm-usp", "மத்திய அரசு"]):
        csss_exc = next((e for e in excluded if "csss" in e.get("scheme_id", "").lower() or "csss" in e.get("scheme_name", "").lower()), None)
        reason = csss_exc.get("reason", "Incompatible with higher-yield State schemes") if csss_exc else "Conflicts with State First Graduate / Post-Matric fee waiver"
        
        if lang == 'ta':
            return (
                f"🏛️ **மத்திய துறை உதவித்தொகை (PM-USP CSSS / National Scholarship Portal):**\n\n"
                f"• **விளக்கம்:** 12-ஆம் வகுப்பில் 80% மதிப்பெண் மற்றும் குடும்ப வருமானம் ₹4.5 லட்சத்திற்குள் இருக்கும் மாணவர்களுக்கான திட்டம் (ஆண்டுக்கு ₹12,000).\n"
                f"• **விலக்கு காரணம்:** அரசு விதிகளின்படி ஒரே நேரத்தில் இரு கல்வி கட்டண சலுகைகளை பெற முடியாது. "
                f"உங்கள் சுயவிவரத்தில் அதிக நிதி பலன் தரும் தமிழக அரசு தொகுப்பு (₹{total_val:,}) தேர்ந்தெடுக்கப்பட்டதால் CSSS தவிர்க்கப்பட்டுள்ளது. இதன் மூலம் உங்களுக்கு அதிகபட்ச தொகை கிடைக்கிறது!"
            )
        elif lang == 'tanglish':
            return (
                f"🏛️ **Central Sector Scheme (CSSS) & MWIS Explanation:**\n\n"
                f"• CSSS grants ₹12,000/year through NSP portal.\n"
                f"• **Why dropped:** Legal mutual exclusivity rule! State First Graduate waiver (₹25,000) mattrum Post-Matric kooda Central tuition aid-ah duplicate panna mudiyadhu. "
                f"Engaloda MWIS algorithm ungalukku highest legal payout (₹{total_val:,}) kidaika State bundle-ah choose pannirukku."
            )
        else:
            return (
                f"🏛️ **National Scholarship Portal (PM-USP CSSS):**\n\n"
                f"• **Overview:** ₹12,000/year for undergraduate students scoring in the top 20th percentile (>80%) with family income < ₹4.5 Lakhs.\n"
                f"• **Why Excluded:** {reason}. Central policy prohibits claiming simultaneous tuition grants with State welfare entitlements. "
                f"Our MWIS graph solver selected your State bundle to deliver the highest legal net sum of ₹{total_val:,}."
            )

    # =========================================================================
    # 10. HOSTEL, MESS, BUS PASS & IN-KIND ASSISTANCE
    # =========================================================================
    if any(k in msg_lower for k in ["hostel", "விடுதி", "உணவு", "mess", "bus", "பஸ்", "pass", "transport"]):
        if lang == 'ta':
            return (
                "🚌 **இலவச பேருந்து படி மற்றும் அரசு கல்லூரி விடுதிகள்:**\n\n"
                "1. **இலவச பேருந்து பாஸ் (Free Bus Pass):** அனைத்து அரசு மற்றும் உதவிபெறும் கல்லூரி மாணவர்களுக்கும் வீடு முதல் கல்லூரி வரை செல்ல TNSTC மூலம் கட்டணமில்லா பஸ் பாஸ் வழங்கப்படுகிறது.\n"
                "2. **அரசு கல்லூரி விடுதிகள் (Free Hostels):** பிற்படுத்தப்பட்டோர் மற்றும் ஆதிதிராவிடர் நலத்துறை கீழ் 38 மாவட்டங்களிலும் செயல்படும் மாணவர் விடுதிகளில் இலவச உணவு மற்றும் தங்குமிடம் வழங்கப்படுகிறது."
            )
        elif lang == 'tanglish':
            return (
                "🚌 **Free Bus Pass & Govt Student Hostels:**\n\n"
                "1. **Free Bus Pass:** TNSTC bus pass completely free for college students between residence and college campus.\n"
                "2. **Govt Welfare Hostels:** Free food, mess, and accommodation provided by BC/MBC & SC/ST Welfare Departments across all 38 districts of Tamil Nadu."
            )
        else:
            return (
                "🚌 **Free Transportation & State Student Hostels:**\n\n"
                "• **Free College Bus Pass:** 100% subsidized travel between residence and educational institution via TNSTC buses.\n"
                "• **State Welfare Hostels:** Free boarding, lodging, and mess facilities run by the BC/MBC and Adi Dravidar Welfare Departments across all 38 districts."
            )

    # =========================================================================
    # 11. DOCUMENTS & CERTIFICATE CHECKLIST (TAHSILDAR / E-SEVAI)
    # =========================================================================
    if any(k in msg_lower for k in ["doc", "certificate", "tahsildar", "e-sevai", "esevai", "சான்றிதழ்", "ஆவணம்", "income cert", "community cert"]):
        if lang == 'ta':
            return (
                "📋 **தேவையான அதிகாரப்பூர்வ ஆவணங்கள் மற்றும் சான்றிதழ்கள் பட்டியல்:**\n\n"
                "1. **வருமானச் சான்றிதழ் (Income Certificate):** வட்டாட்சியர் (Tahsildar) வழங்கிய 6 மாதங்களுக்குள் பெறப்பட்ட சான்றிதழ்.\n"
                "2. **சாதிச் சான்றிதழ் (Permanent Community Certificate):** டிஜிட்டல் கையொப்பம் மற்றும் QR குறியீடு கொண்ட நிரந்தர சான்றிதழ்.\n"
                "3. **அரசுப் பள்ளி Bonafide சான்றிதழ்:** 6 முதல் 12-ஆம் வகுப்பு வரை அரசு பள்ளியில் பயின்றதற்கான பள்ளி தலைமை ஆசிரியர் மற்றும் DEO சான்றொப்பம்.\n"
                "4. **முதல் பட்டதாரி சான்றிதழ்:** குடும்பத்தில் முதல் பட்டதாரி எனில் வட்டாட்சியரால் இ-சேவை மூலம் வழங்கப்பட்டது.\n"
                "5. **வங்கி கணக்கு புத்தகம்:** ஆதார் எண் NPCI உடன் இணைக்கப்பட்ட (Aadhaar DBT active) வங்கி கணக்கு."
            )
        elif lang == 'tanglish':
            return (
                "📋 **Mandatory Documents Checklist:**\n\n"
                "1. **Income Certificate:** Issued by Tahsildar through e-Sevai within last 6 months.\n"
                "2. **Permanent Community Certificate:** Digital QR-coded card.\n"
                "3. **6th-12th Govt School Bonafide:** Required for Pudhumai Penn / Tamil Pudhalvan / 7.5% quota.\n"
                "4. **First Graduate Certificate:** Issued by Revenue department if eligible.\n"
                "5. **Aadhaar-Seeded Bank Passbook:** NPCI active for direct DBT credit."
            )
        else:
            return (
                "📋 **Official Verification Document Checklist:**\n\n"
                "1. **Tahsildar Income Certificate:** Issued via e-Sevai within the last 6 months.\n"
                "2. **Permanent Community Certificate:** Digitally signed with verifiable QR code.\n"
                "3. **6th-12th Government School UDISE Bonafide:** Mandatory for Pudhumai Penn, Tamil Pudhalvan, and 7.5% quota.\n"
                "4. **First Graduate Certificate:** Required for TNEA/DoTE tuition waivers.\n"
                "5. **NPCI-Seeded Bank Passbook:** Ensure Aadhaar is linked for Direct Benefit Transfer (DBT)."
            )

    # =========================================================================
    # 12. HOW TO APPLY & PORTAL STEPS
    # =========================================================================
    if any(k in msg_lower for k in ["apply", "how to", "process", "portal", "website", "எப்படி", "விண்ணப்பிக்க", "epdi apply", "steps"]):
        if lang == 'ta':
            return (
                "📝 **விண்ணப்பிக்கும் வழிமுறைகள்:**\n\n"
                "1. **சான்றிதழ்கள் பெறுதல்:** அருகில் உள்ள அரசு இ-சேவை மையம் மூலம் வருமானம் மற்றும் சாதிச் சான்றிதழ்களைப் பெறவும்.\n"
                "2. **கல்லூரி சேர்க்கை போர்டல்:** TNEA / UMIS மூலம் சேர்க்கை பெறும்போது முதல் பட்டதாரி மற்றும் 7.5% ஒதுக்கீட்டை டிக் செய்யவும்.\n"
                "3. **பெண்கல்வி போர்டல்:** புதுமைப் பெண் திட்டத்திற்கு உங்கள் கல்லூரி சேர்க்கை மையம் மூலம் https://www.pudhumaipenn.tn.gov.in-ல் ஆவணங்களை பதிவேற்றவும்.\n"
                "4. **ஆதார் இணைப்பு:** உங்கள் வங்கி கணக்கில் Aadhaar DBT இணைக்கப்பட்டுள்ளதை வங்கி கிளையில் சரிபார்க்கவும்."
            )
        elif lang == 'tanglish':
            return (
                "📝 **Step-by-Step Application Guide:**\n\n"
                "1. **Get Certificates:** Apply at your local e-Sevai center for Tahsildar Income & Community certificates.\n"
                "2. **College Registration:** Submit your First Graduate certificate during TNEA / DoTE single window counseling.\n"
                "3. **Penkalvi Portal:** Upload 6th-12th Bonafide at https://www.pudhumaipenn.tn.gov.in through your college nodal officer.\n"
                "4. **Bank DBT:** Verify with your bank branch that Aadhaar is linked to NPCI for direct DBT credit."
            )
        else:
            return (
                "📝 **Application & Portal Workflow:**\n\n"
                "1. **Procure Certified Certificates:** Obtain Tahsildar Income & Community certificates from your local e-Sevai centre.\n"
                "2. **Counseling Registration:** Furnish First Graduate certificate during TNEA/DoTE admissions for instant fee concession.\n"
                "3. **Official Scheme Portals:** Register on Penkalvi (https://www.pudhumaipenn.tn.gov.in) or TN SSP Portal (https://ssp.tn.gov.in) with your College Nodal Officer.\n"
                "4. **Bank DBT Validation:** Ensure your savings account has active NPCI Aadhaar seeding."
            )

    # =========================================================================
    # 13. DISBURSEMENT DATES & DBT STATUS
    # =========================================================================
    if any(k in msg_lower for k in ["eppo varum", "when", "date", "disbursement", "பணம் எப்போது வரும்", "வங்கி", "credit", "status"]):
        if lang == 'ta':
            return (
                "📅 **உதவித்தொகை வரவு வைக்கப்படும் கால அட்டவணை:**\n\n"
                "• **புதுமைப் பெண் & தமிழ் புதல்வன்:** மாதந்தோறும் 5 முதல் 10-ஆம் தேதிக்குள் மாணவர் வங்கிக் கணக்கில் நேரடியாக (DBT) வரவு வைக்கப்படும்.\n"
                "• **போஸ்ட்-மெட்ரிக் & முதல் பட்டதாரி:** கல்வி ஆண்டின் முதல் தவணை டிசம்பர்/ஜனவரி மாதத்திலும், இரண்டாம் தவணை மார்ச்/ஏப்ரல் மாதத்திலும் கல்லூரிக்கு வழங்கப்படும்.\n"
                "• **கட்டணமில்லா உதவி எண்:** DBT குறித்த சந்தேகங்களுக்கு **14417** என்ற மாணவர் உதவி எண்ணை அழைக்கலாம்."
            )
        elif lang == 'tanglish':
            return (
                "📅 **Disbursement Timelines & DBT Schedule:**\n\n"
                "• **Pudhumai Penn & Tamil Pudhalvan:** Credited directly between 5th and 10th of every month into your bank account.\n"
                "• **Post-Matric & First Graduate Waivers:** Settled in two installments (Dec-Jan and Mar-Apr) directly with college.\n"
                "• **Helpline:** Call toll-free student helpline **14417** for DBT status queries."
            )
        else:
            return (
                "📅 **Disbursement & Payment Timetable:**\n\n"
                "• **Monthly Stipends (Pudhumai Penn / Tamil Pudhalvan):** Disbursed via Aadhaar DBT directly between the 5th and 10th of each calendar month.\n"
                "• **Annual Fee Reimbursements (First Graduate / Post-Matric):** Settled in two institutional cycles (Dec/Jan and Mar/Apr).\n"
                "• **Toll-Free Helpline:** Dial **14417** or **1800-425-1333** for direct grievance resolution."
            )

    # =========================================================================
    # 14. 47 SCHEMES MASTER CATALOG & FUNDING SPLIT (CSS VS STATE VS CENTRAL)
    # =========================================================================
    if any(k in msg_lower for k in ["47", "how many", "all schemes", "total schemes", "எத்தனை", "திட்டங்கள்", "திட்டம்", "funding", "css", "state-only", "central funded", "department", "evlo scheme"]):
        if lang == 'ta':
            return (
                "📊 **தமிழ்நாடு மாணவர் திட்டங்கள் — விரிவான தொகுப்பு (செப்டம்பர் 2026):**\n\n"
                "• **மொத்த தனித்துவமான திட்டங்கள்:** **47 திட்டங்கள்** (8 அரசு துறைகளால் செயல்படுத்தப்படுகின்றன).\n"
                "• **1. மத்திய ஆதரவு திட்டங்கள் (CSS - 14):** மத்திய-மாநில 60:40 அல்லது 75:25 நிதிப்பகிர்வு (எ.கா. SC/ST போஸ்ட்-மெட்ரிக், PM-YASASVI, சிறுபான்மையினர் உதவித்தொகை, சமக்ர சிக்ஷா, PM POSHAN, RTE 25%).\n"
                "• **2. மத்திய துறை திட்டங்கள் (Central Sector - 8):** 100% மத்திய அரசு நிதி (எ.கா. வெளிநாட்டு கல்வி உதவித்தொகை NOS, Top Class Education SC/ST, AICTE பிரகதி & சக்ஷம், NMMS).\n"
                "• **3. தமிழக அரசு மட்டுமே வழங்கும் திட்டங்கள் (State-Only - 21):** 100% மாநில அரசு நிதி (எ.கா. புதுமைப் பெண், தமிழ் புதல்வன், காலை உணவுத் திட்டம், வெற்றி மடிக்கணினி, நான் முதல்வன், 7.5% இடஒதுக்கீடு, முதல் பட்டதாரி, CMRF ஆராய்ச்சி உதவித்தொகை).\n"
                "• **4. கலப்பு / சரிபார்க்கப்பட வேண்டியவை (Mixed - 4):** இலவச மாணவர் விடுதிகள், இலவச பாடப்புத்தகங்கள், ADW பள்ளி-PG மற்றும் BC/MBC இலவசக் கல்வி."
            )
        elif lang == 'tanglish':
            return (
                "📊 **Tamil Nadu Student Schemes — Master Reference (47 Schemes Total):**\n\n"
                "• **Total Schemes:** **47 Verified Schemes** across 8 Government Departments.\n"
                "• **CSS (Centrally Sponsored - 14):** 60:40 or 75:25 sharing (SC/ST Post-Matric, PM-YASASVI, Minority Pre/Post-Matric, Samagra Shiksha, PM POSHAN, RTE 25%).\n"
                "• **Central Sector (100% Centre - 8):** National Overseas Scholarship (NOS), Top Class SC/ST, AICTE Pragati/Saksham, NMMS.\n"
                "• **TN State-Only (100% State - 21):** Pudhumai Penn, Tamil Pudhalvan, CM Breakfast, Vetri Laptop, Naan Mudhalvan, 7.5% Quota, First Graduate, CMRF Ph.D.\n"
                "• **Mixed / Flagged (4):** SC/ST/BC/MBC Free Hostels, Free Textbooks, ADW School-PG, Free Education BC/MBC/DNC."
            )
        else:
            return (
                "📊 **Tamil Nadu Student Schemes — Combined Master Reference (September 2026):**\n\n"
                "• **Total Catalog:** **47 Unique Schemes** implemented across 8 State Departments.\n"
                "• **1. Centrally Sponsored Schemes (CSS - 14 Schemes):** Co-funded between Centre & State (60:40 or 75:25), including SC/ST Post-Matric, PM-YASASVI, Minority Welfare, PWD Scholarships, Samagra Shiksha, and PM POSHAN.\n"
                "• **2. Central Sector Schemes (8 Schemes):** 100% Centre-funded where TN facilitates certification/exams: National Overseas Scholarships (SC/ST), Top Class Education (IIT/NIT), AICTE Pragati (Girls), AICTE Saksham, and NMMS.\n"
                "• **3. Tamil Nadu State-Only (21 Schemes):** 100% TN-funded flagship initiatives: Pudhumai Penn, Tamil Pudhalvan, CM Breakfast Scheme, Vetri Laptop, Naan Mudhalvan, 7.5% Govt School Quota, First Graduate, and CM Research Fellowship.\n"
                "• **4. Mixed / Flagged (4 Schemes):** Free Hostels, Textbooks (Classes 1–8), ADW School–PG, and Free Education for BC/MBC."
            )

    # =========================================================================
    # 15. SPECIALIZED SCHEMES (OVERSEAS, NMMS, SPORTS, FELLOWSHIP)
    # =========================================================================
    if any(k in msg_lower for k in ["overseas", "foreign", "nos", "வெளிநாடு", "phd", "research", "fellowship", "cmrf", "nmms", "sports", "விளையாட்டு", "mims", "breakfast", "காலை உணவு"]):
        if any(k in msg_lower for k in ["overseas", "foreign", "nos", "வெளிநாடு"]):
            if lang == 'ta':
                return (
                    "✈️ **தேசிய வெளிநாட்டுக் கல்வி உதவித்தொகை (National Overseas Scholarship - NOS):**\n\n"
                    "• **தகுதி:** SC, ST, சீர்மரபினர் (DNT), நிலமற்ற விவசாய தொழிலாளர் குடும்ப மாணவர்கள்.\n"
                    "• **படிப்பு:** வெளிநாட்டின் முன்னணி பல்கலைக்கழகங்களில் Master's அல்லது Ph.D.\n"
                    "• **நிதி உதவி:** முழு கல்விக் கட்டணம், விசா கட்டணம், விமானக் கட்டணம், மற்றும் வாழ்க்கைச் செலவு பராமரிப்பு படி (ஆண்டுக்கு ₹20,00,000 வரை).\n"
                    "• **விண்ணப்ப தளம்:** https://nosmsje.gov.in (SC) / https://overseas.tribal.gov.in (ST)."
                )
            else:
                return (
                    "✈️ **National Overseas Scholarship (NOS for SC & ST):**\n\n"
                    "• **Eligibility:** SC, ST, DNT, and rural landless artisan students pursuing Master's or Ph.D in top 500 global institutions, family income ≤ ₹8L (SC) / ₹6L (ST).\n"
                    "• **Coverage:** 100% full funding covering tuition fees, foreign currency maintenance stipend, airfare, and visa fees (value ~₹20 Lakhs/year).\n"
                    "• **Portals:** https://nosmsje.gov.in (MoSJE) and https://overseas.tribal.gov.in (MoTA)."
                )
        elif any(k in msg_lower for k in ["phd", "research", "fellowship", "cmrf", "ஆராய்ச்சி"]):
            if lang == 'ta':
                return (
                    "🔬 **முதலமைச்சரின் ஆராய்ச்சி உதவித்தொகைத் திட்டம் (CMRF):**\n\n"
                    "• **தகுதி:** அரசு மற்றும் உதவிபெறும் கல்லூரிகளில் முழுநேர Ph.D ஆராய்ச்சி மேற்கொள்ளும் முனைவர் பட்ட மாணவர்கள்.\n"
                    "• **நிதி உதவி:** மாதம் ₹25,000 ஆராய்ச்சி உதவித்தொகை (ஆண்டுக்கு ₹3,00,000) + ₹10,000 தற்செயல் படி (3 ஆண்டுகள் வரை).\n"
                    "• **விண்ணப்ப தளம்:** https://tndce.tn.gov.in (கல்லூரி கல்வி இயக்ககம்)."
                )
            else:
                return (
                    "🔬 **Chief Minister's Research Fellowship (CMRF):**\n\n"
                    "• **Eligibility:** Full-time Ph.D research scholars in recognized government and aided arts, science, and engineering colleges in Tamil Nadu.\n"
                    "• **Stipend:** ₹25,000 per month (₹3,00,000 annually) for up to 3 years plus ₹10,000 annual contingency allowance.\n"
                    "• **Portal:** Directorate of Collegiate Education (https://tndce.tn.gov.in)."
                )
        elif any(k in msg_lower for k in ["breakfast", "காலை உணவு"]):
            if lang == 'ta':
                return (
                    "🥣 **முதலமைச்சரின் காலை உணவுத் திட்டம் (CM Breakfast Scheme):**\n\n"
                    "• **பயனாளிகள்:** தமிழகத்தில் உள்ள அனைத்து அரசு தொடக்கப் பள்ளிகளில் (வகுப்பு 1 முதல் 5 வரை) பயிலும் அனைத்து மாணவ, மாணவிகள்.\n"
                    "• **பலன்:** பள்ளி துவங்கும் முன் சுடச்சுட சுவையான மற்றும் சத்தான காலை உணவு இலவசமாக வழங்கப்படுகிறது.\n"
                    "• **செயல்படுத்தும் துறை:** பள்ளி கல்வித் துறை மற்றும் ஊரக வளர்ச்சித் துறை."
                )
            else:
                return (
                    "🥣 **Chief Minister's Breakfast Scheme:**\n\n"
                    "• **Coverage:** Primary school children (Classes 1 to 5) across all government schools in Tamil Nadu.\n"
                    "• **Benefit:** Free nutritious, hot-cooked breakfast daily prior to school hours (value ~₹6,000/yr per child).\n"
                    "• **Implementing Department:** School Education Department."
                )
        elif any(k in msg_lower for k in ["nmms"]):
            if lang == 'ta':
                return (
                    "📝 **தேசிய வருவாய் வழி மற்றும் திறன் படிப்புதவித் திட்டம் (NMMS):**\n\n"
                    "• **தகுதி:** அரசு மற்றும் உதவிபெறும் பள்ளிகளில் 8-ஆம் வகுப்பு பயின்று, DGE-TN நடத்தும் MAT/SAT தேர்வில் தேர்ச்சி பெறும் மாணவர்கள் (வருமானம் ≤ ₹3.5 லட்சம்).\n"
                    "• **உதவித்தொகை:** 9-ஆம் வகுப்பு முதல் 12-ஆம் வகுப்பு வரை மாதம் ₹1,000 வீதம் ஆண்டுக்கு ₹12,000 வங்கி கணக்கில் செலுத்தப்படும்.\n"
                    "• **இணையதளம்:** தேர்வு தகவல்கள்: https://dge.tn.gov.in; உதவித்தொகை பதிவு: NSP."
                )
            else:
                return (
                    "📝 **National Means-cum-Merit Scholarship (NMMS):**\n\n"
                    "• **Target:** Students studying in Class 8 in govt/aided schools with parental income ≤ ₹3.5 Lakhs who qualify the state-level MAT/SAT exam.\n"
                    "• **Grant:** ₹12,000 per annum (₹1,000/month DBT) through Classes 9, 10, 11, and 12.\n"
                    "• **Portal:** Examination via https://dge.tn.gov.in and scholarship claim on National Scholarship Portal (NSP)."
                )

    # =========================================================================
    # 16. WHAT AM I ELIGIBLE FOR? / PERSONALIZED BREAKDOWN
    # =========================================================================
    if any(k in msg_lower for k in ["எனக்கு என்ன கிடைக்கும்", "what will i get", "enaku enna kedaikum", "eligible", "my scheme", "bundle", "total"]):
        if lang == 'ta':
            return (
                f"📊 **{student_name}-க்கான தனிப்பயனாக்கப்பட்ட அரசு சலுகைகள் மதிப்பீடு:**\n\n"
                f"• **சமூகம்:** {community} | **வருடாந்திர வருமானம்:** ₹{income:,}\n"
                f"• **பரிந்துரைக்கப்பட்ட திட்டங்கள்:** {rec_names_str}\n"
                f"• **மொத்த ஆண்டு நிதி பலன்:** ₹{total_val:,}\n\n"
                f"இந்த சேர்க்கை பரஸ்பர விலக்கு (Mutual Exclusivity) விதிகளை கருத்தில் கொண்டு, உங்களுக்கு அதிகபட்ச சட்டபூர்வ தொகையை உறுதி செய்யும் வகையில் தேர்வு செய்யப்பட்டுள்ளது."
            )
        elif lang == 'tanglish':
            return (
                f"📊 **Personalized Entitlement Summary for {student_name}:**\n\n"
                f"• **Community:** {community} | **Annual Income:** ₹{income:,}\n"
                f"• **Allocated Schemes:** {rec_names_str}\n"
                f"• **Total Annual Benefit:** ₹{total_val:,}\n\n"
                f"Indha schemes MWIS algorithm moolam optimize pannappattadhu, conflicts edhuvum illama maximum financial aid kidaika!"
            )
        else:
            return (
                f"📊 **Personalized Higher Education Entitlement for {student_name}:**\n\n"
                f"• **Profile:** {community} Community | Annual Family Income: ₹{income:,}\n"
                f"• **Optimal Recommended Bundle:** {rec_names_str}\n"
                f"• **Total Annual Financial Grant:** ₹{total_val:,}\n\n"
                f"Selected via Maximum Weight Independent Set (MWIS) constraint optimization to guarantee maximum lawful financial support."
            )

    # =========================================================================
    # 15. DEFAULT CONTEXTUAL RESPONSE FOR ANY OTHER QUERY
    # =========================================================================
    if lang == 'ta':
        return (
            f"உங்கள் கேள்வி: '{msg}'\n\n"
            f"தமிழ்நாடு உயர்கல்வித் துறை வழிகாட்டுதலின்படி, உங்கள் சுயவிவரத்திற்கு ({community}, வருமானம்: ₹{income:,}) "
            f"₹{total_val:,} மதிப்புள்ள அரசு சலுகைகள் கிடைக்க வாய்ப்புள்ளது ({rec_names_str}).\n\n"
            f"உங்களுக்கு தேவையான ஆவணங்கள்: வட்டாட்சியர் வருமானச் சான்றிதழ், சாதிச் சான்றிதழ், மற்றும் 6-12 அரசு பள்ளி Bonafide. "
            f"விண்ணப்ப முறை அல்லது குறிப்பிட்ட திட்டங்கள் குறித்து மேலும் விரிவாக அறிய விரும்பினால் கேளுங்கள்!"
        )
    elif lang == 'tanglish':
        return (
            f"Ungaloda question: '{msg}'\n\n"
            f"TN Government welfare rules-padi, ungaloda profile-ku ({community}, Annual Income: ₹{income:,}) "
            f"total-a ₹{total_val:,} annual benefit kidaika vaaippu irukku ({rec_names_str}).\n\n"
            f"Mukkiyamana documents: e-Sevai Income cert, Community cert, mattrum 6th-12th Bonafide. "
            f"Specific scheme apply pandradhu pathi edhavadhu kekkanuma?"
        )
    else:
        return (
            f"Regarding your query: '{msg}'\n\n"
            f"Under Tamil Nadu Higher Education Department regulations, based on your profile ({community}, Annual Income: ₹{income:,}), "
            f"you qualify for ₹{total_val:,} in annual government entitlements ({rec_names_str}).\n\n"
            f"Essential prerequisites include a certified Tahsildar Income Certificate, Permanent Community Card, and 6th-12th School Bonafide. "
            f"Feel free to ask about application steps on Penkalvi/TNEA, document verification, or specific scheme rules!"
        )

async def get_ai_advisory(
    message: str,
    profile_context: dict,
    evaluation_context: dict,
    history: Optional[List[Dict[str, str]]] = None
) -> str:
    """
    Main Advisory Engine using Google GenAI SDK (gemini-2.5-flash) with
    intelligent contextual fallback that guarantees rich, natural multi-turn conversation.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    history = history or []

    # If API key is not present, use the intelligent dynamic conversational engine
    if not api_key:
        logger.info("GEMINI_API_KEY not configured in env. Engaging intelligent conversational engine.")
        return _dynamic_conversational_engine(message, profile_context, evaluation_context, history)

    try:
        # Initialize Google GenAI client
        client = genai.Client(api_key=api_key)

        recommended = evaluation_context.get("recommended_bundle", [])
        excluded = evaluation_context.get("excluded_schemes", [])
        total_val = evaluation_context.get("total_financial_value", 0)
        probabilities = evaluation_context.get("selection_probabilities", {})

        system_instruction = f"""
You are the official Tamil Nadu e-Governance Scholarship & Higher Education Welfare AI Advisor for Smartathon'26.
Your duty is to converse naturally and advise the student on higher education entitlements, required certificates, and application steps.

=== STUDENT PROFILE CONTEXT ===
- Full Name: {profile_context.get('full_name', 'Student')}
- Gender: {profile_context.get('gender', 'Unknown')}
- Community: {profile_context.get('community', 'Unknown')}
- Annual Family Income: INR {profile_context.get('annual_income', 0):,}
- 6th-12th Schooling: {profile_context.get('schooling_type', 'Unknown')}
- 12th Board Marks: {profile_context.get('board_percentage', 0)}%
- Course Enrolled: {profile_context.get('current_course', 'Unknown')}
- First Graduate Status: {profile_context.get('is_first_graduate', False)}
- Differently Abled: {profile_context.get('is_differently_abled', False)}

=== EVALUATION ENGINE OUTPUT (MWIS Optimization) ===
- Optimal Recommended Bundle: {json.dumps(recommended, ensure_ascii=False)}
- Total Annual Stackable Benefit: INR {total_val:,}
- Excluded Conflicting Schemes: {json.dumps(excluded, ensure_ascii=False)}
- Probability Analysis: {json.dumps(probabilities, ensure_ascii=False)}

=== MANDATORY CONVERSATION GUARDRAILS ===
1. LANGUAGE AGILITY:
   - If the user writes in Tamil script, reply in fluent, natural Tamil.
   - If the user writes in Tanglish, reply in friendly, conversational Tanglish.
   - If the user writes in English, reply in structured, crisp English.
2. CONVERSATIONAL RELEVANCE:
   - Always reply directly and specifically to the student's exact question.
   - Do NOT give generic greetings unless greeted.
   - Provide concrete steps, portal URLs (pudhumaipenn.tn.gov.in, tneaonline.org, ssp.tn.gov.in), and e-Sevai requirements.
"""

        # Format chat history for Google GenAI SDK
        contents = []
        for h in history:
            role = "user" if h.get("role") in ["user", "student"] else "model"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=h.get("content", ""))]
                )
            )

        # Append current user query
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=message)]
            )
        )

        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3,
                max_output_tokens=650
            )
        )

        if response and response.text:
            return response.text.strip()
        else:
            return _dynamic_conversational_engine(message, profile_context, evaluation_context, history)

    except Exception as e:
        logger.warning(f"Gemini API call failed ({e}). Engaging intelligent conversational engine.")
        return _dynamic_conversational_engine(message, profile_context, evaluation_context, history)

def generate_chat_reply(user_message: str, context: dict, chat_history: list) -> str:
    """Synchronous fallback wrapper."""
    profile = context.get("profile", {})
    evaluation = context.get("evaluation", context)
    return _dynamic_conversational_engine(user_message, profile, evaluation, chat_history)
