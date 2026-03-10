// config.js — ListenMe
// Set this to your Frontend Public ALB DNS (or EC2 IP for single-server)
const API_BASE = 'http://FRONTEND-PUBLIC-ALB-DNS/api';

const api = {
  async request(method, path, body = null, auth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res  = await fetch(API_BASE + path, opts);
    const data = await res.json();
    if (!res.ok) throw { status: res.status, ...data };
    return data;
  },

  async upload(path, formData) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res  = await fetch(API_BASE + path, { method: 'POST', headers, body: formData });
    const data = await res.json();
    if (!res.ok) throw { status: res.status, ...data };
    return data;
  },

  get:    (path, auth = true)       => api.request('GET',    path, null, auth),
  post:   (path, body, auth = true) => api.request('POST',   path, body, auth),
  del:    (path)                    => api.request('DELETE', path),
};

function requireAuth() {
  if (!localStorage.getItem('token')) { window.location.href = 'login.html'; return false; }
  return true;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}

function isAdmin() {
  const u = getUser();
  return u && u.is_admin === true;
}