import json
import os
import hashlib
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List

from sqlalchemy import create_engine, Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# --- 1. SQLite Database Setup (Resilient Fallback) ---
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    profile_data = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# --- 2. MongoDB Atlas Integration ---
ENV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")

def _load_env():
    if os.path.exists(ENV_PATH):
        try:
            with open(ENV_PATH, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ[k.strip()] = v.strip()
        except Exception:
            pass

_load_env()

MONGODB_CLUSTER_URI_TEMPLATE = os.getenv(
    "MONGODB_URI",
    "mongodb+srv://<db_username>:YwNJOZkLIRefHTaU@cluster0.fzucldr.mongodb.net/?appName=Cluster0"
)
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "smartathon_scholarships")
DIRECT_SHARD_HOSTS = "ac-1agfibl-shard-00-00.fzucldr.mongodb.net:27017,ac-1agfibl-shard-00-01.fzucldr.mongodb.net:27017,ac-1agfibl-shard-00-02.fzucldr.mongodb.net:27017"
DIRECT_SHARD_OPTS = "ssl=true&replicaSet=atlas-eotjuz-shard-0&authSource=admin&appName=Cluster0"

_mongo_client = None
_mongo_connected = False
_mongo_error_reason = None
_configured_username = os.getenv("MONGODB_USERNAME", "")

