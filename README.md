# 🎓 AI Scholarship & Government Scheme Eligibility Matcher
### **SMARTATHON'26 (DSU × ONEYES) — Problem Statement #6**
#### *Tamil Nadu Higher Education & Central Student Welfare Optimization Platform*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_2.0-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB.svg?style=flat&logo=react)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB.svg?style=flat&logo=python)](https://www.python.org)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB_Atlas_%2B_SQLite-47A248.svg?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Gemini](https://img.shields.io/badge/AI_Advisor-Gemini_2.5_Flash-4285F4.svg?style=flat&logo=google)](https://ai.google.dev)

---

## 🏛️ Executive Summary

Tamil Nadu students often miss out on eligible higher education welfare grants—or face sudden disqualification due to conflicting double-claims across Central and State portals. 

**TN e-Vidya** is an official GovTech application designed specifically for the Government of Tamil Nadu and Central schemes. It combines **Maximum Weight Independent Set (MWIS) Graph Theory**, an authentic **Indian GovTech civic UI/UX**, **e-Sevai Document OCR scanning**, and a **bilingual (Tamil / English) AI Advisory Desk** to ensure students secure the maximum lawful funding with zero policy collision risk.

---

## 📊 Complete 47 Schemes Master Catalog (September 2026 Reference)

The platform ingests all **47 official student welfare schemes** categorized strictly by Government funding model:

| Category | Schemes Count | Funding Share Ratio | Key Flagship Schemes Included |
| :--- | :---: | :---: | :--- |
| **A. Centrally Sponsored (CSS)** | **14** | 60:40 / 75:25 | Post-Matric SC, Pre-Matric SC, Post-Matric ST (75:25), Pre-Matric ST, PM-YASASVI Pre-Matric (OBC/EBC/DNT), PM-YASASVI Post-Matric (BC/MBC/DNC), Minority Pre/Post-Matric, Merit-cum-Means Minorities, Pre/Post-Matric Disability, Samagra Shiksha, PM POSHAN, RTE 25% Reimbursement |
| **B. Central Sector Schemes** | **8** | 100:0 (GoI) | National Overseas Scholarship (SC/DNT), National Overseas Scholarship (ST), Top Class Education (SC/ST in IIT/NIT), PM-YASASVI Top Class, AICTE Saksham, AICTE Pragati (Girls), NMMS |
| **C. Mixed / Flagged** | **4** | State Administered | Free Hostels (SC/ST/BC/MBC), Free Textbooks & Notebooks (Classes 1–8), ADW Scholarship (School–PG), Free Education Scheme for BC, MBC & DNC |
| **D. Tamil Nadu State-Only** | **21** | 0:100 (State) | Pudhumai Penn Scheme (₹1,000/mo), Tamil Pudhalvan Scheme (₹1,000/mo), CM Breakfast Scheme, Kalaignar Sports Kit, MIMS Sports Grant, Free Guides & Question Banks, Free Bicycles, Rural Girls' Scholarship, TN Spark Labs, Thiran Next, Vetri Paadhai, Vetri Laptop Scheme (20 Lakh Laptops), Naan Mudhalvan (Paid Internships & Certifications), 7.5% Govt School Horizontal Quota, First Graduate Tuition Concession, Stipend for Tamil-Medium Students, Periyar EVR Nagammai (UG), EVR Nagammai (PG), Chief Minister's Research Fellowship (CMRF - ₹25,000/mo), Deceased Govt Servants' Scholarship, RIMC Dehradun Scholarship |
| **Total Deduplicated Catalog** | **47** | — | **8 Implementing State Departments** |

---

## ⚡ Core Technical Features

### 1. MWIS Graph-Theoretic Policy Optimizer (`backend/engine.py`)
- Models government welfare regulations as a mathematical conflict graph $G = (V, E)$.
- Solves the **Maximum Weight Independent Set (MWIS)** using bitmask and constraint filtering.
- Mathematically proves zero double-claiming risk (e.g. automatically resolves conflicts between First Graduate Tuition Waiver and AICTE Pragati or Post-Matric).

### 2. Authentic Indian Civic GovTech UI/UX (`frontend/`)
- **Strict Anti-AI Design**: Zero dark-mode neon glows, zero cyan/purple gradients, and zero blurry glassmorphism (`backdrop-blur`).
- **Official Color Palette**: Deep Navy (`#0f2942`) and Tamil Forest Green (`#006a4e`).
- **Official Sanction Memorandum**: Modeled after formal Government Orders (G.O. Ms.) with candidate data ledgers, itemized tuition/DBT breakdowns, and explicit side-by-side mutual exclusivity comparison tables.

### 3. Multimodal e-Sevai Document OCR Scanner (`backend/ocr_service.py`)
- Upload Tahsildar Revenue certificates, Community cards, or 10th/12th marksheets.
- Automatically extracts certificate numbers, annual income figures, and candidate names to cross-verify against declared profile fields.

### 4. Bilingual AI Chat Advisor (`backend/chat_service.py`)
- Powered by Google GenAI (`gemini-2.5-flash`) with an intelligent offline rule engine fallback.
- Answers multi-turn questions fluently in **தமிழ் (Tamil)**, **Tanglish**, and **English**.
- In-depth knowledge of all 47 schemes, required Tahsildar certificates, e-Sevai procedures, and application deadlines.

### 5. Resilient Dual-Database Architecture (`backend/database.py`)
- Primary connection to **MongoDB Atlas Cloud Cluster** (`smartathon_scholarships` database) for user profiles and evaluation audit logs.
- Automatic, zero-downtime fallback to local **SQLite** (`app.db`) whenever internet or credentials are not present.

---

## 🚀 Quickstart Guide

### Prerequisites
- Python 3.10+ (tested on Python 3.13)
- Node.js 18+ and npm

### 1. Clone & Setup Backend
```bash
# Clone repository
git clone https://github.com/Surya252006/smartathon26dsu.git
cd smartathon26dsu

# Create virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend test suite
pytest backend/tests/test_engine.py

# Start FastAPI server
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

The application will be live at:
- **Frontend Portal**: `http://localhost:5173`
- **Interactive Swagger API Docs**: `http://127.0.0.1:8000/docs`

---

## 👥 Jury Demo Personas (1-Click Evaluation)

The platform includes 3 automated demo personas ready for jury presentation:
1. **Priya Murugesan (Govt School Stacking)**: BC Female, 86.5% marks, First Graduate → Sanctions **₹37,000/yr** (Pudhumai Penn ₹12,000 + First Graduate ₹25,000).
2. **Karthik Rajan (Merit Exclusivity Conflict)**: OC Male, 94.8% marks → Confirms Central Sector PM-USP CSSS (₹12,000) while dropping conflicting state fee claims.
3. **Ananya Sundaram (Technical Merit)**: MBC Female, 91.0% Engineering → Awards AICTE Pragati (₹50,000) with 100% legal compliance.

---

## 📜 License & Acknowledgments
Built for **SMARTATHON'26** by team developers.
Special thanks to Dhanalakshmi Srinivasan University (DSU) and ONEYES Technologies.
All scheme parameters verified against official notifications on `scholarships.gov.in`, `ssp.tn.gov.in`, `tndce.tn.gov.in`, and `pudhumaipenn.tn.gov.in`.
