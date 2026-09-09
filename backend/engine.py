import math
from typing import List, Dict, Any, Tuple
from backend.models import UserProfile, SchemeExclusion, SelectionProbability, EvaluationResponse

def is_scheme_eligible(profile: UserProfile, scheme: dict) -> Tuple[bool, List[str]]:
    reasons = []
    criteria = scheme.get("criteria", {})
    
    # 1. Gender check
    req_gender = criteria.get("gender", "any")
    if req_gender != "any" and req_gender != profile.gender:
        reasons.append(f"Requires gender to be {req_gender}")
        
    # 2. Community check
    eligible_communities = criteria.get("eligible_communities", [])
    comm = str(profile.community or "").upper().strip()
    norm_comm = "BC" if "BCM" in comm or comm == "BC" else (
        "MBC" if ("MBC" in comm or "DNC" in comm) else (
            "SC" if ("SCA" in comm or comm == "SC") else comm
        )
    )
    if "All" not in eligible_communities and comm not in eligible_communities and norm_comm not in eligible_communities:
        reasons.append(f"Community {profile.community} not in {eligible_communities}")
        
    # 3. Income limit
    max_income = criteria.get("max_income")
    if max_income is not None and profile.annual_income > max_income:
        reasons.append(f"Income {profile.annual_income} exceeds maximum {max_income}")
        
    # 4. Percentage check
    min_percentage = criteria.get("min_percentage", 0.0)
    if profile.board_percentage < min_percentage:
        reasons.append(f"Board percentage {profile.board_percentage} is below minimum {min_percentage}")
        
    # 5. Government school only
    govt_school_only = criteria.get("govt_school_only", False)
    if govt_school_only and profile.schooling_type != "tn_govt_school_6_to_12":
        reasons.append("Requires 6th-12th study in TN Government School")
        
    # 6. First graduate only
    if criteria.get("first_graduate_only", False) and not profile.is_first_graduate:
        reasons.append("Requires first graduate status")
        
    # 7. Differently abled only
    if criteria.get("differently_abled_only", False) and not profile.is_differently_abled:
        reasons.append("Requires differently abled status")
        
    # 8. Course check
    allowed_courses = criteria.get("allowed_courses", ["All"])
    if "All" not in allowed_courses:
        c_lower = str(profile.current_course or "").lower()
        matched = False
        for ac in allowed_courses:
            ac_lower = ac.lower()
            if ac_lower in c_lower or c_lower in ac_lower:
                matched = True
                break
            if "eng" in c_lower and "engineering" in ac_lower:
                matched = True
                break
            if ("sci" in c_lower or "art" in c_lower) and "arts" in ac_lower:
                matched = True
                break
        if not matched:
            reasons.append(f"Course {profile.current_course} not in allowed courses {allowed_courses}")
        
    return len(reasons) == 0, reasons

