# ScholarSecure — Development Activity 3

## Group Members
- Muhammad Uzair — 23F-3032
- Ikram Ali — 23F-3064

## Part 1 — Complementary Modules
**Project Name:** ScholarSecure — Scholarship Tracker & Verification Portal

**Module 1:** Submit Scholarship Application  
**Responsible Member:** Muhammad Uzair

**Responsibility:** Allows a signed-in student to select a scholarship, enter study level, CGPA and a personal statement, validate the required values, submit the application, receive feedback and immediately see the new application reference.

**Module 2:** Search and Track Applications  
**Responsible Member:** Ikram Ali

**Responsibility:** Allows the signed-in student to search their own applications by reference/scholarship/status, filter by status, and expand a record to view details while masking sensitive values.

## Part 2 — Member 1
**Primary function:** Create and store a new scholarship application locally.

**Input validation rule:** Scholarship, study level, CGPA and personal statement are required. CGPA must be 0.00–4.00. Statement must be 20–500 characters. Scholarship value must come from the approved list.

**JavaScript interaction implemented:** Form submission calls `createApplication()`, validates/sanitizes values, creates a unique local reference number, stores the record in localStorage, resets the form and displays success/error feedback plus the new record.

## Part 3 — Member 2
**Primary function:** Search, filter and inspect the current student's applications.

**Input/search rule:** Search is limited to 60 characters. Only records owned by the signed-in student are displayed. Status filtering is limited to statuses present in that student's records.

**JavaScript interaction implemented:** Live search + status filtering and expandable application detail panels.

## Part 4 — Integration
- Both modules are part of the same React/Vite ScholarSecure project.
- Student navigation now contains Dashboard, Apply and Track links.
- Existing student/officer role routes remain protected.
- New module pages use the existing visual system and shared top bar.
- Existing Activity 2 officer actions are preserved.

## Part 5 — Testing
| Test | Expected | Actual |
|---|---|---|
| Module 1 valid submission | Application is accepted and displayed | Pass |
| Module 1 required field missing | Submission blocked with error | Pass |
| Module 1 invalid CGPA | Submission blocked with range error | Pass |
| Module 1 short statement | Submission blocked with length error | Pass |
| Module 2 search by reference/scholarship/status | Matching student records update | Pass |
| Module 2 status filter | List updates to selected status | Pass |
| Module 2 details toggle | Details open/close correctly | Pass |
| Student attempts officer approval | Access denied | Pass |
| Officer uses review actions | Existing approve/reject functionality remains available | Pass |

**Module 1 issue discovered:** A student could otherwise enter unexpected markup-like characters or an out-of-range CGPA.  
**Module 2 issue discovered:** Search input could be excessively long and records must not expose other students' applications.

**Correction made:** Input is trimmed/sanitized and constrained; CGPA and statement lengths are validated; tracking filters records by the signed-in student's name; search input is limited to 60 characters.

## Part 6 — Security-Aware Development
| Module | Possible misuse/problem | Proposed response |
|---|---|---|
| Module 1 | Missing/invalid values or unexpected markup in submitted text | Required-field checks, allow-listed scholarship values, CGPA range validation, text length limits and basic sanitization |
| Module 2 | Student attempts to view another student's application data | Filter displayed records to the signed-in student and mask sensitive phone/CNIC values |

Frontend validation is a prototype safeguard only. Real authorization, validation and persistence must later be enforced by the backend.

## Submission Summary
**Project Name:** ScholarSecure  
**Module 1:** Submit Scholarship Application  
**Module 2:** Search and Track Applications

**JavaScript interactions implemented:**
1. Validated application creation with local data storage and user feedback.
2. Live search/status filtering with expandable application details.

**One problem discovered during testing:** User input and record visibility required stronger constraints than the first prototype.  
**How it was corrected:** Added validation/sanitization and student-only record filtering while preserving role-based route protection.
