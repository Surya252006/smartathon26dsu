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
    st = str(getattr(profile, 'schooling_type', '') or "").lower()
    ct = str(getattr(profile, 'college_type', '') or "").lower()
    is_govt = (
        st == "tn_govt_school_6_to_12" or 
        "govt" in st or 
        ct == "government" or 
        "government" in ct or
        getattr(profile, 'is_govt_school', False)
    )
    if govt_school_only and not is_govt:
        reasons.append("Requires continuous study in Tamil Nadu Government Schools")
        
    # 6. First graduate only
    if criteria.get("first_graduate_only", False) and not profile.is_first_graduate:
        reasons.append("Requires first graduate status")
        
    # 7. Differently abled only
    if criteria.get("differently_abled_only", False) and not profile.is_differently_abled:
        reasons.append("Requires differently abled status")
        
    # 8. Course & Grade Level check (Collegiate vs School Class 1 to 12 vs Ph.D.)
    c_lower = str(profile.current_course or "").lower()
    d_lower = str(getattr(profile, 'degree', '') or "").lower()
    
    is_school = any(k in c_lower or k in d_lower for k in [
        "class", "school", "primary", "middle", "sslc", "hsc", "grade",
        "வகுப்பு", "பள்ளி", "std"
    ]) or any(d_lower.startswith(p) for p in ["primary", "middle", "high school", "higher secondary"])
    
    is_phd = "phd" in c_lower or "ph.d" in c_lower or "research" in c_lower or "doctorate" in c_lower or "phd" in d_lower
    
    scheme_id = scheme.get("id", "")
    allowed_courses = criteria.get("allowed_courses", ["All"])
    
    # A. Check PhD exclusivity
    if scheme_id == "cm-research-fellowship" or "fellowship" in scheme.get("category", ""):
        if not is_phd:
            reasons.append("Exclusively for Ph.D. doctoral research scholars")
            return False, reasons
            
    # B. Collegiate-only schemes: must NOT be awarded to current school students
    COLLEGIATE_ONLY_IDS = {
        "tn-first-graduate", "first-graduate", "tn-pudhumai-penn", "pudhumai-penn",
        "tn-tamil-pudhalvan", "tamil-pudhalvan", "cm-research-fellowship", "aicte-pragati",
        "pm-usp-csss", "post-matric-sc", "post-matric-st", "pm-yasasvi-post-matric",
        "minority-post-matric", "free-education-bc-mbc", "mcm-minorities", "pwd-post-matric",
        "naan-mudhalvan", "vetri-laptop", "cm-breakfast-scheme-college",
        "stipend-tamil-medium", "deceased-govt-servants-scholarship", "free-education-bc-mbc-dnc",
        "minority-mcm", "pm-yasasvi-top-class"
    }
    target_lower = scheme.get("target_beneficiaries", "").lower()
    if is_school:
        if scheme_id in COLLEGIATE_ONLY_IDS or ("post-matric" in scheme_id and "pre-matric" not in scheme_id):
            reasons.append("Requires completed 12th standard and active enrollment in higher education (UG/PG/Diploma)")
            return False, reasons
        if ("college" in target_lower or "undergraduate" in target_lower or "postgraduate" in target_lower) and "school" not in target_lower and "class" not in target_lower:
            reasons.append("Designated for college and university students only")
            return False, reasons

    # C. School-only schemes: must NOT be awarded to college/university students
    SCHOOL_ONLY_IDS = {
        "cm-breakfast-scheme", "pm-poshan", "free-bicycle-scheme", "free-textbooks-notebooks",
        "free-guides-question-banks", "nmms-scholarship", "samagra-shiksha", "pre-matric-sc",
        "pre-matric-st", "pm-yasasvi-pre-matric", "minority-pre-matric", "pwd-pre-matric",
        "rural-girls-scholarship", "thiran-next", "rte-25-reimbursement"
    }
    if not is_school and (scheme_id in SCHOOL_ONLY_IDS or "pre-matric" in scheme_id):
        reasons.append("Exclusively for currently enrolled school students (Classes 1 to 12)")
        return False, reasons

    # D. School Grade-Level Precision Matching
    if is_school:
        import re
        grade_match = re.search(r'(?:class|std|grade|வகுப்பு)\s*(\d+)', f"{c_lower} {d_lower}")
        grade_num = int(grade_match.group(1)) if grade_match else None
        if grade_num is None:
            if "primary" in c_lower or "primary" in d_lower or "தொடக்க" in d_lower: grade_num = 3
            elif "middle" in c_lower or "middle" in d_lower or "நடுநிலை" in d_lower: grade_num = 7
            elif "high school" in c_lower or "sslc" in c_lower or "10" in c_lower or "உயர்நிலை" in d_lower: grade_num = 10
            elif "higher secondary" in c_lower or "hsc" in c_lower or "11" in c_lower or "12" in c_lower or "மேல்நிலை" in d_lower: grade_num = 11

        # Breakfast scheme: Class 1 to 5
        if scheme_id == "cm-breakfast-scheme" and grade_num is not None and grade_num > 5:
            reasons.append(f"Chief Minister's Breakfast Scheme is allocated for Primary Schools (Classes 1 to 5); current grade is Class {grade_num}.")
            return False, reasons
            
        # Free Bicycle scheme: Class 11 and 12 only
        if scheme_id == "free-bicycle-scheme" and grade_num is not None and grade_num < 11:
            reasons.append(f"Free Bicycle Scheme is exclusively distributed to Higher Secondary students (Classes 11 & 12); current grade is Class {grade_num}.")
            return False, reasons
            
        # Pre-Matric SC/ST/OBC/Minority: Class 9 and 10 only (Class 1-8 for PwD)
        if ("pre-matric" in scheme_id and scheme_id != "pwd-pre-matric") and grade_num is not None and (grade_num < 9 or grade_num > 10):
            reasons.append(f"Pre-Matric scholarship covers secondary examination classes (Class 9 & 10); current grade is Class {grade_num}.")
            return False, reasons

        # NMMS: Class 9 to 12
        if scheme_id == "nmms-scholarship" and grade_num is not None and grade_num < 9:
            reasons.append("NMMS scholarship disbursal commences in Class 9 following the Class 8 qualifying examination.")
            return False, reasons

        # Question Banks & Guides: Class 10 & 12 Board Exam students
        if scheme_id == "free-guides-question-banks" and grade_num is not None and grade_num not in [10, 12]:
            reasons.append("Board Exam study materials and question banks are designated for Class 10 (SSLC) and Class 12 (HSC) board students.")
            return False, reasons
            
        # Free textbooks & notebooks: Class 1 to 8
        if scheme_id == "free-textbooks-notebooks" and grade_num is not None and grade_num > 8:
            reasons.append(f"Free textbook distribution scheme applies to Elementary and Middle schools (Classes 1 to 8); current grade is Class {grade_num}.")
            return False, reasons

        # RTE 25% reimbursement: only for private school quota admissions
        if scheme_id == "rte-25-reimbursement" and profile.schooling_type == "tn_govt_school_6_to_12":
            reasons.append("RTE 25% fee reimbursement applies to private unaided schools; candidate is currently in a Government school.")
            return False, reasons

        # Minority Pre-Matric: for BCM / notified religious minorities
        if scheme_id == "minority-pre-matric" and (profile.community or "").upper() not in ["BCM", "MINORITY"]:
            reasons.append("Minority Pre-Matric is strictly for notified religious/linguistic minorities (BCM/Minority).")
            return False, reasons

    # E. General Course Check for Collegiate
    if not is_school and "All" not in allowed_courses:
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
    
    if category in ["entitlement", "welfare_inkind"]:
        return SelectionProbability(
            score=98.0,
            level="Guaranteed",
            explanation="Statutory welfare entitlement backed by Tamil Nadu state budget. 100% guaranteed on active school/college enrollment."
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

    # At most one Pre-Matric maintenance scholarship (excluding PwD)
    pre_matric_count = sum(1 for s in bundle if "pre-matric" in s.get("id", "") and s.get("id", "") != "pwd-pre-matric")
    if pre_matric_count > 1:
        return False

    # At most one Post-Matric maintenance scholarship (excluding PwD)
    post_matric_count = sum(1 for s in bundle if "post-matric" in s.get("id", "") and s.get("id", "") != "pwd-post-matric")
    if post_matric_count > 1:
        return False

    return True

def solve_optimal_bundle(profile: UserProfile, all_schemes: List[dict]) -> EvaluationResponse:
    eligible_schemes = []
    
    # 1. Filter out completely ineligible schemes
    for scheme in all_schemes:
        is_el, _ = is_scheme_eligible(profile, scheme)
        if is_el:
            eligible_schemes.append(scheme)
            
    # If no schemes are eligible, return empty early
    if not eligible_schemes:
        return EvaluationResponse(
            recommended_bundle=[],
            total_financial_value=0,
            excluded_schemes=[],
            selection_probabilities={}
        )

    # 2. Partition into conflict-free schemes vs conflicting clusters for ultra-fast MWIS
    eligible_ids = {s["id"] for s in eligible_schemes}
    conflicting_schemes = []
    free_schemes = []

    for s in eligible_schemes:
        excs = set(s.get("mutually_exclusive_with", []))
        if excs.intersection(eligible_ids):
            conflicting_schemes.append(s)
        else:
            free_schemes.append(s)

    free_total = sum(s.get("financial_value", 0) for s in free_schemes)

    # MWIS on conflicting subset (typically 2-4 items max)
    m = len(conflicting_schemes)
    best_conflict_bundle = []
    max_conflict_val = 0

    if m > 0:
        # If m is small, evaluate all subsets
        limit = min(m, 12)
        for i in range(1 << limit):
            cand = [conflicting_schemes[j] for j in range(limit) if (i & (1 << j))]
            c_val = sum(s.get("financial_value", 0) for s in cand)
            if c_val > max_conflict_val and is_bundle_valid(cand):
                max_conflict_val = c_val
                best_conflict_bundle = cand
    
    best_bundle = free_schemes + best_conflict_bundle
    max_value = free_total + max_conflict_val
            
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