def calculate_selection_probability(profile: UserProfile, scheme: dict) -> SelectionProbability:
    category = scheme.get("category", "entitlement")
    
    if category == "entitlement":
        return SelectionProbability(
            score=98.0,
            level="Guaranteed",
            explanation="Statutory welfare entitlement backed by state budget. Requires valid e-Sevai verification documents."
        )
        
    # merit_cum_means calculation
    scheme_id = scheme.get("id", "")
    criteria = scheme.get("criteria", {})
    max_income = criteria.get("max_income", 1000000) or 1000000
    
    if scheme_id == "pm-usp-csss":
        # Pure Central Sector Merit Quota (80th percentile threshold)
        s_merit = min(1.0, max(0.5, 0.6 + (profile.board_percentage - 80.0) / 20.0))
        s_income = max(0.0, 1.0 - (profile.annual_income / max_income))
        s_quota = 0.0
        s_doc = 1.0 if len(profile.available_docs) >= 2 else 0.8
        score = 0.70 * s_merit + 0.15 * s_income + 0.05 * s_quota + 0.10 * s_doc
    else:
        # Technical/State quota (e.g. Pragati)
        s_merit = min(1.0, max(0.5, 0.6 + (profile.board_percentage - 85.0) / 15.0))
        s_income = max(0.0, 1.0 - (profile.annual_income / max_income))
        s_quota = 0.0
        if profile.gender == "female": s_quota += 0.4
        if profile.community in ["SC", "ST", "MBC"]: s_quota += 0.3
        elif profile.community in ["BC", "SCC"]: s_quota += 0.2
        if profile.schooling_type == "tn_govt_school_6_to_12": s_quota += 0.3
        s_quota = min(1.0, s_quota)
        s_doc = 1.0 if len(profile.available_docs) >= 2 else 0.8
        score = 0.45 * s_merit + 0.25 * s_income + 0.20 * s_quota + 0.10 * s_doc

    score_percentage = round(score * 100, 1)
    
    if score_percentage >= 80:
        level = "High"
    elif score_percentage >= 50:
        level = "Medium"
    else:
        level = "Low"
        
    explanation = f"Merit delta ({round(s_merit*100)}%), economic need ({round(s_income*100)}%), social equity bonus ({round(s_quota*100)}%), doc readiness."
    
    return SelectionProbability(
        score=score_percentage,
        level=level,
        explanation=explanation
    )

def is_bundle_valid(bundle: List[dict]) -> bool:
    scheme_ids = {s["id"] for s in bundle}
    for scheme in bundle:
        exclusions = scheme.get("mutually_exclusive_with", [])
        for exc in exclusions:
            if exc in scheme_ids:
                return False
    return True

def solve_optimal_bundle(profile: UserProfile, all_schemes: List[dict]) -> EvaluationResponse:
    eligible_schemes = []
    
    # 1. Filter out completely ineligible schemes
    for scheme in all_schemes:
        is_el, _ = is_scheme_eligible(profile, scheme)
        if is_el:
            eligible_schemes.append(scheme)
            
    # 2. Find Maximum Weight Independent Set (MWIS) via bitmask
    n = len(eligible_schemes)
    best_bundle = []
    max_value = 0
    
    # If no schemes are eligible, return empty early
    if n == 0:
        return EvaluationResponse(
            recommended_bundle=[],
            total_financial_value=0,
            excluded_schemes=[],
            selection_probabilities={}
        )
    
    for i in range(1, (1 << n)):
        current_bundle = []
        current_val = 0
        for j in range(n):
            if (i & (1 << j)):
                current_bundle.append(eligible_schemes[j])
                current_val += eligible_schemes[j].get("financial_value", 0)
                
        if current_val > max_value and is_bundle_valid(current_bundle):
            max_value = current_val
            best_bundle = current_bundle
            
    best_bundle_ids = {s["id"] for s in best_bundle}
    
    # 3. Compile Response
    recommended_bundle = []
    selection_probabilities = {}
    
    for scheme in best_bundle:
        prob = calculate_selection_probability(profile, scheme)
        selection_probabilities[scheme["id"]] = prob
        recommended_bundle.append(scheme)
        
    excluded_schemes_list = []
    for scheme in eligible_schemes:
        if scheme["id"] not in best_bundle_ids:
            conflicts = []
            for best_s in best_bundle:
                if scheme["id"] in best_s.get("mutually_exclusive_with", []) or \
                   best_s["id"] in scheme.get("mutually_exclusive_with", []):
                    conflicts.append(best_s["name"])
            
            conflict_str = f"Incompatible with: {', '.join(conflicts)} which offers a higher net benefit." if conflicts else "Suboptimal financial combination."
            
            excluded_schemes_list.append(SchemeExclusion(
                scheme_id=scheme["id"],
                scheme_name=scheme["name"],
                reason=f"Excluded: {conflict_str}"
            ))
            
    return EvaluationResponse(
        recommended_bundle=recommended_bundle,
        total_financial_value=max_value,
        excluded_schemes=excluded_schemes_list,
        selection_probabilities=selection_probabilities
    )
