import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useMachines } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OperatorDashboard = () => {
  const { machines, requests } = useMachines();
  const { user } = useAuth();
  const navigate = useNavigate();

  const myRequests = requests.filter(r => r.reportedBy === user?.name);
  const pendingRequests = myRequests.filter(r => r.status === 'Pending').length;
  const inProgressRequests = myRequests.filter(r => r.status === 'In Progress').length;
  const resolvedRequests = myRequests.filter(r => r.status === 'Resolved').length;

  const criticalMachines = machines.filter(m => m.status === 'Critical');
  const warningMachines = machines.filter(m => m.status === 'Warning');
  const normalMachines = machines.filter(m => m.status === 'Normal');

  const stats = [
    { label: 'Total Machines', value: machines.length, color: '#00d4ff', icon: '🏭' },
    { label: 'Pending Issues', value: pendingRequests, color: '#ffaa00', icon: '⏳' },
    { label: 'In Progress', value: inProgressRequests, color: '#00d4ff', icon: '🔧' },
    { label: 'Resolved', value: resolvedRequests, color: '#00ff88', icon: '✓' }
  ];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">Operator Dashboard</h1>
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

          <div className="operator-actions-section">
            <button className="btn-report-large" onClick={() => navigate('/operator/report')}>
              ⚠ Report Machine Issue
            </button>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">Fleet Status Overview</h2>
            <div className="fleet-status-grid">
              <div className="fleet-status-item">
                <div className="fleet-status-count" style={{ color: '#00ff88' }}>{normalMachines.length}</div>
                <div className="fleet-status-label">Normal</div>
              </div>
              <div className="fleet-status-item">
                <div className="fleet-status-count" style={{ color: '#ffaa00' }}>{warningMachines.length}</div>
                <div className="fleet-status-label">Warning</div>
              </div>
              <div className="fleet-status-item">
                <div className="fleet-status-count" style={{ color: '#ff3366' }}>{criticalMachines.length}</div>
                <div className="fleet-status-label">Critical</div>
              </div>
            </div>
          </div>

          {(criticalMachines.length > 0 || warningMachines.length > 0) && (
            <div className="dashboard-card">
              <h2 className="card-title">Machine Alerts</h2>
              {criticalMachines.length > 0 && (
                <div className="alert-section-clean">
                  <h3 className="alert-section-title critical">Critical Status</h3>
                  <div className="machine-alert-grid-clean">
                    {criticalMachines.map(m => (
                      <div key={m.id} className="machine-alert-card-clean critical">
                        <div className="machine-alert-id-clean">{m.id}</div>
                        <div className="machine-alert-location-clean">{m.location}</div>
                        <div className="machine-alert-health-clean">Health: {m.healthScore}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {warningMachines.length > 0 && (
                <div className="alert-section-clean">
                  <h3 className="alert-section-title warning">Warning Status</h3>
                  <div className="machine-alert-grid-clean">
                    {warningMachines.map(m => (
                      <div key={m.id} className="machine-alert-card-clean warning">
                        <div className="machine-alert-id-clean">{m.id}</div>
                        <div className="machine-alert-location-clean">{m.location}</div>
                        <div className="machine-alert-health-clean">Health: {m.healthScore}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OperatorDashboard;
