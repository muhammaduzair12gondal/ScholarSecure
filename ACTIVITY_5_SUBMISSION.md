# ScholarSecure - Activity 5

## Implemented Tasks

1. **Secure input validation:** `src/auth.js` validates scholarship allow-list values, required fields, CGPA range and personal-statement length. `src/pages/TrackApplications.jsx` limits search input to 60 characters. Both forms trim input and show user-facing messages.
2. **XSS prevention:** `src/pages/TrackApplications.jsx` displays the student statement with normal React text interpolation (`{item.statement}`). React escapes this value as text; no `dangerouslySetInnerHTML` or unsafe DOM HTML insertion is used.
3. **Secure file selection:** `src/pages/SubmitApplication.jsx` accepts optional PDF, DOC and DOCX evidence and rejects other extensions or files over 5 MB. The selected file is only checked in the browser and is not stored in browser storage.
4. **Sensitive information handling:** `src/auth.js` stores only a non-secret session profile in `sessionStorage`; passwords are never stored. `src/components/Topbar.jsx` calls `clearSession()` on logout. Application records are demo data only and production authorization must be server-side.
5. **Password strength checker:** `index.html` loads the supplied `password_strength_helper.js`. `src/pages/Login.jsx` calls `window.checkPasswordStrength(password)` whenever the password changes and displays its level and message.

## Activity 5 Test Cases

| Feature | Test input/action | Expected and actual result |
|---|---|---|
| Application validation | Submit with an empty required field | Submission is blocked and a validation message appears. Pass. |
| XSS-safe display | Submit or load a statement containing `<script>alert('x')</script>` | It is displayed as text; JavaScript does not execute. Pass. |
| File validation | Select `evidence.pdf`, then an unsupported `.exe` or file over 5 MB | PDF is accepted; unsupported or oversized file is rejected with a message. Pass. |
| Password strength | Enter `abc`, `Student123`, and `Student123!Long` | Weak, Moderate and Strong feedback is shown by the supplied helper. Pass. |
| Sensitive data | Log out, then inspect browser storage | Session profile is cleared; no password is stored. Pass. |

Client-side controls are demonstrations and must be repeated by a backend in a production system.