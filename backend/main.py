import json
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.models import UserProfile, EvaluationResponse
from backend.engine import solve_optimal_bundle
from backend.database import (
    load_schemes, 
    load_schemes_catalog, 
    get_db_status, 
    configure_mongodb_username, 
    log_evaluation_to_db,
    SessionLocal, 
    register_user, 
    authenticate_user, 
    create_user_profile, 
    get_user_profile
)
from backend.chat_service import get_ai_advisory
from backend.ocr_service import verify_student_document, VerificationResult

app = FastAPI(
    title="AI Scholarship & Government Scheme Eligibility Matcher",
    description="Smartathon'26 Production API for Tamil Nadu Higher Education Welfare Optimization",
    version="2.0.0"
)

# Enable CORS for Vite frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    """Cache schemes on startup to validate the JSON file early."""
    try:
        schemes = load_schemes()
        catalog = load_schemes_catalog()
        print(f"Successfully loaded {len(schemes)} core schemes and {len(catalog)} catalog schemes into memory.")
    except Exception as e:
        print(f"Failed to load schemes: {e}")

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "AI Scholarship & Government Scheme Matcher",
        "hackathon": "SMARTATHON'26 (DSU x ONEYES)",
        "database": get_db_status()
    }

@app.get("/api/db/status")
def database_status():
    """Returns real-time status of SQLite and MongoDB Atlas cluster connection."""
    return get_db_status()

class MongoConfigRequest(BaseModel):
    username: str

@app.post("/api/db/configure")
def configure_mongo(req: MongoConfigRequest):
    """Dynamically tests and configures MongoDB Atlas cluster username."""
    return configure_mongodb_username(req.username)

@app.post("/api/evaluate", response_model=EvaluationResponse)
def evaluate_profile(profile: UserProfile):
    """
    Evaluates the user profile against all schemes and returns the optimal bundle,
    calculating probabilities and resolving mutual exclusivity conflicts via MWIS.
    """
    try:
        all_schemes = load_schemes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Schemes database unavailable: {e}")
        
    result = solve_optimal_bundle(profile, all_schemes)
    
    # Mirror evaluation event to MongoDB Atlas if connected
    try:
        log_evaluation_to_db(
            user_id=None,
            profile_data=profile.dict(),
            evaluation_result=result.dict()
        )
    except Exception as me:
        pass

    return result

class PredictRequest(BaseModel):
    community: str = "BC"
    gender: str = "female"
    annual_income: float = 120000
    board_percentage: float = 85.0
    schooling_type: str = "tn_govt_school_6_to_12"
    is_first_graduate: bool = True
    current_course: str = "Engineering"

@app.post("/api/predict-entitlement")
def predict_student_entitlement(req: PredictRequest):
    """
    Fast AI Eligibility & Grant Predictor based on preliminary student parameters.
    Satisfies Problem Statement requirement for Instant Student Entitlement Forecasting.
    """
    schemes = load_schemes_catalog()
    likely_schemes = []
    estimated_grant = 0
    
    for s in schemes:
        crit = s.get("criteria", {})
        # Gender check
        if crit.get("gender") not in ["any", req.gender]:
            continue
        # Community check
        if req.community not in crit.get("eligible_communities", []):
            continue
        # Income check
        max_inc = crit.get("max_income")
        if max_inc is not None and req.annual_income > max_inc:
            continue
        # Govt school check
        if crit.get("govt_school_only") and req.schooling_type != "tn_govt_school_6_to_12":
            continue
        # First graduate check
        if crit.get("first_graduate_only") and not req.is_first_graduate:
            continue
        # Mark percentage check
        if req.board_percentage < crit.get("min_percentage", 0.0):
            continue

        likely_schemes.append({
            "id": s.get("id"),
            "name": s.get("name"),
            "financial_value": s.get("financial_value", 0),
            "match_confidence": 95 if s.get("category") == "entitlement" else 85
        })
        estimated_grant += s.get("financial_value", 0)
        
    return {
        "prediction_status": "high_confidence" if len(likely_schemes) >= 2 else "moderate",
        "eligible_schemes_count": len(likely_schemes),
        "likely_schemes": likely_schemes[:5],
        "estimated_annual_entitlement": estimated_grant,
        "recommendation": "Run full MWIS optimizer to resolve mutual exclusivity and generate e-Sevai roadmap PDF."
    }

class ChatRequest(BaseModel):
    message: str = Field(..., description="User query in Tamil, Tanglish, or English")
    profile_context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Student demographic & academic profile")
    evaluation_context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="MWIS recommended bundle and excluded schemes")
    chat_history: Optional[List[Dict[str, str]]] = Field(default_factory=list, description="Prior conversation history")

