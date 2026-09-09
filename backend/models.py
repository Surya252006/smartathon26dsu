from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Literal, Any

class UserProfile(BaseModel):
    user_id: Optional[str] = Field(None, description="Optional UUID linking to database User")
    full_name: str = Field(..., description="Full name of the student")
    gender: Literal["male", "female", "other"]
    community: Literal["OC", "BC", "MBC", "SC", "ST", "SCC"]
    annual_income: float = Field(..., description="Annual family income in INR")
    is_first_graduate: bool = Field(..., description="True if first graduate in family")
    schooling_type: Literal["tn_govt_school_6_to_12", "govt_aided", "private_cbse", "other"]
    board_percentage: float = Field(..., ge=0.0, le=100.0, description="12th/Board marks percentage")
    admission_mode: Literal["govt_counseling_single_window", "7.5_percent_govt_quota", "management_quota"]
    current_course: Literal["Engineering", "Arts & Science", "Medical", "Diploma", "All"]
    is_differently_abled: bool = Field(False, description="True if possessing disability certificate")
    disability_percentage: Optional[float] = Field(None, ge=0.0, le=100.0, description="Disability severity percentage")
    available_docs: List[str] = Field(default_factory=list, description="List of available document keys")

class SchemeExclusion(BaseModel):
    scheme_id: str
    scheme_name: str
    reason: str

class SelectionProbability(BaseModel):
    score: float
    level: Literal["High", "Medium", "Low", "Guaranteed"]
    explanation: str

class EvaluationResponse(BaseModel):
    recommended_bundle: List[Dict[str, Any]] = Field(..., description="Optimal bundle of schemes")
    total_financial_value: int = Field(..., description="Total maximum financial value in INR")
    excluded_schemes: List[SchemeExclusion] = Field(..., description="Schemes excluded due to conflicts or sub-optimality")
    selection_probabilities: Dict[str, SelectionProbability] = Field(..., description="Probability analysis per evaluated scheme")
