import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      const parsed = JSON.parse(userData);
      // normalize id field for consistent comparisons
      if (!parsed.id && parsed._id) parsed.id = parsed._id;
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    // normalize id
    const storeUser = { ...userData };
    if (!storeUser.id && storeUser._id) storeUser.id = storeUser._id;
    localStorage.setItem('user', JSON.stringify(storeUser));
    setUser(storeUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
