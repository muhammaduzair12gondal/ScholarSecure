# ScholarSecure

Secure Scholarship Application, Tracking & Document Verification System — frontend prototype for Secure Software Development.

## Group

- Muhammad Uzair — 23F-3032
- Ikram Ali — 23F-3064

## Primary user role

Student

## Developed pages

1. Home / Landing page
2. Login / Student entry page
3. Scholarship Dashboard / Core functional page

## JavaScript interactions implemented

1. Login form validation and show/hide password control
2. Scholarship search and category filtering
3. Scholarship details modal and dynamic "Start application" action
4. Session-based protected dashboard navigation using browser localStorage
5. Logout action

## Security-aware frontend choices

- Student UI does not expose administrative functions.
- Password input is masked by default.
- Only information required for the student workflow is displayed.
- Sensitive document contents are not displayed on the dashboard; only document status is shown.
- The prototype explicitly distinguishes frontend behavior from future backend security enforcement.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Build for production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this folder to a GitHub repository, or import the folder directly into Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy.

`vercel.json` is included so React Router paths work after deployment.

## Suggested testing record for the activity sheet

**Problem discovered:** Directly opening `/dashboard` on a static host could return a 404 after deployment.

**Improvement made:** Added a Vercel rewrite rule so all routes are served through `index.html`, allowing React Router to handle navigation correctly.

## Important prototype note

This activity is frontend-only. The current login/session is a demonstration using browser localStorage and is not a real authentication control. Real authentication, authorization, database access, password hashing, audit logging, secure uploads and verification rules should be implemented on the backend in later SSD stages.
