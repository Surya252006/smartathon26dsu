import pytest
from backend.models import UserProfile
from backend.engine import is_scheme_eligible, calculate_selection_probability, solve_optimal_bundle
from backend.database import load_schemes
import backend.database

@pytest.fixture(autouse=True)
def reset_schemes_cache():
    """Ensure fresh copy of schemes dataset for every test."""
    backend.database._SCHEMES_CACHE = None

@pytest.fixture
def all_schemes():
    return load_schemes()

# ============================================================================
# 1. TEST: Income Hard Boundary Verification
# ============================================================================
def test_income_hard_boundary(all_schemes):
    """
    Verifies strict boundary adherence:
    - Income == ceiling (₹2,50,000) -> ELIGIBLE
    - Income == ceiling + ₹1 (₹2,50,001) -> INELIGIBLE with explicit reason.
    """
    post_matric = next(s for s in all_schemes if s["id"] == "tn-post-matric-sc-st")
    assert post_matric["criteria"]["max_income"] == 250000

    # Case A: Exactly on ceiling
    profile_at_boundary = UserProfile(
        full_name="Boundary Candidate",
        gender="female",
        community="SC",
        annual_income=250000.0,
        is_first_graduate=False,
        schooling_type="tn_govt_school_6_to_12",
        board_percentage=85.0,
        admission_mode="govt_counseling_single_window",
        current_course="Engineering",
        is_differently_abled=False
    )
    is_el_a, reasons_a = is_scheme_eligible(profile_at_boundary, post_matric)
    assert is_el_a is True, f"Failed at exact boundary: {reasons_a}"

    # Case B: Exactly 1 Rupee over ceiling
    profile_above_boundary = UserProfile(
        full_name="Above Boundary Candidate",
        gender="female",
        community="SC",
        annual_income=250001.0,
        is_first_graduate=False,
        schooling_type="tn_govt_school_6_to_12",
        board_percentage=85.0,
        admission_mode="govt_counseling_single_window",
        current_course="Engineering",
        is_differently_abled=False
    )
    is_el_b, reasons_b = is_scheme_eligible(profile_above_boundary, post_matric)
    assert is_el_b is False, "Candidate with income over ceiling should be rejected"
    assert any("exceeds maximum" in r for r in reasons_b), f"Expected income limit rejection reason, got: {reasons_b}"

# ============================================================================
# 2. TEST: Mutual Exclusivity MWIS Graph Optimizer
# ============================================================================
def test_mutual_exclusivity_mwis():
    """
    Synthetic graph test:
    Scheme A (₹50,000) and Scheme B (₹25,000) are mutually exclusive.
    MWIS optimizer must strictly select Scheme A (₹50,000) and log
    the exact incompatibility rationale explaining why Scheme B was dropped.
    """
    mock_schemes = [
        {
            "id": "mock-scheme-a",
            "name": "High Value Scheme A",
            "category": "entitlement",
            "financial_value": 50000,
            "benefit_breakdown": {"tuition_waiver": 50000, "maintenance_stipend": 0, "book_allowance": 0},
            "criteria": {"gender": "any", "eligible_communities": ["OC", "BC", "SC"], "max_income": None, "min_percentage": 0},
            "mutually_exclusive_with": ["mock-scheme-b"]
        },
        {
            "id": "mock-scheme-b",
            "name": "Lower Value Scheme B",
            "category": "entitlement",
            "financial_value": 25000,
            "benefit_breakdown": {"tuition_waiver": 25000, "maintenance_stipend": 0, "book_allowance": 0},
            "criteria": {"gender": "any", "eligible_communities": ["OC", "BC", "SC"], "max_income": None, "min_percentage": 0},
            "mutually_exclusive_with": ["mock-scheme-a"]
        }
    ]

    profile = UserProfile(
        full_name="Conflict Candidate",
        gender="male",
        community="BC",
        annual_income=150000,
        is_first_graduate=False,
        schooling_type="govt_aided",
        board_percentage=80.0,
        admission_mode="govt_counseling_single_window",
        current_course="Engineering",
        is_differently_abled=False
    )

    response = solve_optimal_bundle(profile, mock_schemes)
    
    # Assert Scheme A was awarded
    awarded_ids = [s["id"] for s in response.recommended_bundle]
    assert awarded_ids == ["mock-scheme-a"]
    assert response.total_financial_value == 50000

    # Assert Scheme B was recorded in the exclusion ledger with exact reason
    assert len(response.excluded_schemes) == 1
    exclusion = response.excluded_schemes[0]
    assert exclusion.scheme_id == "mock-scheme-b"
    assert "High Value Scheme A" in exclusion.reason
    assert "higher net benefit" in exclusion.reason

# ============================================================================
# 3. TEST: Stackable Entitlements (Priya Benchmark)
# ============================================================================
def test_stackable_entitlements(all_schemes):
    """
    Asserts that statutory state entitlements (Pudhumai Penn + First Graduate)
    can be combined legally without collision for a female government school student.
    """
    priya_profile = UserProfile(
        full_name="Priya M",
        gender="female",
        community="BC",
        annual_income=120000,
        is_first_graduate=True,
        schooling_type="tn_govt_school_6_to_12",
        board_percentage=86.5,
        admission_mode="govt_counseling_single_window",
        current_course="Engineering",
        is_differently_abled=False,
        available_docs=["income_certificate", "community_certificate", "marksheet"]
    )

    response = solve_optimal_bundle(priya_profile, all_schemes)
    awarded_ids = {s["id"] for s in response.recommended_bundle}

    # Expected stack: First Graduate (₹25,000) + Pudhumai Penn (₹12,000) = ₹37,000
    assert "tn-first-graduate" in awarded_ids, "Priya must receive First Graduate concession"
    assert "tn-pudhumai-penn" in awarded_ids, "Priya must receive Pudhumai Penn monthly stipend"
    assert response.total_financial_value == 37000, f"Expected ₹37,000, got ₹{response.total_financial_value}"

    # Verify both entitlements carry Guaranteed 98% probability
    prob_penn = response.selection_probabilities["tn-pudhumai-penn"]
    prob_fg = response.selection_probabilities["tn-first-graduate"]
    assert prob_penn.score >= 95.0
    assert prob_penn.level == "Guaranteed"
    assert prob_fg.score >= 95.0
    assert prob_fg.level == "Guaranteed"

