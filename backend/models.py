from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Literal, Any

class UserProfile(BaseModel):
    user_id: Optional[str] = Field(None, description="Optional UUID linking to database User")
    full_name: str = Field("Student Candidate", description="Full name of the student")
    gender: str = Field("male", description="Gender")
    community: str = Field("BC", description="Community category")
    annual_income: float = Field(140000.0, description="Annual family income in INR")
    is_first_graduate: bool = Field(False, description="True if first graduate in family")
    schooling_type: str = Field("tn_govt_school_6_to_12", description="Schooling category")
    board_percentage: float = Field(85.0, ge=0.0, le=100.0, description="12th/Board marks percentage")
    admission_mode: str = Field("govt_counseling_single_window", description="Admission mode")
    current_course: str = Field("Engineering", description="Course name or category")
    is_differently_abled: bool = Field(False, description="True if possessing disability certificate")
    disability_percentage: Optional[float] = Field(None, ge=0.0, le=100.0, description="Disability severity percentage")
    available_docs: List[str] = Field(default_factory=list, description="List of available document keys")
    district: Optional[str] = None
    taluk: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None

    class Config:
        extra = "allow"

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