@app.post("/api/chat")
async def chat_with_advisor(req: ChatRequest):
    """
    Production Gemini 2.5 Flash Advisory Engine with automatic fallback.
    Responds in user's detected language (Tamil, Tanglish, or English).
    """
    try:
        reply = await get_ai_advisory(
            message=req.message,
            profile_context=req.profile_context or {},
            evaluation_context=req.evaluation_context or {},
            history=req.chat_history or []
        )
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Advisory engine failure: {str(e)}")

class ParseQueryRequest(BaseModel):
    text: str

@app.post("/api/parse-query")
def parse_voice_query(req: ParseQueryRequest):
    """
    Parses spoken natural language (Tamil/English) into structured UserProfile form fields.
    """
    t = req.text.lower()
    
    # Defaults
    parsed = {
        "gender": "female" if any(w in t for w in ["girl", "female", "pen", "பெண்", "woman"]) else "male",
        "community": "SC" if "sc" in t else ("ST" if "st" in t else ("MBC" if "mbc" in t else ("OC" if "oc" in t else "BC"))),
        "annual_income": 120000,
        "is_first_graduate": any(w in t for w in ["first", "graduate", "முதல்", "பட்டதாரி", "fg"]),
        "schooling_type": "tn_govt_school_6_to_12" if any(w in t for w in ["govt", "government", "அரசு", "school"]) else "govt_aided",
        "board_percentage": 88.0,
        "admission_mode": "govt_counseling_single_window",
        "current_course": "Engineering" if any(w in t for w in ["eng", "engineering", "b.e", "btech"]) else "Arts & Science",
        "is_differently_abled": any(w in t for w in ["disabled", "disability", "differently"])
    }
    
    # Extract percentage if mentioned
    import re
    pct_match = re.search(r'(\d{2}(?:\.\d{1,2})?)\s*%', t) or re.search(r'(\d{2})\s*(?:percent|marks|mark)', t)
    if pct_match:
        try:
            parsed["board_percentage"] = float(pct_match.group(1))
        except Exception:
            pass
            
    # Extract income if mentioned
    inc_match = re.search(r'(\d+)\s*(?:lakh|lakhs|patcham|ilatcham)', t)
    if inc_match:
        try:
            parsed["annual_income"] = float(inc_match.group(1)) * 100000
        except Exception:
            pass
            
    return {"status": "success", "parsed_profile": parsed}

