export const DEMO_USERS = [
  { id: 'student-1', name: 'Muhammad Uzair', role: 'student', roleLabel: 'Student', email: 'student@scholarsecure.demo', accessCode: 'StudentDemo2026' },
  { id: 'officer-1', name: 'Sara Ahmed', role: 'officer', roleLabel: 'Scholarship Officer', email: 'officer@scholarsecure.demo', accessCode: 'OfficerDemo2026' }
];

const SESSION_KEY = 'scholarsecure_current_user';
const APPLICATIONS_KEY = 'scholarsecure_demo_applications';

const seedApplications = [
  { id: 'APP-1001', studentName: 'Muhammad Uzair', scholarship: 'HEC Need-Based Scholarship', submitted: '26 Sep 2026', status: 'Under review', documentStatus: '4 of 5 verified', phone: '0300-000-0001', cnic: 'DEMO-CNIC-001', internalNote: 'Income evidence requires final cross-check before a decision.' },
  { id: 'APP-1002', studentName: 'Areeba Khan', scholarship: 'Punjab Educational Endowment Fund', submitted: '30 Sep 2026', status: 'Pending review', documentStatus: '5 of 5 verified', phone: '0300-000-0002', cnic: 'DEMO-CNIC-002', internalNote: 'Eligibility evidence is complete. Review academic threshold.' },
  { id: 'APP-1003', studentName: 'Hamza Ali', scholarship: 'Digital Skills Access Scholarship', submitted: '02 Oct 2026', status: 'Pending review', documentStatus: '3 of 4 verified', phone: '0300-000-0003', cnic: 'DEMO-CNIC-003', internalNote: 'Domicile verification is still pending.' }
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
    if (saved) return JSON.parse(saved);
  } catch {
    localStorage.removeItem(APPLICATIONS_KEY);
  }
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(seedApplications));
  return seedApplications;
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
  return phone ? `${phone.slice(0, 4)}-***-${phone.slice(-4)}` : '';
}

export function maskCnic(cnic) {
  return cnic ? `${cnic.slice(0, 5)}-*******` : '';
}
