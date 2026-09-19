# 🎓 EduLearn — Enterprise Learning Management System (LMS)

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

> A full-stack, production-grade Learning Management Platform built with the **MERN stack**, featuring **Role-Based Access Control (RBAC)** across three distinct personas: **Students, Instructors, and Administrators**.

---

## 🌟 Core Features & Highlights

### 👨‍🎓 1. Student Learning Hub
- **Interactive Course Studio:** Browse catalog, filter by category/level, and stream video lessons with real-time lesson progress tracking.
- **Assignment Submission Portal:** Submit project solutions via GitHub repository URLs with notes and view grading status.
- **Interactive Quizzes:** Real-time quiz evaluations with score isolation per student session.
- **Dynamic Certificate Engine:** Automatically unlocks an official, verifiable certificate with credential ID (`CERT-XXXXX`) upon 100% course completion with celebration confetti and PDF/print download.

### 👩‍🏫 2. Instructor Course Studio
- **Curriculum Management:** Create multi-module courses with embedded lectures and video resources.
- **Assignment Evaluation Desk:** Review student repository submissions, assign marks, and provide personalized qualitative feedback.
- **Faculty Verification Workflow:** Secure registration gating where faculty accounts require Admin verification before publishing courses.

### 🛡️ 3. Administrator Governance Portal
- **Platform Analytics:** Real-time counters for active students, faculty, pending approvals, suspensions, and total courses.
- **User Management & Approval:** Approve pending instructor requests, reinstate accounts, or permanently delete users.
- **Security & Suspension System:** Enforce temporary (7/14/30 days) or indefinite account suspensions with customized audit reasons.
- **Grievance Resolution Desk:** Review and resolve escalated student and faculty support tickets.

---

## 🏗️ Architecture & Data Flow

The backend follows an industry-standard **MVC (Model-View-Controller)** pattern with decoupled routing and middleware authorization:

```
[ React 19 Client (Vite + Tailwind) ]
                  ⬇️  (HTTP / REST API via Axios)
[ Express.js Server (server.js) ]
                  ⬇️
[ Route Dispatchers (/api/auth, /api/courses, /api/assignments, /api/admin) ]
                  ⬇️
[ Security Middlewares (protect, adminOnly, instructorOnly) ]
                  ⬇️
[ Controllers (Business Logic & Validations) ]
                  ⬇️
[ Mongoose Models & Schemas (User, Course, Assignment) ]
                  ⬇️
[ MongoDB Atlas Cloud Database ]
```

---

## 📂 Project Directory Structure

```plaintext
online-learning-platform/
├── backend/
│   ├── config/             # Database connection (MongoDB Atlas)
│   ├── controllers/        # Business logic (auth, courses, assignments, admin)
│   ├── middleware/         # JWT verification & RBAC access guards
│   ├── models/             # Mongoose schemas (User, Course, Assignment)
│   ├── routes/             # RESTful API endpoints
│   └── server.js           # Express app entry point
├── frontend/
│   ├── public/             # Static assets & icons
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, Modals)
│   │   ├── pages/
│   │   │   ├── assessment/ # Assignment & Quiz portals
│   │   │   ├── auth/       # Login & Register views with validation
│   │   │   ├── certificate/# Dynamic Certificate Center & Modal
│   │   │   ├── courses/    # Course catalog & Video player view
│   │   │   ├── dashboard/  # Role-specific dashboards (Student, Instructor, Admin)
│   │   │   └── home/       # Landing page with active catalog
│   │   ├── App.jsx         # Client-side routing & route guards
│   │   └── main.jsx        # React root mount
│   └── vite.config.js      # Vite build configuration
└── README.md
```

---

## 👥 Demo Access Credentials

| Role | Email / ID | Password | Access Level |
|---|---|---|---|
| **Student** | `STU-101` / `student@edulearn.com` | `Edu@101` | Course streaming, quiz, assignments, certificates |
| **Instructor** | `FAC-201` / `instructor@edulearn.com` | `Edu@faculty` | Course studio, lecture upload, assignment grading |
| **Admin** | `ADMIN-ROOT` / `admin@edulearn.com` | `Admin@2026` | Platform analytics, user approval & suspension |

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Start backend server (Port 5000)
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server (Port 5173)
npm run dev
```

---

## 🔒 Security & Best Practices
- **Password Security:** Salted hashing with `bcryptjs` (10 rounds) using Mongoose pre-save hooks.
- **Route Guards:** Two-tier protection via `protect` (JWT verification) and `adminOnly` / `instructorOnly` middlewares.
- **Input Sanitization:** Email regex format enforcement and input trimming.
- **Git Hygiene:** Strict `.gitignore` configurations ensuring zero credential or `node_modules` leakage.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

