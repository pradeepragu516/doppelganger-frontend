import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="system-title">Smart Maintenance System</h1>
      </div>
      <div className="navbar-right">
        <span className="user-name">{user?.name}</span>
        <span className="user-role">{user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : ''}</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
