import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const adminMenu = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/machines', label: 'Machine Monitor' },
    { path: '/admin/requests', label: 'Maintenance Requests' },
    { path: '/admin/analytics', label: 'Analytics' },
    { path: '/admin/users', label: 'User Management' }
  ];

  const maintenanceMenu = [
    { path: '/maintenance/dashboard', label: 'Dashboard' },
    { path: '/maintenance/requests', label: 'Assigned Requests' }
  ];

  const operatorMenu = [
    { path: '/operator/dashboard', label: 'Dashboard' },
    { path: '/operator/report', label: 'Report Issue' },
    { path: '/operator/myrequests', label: 'My Requests' }
  ];

  const role = (user?.role || '').toLowerCase();
  let menu = [];
  if (role === 'admin') menu = adminMenu;
  else if (role === 'maintenance') menu = maintenanceMenu;
  else if (role === 'operator') menu = operatorMenu;

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
