import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Register a new user and add their profile to Firestore.
 */
export async function registerUser(email, password, name, role, bloodType) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in 'Users' collection
    await setDoc(doc(db, "Users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      role: role,
      bloodType: role === 'donor' ? bloodType : null,
      isAvailable: role === 'donor' ? true : null,
      location: null, // Will be updated later via Geolocation API
      createdAt: new Date().toISOString()
    });
    
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Login an existing user.
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function logoutUser() {
  await signOut(auth);
}
