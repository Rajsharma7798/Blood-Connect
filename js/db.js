import { db } from './firebase-config.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Users Collection CRUD
export const getUserProfile = async (uid) => {
  const docRef = doc(db, "Users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserLocation = async (uid, geoPoint) => {
  const userRef = doc(db, "Users", uid);
  await updateDoc(userRef, { location: geoPoint });
};

export const updateAvailability = async (uid, isAvailable) => {
  const userRef = doc(db, "Users", uid);
  await updateDoc(userRef, { isAvailable });
};

// Hospitals Collection CRUD
export const getActiveHospitals = async () => {
  const q = query(collection(db, "Hospitals"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// BloodRequests Collection CRUD
export const createBloodRequest = async (patientName, bloodType, requiredUnits, hospitalId, location) => {
  const docRef = await addDoc(collection(db, "BloodRequests"), {
    patientName,
    bloodType,
    requiredUnits,
    hospitalId,
    location,
    status: 'pending',
    timestamp: serverTimestamp()
  });
  return docRef.id;
};

export const getPendingRequests = async () => {
  const q = query(collection(db, "BloodRequests"), where("status", "==", "pending"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
