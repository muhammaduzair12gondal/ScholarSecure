# ScholarSecure — Development Activity 6
## Backend Development and Integration of Existing Semester Project

**Course:** Secure Software Development  
**Project Name:** ScholarSecure — Secure Scholarship Application, Tracking & Verification Portal  
**Repository:** [https://github.com/muhammaduzair12gondal/ScholarSecure.git](https://github.com/muhammaduzair12gondal/ScholarSecure.git)

---

## 1. Group Members & Module Allocation

| Member Name | Roll Number | Selected Module | Responsibility |
|---|---|---|---|
| **Muhammad Uzair** | 23F-3032 | **Member 1: Scholarship Application Submission Module** | Implemented backend logic for submitting applications (`POST /api/applications`), server-side input validation and sanitization, automatic reference ID sequencing (`APP-XXXX`), and integration with the frontend submission view. |
| **Ikram Ali** | 23F-3064 | **Member 2: Application Tracking & Officer Decision Management Module** | Implemented backend logic for retrieval with role-based filtering (`GET /api/applications`), status updates with officer authorization (`PATCH /api/applications/:appId/status`), masking PII, and integration with tracking and officer dashboards. |

---

## 2. Architecture & Technology Stack

- **Backend Framework:** Node.js with Express.js (ES Modules)
- **Database:** MongoDB with Mongoose ODM (parameterized queries, schematized validation)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) signed with HMAC-SHA256, 2-hour validity
- **Password Security:** `bcrypt` with adaptive cost factor (salt rounds = 12), pre-save hashing
- **Authorization:** Custom role-based middleware (`authenticate`, `authorize('officer')`, `authorize('student')`)
- **Security Controls:**
  - `helmet` for HTTP security headers
  - `cors` with restricted origin whitelist (`http://localhost:5173`)
  - `express-rate-limit` (100 requests per 15 minutes per IP)
  - `express-validator` for server-side type and length validation and HTML sanitization
  - Safe against SQL/NoSQL injection (no raw query concatenation)
  - Generic error messages to prevent user enumeration and avoid leaking stack traces
- **Frontend Integration:** React 18 (Vite SPA) connected to backend via centralized `src/api.js` client

---

## 3. Implemented Backend Routes & API Endpoints

### 3.1 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description | Request Body | Response |
|---|---|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates credentials, verifies bcrypt hash, returns JWT | `{"email", "password"}` | `{"message", "token", "user": {"id", "name", "email", "role", "roleLabel"}}` |
| `GET` | `/api/auth/me` | Authenticated | Retrieves current authenticated user profile from token | Headers: `Authorization: Bearer <token>` | `{"id", "name", "email", "role", "roleLabel"}` |

### 3.2 Application Endpoints (`/api/applications`)

| Method | Endpoint | Role Allowed | Description | Validation & Security Rules |
|---|---|---|---|---|
| `POST` | `/api/applications` | `student` only | Submits a new scholarship application | • Scholarship from whitelist<br>• Study level in `['Undergraduate', 'Graduate', 'Postgraduate']`<br>• CGPA between 0.00 and 4.00<br>• Statement between 20 and 500 chars (sanitized against HTML tags) |
| `GET` | `/api/applications` | Authenticated (`student`, `officer`) | Retrieves applications | • **Students:** Filtered strictly to `studentId == req.user.id`<br>• **Officers:** Returns entire assigned review queue |
| `PATCH` | `/api/applications/:appId/status` | `officer` only | Records officer decision (Approve/Reject) | • Requires `role === 'officer'` (403 Forbidden for students)<br>• Status must be valid enum: `Approved`, `Rejected`, etc. |

### 3.3 System Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Health check confirming server and database availability |

---

## 4. Database Setup & Backup Scripts

The database setup and backup files are located in the `server/` directory:

1. **Seed Script:** `server/seed.js`
   - Populates initial users (`Muhammad Uzair` as student, `Sara Ahmed` as scholarship officer).
   - Hashes passwords using bcrypt before insertion.
   - Populates 3 seed applications (`APP-1001`, `APP-1002`, `APP-1003`).
   - Run via: `npm run seed` inside `server/` or `npm run server:seed` from project root.

2. **JSON Database Backups:**
   - `server/db_backup/users.json` — Contains exported user documents with bcrypt hashes.
   - `server/db_backup/applications.json` — Contains exported scholarship application documents.

3. **Database Restore Script:** `server/restore_db.js`
   - Automatically drops and restores both collections from the JSON backup files.
   - Run via: `npm run restore` inside `server/`.

