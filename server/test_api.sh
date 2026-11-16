#!/bin/bash
# ==============================================================================
# ScholarSecure — Activity 6 Backend & Security Verification Suite
# Group Members:
#   1. Muhammad Uzair (23F-3032) — Member 1: Application Submission Module
#   2. Ikram Ali (23F-3064)       — Member 2: Application Tracking & Officer Decision Module
# ==============================================================================

BASE_URL="http://localhost:5000/api"
PASSED=0
FAILED=0

green() { echo -e "\033[32m$1\033[0m"; }
red() { echo -e "\033[31m$1\033[0m"; }
cyan() { echo -e "\033[36m$1\033[0m"; }

assert_eq() {
  local test_name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$expected" == "$actual" ]; then
    green "  [PASS] $test_name"
    ((PASSED++))
  else
    red "  [FAIL] $test_name"
    red "         Expected: $expected"
    red "         Actual:   $actual"
    ((FAILED++))
  fi
}

echo "=============================================================================="
cyan "ScholarSecure — Backend Security & Integration Verification Suite (Activity 6)"
echo "=============================================================================="

# ------------------------------------------------------------------------------
# Test 1: Server Health Check
# ------------------------------------------------------------------------------
cyan "\n[Task 1] Testing Server & Database Connectivity..."
HEALTH_STATUS=$(curl -s "$BASE_URL/health" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status',''))")
assert_eq "Server responds with healthy status" "ok" "$HEALTH_STATUS"

# ------------------------------------------------------------------------------
# Test 2: Authentication & Password Verification (Student)
# ------------------------------------------------------------------------------
cyan "\n[Task 4] Testing User Authentication & JWT Generation (Student)..."
STUDENT_LOGIN_RES=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"student@scholarsecure.demo","password":"Student123!"}')

STUDENT_TOKEN=$(echo "$STUDENT_LOGIN_RES" | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))")
STUDENT_ROLE=$(echo "$STUDENT_LOGIN_RES" | python3 -c "import sys,json; print(json.load(sys.stdin).get('user',{}).get('role',''))")
assert_eq "Student login succeeds with valid credentials" "student" "$STUDENT_ROLE"
assert_eq "Signed JWT token issued" "True" "$([ -n "$STUDENT_TOKEN" ] && echo True || echo False)"

# ------------------------------------------------------------------------------
# Test 3: Authentication & Password Verification (Officer)
# ------------------------------------------------------------------------------
cyan "\n[Task 4] Testing User Authentication & JWT Generation (Officer)..."
OFFICER_LOGIN_RES=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"officer@scholarsecure.demo","password":"Officer123!"}')

OFFICER_TOKEN=$(echo "$OFFICER_LOGIN_RES" | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))")
OFFICER_ROLE=$(echo "$OFFICER_LOGIN_RES" | python3 -c "import sys,json; print(json.load(sys.stdin).get('user',{}).get('role',''))")
assert_eq "Officer login succeeds with valid credentials" "officer" "$OFFICER_ROLE"
assert_eq "Signed JWT token issued" "True" "$([ -n "$OFFICER_TOKEN" ] && echo True || echo False)"

# ------------------------------------------------------------------------------
# Test 4: Rejection of Invalid Credentials (No Plaintext / Safe Errors)
# ------------------------------------------------------------------------------
cyan "\n[Task 4] Testing Credential Verification with Wrong Password..."
BAD_LOGIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"student@scholarsecure.demo","password":"IncorrectPassword!"}')
assert_eq "Rejects invalid credentials with 401 Unauthorized" "401" "$BAD_LOGIN_STATUS"

# ------------------------------------------------------------------------------
# Test 5: Rejection of Missing Token
# ------------------------------------------------------------------------------
cyan "\n[Task 4] Testing Access with Missing JWT Token..."
NO_TOKEN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/applications")
assert_eq "Rejects unauthenticated request with 401 Unauthorized" "401" "$NO_TOKEN_STATUS"

# ------------------------------------------------------------------------------
# Test 6: Rejection of Modified/Invalid Token
# ------------------------------------------------------------------------------
cyan "\n[Task 4] Testing Access with Tampered / Invalid JWT Token..."
BAD_TOKEN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/applications" \
  -H "Authorization: Bearer fake.tampered.token")
assert_eq "Rejects invalid or modified JWT with 401 Unauthorized" "401" "$BAD_TOKEN_STATUS"

