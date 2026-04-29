/**
 * Local Storage Database Helper
 * Replaces Firebase Firestore with browser localStorage.
 */

const DB_KEYS = {
  USERS: 'bloodconnect_users',
  REQUESTS: 'bloodconnect_requests',
  CURRENT_USER: 'bloodconnect_current_user'
};

function getCollection(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveCollection(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---- Auth Functions ----

export function registerUser(email, password, name, role, bloodType) {
  const users = getCollection(DB_KEYS.USERS);

  // Check if email already exists
  if (users.find(u => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = {
    uid: 'user_' + Date.now(),
    name,
    email,
    password, // In a real app, never store plaintext passwords
    role,
    bloodType: role === 'donor' ? bloodType : null,
    isAvailable: role === 'donor' ? true : null,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveCollection(DB_KEYS.USERS, users);

  // Set current user session
  const session = { uid: newUser.uid, name: newUser.name, email: newUser.email, role: newUser.role };
  sessionStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(session));

  return newUser;
}

export function loginUser(email, password) {
  const users = getCollection(DB_KEYS.USERS);
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const session = { uid: user.uid, name: user.name, email: user.email, role: user.role };
  sessionStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(session));

  return user;
}

export function logoutUser() {
  sessionStorage.removeItem(DB_KEYS.CURRENT_USER);
}

export function getCurrentUser() {
  const data = sessionStorage.getItem(DB_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

// ---- Blood Request Functions ----

export function createBloodRequest(patientName, contactNumber, hospitalName, bloodType, unitsNeeded, urgency) {
  const requests = getCollection(DB_KEYS.REQUESTS);

  const newRequest = {
    id: 'req_' + Date.now(),
    patientName,
    contactNumber,
    hospitalName,
    bloodType,
    requiredUnits: unitsNeeded,
    urgency,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  requests.push(newRequest);
  saveCollection(DB_KEYS.REQUESTS, requests);
  return newRequest;
}

// ---- Profile Update ----

export function updateUserProfile(uid, updates) {
  const users = getCollection(DB_KEYS.USERS);
  const index = users.findIndex(u => u.uid === uid);
  if (index === -1) throw new Error('User not found.');

  users[index] = { ...users[index], ...updates };
  saveCollection(DB_KEYS.USERS, users);

  // Update session name if changed
  const session = getCurrentUser();
  if (session && session.uid === uid) {
    session.name = users[index].name;
    session.role = users[index].role;
    sessionStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(session));
  }

  return users[index];
}

export function getUserByUid(uid) {
  const users = getCollection(DB_KEYS.USERS);
  return users.find(u => u.uid === uid) || null;
}

// ---- Location Settings ----

export function saveLocationSettings(uid, city, radius) {
  const key = 'bloodconnect_location_' + uid;
  localStorage.setItem(key, JSON.stringify({ city, radius }));
}

export function getLocationSettings(uid) {
  const key = 'bloodconnect_location_' + uid;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : { city: '', radius: 10 };
}

// ---- Data Retrieval (for Admin) ----

export function getAllUsers() {
  return getCollection(DB_KEYS.USERS);
}

export function getAllRequests() {
  return getCollection(DB_KEYS.REQUESTS);
}