---

## 5. Verification & Testing Evidence

An automated verification test suite was developed in `server/test_api.sh` covering all requirements of Tasks 1 through 6:

```
==============================================================================
ScholarSecure — Backend Security & Integration Verification Suite (Activity 6)
==============================================================================

[Task 1] Testing Server & Database Connectivity...
  [PASS] Server responds with healthy status

[Task 4] Testing User Authentication & JWT Generation (Student)...
  [PASS] Student login succeeds with valid credentials
  [PASS] Signed JWT token issued

[Task 4] Testing User Authentication & JWT Generation (Officer)...
  [PASS] Officer login succeeds with valid credentials
  [PASS] Signed JWT token issued

[Task 4] Testing Credential Verification with Wrong Password...
  [PASS] Rejects invalid credentials with 401 Unauthorized

[Task 4] Testing Access with Missing JWT Token...
  [PASS] Rejects unauthenticated request with 401 Unauthorized

[Task 4] Testing Access with Tampered / Invalid JWT Token...
  [PASS] Rejects invalid or modified JWT with 401 Unauthorized

[Task 2 & 3 - Member 1] Testing Application Submission Module...
  [PASS] Application submission succeeds for student
  [PASS] Sequential application ID generated

[Task 5] Testing Server-side Input Validation (Invalid CGPA)...
  [PASS] Rejects invalid CGPA (> 4.00) with 400 Bad Request
  [PASS] Rejects statement < 20 characters with 400 Bad Request

[Task 2 & 5 - Member 2] Testing Application Retrieval & Role Filtering...
  Student sees: 5 applications (own records)
  Officer sees: 5 applications (all records queue)
  [PASS] Student cannot view other students records outside ownership

[Task 5] Testing RBAC Enforcement (Student attempts Officer Action)...
  [PASS] Student blocked from officer status update with 403 Forbidden

[Task 2 - Member 2] Testing Officer Decision Recording (Approval)...
  [PASS] Officer successfully updates application status
  [PASS] Application status updated to Approved in database

==============================================================================
ALL 16 TESTS PASSED SUCCESSFULLY! 🚀
==============================================================================
```

---

## 6. Demonstration of Individual Modules

### Member 1: Application Submission Module (Muhammad Uzair)
- **Frontend Page:** `src/pages/SubmitApplication.jsx`
- **Backend Route:** `POST /api/applications` (`server/routes/applications.js`)
- **Key Operations:**
  - Client sends form payload with Authorization header containing JWT.
  - Server verifies student role; rejects non-students.
  - Server enforces input constraints (CGPA 0.00–4.00, statement 20–500 chars, approved scholarship names).
  - Automatically queries the database to compute the next sequential reference (`APP-1004`, `APP-1005`).
  - Persists record into MongoDB `applications` collection and returns HTTP 201 Created.
  - Frontend updates UI with submission confirmation and resets the form.

### Member 2: Application Tracking & Officer Decision Management Module (Ikram Ali)
- **Frontend Pages:** `src/pages/TrackApplications.jsx` & `src/pages/OfficerDashboard.jsx`
- **Backend Routes:** `GET /api/applications` & `PATCH /api/applications/:appId/status` (`server/routes/applications.js`)
- **Key Operations:**
  - Role-aware retrieval: when student requests `/api/applications`, the backend limits the MongoDB query to `{ studentId: req.user.id }`.
  - When officer requests `/api/applications`, all submitted records across students are returned.
  - Officer decision: `PATCH /api/applications/:appId/status` checks `req.user.role === 'officer'`. If a student attempts this endpoint, the backend returns HTTP 403 Forbidden.
  - Successful officer action updates status to `Approved` or `Rejected` in the database, with real-time feedback.

---

## 7. Instructions to Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB running on `mongodb://127.0.0.1:27017`

### 1. Backend Setup
```bash
cd server
npm install
npm run seed       # Seeds demo accounts and applications
npm start          # Runs backend on http://localhost:5000
```

### 2. Frontend Setup
```bash
# In the project root directory
npm install
npm run dev        # Runs Vite frontend on http://localhost:5173
```

### 3. Run Automated Backend Tests
```bash
# Run from project root
npm run test:backend
# or:
bash server/test_api.sh
```

### 4. Demo Login Credentials
- **Student Account:** `student@scholarsecure.demo` / `Student123!`
- **Officer Account:** `officer@scholarsecure.demo` / `Officer123!`
