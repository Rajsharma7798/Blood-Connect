import { db } from './firebase-config.js';
import { updateUserLocation } from './db.js';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  GeoPoint 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Helper metric function (Haversine formula) to calculate distance between GeoPoints in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return d;
};

// 1. Capture User Location
export const trackUserLocation = (uid) => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const geoPoint = new GeoPoint(latitude, longitude);
        // Save to Firestore
        await updateUserLocation(uid, geoPoint);
        console.log("Location updated securely.");
      },
      (error) => {
        console.error("Error getting location:", error.message);
      },
      { enableHighAccuracy: true }
    );
  } else {
    console.error("Geolocation is not supported by your browser.");
  }
};

// 2. Query Donors within 10km Radius & Real-time Notification
export const listenForNearbyMatches = (myLocation, requiredBloodType, callback) => {
  const usersRef = collection(db, "Users");
  
  // Real-time listener for available donors of matching blood type
  // Note: Native firestore radius queries require GeoHash limits or GeoFire, 
  // but for simplicity in a PBL project, we fetch available donors and filter client-side.
  const q = query(usersRef, 
    where("role", "==", "donor"), 
    where("isAvailable", "==", true),
    where("bloodType", "==", requiredBloodType)
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added" || change.type === "modified") {
        const donorData = change.doc.data();
        if (donorData.location) {
          const distance = calculateDistance(
            myLocation.latitude, myLocation.longitude,
            donorData.location.latitude, donorData.location.longitude
          );
          
          // Trigger match if within 10km
          if (distance <= 10) {
            callback({ id: change.doc.id, ...donorData, distance });
          }
        }
      }
    });
  });
};

// UI Notification Controller
export const showToastNotification = (message) => {
  const toastContainer = document.getElementById('toastContainer');
  const toastContent = document.querySelector('.toast-content p');
  
  if (toastContainer && toastContent) {
    toastContent.textContent = message;
    toastContainer.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      toastContainer.classList.add('hidden');
    }, 5000);
  }
};
