import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_stream_separation():
    print("=== Testing School and College Stream Separation ===\n")
    
    # 1. Test School Student Evaluation (Class 10)
    school_profile = {
        "full_name": "Kavitha Rajendran",
        "gender": "female",
        "community": "BC",
        "annual_income": 80000.0,
        "board_percentage": 92.0,
        "current_course": "Class 10 (SSLC)",
        "student_type": "school",
        "school_class": "Class 10",
        "school_name": "Govt Girls Higher Secondary School, Ashok Nagar, Chennai",
        "schooling_type": "tn_govt_school_6_to_12",
        "is_first_graduate": False,
        "is_differently_abled": False,
        "emis_id": "33020401402"
    }
    
    resp_school = requests.post(f"{BASE_URL}/api/evaluate", json=school_profile)
    assert resp_school.status_code == 200, f"Failed school evaluate: {resp_school.text}"
    school_eval = resp_school.json()
    
    school_bundle = school_eval.get("recommended_bundle", [])
    school_ids = [s.get("id") for s in school_bundle]
    print(f"School Student Bundle ({len(school_bundle)} schemes):")
    for s in school_bundle:
        print(f"  - [{s.get('id')}] {s.get('name')} -> INR {s.get('financial_value', 0):,}")
    
    # Check that NO collegiate-only scheme is in school bundle
    collegiate_leak = [sid for sid in school_ids if sid in [
        "tn-pudhumai-penn", "tn-tamil-pudhalvan", "tn-first-graduate", 
        "pm-usp-csss", "aicte-pragati", "post-matric-sc"
    ]]
    assert len(collegiate_leak) == 0, f"ERROR: Collegiate scheme leaked to school student: {collegiate_leak}"
    print("SUCCESS: 0 collegiate schemes leaked to school student.\n")
    
    # 2. Test College Student Evaluation (UG Engineering)
    college_profile = {
        "full_name": "Surya Suresh",
        "gender": "male",
        "community": "BC",
        "annual_income": 120000.0,
        "board_percentage": 91.5,
        "current_course": "B.E. Computer Science and Engineering",
        "degree": "Undergraduate",
        "student_type": "college",
        "schooling_type": "tn_govt_school_6_to_12",
        "is_first_graduate": True,
        "is_differently_abled": False
    }
    
    resp_college = requests.post(f"{BASE_URL}/api/evaluate", json=college_profile)
    assert resp_college.status_code == 200, f"Failed college evaluate: {resp_college.text}"
    college_eval = resp_college.json()
    
    college_bundle = college_eval.get("recommended_bundle", [])
    college_ids = [s.get("id") for s in college_bundle]
    print(f"College Student Bundle ({len(college_bundle)} schemes):")
    for s in college_bundle:
        print(f"  - [{s.get('id')}] {s.get('name')} -> INR {s.get('financial_value', 0):,}")
        
    # Check that NO school-only scheme is in college bundle
    school_leak = [sid for sid in college_ids if sid in [
        "cm-breakfast-scheme", "pm-poshan", "free-bicycle-scheme",
        "free-textbooks-notebooks", "free-guides-question-banks", "nmms-scholarship"
    ]]
    assert len(school_leak) == 0, f"ERROR: School scheme leaked to college student: {school_leak}"
    print("SUCCESS: 0 school schemes leaked to college student.\n")
    
    # 3. Test School Student Registration Endpoint
    import time
    school_reg = {
        "full_name": "Anbarasan Murugan",
        "email": f"anbu.school.test_{int(time.time())}@school.tn.gov.in",
        "password": "Password123!",
        "role": "student",
        "student_type": "school",
        "gender": "male",
        "community": "MBC",
        "annual_income": 72000.0,
        "school_class": "Class 11",
        "school_name": "Govt Boys Model Hr Sec School, Madurai",
        "school_type": "govt",
        "emis_id": "33240501809",
        "school_medium": "Tamil",
        "school_marks": 89.0,
        "current_course": "Class 11 (Science Group)"
    }
    
    resp_reg = requests.post(f"{BASE_URL}/api/register", json=school_reg)
    assert resp_reg.status_code == 200, f"Failed registration: {resp_reg.text}"
    reg_data = resp_reg.json()
    assert reg_data.get("student_type") == "school", "Registered user did not preserve student_type"
    assert reg_data.get("profile", {}).get("student_type") == "school", "Bio-profile did not preserve student_type"
    assert reg_data.get("profile", {}).get("school_class") == "Class 11", "Bio-profile did not preserve school_class"
    print(f"Registration Successful for School Student: {reg_data.get('email')}")
    print(f"Preserved Stream: {reg_data.get('student_type')}, Class: {reg_data.get('profile', {}).get('school_class')}")
    print("\nALL BACKEND STREAM SEPARATION TESTS PASSED!")

if __name__ == "__main__":
    test_stream_separation()
