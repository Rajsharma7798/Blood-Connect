# BLOOD CONNECT

**Project Based Learning (PBL) Initiative - MIT-ADT**

**Developers:** Raj Jagesh Sharma, Devanshu, Rajan, Sharva
**Guide:** Prof. Manisha Galphade

## Project Scope
**Blood Connect** is a web-based platform designed to bridge the gap between blood donors and recipients in real-time. By leveraging the HTML5 Geolocation API and a robust Firebase backend (Cloud Firestore), Blood Connect identifies the closest available blood donors within a 10km radius of a hospital or an individual in need, triggering real-time UI notifications.

## Development Methodologies
- **V-Model:** This project adheres to the V-Model of software development. Every stage of our system design (from requirements and architecture down to component design) is matched by a corresponding testing phase (from component testing up to user acceptance testing), ensuring rigorous verification and validation.
- **Gap Analysis Findings:**
  - *Current Problem:* Existing systems lack real-time location mapping of donors, leading to delays.
  - *Our Solution:* Integrating geospatial queries (GeoFire/Firebase) to instantly query donors in immediate proximity.
- **Literature Survey Conclusions:**
  - Modern medical systems require highly accessible and responsive designs (high-contrast, minimal cognitive load).
  - Web applications using Firebase Firestore can deliver sub-second data synchronization, crucial for emergency medical requests.

## Architecture
- **Frontend:** HTML5, Vanilla CSS (Custom Design System with Medical-friendly Theme), Vanilla JavaScript.
- **Backend:** Firebase Authentication (Email/Password), Cloud Firestore (NoSQL Document Database).
- **Core Modules:** User Auth, Protected Dashboard, Geolocation Matching, Real-time Snapshot listeners.

## File Structure
- `/index.html` - Landing & Auth Modals
- `/dashboard.html` - Authenticated dashboard
- `/css/style.css` - Design System
- `/js/app.js` - UI/UX Logic
- `/js/firebase-config.js` - Firebase v10+ App Setup
- `/js/auth.js` - Sign Up / Log In Logic
- `/js/db.js` - CRUD operations for Users, Hospitals, BloodRequests
- `/js/geo.js` - Geolocation tracking and 10km proximity queries
