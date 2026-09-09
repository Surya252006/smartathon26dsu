// ==============================================================================
// Cloud Cluster Persistence Engine (Firebase Cloud Firestore & MongoDB Atlas)
// Enables multi-device public synchronization for student profiles & evaluations
// ==============================================================================

import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Persists a candidate's profile to the cloud cluster database.
 * Syncs to Cloud Firestore and mirrors to backend/MongoDB when online.
 */
export async function saveProfileToCluster(profileData, user = null) {
  if (!profileData) return null;

  const sanitizedId = user?.user_id || 
    (profileData.full_name ? `student_${profileData.full_name.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : `guest_${Date.now()}`);

  const cloudPayload = {
    user_id: sanitizedId,
    full_name: profileData.full_name || user?.profile?.full_name || 'Student Candidate',
    email: user?.email || `${sanitizedId}@tnevidya.tn.gov.in`,
    gender: profileData.gender || 'male',
    community: profileData.community || 'BC',
    annual_income: Number(profileData.annual_income) || 0,
    district: profileData.district || 'Chennai',
    state: profileData.state || 'Tamil Nadu',
    degree: profileData.degree || 'Undergraduate (UG)',
    current_course: profileData.current_course || 'Engineering',
    board_percentage: Number(profileData.board_percentage) || 0,
    is_first_graduate: Boolean(profileData.is_first_graduate),
    schooling_type: profileData.schooling_type || 'tn_govt_school_6_to_12',
    is_differently_abled: Boolean(profileData.is_differently_abled),
    updated_at: new Date().toISOString(),
    cloud_synced: true,
    cluster: "tnscheme-ai-dsu-oneyes.firestore.google"
  };

  // 1. Write to Cloud Firestore Cluster
  try {
    const docRef = doc(db, 'student_profiles', sanitizedId);
    await setDoc(docRef, cloudPayload, { merge: true });
    console.log(`[Cloud Cluster] Profile synced to Firestore collection 'student_profiles' for: ${sanitizedId}`);
  } catch (firestoreErr) {
    console.warn("[Cloud Cluster] Firestore direct write notice:", firestoreErr.message);
  }

  // 2. Also mirror to MongoDB Atlas if local backend is available
  try {
    fetch('http://localhost:8000/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: sanitizedId,
        profile_data: cloudPayload
      })
    }).catch(() => {});
  } catch (e) {}

  return cloudPayload;
}

/**
 * Logs an evaluation result to the cloud cluster for institutional audit.
 */
export async function saveEvaluationToCluster(resultData, profileData) {
  if (!resultData) return null;

  const evalId = `EVAL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const evalPayload = {
    eval_id: evalId,
    candidate_name: profileData?.full_name || 'Guest Candidate',
    district: profileData?.district || 'Chennai',
    community: profileData?.community || 'BC',
    annual_income: Number(profileData?.annual_income) || 0,
    total_financial_value: resultData.total_financial_value || 0,
    recommended_bundle: (resultData.recommended_bundle || []).map(s => ({
      id: s.id,
      name: s.name,
      amount: s.financial_value,
      portal: s.portal_name
    })),
    eligible_count: resultData.eligible_schemes_count || 0,
    evaluated_at: new Date().toISOString(),
    cluster_synced: true
  };

  try {
    const docRef = doc(db, 'evaluations', evalId);
    await setDoc(docRef, evalPayload);
    console.log(`[Cloud Cluster] Evaluation logged in Firestore: ${evalId}`);
  } catch (err) {
    console.warn("[Cloud Cluster] Firestore evaluation log notice:", err.message);
  }

  return evalPayload;
}

/**
 * Saves an official scholarship application record to Cloud Firestore.
 */
export async function saveApplicationToCluster(applicationData) {
  if (!applicationData) return null;

  const refId = applicationData.refId || `TNEV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const appRecord = {
    ref_id: refId,
    scheme_name: applicationData.scheme_name || 'State Welfare Scheme',
    amount: applicationData.amount || 0,
    applicant_name: applicationData.applicant_name || 'Student Candidate',
    district: applicationData.district || 'Chennai',
    status: 'Submitted — Nodal Officer Verification Pending',
    submitted_at: new Date().toISOString(),
    portal_gateway: applicationData.portal_name || 'TN SSP Portal',
    cluster_source: 'public_web_client'
  };

  try {
    const docRef = doc(db, 'applications', refId);
    await setDoc(docRef, appRecord);
    console.log(`[Cloud Cluster] Application registered in Firestore: ${refId}`);
  } catch (err) {
    console.warn("[Cloud Cluster] Firestore application record notice:", err.message);
  }

  return appRecord;
}