# ============================================================================
# 4. TEST: Probabilistic Scoring Calibration
# ============================================================================
def test_probabilistic_scoring(all_schemes):
    """
    Asserts:
    1. Statutory Entitlement schemes yield >= 95.0% score with 'Guaranteed' status.
    2. Competitive merit schemes scale with 12th marks (e.g. 95% marks vs 82% marks).
    """
    csss_scheme = next(s for s in all_schemes if s["id"] == "pm-usp-csss")

    # Candidate 1: High marks (95%)
    high_merit = UserProfile(
        full_name="High Scorer",
        gender="male",
        community="OC",
        annual_income=200000,
        is_first_graduate=False,
        schooling_type="private_cbse",
        board_percentage=95.0,
        admission_mode="management_quota",
        current_course="Engineering",
        available_docs=["marksheet", "aadhaar"]
    )
    prob_high = calculate_selection_probability(high_merit, csss_scheme)

    # Candidate 2: Marginal marks (81% - just above 80% cutoff)
    low_merit = UserProfile(
        full_name="Marginal Scorer",
        gender="male",
        community="OC",
        annual_income=200000,
        is_first_graduate=False,
        schooling_type="private_cbse",
        board_percentage=81.0,
        admission_mode="management_quota",
        current_course="Engineering",
        available_docs=["marksheet", "aadhaar"]
    )
    prob_low = calculate_selection_probability(low_merit, csss_scheme)

    assert prob_high.score > prob_low.score, "Higher 12th marks must yield strictly higher merit score"
    assert prob_high.score >= 85.0, f"Expected >= 85% for 95% marks, got {prob_high.score}%"
    assert prob_high.level == "High"

# ============================================================================
# 5. TEST: Empty / Unmatched Profile Safety
# ============================================================================
def test_empty_eligible_profile(all_schemes):
    """
    Verifies that a completely non-qualifying profile returns an empty bundle
    with ₹0 and does NOT raise exceptions or crash.
    """
    ineligible = UserProfile(
        full_name="Non Eligible",
        gender="male",
        community="OC",
        annual_income=5000000, # 50 Lakhs income
        is_first_graduate=False,
        schooling_type="other",
        board_percentage=45.0, # Below cutoffs
        admission_mode="management_quota",
        current_course="Engineering"
    )
    response = solve_optimal_bundle(ineligible, all_schemes)
    assert response.recommended_bundle == []
    assert response.total_financial_value == 0
    assert response.selection_probabilities == {}

# ============================================================================
# 6. TEST: All 3 Jury Demo Personas Benchmark
# ============================================================================
def test_all_three_personas_benchmark(all_schemes):
    """
    End-to-end integration test verifying that all 3 jury demo personas
    produce their exact hackathon demo benchmark yields.
    """
    # 1. Priya (Govt Stacking) -> ₹37,000
    p1 = UserProfile(
        full_name="Priya M", gender="female", community="BC", annual_income=120000,
        is_first_graduate=True, schooling_type="tn_govt_school_6_to_12",
        board_percentage=86.5, admission_mode="govt_counseling_single_window",
        current_course="Engineering", available_docs=["income_certificate", "community_certificate", "marksheet"]
    )
    r1 = solve_optimal_bundle(p1, all_schemes)
    assert r1.total_financial_value == 37000
    assert {"tn-first-graduate", "tn-pudhumai-penn"} == {s["id"] for s in r1.recommended_bundle}

    # 2. Karthik (Merit Conflict) -> ₹12,000 (CSSS)
    p2 = UserProfile(
        full_name="Karthik R", gender="male", community="OC", annual_income=210000,
        is_first_graduate=False, schooling_type="private_cbse",
        board_percentage=94.8, admission_mode="management_quota",
        current_course="Engineering", available_docs=["marksheet", "aadhaar"]
    )
    r2 = solve_optimal_bundle(p2, all_schemes)
    assert r2.total_financial_value == 12000
    assert [s["id"] for s in r2.recommended_bundle] == ["pm-usp-csss"]
    assert r2.selection_probabilities["pm-usp-csss"].score >= 85.0

    # 3. Ananya (Tech Merit) -> ₹50,000 (Pragati)
    p3 = UserProfile(
        full_name="Ananya S", gender="female", community="MBC", annual_income=340000,
        is_first_graduate=False, schooling_type="govt_aided",
        board_percentage=91.0, admission_mode="govt_counseling_single_window",
        current_course="Engineering", available_docs=["income_certificate", "community_certificate", "marksheet"]
    )
    r3 = solve_optimal_bundle(p3, all_schemes)
    assert r3.total_financial_value == 50000
    assert [s["id"] for s in r3.recommended_bundle] == ["aicte-pragati"]
    assert r3.selection_probabilities["aicte-pragati"].score >= 80.0
