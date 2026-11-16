# ScholarSecure

Secure Scholarship Application, Tracking & Document Verification System — frontend prototype for Secure Software Development.

## Group

- Muhammad Uzair — 23F-3032
- Ikram Ali — 23F-3064

## Activity 2 roles

- Student
- Scholarship Officer

## Demo accounts

- Student: `student@scholarsecure.demo` / `Student123!`
- Scholarship Officer: `officer@scholarsecure.demo` / `Officer123!`

## Role-based functionality

### Student

1. Search scholarships.
2. View only their own application and verification status.
3. See masked phone/CNIC information.
4. Attempting the officer-only approval action returns `Access Denied`.

### Scholarship Officer

1. Search assigned applications.
2. View full demo contact/CNIC information and internal review notes.
3. Approve or reject applications.
4. Decisions are persisted in browser localStorage for the prototype.

## Security-aware frontend choices

- Login identifies the role from the demo account rather than letting the user select a role.
- Protected routes prevent Student and Officer accounts from opening the other role's dashboard.
- The approval/rejection mutation performs its own role check and is not protected only by hiding buttons.
- Student data is limited and masked; internal notes are omitted from the Student dashboard.
- Logout clears the current session and returns to the login page.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` rewrites client-side routes through `index.html` so `/dashboard` and `/officer` can be opened directly.

## Activity 6: Backend & Database Integration

As part of **Development Activity 6 (Secure Software Development)**, ScholarSecure has transitioned from a frontend prototype into a full-stack, secure web application powered by an Express.js backend and MongoDB database.

### Group Members & Modules
- **Muhammad Uzair (23F-3032) — Member 1:** Scholarship Application Submission Module (`POST /api/applications`, server-side validation, sequential ID generation, database storage).
- **Ikram Ali (23F-3064) — Member 2:** Application Tracking & Officer Decision Management Module (`GET /api/applications` with role-based filtering, `PATCH /api/applications/:appId/status` with officer authorization).

### Security Architecture
1. **Password Hashing:** Passwords hashed with `bcrypt` (12 salt rounds) via pre-save hooks. No plaintext credentials stored.
2. **JWT Authentication:** Cryptographically signed JSON Web Tokens (`HS256`) issued upon valid credential verification.
3. **Role-Based Access Control (RBAC):** Backend enforces strict role restrictions:
   - Students can only submit applications and view their own submitted records.
   - Officers can view the entire queue and record decisions (`Approve`/`Reject`).
   - Unauthorized attempts return `401 Unauthorized` or `403 Forbidden`.
4. **Input Validation & Sanitization:** Enforced server-side with `express-validator` and HTML-tag stripping.
5. **Rate Limiting & Headers:** Protected by `express-rate-limit` and `helmet`.

### How to Run Locally

#### 1. Backend Server
```bash
cd server
npm install
npm run seed       # Seed initial users (with bcrypt hashes) and sample applications
npm start          # Starts server on http://localhost:5000
```

#### 2. Frontend Client
```bash
# In the project root
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

#### 3. Run Backend Verification Test Suite
```bash
npm run test:backend
# or
bash server/test_api.sh
```

### Database Backup & Restore
- Seed script: `server/seed.js`
- JSON backups: `server/db_backup/users.json` and `server/db_backup/applications.json`
- Restore script: `node server/restore_db.js` (or `npm run restore` in `server/`)
