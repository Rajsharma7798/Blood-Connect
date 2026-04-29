# 🩸 BLOOD CONNECT

> **Project Based Learning (PBL) Initiative — MIT-ADT University**

**Developers:** Raj Jagesh Sharma, Devanshu, Rajan, Sharva  
**Guide:** Prof. Manisha Galphade

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Setup & Installation](#-setup--installation)
6. [How to Use](#-how-to-use)
7. [Implementation Details](#-implementation-details)
8. [Development Methodology](#-development-methodology)
9. [Screenshots](#-screenshots)
10. [Future Scope](#-future-scope)

---

## 🎯 Project Overview

**Blood Connect** is a web-based platform designed to bridge the gap between blood donors and recipients in real-time. The system allows users to register as blood donors, request blood in emergencies, and connects nearby donors with recipients. An integrated Admin Dashboard enables administrators to monitor all user registrations and blood requests, with the ability to export data to CSV/Excel.

### Problem Statement
Existing blood bank systems lack real-time location mapping of donors, leading to critical delays during medical emergencies. There is no centralized platform that connects donors and recipients instantly based on proximity.

### Our Solution
Blood Connect integrates geospatial logic and a responsive web interface to instantly match donors with recipients within a 10km radius, reducing response time from hours to seconds.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **User Registration & Login** | Users can sign up as Blood Donors or Recipients with email, password, and blood type |
| 🩸 **Blood Request System** | Emergency blood request form with patient details, hospital name, blood type, units needed, and urgency level |
| 📍 **Real-time Geolocation** | HTML5 Geolocation API integration for proximity-based donor matching within 10km |
| 🔒 **Admin Portal** | Separate admin login (Username: `Admin`, Password: `Pass@123`) to view all platform data |
| 📊 **Admin Dashboard** | Displays all registered users and blood requests with timestamps in spreadsheet-style tables |
| 📥 **CSV/Excel Export** | One-click export of Users and Blood Requests tables to `.csv` files (openable in Microsoft Excel) |
| 🎉 **Events Page** | Dedicated page showcasing community blood donation drives and events |
| 📱 **Responsive Design** | Fully responsive UI that works on desktop, tablet, and mobile devices |
| 🎨 **Modern UI/UX** | Glassmorphism modals, smooth animations, medical-friendly color theme |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Structure** | HTML5 (Semantic Elements) |
| **Styling** | Vanilla CSS (Custom Design System, CSS Variables, Flexbox, Grid) |
| **Logic** | Vanilla JavaScript (ES6 Modules) |
| **Data Storage** | Browser `localStorage` (persistent) and `sessionStorage` (session-based auth) |
| **Typography** | Google Fonts — Inter |
| **Geolocation** | HTML5 Geolocation API |
| **Version Control** | Git & GitHub |

---

## 📁 Project Structure

```
Blood-Connect/
│
├── index.html                 # Landing page with hero, features, events section, auth & admin modals
├── dashboard.html             # Authenticated user dashboard (post-login)
├── request-blood.html         # Emergency blood request form
├── events.html                # Community events page (Blood Donation Drives)
├── admin.html                 # Admin dashboard with data tables and CSV export
│
├── css/
│   └── style.css              # Complete design system (variables, components, layouts, animations)
│
├── js/
│   ├── local-db.js            # Core data layer — localStorage CRUD for Users & Blood Requests
│   ├── app.js                 # Main application logic — auth modals, form handling, admin modal
│   ├── admin.js               # Admin dashboard — data loading, table rendering, CSV export
│   ├── firebase-config.js     # Firebase configuration (placeholder for future cloud migration)
│   ├── auth.js                # Firebase auth functions (placeholder for future cloud migration)
│   ├── db.js                  # Firebase Firestore CRUD (placeholder for future cloud migration)
│   └── geo.js                 # Geolocation tracking and proximity query logic
│
├── assets/
│   └── images/
│       ├── blood_cells.png            # Hero section slide 1
│       ├── donation_benefits.png      # Hero section slide 2
│       └── blood_request_illustration.png  # Request blood page illustration
│
├── firestore.rules            # Firebase security rules (for future cloud deployment)
├── mcp_config.json            # MCP server configuration
└── README.md                  # This file
```

---

## 🚀 Setup & Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge)
- Python 3.x installed (for the local development server)
- Git installed (for cloning and version control)

### Steps

**1. Clone the Repository**
```bash
git clone https://github.com/Rajsharma7798/Blood-Connect.git
cd Blood-Connect
```

**2. Start the Local Development Server**
```bash
python -m http.server 8000
```

**3. Open in Browser**
Navigate to:
```
http://localhost:8000/
```

> **Note:** A local server is required because the project uses ES6 JavaScript modules (`import`/`export`), which do not work when opening HTML files directly via `file://` protocol.

---

## 📖 How to Use

### 👤 As a User (Donor / Recipient)

1. **Visit the homepage** at `http://localhost:8000/`
2. Click **"Sign Up to Donate"** or **"Login"** in the navigation bar
3. **Register** by filling in:
   - Full Name
   - Email
   - Password
   - Role (Blood Donor / Recipient)
   - Blood Type (if Donor)
4. After registration, you are redirected to the **Dashboard**
5. To request blood, click **"Request Blood"** and fill the emergency form with:
   - Patient Name, Contact Number
   - Hospital Name & Location
   - Blood Type Needed, Units Required
   - Urgency Level
6. Click **"Broadcast Request Now"** — the request is saved and visible to the Admin

### 🔒 As an Admin

1. Click the **🔒 Admin** button in the navigation bar
2. Enter the credentials:
   - **Username:** `Admin`
   - **Password:** `Pass@123`
3. You will be redirected to the **Admin Dashboard**
4. View two data tables:
   - **Registered Users** — Name, Email, Role, Blood Type, Registration Date/Time
   - **Blood Requests** — Patient Name, Blood Type, Units, Hospital, Status, Request Date/Time
5. Click **"Export to CSV"** on either table to download the data as a `.csv` file
6. Open the downloaded `.csv` file in **Microsoft Excel** or Google Sheets

### 🎉 Events Page

1. From the homepage, scroll down to the **Events** section
2. Click **"View Events"** to see community blood donation drives
3. Current event: **Blood Donation Drive — MIT ADT University** (17th April 2026, 3rd Floor SOC)

---

## 🔧 Implementation Details

### 1. Data Storage (`js/local-db.js`)

All data is stored in the browser's `localStorage` using two keys:
- `bloodconnect_users` — Array of registered user objects
- `bloodconnect_requests` — Array of blood request objects

Each entry is automatically timestamped with `createdAt: new Date().toISOString()`.

**Key Functions:**
| Function | Purpose |
|---|---|
| `registerUser()` | Validates uniqueness, creates user object, saves to localStorage |
| `loginUser()` | Checks credentials against stored users |
| `logoutUser()` | Clears session data from sessionStorage |
| `getCurrentUser()` | Returns the currently logged-in user from sessionStorage |
| `createBloodRequest()` | Creates and stores a blood request with all form data |
| `getAllUsers()` | Returns all registered users (used by Admin dashboard) |
| `getAllRequests()` | Returns all blood requests (used by Admin dashboard) |

### 2. Authentication Flow (`js/app.js`)

```
User clicks Login/Register
        │
        ▼
   Modal opens
        │
        ├── Login Mode: email + password → loginUser() → redirect to dashboard.html
        │
        └── Register Mode: name + email + password + role + bloodType
                → registerUser() → redirect to dashboard.html

Admin clicks 🔒 Admin button
        │
        ▼
   Admin Modal opens
        │
        └── username + password → validates against "Admin"/"Pass@123"
                → sessionStorage.setItem('isAdmin', 'true')
                → redirect to admin.html
```

### 3. Admin Dashboard (`js/admin.js`)

- **Access Control:** On page load, checks `sessionStorage.getItem('isAdmin')`. If not `'true'`, redirects back to homepage.
- **Data Rendering:** Calls `getAllUsers()` and `getAllRequests()` from `local-db.js`, then renders HTML table rows dynamically.
- **CSV Export:** Iterates over table rows, escapes special characters, builds a CSV string, creates a `Blob`, and triggers a download using a temporary `<a>` element.

### 4. Design System (`css/style.css`)

The CSS uses a custom design system built with CSS Custom Properties (variables):

| Variable | Value | Usage |
|---|---|---|
| `--primary-red` | `#E63946` | Primary action buttons, highlights |
| `--dark-blue` | `#0A2540` | Headings, navbar background elements |
| `--bg-color` | `#F1FAEE` | Page background (soft medical green) |
| `--light-blue` | `#A8DADC` | Input focus rings, accents |
| `--text-dark` | `#1D3557` | Body text |
| `--shadow-lg` | Multi-layered box shadow | Cards, modals, hero images |

**Key UI Components:**
- **Glassmorphism Modals** — Frosted-glass backdrop with blur effect
- **Hero Image Carousel** — CSS-only auto-fading slideshow using `@keyframes`
- **Feature Cards** — Hover-lift effect with shadow transitions
- **Toggle Switch** — Custom CSS checkbox for availability status
- **Toast Notifications** — Slide-in animation for real-time alerts

### 5. Blood Request Form (`request-blood.html`)

The emergency request form captures:
- Patient Name, Contact Number
- Hospital Name & Location
- Blood Type Needed (dropdown: A+, A-, B+, B-, AB+, AB-, O+, O-)
- Units Needed (1–20)
- Urgency Level (Immediate / Today / Scheduled)

All data is saved via `createBloodRequest()` in `local-db.js` with an automatic timestamp, and is immediately visible in the Admin Dashboard.

### 6. Events Page (`events.html`)

A dedicated page linked from the homepage's Events section. Displays event cards with:
- Event image
- Title and metadata (date, location)
- Description of the event

---

## 📐 Development Methodology

### V-Model
This project adheres to the **V-Model** of software development:

```
Requirements Analysis  ←→  User Acceptance Testing
        │                           │
System Design          ←→  System Testing
        │                           │
Architecture Design    ←→  Integration Testing
        │                           │
Component Design       ←→  Component Testing
        │                           │
        └──── Implementation ───────┘
```

### Gap Analysis

| Aspect | Current Systems | Blood Connect |
|---|---|---|
| Donor Discovery | Manual phone calls, delayed | Real-time geolocation matching |
| Data Access | Paper records, no analytics | Digital dashboard with CSV export |
| Response Time | Hours to days | Seconds |
| Accessibility | Limited to office hours | 24/7 web-based access |

### Literature Survey Conclusions
- Modern medical systems require highly accessible and responsive designs (high-contrast, minimal cognitive load)
- Web applications using localStorage can deliver instant data synchronization, crucial for emergency medical requests
- Progressive Web App patterns ensure reliability even with limited connectivity

---

## 📸 Screenshots

### Homepage
The landing page features a hero section with an auto-sliding image carousel, feature cards, and an events section.

### Registration Modal
Glassmorphism-styled modal with form fields for Full Name, Email, Password, Role, and Blood Type.

### Admin Dashboard
Spreadsheet-style tables displaying all registered users and blood requests with Export to CSV functionality.

### Events Page
Community events page showcasing the MIT ADT University Blood Donation Drive.

---

## 🔮 Future Scope

- **Firebase Cloud Integration** — Migrate from localStorage to Firebase Firestore for multi-device data sync
- **Push Notifications** — Real-time browser push notifications for nearby blood requests
- **Google Maps Integration** — Visual map showing nearby donors and hospitals
- **SMS Alerts** — Twilio integration for SMS-based emergency alerts
- **Blood Bank Inventory** — Real-time blood unit tracking across partnered hospitals
- **PWA Support** — Convert to a Progressive Web App for offline access and home screen installation
- **Multi-language Support** — Hindi and Marathi translations for wider accessibility in Maharashtra

---

## 📄 License

This project is developed as part of the Project Based Learning (PBL) curriculum at **MIT-ADT University, Loni Kalbhor, Pune**.

---

<p align="center">
  Made with ❤️ by <strong>Raj Jagesh Sharma, Devanshu, Rajan & Sharva</strong><br>
  MIT-ADT University | 2026
</p>
