export const DEMO_USERS = [
  { id: 'student-1', name: 'Muhammad Uzair', role: 'student', roleLabel: 'Student', email: 'student@scholarsecure.demo', accessCode: 'Student123!' },
  { id: 'officer-1', name: 'Sara Ahmed', role: 'officer', roleLabel: 'Scholarship Officer', email: 'officer@scholarsecure.demo', accessCode: 'Officer123!' }
];

export const SCHOLARSHIP_OPTIONS = [
  'HEC Need-Based Scholarship',
  'Punjab Educational Endowment Fund',
  'University Merit Support Grant',
  'Digital Skills Access Scholarship'
];

const SESSION_KEY = 'scholarsecure_current_user';
const APPLICATIONS_KEY = 'scholarsecure_demo_applications';

const seedApplications = [
  { id: 'APP-1001', studentName: 'Muhammad Uzair', scholarship: 'HEC Need-Based Scholarship', submitted: '26 Sep 2026', status: 'Under review', documentStatus: '4 of 5 verified', phone: '0300-000-0001', cnic: 'DEMO-CNIC-001', internalNote: 'Income evidence requires final cross-check before a decision.', studyLevel: 'Undergraduate', cgpa: '2.35', statement: 'Need-based application submitted for review.' },
  { id: 'APP-1002', studentName: 'Areeba Khan', scholarship: 'Punjab Educational Endowment Fund', submitted: '30 Sep 2026', status: 'Pending review', documentStatus: '5 of 5 verified', phone: '0300-000-0002', cnic: 'DEMO-CNIC-002', internalNote: 'Eligibility evidence is complete. Review academic threshold.', studyLevel: 'Undergraduate', cgpa: '3.52', statement: 'Merit and need application.' },
  { id: 'APP-1003', studentName: 'Hamza Ali', scholarship: 'Digital Skills Access Scholarship', submitted: '02 Oct 2026', status: 'Pending review', documentStatus: '3 of 4 verified', phone: '0300-000-0003', cnic: 'DEMO-CNIC-003', internalNote: 'Domicile verification is still pending.', studyLevel: 'Undergraduate', cgpa: '3.11', statement: 'Digital skills scholarship application.' }
];

export function authenticate(email, code) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = DEMO_USERS.find((item) => item.email.toLowerCase() === normalizedEmail && item.accessCode === code);
  if (!user) return null;
  const sessionUser = { id: user.id, name: user.name, role: user.role, roleLabel: user.roleLabel, email: user.email };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  localStorage.removeItem('scholarsecure_session');
  return sessionUser;
}

export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('scholarsecure_session');
}

export function getApplications() {
  try {
    const saved = localStorage.getItem(APPLICATIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Reset malformed demo data below.
  }
  const fresh = seedApplications.map((item) => ({ ...item }));
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(fresh));
  return fresh;
}

function cleanPlainText(value, maxLength) {
  return String(value || '').trim().replace(/[<>]/g, '').slice(0, maxLength);
}

export function createApplication(formData) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'student') {
    return { ok: false, message: 'Access Denied: only a signed-in student can submit an application.' };
  }

  const scholarship = cleanPlainText(formData.scholarship, 100);
  const studyLevel = cleanPlainText(formData.studyLevel, 40);
  const cgpa = cleanPlainText(formData.cgpa, 4);
  const statement = cleanPlainText(formData.statement, 500);
  const parsedCgpa = Number(cgpa);

  if (!SCHOLARSHIP_OPTIONS.includes(scholarship) || !studyLevel || !cgpa || !statement) {
    return { ok: false, message: 'Please complete every required field before submitting.' };
  }
  if (!Number.isFinite(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 4) {
    return { ok: false, message: 'CGPA must be a number between 0.00 and 4.00.' };
  }
  if (statement.length < 20) {
    return { ok: false, message: 'Personal statement must contain at least 20 characters.' };
  }

  const applications = getApplications();
  const nextNumber = applications.reduce((max, item) => {
    const value = Number(String(item.id).replace('APP-', ''));
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 1000) + 1;

  const application = {
    id: `APP-${nextNumber}`,
    studentName: currentUser.name,
    scholarship,
    submitted: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'Submitted',
    documentStatus: 'Awaiting verification',
    phone: 'Not provided',
    cnic: 'Not provided',
    internalNote: 'New application awaiting officer verification.',
    studyLevel,
    cgpa: parsedCgpa.toFixed(2),
    statement
  };

  const updated = [application, ...applications];
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
  return { ok: true, message: `${application.id} submitted successfully.`, application, applications: updated };
}

export function updateApplicationStatus(applicationId, nextStatus) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'officer') {
    return { ok: false, message: 'Access Denied: only a Scholarship Officer can change an application decision.' };
  }
  const applications = getApplications();
  const exists = applications.some((item) => item.id === applicationId);
  if (!exists) return { ok: false, message: 'Application not found.' };
  const updated = applications.map((item) => item.id === applicationId ? { ...item, status: nextStatus } : item);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
  return { ok: true, message: `${applicationId} marked as ${nextStatus}.`, applications: updated };
}

export function maskPhone(phone) {
  if (!phone || phone === 'Not provided') return phone || '';
  return `${phone.slice(0, 4)}-***-${phone.slice(-4)}`;
}

export function maskCnic(cnic) {
  if (!cnic || cnic === 'Not provided') return cnic || '';
  return `${cnic.slice(0, 5)}-*******`;
}
