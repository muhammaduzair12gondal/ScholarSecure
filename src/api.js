/**
 * Central API helper – all frontend-to-backend communication goes through here.
 * Automatically attaches the JWT token from sessionStorage to every request.
 */

const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return sessionStorage.getItem('scholarsecure_token');
}

function setToken(token) {
  sessionStorage.setItem('scholarsecure_token', token);
}

function clearToken() {
  sessionStorage.removeItem('scholarsecure_token');
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return data;
}

// ---------- Auth endpoints ----------

export async function loginAPI(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  // Store the JWT
  setToken(data.token);
  // Store user info for quick access
  sessionStorage.setItem('scholarsecure_current_user', JSON.stringify(data.user));
  return data.user;
}

export async function fetchCurrentUser() {
  try {
    const data = await request('/auth/me');
    return data;
  } catch {
    return null;
  }
}

export function logoutAPI() {
  clearToken();
  sessionStorage.removeItem('scholarsecure_current_user');
}

export function getStoredUser() {
  try {
    const raw = sessionStorage.getItem('scholarsecure_current_user');
    if (!raw) return null;
    // Also check that a token exists
    if (!getToken()) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ---------- Application endpoints ----------

export async function fetchApplications() {
  return request('/applications');
}

export async function createApplicationAPI(formData) {
  return request('/applications', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export async function updateApplicationStatusAPI(appId, status) {
  return request(`/applications/${appId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ---------- Utility functions (unchanged from original) ----------

export function maskPhone(phone) {
  if (!phone || phone === 'Not provided') return phone || '';
  return `${phone.slice(0, 4)}-***-${phone.slice(-4)}`;
}

export function maskCnic(cnic) {
  if (!cnic || cnic === 'Not provided') return cnic || '';
  return `${cnic.slice(0, 5)}-*******`;
}

export const SCHOLARSHIP_OPTIONS = [
  'HEC Need-Based Scholarship',
  'Punjab Educational Endowment Fund',
  'University Merit Support Grant',
  'Digital Skills Access Scholarship',
];