@app.post("/api/verify-document", response_model=VerificationResult)
async def verify_document(
    file: UploadFile = File(...),
    doc_type: str = Form(..., description="income_certificate | community_certificate | marksheet"),
    profile_json: Optional[str] = Form(None, description="Optional serialized UserProfile JSON for cross-check")
):
    """
    Multimodal e-Sevai Document OCR & Readiness Scanner.
    Extracts certificate fields and validates against the declared student profile.
    """
    try:
        file_bytes = await file.read()
        expected_profile = {}
        if profile_json:
            try:
                expected_profile = json.loads(profile_json)
            except Exception:
                expected_profile = {}

        result = await verify_student_document(
            file_bytes=file_bytes,
            filename=file.filename or "document.pdf",
            content_type=file.content_type or "application/octet-stream",
            doc_type=doc_type,
            expected_profile=expected_profile
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document verification error: {str(e)}")

@app.get("/api/schemes")
def list_all_schemes(reload: bool = False):
    """Returns the full catalog of Tamil Nadu and Central schemes for browsing."""
    try:
        return load_schemes_catalog(force_reload=reload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str] = ""
    gender: Optional[str] = "male"
    dob: Optional[str] = "2006-05-14"
    community: Optional[str] = "BC"
    district: Optional[str] = "Chennai"
    taluk: Optional[str] = ""
    city: Optional[str] = ""
    residence_type: Optional[str] = "Rural"
    father_name: Optional[str] = ""

    # Student Stream ('school' or 'college')
    student_type: Optional[str] = "college"
    school_class: Optional[str] = None
    school_name: Optional[str] = None
    school_type: Optional[str] = None
    emis_id: Optional[str] = None
    school_medium: Optional[str] = None

    # Academic
    degree: Optional[str] = "Undergraduate (UG)"
    current_course: Optional[str] = "Engineering"
    college_name: Optional[str] = ""
    college_type: Optional[str] = "Government"
    year_of_study: Optional[str] = "1st Year (Fresher)"
    board_percentage: Optional[float] = 85.0
    admission_mode: Optional[str] = "govt_counseling_single_window"

    # Socio-Economic & Quota
    annual_income: Optional[float] = 140000.0
    is_first_graduate: Optional[bool] = True
    schooling_type: Optional[str] = "tn_govt_school_6_to_12"
    is_differently_abled: Optional[bool] = False
    special_category: Optional[str] = "None"
    avatar: Optional[str] = None
    custom_profile: Optional[Dict[str, Any]] = None

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/register")
def register_student(req: RegisterRequest):
    """Registers a student with complete bio-data and syncs directly into MongoDB Atlas cluster."""
    db = SessionLocal()
    try:
        resolved_student_type = req.student_type or (
            "school" if any(k in (req.current_course or "").lower() or k in (req.degree or "").lower() for k in ["class", "school", "sslc", "hsc", "primary", "middle", "grade", "std"])
            else "college"
        )
        bio_profile = {
            "full_name": req.full_name,
            "email": req.email.lower().strip(),
            "phone": req.phone or "",
            "gender": req.gender or "male",
            "dob": req.dob or "2006-05-14",
            "community": req.community or "BC",
            "district": req.district or "Chennai",
            "taluk": req.taluk or "",
            "city": req.city or req.district or "Chennai",
            "residence_type": req.residence_type or "Rural",
            "father_name": req.father_name or "",
            "student_type": resolved_student_type,
            "studentType": resolved_student_type,
            "current_level": resolved_student_type,
            "school_class": req.school_class or req.current_course or "",
            "school_name": req.school_name or req.college_name or "",
            "school_type": req.school_type or req.schooling_type or "tn_govt_school_6_to_12",
            "emis_id": req.emis_id or "",
            "school_medium": req.school_medium or "Tamil Medium",
            "degree": req.degree or ("High School (Class 9 - 10 / SSLC)" if resolved_student_type == "school" else "Undergraduate (UG)"),
            "current_course": req.current_course or (req.school_class if resolved_student_type == "school" else "Engineering"),
            "college_name": req.college_name or "",
            "college_type": req.college_type or "Government",
            "year_of_study": req.year_of_study or ("Class 10" if resolved_student_type == "school" else "1st Year (Fresher)"),
            "board_percentage": float(req.board_percentage if req.board_percentage is not None else 85.0),
            "admission_mode": req.admission_mode or "govt_counseling_single_window",
            "annual_income": float(req.annual_income if req.annual_income is not None else 140000.0),
            "is_first_graduate": bool(req.is_first_graduate) if resolved_student_type != "school" else False,
            "schooling_type": req.schooling_type or req.school_type or "tn_govt_school_6_to_12",
            "is_differently_abled": bool(req.is_differently_abled),
            "special_category": req.special_category or "None",
            "avatar": req.avatar,
            "available_docs": ["income_certificate", "community_certificate", "marksheet", "bonafide_certificate", "aadhaar_bank"],
            "verified_documents": []
        }
        if req.custom_profile:
            bio_profile.update(req.custom_profile)

        user = register_user(
            db, 
            email=req.email, 
            password=req.password, 
            full_name=req.full_name,
            community=req.community or "BC",
            district=req.district or "Chennai",
            custom_profile=bio_profile
        )
        auth_data = authenticate_user(db, req.email, req.password)
        if auth_data:
            auth_data["student_type"] = resolved_student_type
            if "profile" in auth_data and isinstance(auth_data["profile"], dict):
                auth_data["profile"]["student_type"] = resolved_student_type
                auth_data["profile"]["studentType"] = resolved_student_type
        return {"status": "success", "user": auth_data}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
    finally:
        db.close()

@app.post("/api/auth/login")
def login_student(req: LoginRequest):
    """Authenticates student credentials and returns saved profile."""
    db = SessionLocal()
    try:
        auth_data = authenticate_user(db, req.email, req.password)
        if not auth_data:
            raise HTTPException(status_code=401, detail="Invalid student email or password.")
        return {"status": "success", "user": auth_data}
    finally:
        db.close()

class ProfileUpdateRequest(BaseModel):
    user_id: str
    profile_data: Dict[str, Any]

@app.post("/api/auth/profile")
def save_student_profile(req: ProfileUpdateRequest):
    """Persists student evaluation profile into database."""
    db = SessionLocal()
    try:
        saved = create_user_profile(db, req.user_id, req.profile_data)
        prof_res = saved.get("profile_data", saved) if isinstance(saved, dict) else getattr(saved, "profile_data", saved)
        return {"status": "success", "profile": prof_res}
    finally:
        db.close()

@app.get("/api/auth/profile/{user_id}")
def get_student_profile_endpoint(user_id: str):
    """Retrieves saved student profile and avatar from SQLite and MongoDB."""
    db = SessionLocal()
    try:
        data = get_user_profile(db, user_id)
        if not data:
            raise HTTPException(status_code=404, detail="Profile not found in database")
        return {"status": "success", "profile": data}
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
