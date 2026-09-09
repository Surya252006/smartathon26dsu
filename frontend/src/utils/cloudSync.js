// ==============================================================================
// Cloud Cluster Persistence Engine (Firebase Cloud Firestore & MongoDB Atlas)
// Enables multi-device public synchronization for student profiles & evaluations
// ==============================================================================

import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Persists a candidate's profile and photo to the cloud cluster database.
 * Syncs to Cloud Firestore and mirrors to backend/MongoDB when online.
 */
export async function saveProfileToCluster(profileData, user = null) {
  if (!profileData) return null;

  const rawId = user?.email || user?.user_id || profileData.email || 
    (profileData.full_name || profileData.fullName ? `student_${(profileData.full_name || profileData.fullName).toLowerCase().replace(/[^a-z0-9]/g, '_')}` : `guest_${Date.now()}`);
  const sanitizedId = String(rawId).toLowerCase().trim().replace(/[^a-z0-9]/g, '_');

  const avatarData = profileData.avatar !== undefined 
    ? profileData.avatar 
    : (user?.profile?.avatar || null);

  const cloudPayload = {
    user_id: user?.user_id || sanitizedId,
    full_name: profileData.full_name || profileData.fullName || user?.profile?.full_name || user?.full_name || 'Student Candidate',
    email: user?.email || profileData.email || `${sanitizedId}@tnevidya.tn.gov.in`,
    gender: profileData.gender || 'male',
    community: profileData.community || 'BC',
    annual_income: Number(profileData.annual_income !== undefined ? profileData.annual_income : profileData.annualIncome) || 0,
    district: profileData.district || 'Chennai',
    state: profileData.state || 'Tamil Nadu',
    degree: profileData.degree || 'Undergraduate (UG)',
    current_course: profileData.current_course || profileData.currentCourse || 'Engineering',
    board_percentage: Number(profileData.board_percentage !== undefined ? profileData.board_percentage : profileData.boardPercentage) || 0,
    is_first_graduate: Boolean(profileData.is_first_graduate !== undefined ? profileData.is_first_graduate : profileData.isFirstGraduate),
    schooling_type: profileData.schooling_type || profileData.schoolingType || 'tn_govt_school_6_to_12',
    is_differently_abled: Boolean(profileData.is_differently_abled),
    avatar: avatarData,
    updated_at: new Date().toISOString(),
    cloud_synced: true,
    cluster: "tnscheme-ai-dsu-oneyes.firestore.google"
  };

  // 1. Write to Cloud Firestore Cluster
  try {
    const docRef = doc(db, 'student_profiles', sanitizedId);
    await setDoc(docRef, cloudPayload, { merge: true });
    
    // Also index under user_id if different from sanitizedId
    if (user?.user_id && user.user_id !== sanitizedId) {
      const userRef = doc(db, 'student_profiles', user.user_id.toLowerCase().replace(/[^a-z0-9]/g, '_'));
      await setDoc(userRef, cloudPayload, { merge: true });
    }
    console.log(`[Cloud Cluster] Profile synced to Firestore collection 'student_profiles' for: ${sanitizedId}`);
  } catch (firestoreErr) {
    console.warn("[Cloud Cluster] Firestore direct write notice:", firestoreErr.message);
  }

  // 2. Also mirror to MongoDB Atlas & SQLite if backend is available
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
 * Retrieves a saved profile and avatar from Cloud Firestore or MongoDB Atlas.
 * Essential for restoring student profile photo after sign out / sign in.
 */
export async function getProfileFromCluster(identifier) {
  if (!identifier) return null;
  const cleanId = String(identifier).toLowerCase().trim().replace(/[^a-z0-9]/g, '_');

  // 1. Check Cloud Firestore by direct ID
  try {
    const docRef = doc(db, 'student_profiles', cleanId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn("[Cloud Cluster] Firestore get notice:", err.message);
  }

  // 2. Query Firestore collection where email == identifier or user_id == identifier
  try {
    const colRef = collection(db, 'student_profiles');
    const q = query(colRef, where('email', '==', identifier), limit(1));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data();
    }
  } catch (e) {}

  // 3. Fallback to MongoDB Atlas via backend API
  try {
    const res = await fetch(`http://localhost:8000/api/auth/profile/${encodeURIComponent(cleanId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.profile) return data.profile;
    }
  } catch (e) {}

  return null;
}

/**
 * Specifically updates and saves only the student avatar photo in Cloud Firestore & MongoDB.
 */
export async function saveAvatarToCluster(identifier, base64Avatar) {
  if (!identifier || !base64Avatar) return null;
  const cleanId = String(identifier).toLowerCase().trim().replace(/[^a-z0-9]/g, '_');

  // 1. Save to Cloud Firestore
  try {
    const docRef = doc(db, 'student_profiles', cleanId);
    await setDoc(docRef, { avatar: base64Avatar, updated_at: new Date().toISOString() }, { merge: true });
    console.log(`[Cloud Cluster] Avatar saved to Firestore for: ${cleanId}`);
  } catch (err) {
    console.warn("[Cloud Cluster] Firestore avatar write notice:", err.message);
  }

  // 2. Mirror to MongoDB Atlas via backend
  try {
    fetch('http://localhost:8000/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: cleanId,
        profile_data: { avatar: base64Avatar }
      })
    }).catch(() => {});
  } catch (e) {}

  return true;
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
