import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useMachines } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MaintenanceDashboard = () => {
  const { requests, machines } = useMachines();
  const { user } = useAuth();
  const navigate = useNavigate();

  const myRequests = requests.filter(r => (
    r.assignedToId && user?.id ? r.assignedToId === user.id :
    r.assignedToEmail && user?.email ? r.assignedToEmail === user.email :
    r.assignedTo === user?.name
  ));
  // show unassigned requests as available tasks for technicians
  const availableRequests = requests.filter(r => (
    (!r.assignedToId && !r.assignedToEmail && (!r.assignedTo || r.assignedTo === 'Unassigned'))
    && r.status !== 'Resolved'
  ));
  const pendingTasks = myRequests.filter(r => r.status === 'Pending').length;
  const inProgressTasks = myRequests.filter(r => r.status === 'In Progress').length;
  const completedToday = myRequests.filter(r => r.status === 'Resolved').length;

  const stats = [
    { label: 'Pending Tasks', value: pendingTasks, color: '#ffaa00', icon: '⏳' },
    { label: 'In Progress', value: inProgressTasks, color: '#00d4ff', icon: '🔧' },
    { label: 'Completed', value: completedToday, color: '#00ff88', icon: '✓' }
  ];

  const urgentRequests = myRequests
    .filter(r => r.status !== 'Resolved')
    .sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 6);

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">Technician Dashboard</h1>
          <p className="dashboard-subtitle">Welcome, {user?.name}</p>
          
          <div className="stats-grid-clean">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card-clean" style={{ borderTop: `3px solid ${stat.color}` }}>
                <div className="stat-icon-clean">{stat.icon}</div>
                <div className="stat-details">
                  <div className="stat-value-clean" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="stat-label-clean">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">My Active Tasks</h2>
            {urgentRequests.length === 0 ? (
              <p className="no-data">No active tasks at the moment</p>
            ) : (
              <div className="task-list-clean">
                {urgentRequests.map((req) => (
                  <div 
                    key={req.id} 
                    className="task-item-clean"
                    onClick={() => navigate(`/maintenance/update/${req.id}`)}
                  >
                    <div className="task-header-clean">
                      <span className="task-id-clean">{req.id}</span>
                      <span className={`priority-badge priority-${req.priority.toLowerCase()}`}>
                        {req.priority}
                      </span>
                    </div>
                    <div className="task-machine-clean">{req.machine}</div>
                    <div className="task-issue-clean">{req.issue}</div>
                    <div className="task-footer-clean">
                      <span className={`status-badge status-${req.status.toLowerCase().replace(' ', '-')}`}>
                        {req.status}
                      </span>
                      <span className="task-time-clean">{new Date(req.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dashboard-card">
            <h2 className="card-title">Available Tasks</h2>
            {availableRequests.length === 0 ? (
              <p className="no-data">No available tasks right now</p>
            ) : (
              <div className="task-list-clean">
                {availableRequests.map((req) => (
                  <div 
                    key={req.id} 
                    className="task-item-clean"
                    onClick={() => navigate(`/maintenance/update/${req.id}`)}
                  >
                    <div className="task-header-clean">
                      <span className="task-id-clean">{req.id}</span>
                      <span className={`priority-badge priority-${req.priority.toLowerCase()}`}>
                        {req.priority}
                      </span>
                    </div>
                    <div className="task-machine-clean">{req.machine}</div>
                    <div className="task-issue-clean">{req.issue}</div>
                    <div className="task-footer-clean">
                      <span className={`status-badge status-${req.status.toLowerCase().replace(' ', '-')}`}>
                        {req.status}
                      </span>
                      <span className="task-time-clean">{new Date(req.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
