import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Operator');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // normalize role to backend enum
    const normalizedRole = role.toLowerCase() === 'admin' ? 'admin' : (role.toLowerCase() === 'maintenance' ? 'maintenance' : 'operator');
    try {
      const { user, token, error } = await authService.register({ name, email, password, role: normalizedRole });
      if (error) {
        console.warn('Register fallback or error:', error);
      }
      login(user, token || 'mock-token-12345');
    } catch (err) {
      console.error('Register error:', err);
      return;
    }
    
    if (role === 'Admin') {
      navigate('/admin/dashboard');
    } else if (role === 'Maintenance') {
      navigate('/maintenance/dashboard');
    } else {
      navigate('/operator/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Create Account</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Operator">Machine Operator</option>
              <option value="Maintenance">Maintenance Technician</option>
              <option value="Admin">Administrator</option>
            </select>
          </div>
          <button type="submit" className="btn-submit">Create Account</button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
