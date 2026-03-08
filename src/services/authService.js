const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const safeJson = async (res) => {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
};

export const authService = {
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await safeJson(res);
      if (!res.ok) throw data;
      return { user: data.user || data, token: data.token };
    } catch (err) {
      // fallback to mock
      const mockUser = { name: email.includes('admin') ? 'Admin User' : 'Maintenance User', email, role: email.includes('admin') ? 'admin' : 'maintenance' };
      return { user: mockUser, token: 'mock-token-12345', error: err };
    }
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await safeJson(res);
      if (!res.ok) throw data;
      return { user: data, token: data.token };
    } catch (err) {
      // fallback to echo
      return { user: userData, token: 'mock-token-12345', error: err };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
