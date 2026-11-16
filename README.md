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

## Important prototype note

This activity is frontend-only. The browser-side demo credentials, storage and role checks illustrate role-based behavior but are not production authentication. Real authentication, authorization, database access, password hashing, audit logging, secure uploads and verification rules must be enforced by a backend in later SSD stages.