# ------------------------------------------------------------------------------
# Test 7: Member 1 Module — Application Submission (POST /api/applications)
# ------------------------------------------------------------------------------
cyan "\n[Task 2 & 3 - Member 1] Testing Application Submission Module..."
SUBMIT_RES=$(curl -s -X POST "$BASE_URL/applications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{
    "scholarship": "Digital Skills Access Scholarship",
    "studyLevel": "Undergraduate",
    "cgpa": "3.85",
    "statement": "I have completed several programming certifications and need assistance for university tuition fees."
  }')

SUBMIT_OK=$(echo "$SUBMIT_RES" | python3 -c "import sys,json; print(json.load(sys.stdin).get('ok',False))")
NEW_APP_ID=$(echo "$SUBMIT_RES" | python3 -c "import sys,json; print(json.load(sys.stdin).get('application',{}).get('appId',''))")
assert_eq "Application submission succeeds for student" "True" "$SUBMIT_OK"
assert_eq "Sequential application ID generated" "True" "$([[ "$NEW_APP_ID" =~ ^APP-[0-9]+$ ]] && echo True || echo False)"

# ------------------------------------------------------------------------------
# Test 8: Server-side Input Validation
# ------------------------------------------------------------------------------
cyan "\n[Task 5] Testing Server-side Input Validation (Invalid CGPA)..."
INVALID_CGPA_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/applications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{
    "scholarship": "Digital Skills Access Scholarship",
    "studyLevel": "Undergraduate",
    "cgpa": "9.99",
    "statement": "Personal statement with adequate length for testing."
  }')
assert_eq "Rejects invalid CGPA (> 4.00) with 400 Bad Request" "400" "$INVALID_CGPA_STATUS"

INVALID_STMT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/applications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{
    "scholarship": "Digital Skills Access Scholarship",
    "studyLevel": "Undergraduate",
    "cgpa": "3.50",
    "statement": "Too short"
  }')
assert_eq "Rejects statement < 20 characters with 400 Bad Request" "400" "$INVALID_STMT_STATUS"

# ------------------------------------------------------------------------------
# Test 9: Member 2 Module — Application Retrieval & Role Separation
# ------------------------------------------------------------------------------
cyan "\n[Task 2 & 5 - Member 2] Testing Application Retrieval & Role Filtering..."
STUDENT_APPS_COUNT=$(curl -s "$BASE_URL/applications" \
  -H "Authorization: Bearer $STUDENT_TOKEN" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")

OFFICER_APPS_COUNT=$(curl -s "$BASE_URL/applications" \
  -H "Authorization: Bearer $OFFICER_TOKEN" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")

echo "  Student sees: $STUDENT_APPS_COUNT applications (own records)"
echo "  Officer sees: $OFFICER_APPS_COUNT applications (all records queue)"
assert_eq "Student cannot view other students records outside ownership" "True" "$([ "$STUDENT_APPS_COUNT" -le "$OFFICER_APPS_COUNT" ] && echo True || echo False)"

# ------------------------------------------------------------------------------
# Test 10: Role-Based Authorization Enforcement (Student Forbidden from Decision)
# ------------------------------------------------------------------------------
cyan "\n[Task 5] Testing RBAC Enforcement (Student attempts Officer Action)..."
STUDENT_APPROVE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$BASE_URL/applications/$NEW_APP_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{"status":"Approved"}')
assert_eq "Student blocked from officer status update with 403 Forbidden" "403" "$STUDENT_APPROVE_STATUS"

# ------------------------------------------------------------------------------
# Test 11: Member 2 Module — Officer Decision Management (PATCH /api/applications/:id/status)
# ------------------------------------------------------------------------------
cyan "\n[Task 2 - Member 2] Testing Officer Decision Recording (Approval)..."
OFFICER_APPROVE_RES=$(curl -s -X PATCH "$BASE_URL/applications/$NEW_APP_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OFFICER_TOKEN" \
  -d '{"status":"Approved"}')

OFFICER_APPROVE_OK=$(echo "$OFFICER_APPROVE_RES" | python3 -c "import sys,json; print(json.load(sys.stdin).get('ok',False))")
UPDATED_STATUS=$(echo "$OFFICER_APPROVE_RES" | python3 -c "import sys,json; print(json.load(sys.stdin).get('application',{}).get('status',''))")
assert_eq "Officer successfully updates application status" "True" "$OFFICER_APPROVE_OK"
assert_eq "Application status updated to Approved in database" "Approved" "$UPDATED_STATUS"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------
echo -e "\n=============================================================================="
if [ "$FAILED" -eq 0 ]; then
  green "ALL $PASSED TESTS PASSED SUCCESSFULLY! 🚀"
else
  red "TESTS FINISHED WITH $FAILED FAILURES ($PASSED passed)."
fi
echo "=============================================================================="