def _save_env_var(key: str, value: str):
    """Persists an environment variable to the root .env file."""
    try:
        env_lines = []
        found = False
        if os.path.exists(ENV_PATH):
            with open(ENV_PATH, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip().startswith(f"{key}="):
                        env_lines.append(f"{key}={value}\n")
                        found = True
                    else:
                        env_lines.append(line)
        if not found:
            env_lines.append(f"{key}={value}\n")
        with open(ENV_PATH, "w", encoding="utf-8") as f:
            f.writelines(env_lines)
    except Exception as e:
        print(f"[ENV Persistence Notice] Could not write to .env: {e}")

def init_mongodb(username_or_uri: Optional[str] = None):
    """
    Initializes MongoDB client. Supports username, full connection URI, and automatic
    direct replica set fallback to bypass local network DNS SRV issues.
    """
    global _mongo_client, _mongo_connected, _mongo_error_reason, _configured_username
    
    from pymongo import MongoClient

    if username_or_uri:
        val = username_or_uri.strip()
        if val.startswith("mongodb://") or val.startswith("mongodb+srv://"):
            target_uri = val
            _configured_username = "custom_uri"
        else:
            _configured_username = val
            raw_uri = MONGODB_CLUSTER_URI_TEMPLATE
            if "<db_username>" in raw_uri:
                target_uri = raw_uri.replace("<db_username>", _configured_username)
            else:
                target_uri = raw_uri
    else:
        raw_uri = MONGODB_CLUSTER_URI_TEMPLATE
        if "<db_username>" in raw_uri:
            if _configured_username:
                target_uri = raw_uri.replace("<db_username>", _configured_username)
            else:
                _mongo_connected = False
                _mongo_error_reason = "MongoDB URI contains placeholder '<db_username>'. Set MONGODB_USERNAME or configure via UI/API."
                return False
        else:
            target_uri = raw_uri

    # Attempt 1: Connect with target URI (SRV or direct)
    uris_to_try = [target_uri]
    
    # If the target URI has cluster0.fzucldr and we know the username, also prepare the direct replica set fallback
    if _configured_username and _configured_username != "custom_uri" and "cluster0.fzucldr" in target_uri:
        direct_uri = f"mongodb://{_configured_username}:YwNJOZkLIRefHTaU@{DIRECT_SHARD_HOSTS}/?{DIRECT_SHARD_OPTS}"
        if direct_uri != target_uri:
            uris_to_try.append(direct_uri)

    last_error = None
    for uri in uris_to_try:
        try:
            client = MongoClient(
                uri,
                serverSelectionTimeoutMS=4000,
                connectTimeoutMS=4000
            )
            client.admin.command('ping')
            _mongo_client = client
            _mongo_connected = True
            _mongo_error_reason = None
            print(f"[MongoDB Atlas] Successfully connected to cluster! Active database: {MONGODB_DB_NAME}")
            
            # Save working config to .env
            if _configured_username and _configured_username != "custom_uri":
                _save_env_var("MONGODB_USERNAME", _configured_username)
            elif target_uri.startswith("mongodb"):
                _save_env_var("MONGODB_URI", target_uri)
            return True
        except Exception as e:
            last_error = e

    _mongo_connected = False
    _mongo_error_reason = str(last_error) if last_error else "Connection failed"
    print(f"[MongoDB Atlas] Connection notice: {_mongo_error_reason}. Fallback to SQLite is active.")
    return False

# Attempt initial connection with environment settings
init_mongodb()

def get_db_status() -> Dict[str, Any]:
    """Returns the operational status of SQLite and MongoDB Atlas."""
    return {
        "sqlite": {
            "status": "active",
            "db_path": DB_PATH
        },
        "mongodb": {
            "connected": _mongo_connected,
            "cluster_host": "cluster0.fzucldr.mongodb.net",
            "database": MONGODB_DB_NAME,
            "username_configured": bool(_configured_username),
            "username": _configured_username if _configured_username else "<db_username>",
            "error_reason": _mongo_error_reason
        }
    }

def configure_mongodb_username(username: str) -> Dict[str, Any]:
    """Dynamically updates the MongoDB username and tests connection."""
    success = init_mongodb(username=username)
    return {
        "success": success,
        "status": get_db_status()
    }

def get_mongo_collection(collection_name: str):
    """Returns a pymongo collection if connected, else None."""
    if _mongo_connected and _mongo_client:
        try:
            return _mongo_client[MONGODB_DB_NAME][collection_name]
        except Exception:
            return None
    return None

# --- 3. User & Profile Operations (Dual SQLite + MongoDB) ---

def hash_password(password: str) -> str:
    return hashlib.sha256(f"tn_gov_salt_{password}".encode("utf-8")).hexdigest()

def register_user(
    db: Session, 
    email: str, 
    password: str, 
    full_name: str, 
    community: str = "BC", 
    district: str = "Chennai",
    custom_profile: Optional[Dict[str, Any]] = None
) -> User:
    cleaned_email = email.lower().strip()
    existing = db.query(User).filter(User.email == cleaned_email).first()
    if existing:
        raise ValueError("A student account with this email already exists.")
    
    user_id = str(uuid.uuid4())
    hashed_pwd = hash_password(password)
    now = datetime.utcnow()

    # 1. Save to SQLite
    user = User(
        id=user_id,
        email=cleaned_email,
        password_hash=hashed_pwd,
        created_at=now
    )
    db.add(user)
    
    profile_data = {
        "full_name": full_name,
        "email": cleaned_email,
        "community": community,
        "district": district,
        "annual_income": 120000,
        "gender": "female",
        "schooling_type": "tn_govt_school_6_to_12",
        "is_first_graduate": True,
        "board_percentage": 85.0,
        "current_course": "Engineering",
        "admission_mode": "govt_counseling_single_window",
        "available_docs": ["income_certificate", "community_certificate"]
    }
    if custom_profile:
        profile_data.update(custom_profile)

    profile = Profile(user_id=user_id, profile_data=profile_data, updated_at=now)
    db.add(profile)
    db.commit()
    db.refresh(user)

    # 2. Sync to MongoDB Atlas if available
    mongo_users = get_mongo_collection("users")
    if mongo_users is not None:
        try:
            mongo_users.update_one(
                {"_id": user_id},
                {"$set": {
                    "_id": user_id,
                    "email": cleaned_email,
                    "password_hash": hashed_pwd,
                    "full_name": full_name,
                    "created_at": now.isoformat(),
                    "profile": profile_data
                }},
                upsert=True
            )
        except Exception as me:
            print(f"[MongoDB Sync Notice] User sync failed: {me}")

    return user

def authenticate_user(db: Session, email: str, password: str) -> Optional[Dict[str, Any]]:
    cleaned_email = email.lower().strip()
    
    # Auto-provision or authenticate official demo admin if requested
    if cleaned_email in ["admin@tnega.tn.gov.in", "admin@tn.gov.in", "admin@dsu.tn.gov.in"]:
        user = db.query(User).filter(User.email == cleaned_email).first()
        if not user and password in ["admin2026", "admin123"]:
            user = register_user(
                db, 
                cleaned_email, 
                password, 
                "TNeGA System Administrator", 
                community="OC", 
                district="Chennai",
                custom_profile={"role": "admin"}
            )
        elif user and user.password_hash != hash_password(password) and password in ["admin2026", "admin123"]:
            user.password_hash = hash_password(password)
            db.commit()

    # Auto-provision official demo student Priya if requested
    elif cleaned_email == "priya.demo@dsu.tn.gov.in":
        user = db.query(User).filter(User.email == cleaned_email).first()
        if not user and password in ["tnstudent2026", "student123", "priya2026"]:
            user = register_user(
                db,
                cleaned_email,
                password,
                "Priya Murugesan",
                community="BC",
                district="Pudukkottai",
                custom_profile={
                    "gender": "female",
                    "annual_income": 120000,
                    "schooling_type": "tn_govt_school_6_to_12",
                    "is_first_graduate": True,
                    "board_percentage": 88.5,
                    "current_course": "Engineering",
                    "admission_mode": "govt_counseling_single_window",
                    "available_docs": ['income_certificate', 'community_certificate', 'first_graduate_certificate', 'bonafide_certificate', 'marksheet', 'aadhaar_bank']
                }
            )

    # Auto-provision official demo student Karthik if requested
    elif cleaned_email == "karthik.demo@dsu.tn.gov.in":
        user = db.query(User).filter(User.email == cleaned_email).first()
        if not user and password in ["tnstudent2026", "student123", "karthik2026"]:
            user = register_user(
                db,
                cleaned_email,
                password,
                "Karthikeyan R",
                community="OC",
                district="Chennai",
                custom_profile={
                    "gender": "male",
                    "annual_income": 350000,
                    "schooling_type": "private_matric",
                    "is_first_graduate": False,
                    "board_percentage": 94.2,
                    "current_course": "Medical",
                    "admission_mode": "govt_counseling_single_window",
                    "available_docs": ['income_certificate', 'community_certificate', 'bonafide_certificate', 'marksheet', 'aadhaar_bank']
                }
            )

    user = db.query(User).filter(User.email == cleaned_email).first()
    if not user:
        return None
    if user.password_hash != hash_password(password):
        return None
    
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    profile_dict = profile.profile_data if profile else {}

    # Determine role: admin vs student
    is_admin = cleaned_email.startswith("admin") or "admin" in cleaned_email or profile_dict.get("role") == "admin"
    role = "admin" if is_admin else "student"
    profile_dict["role"] = role

    return {
        "user_id": user.id,
        "email": user.email,
        "role": role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "profile": profile_dict
    }

def create_user_profile(db: Session, user_id: str, profile_data: Dict[str, Any]) -> Profile:
    """Creates or updates a user profile in SQLite and MongoDB."""
    now = datetime.utcnow()
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile:
        profile.profile_data = profile_data
        profile.updated_at = now
    else:
        profile = Profile(user_id=user_id, profile_data=profile_data, updated_at=now)
        db.add(profile)
    
    db.commit()
    db.refresh(profile)

    # Sync to MongoDB Atlas
    mongo_profiles = get_mongo_collection("profiles")
    if mongo_profiles is not None:
        try:
            mongo_profiles.update_one(
                {"_id": user_id},
                {"$set": {
                    "_id": user_id,
                    "profile_data": profile_data,
                    "updated_at": now.isoformat()
                }},
                upsert=True
            )
        except Exception as me:
            print(f"[MongoDB Sync Notice] Profile sync failed: {me}")

    return profile

def get_user_profile(db: Session, user_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a user profile as a dictionary from SQLite and MongoDB Atlas."""
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile and profile.profile_data:
        return profile.profile_data

    # Fallback to MongoDB Atlas
    mongo_profiles = get_mongo_collection("profiles")
    if mongo_profiles is not None:
        try:
            doc = mongo_profiles.find_one({"_id": user_id})
            if doc and "profile_data" in doc:
                return doc["profile_data"]
        except Exception:
            pass
    return None

def log_evaluation_to_db(user_id: Optional[str], profile_data: Dict[str, Any], evaluation_result: Dict[str, Any]):
    """Logs an MWIS evaluation event to MongoDB collection 'evaluations'."""
    mongo_evals = get_mongo_collection("evaluations")
    if mongo_evals is not None:
        try:
            mongo_evals.insert_one({
                "user_id": user_id or "anonymous",
                "timestamp": datetime.utcnow().isoformat(),
                "profile": profile_data,
                "total_max_cash": evaluation_result.get("total_max_cash", 0),
                "optimal_bundle": [s.get("id") for s in evaluation_result.get("optimal_bundle", [])],
                "eligible_count": len(evaluation_result.get("eligible_schemes", []))
            })
        except Exception as me:
            print(f"[MongoDB Sync Notice] Evaluation log failed: {me}")

# --- 4. Schemes Caching & Datasets ---

_SCHEMES_CACHE = None
_CATALOG_CACHE = None

def load_schemes() -> list:
    """
    Loads core schemes for MWIS optimization graph engine (from schemes.json).
    """
    global _SCHEMES_CACHE
    if _SCHEMES_CACHE is not None:
        return _SCHEMES_CACHE
        
    filepath = os.path.join(os.path.dirname(__file__), "data", "schemes.json")
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Schemes dataset not found at {filepath}")
        
    with open(filepath, "r", encoding="utf-8") as f:
        _SCHEMES_CACHE = json.load(f)
        return _SCHEMES_CACHE

def load_schemes_catalog(force_reload: bool = False) -> list:
    """
    Loads comprehensive catalog of all 47 TN State & Central schemes from the official September 2026 Master Reference.
    """
    global _CATALOG_CACHE
    if _CATALOG_CACHE is not None and not force_reload:
        return _CATALOG_CACHE

    catalog_path = os.path.join(os.path.dirname(__file__), "data", "all_schemes_catalog.json")
    if os.path.exists(catalog_path):
        with open(catalog_path, "r", encoding="utf-8") as f:
            _CATALOG_CACHE = json.load(f)
            return _CATALOG_CACHE
    
    # Fallback to schemes.json if catalog not found
    return load_schemes()

