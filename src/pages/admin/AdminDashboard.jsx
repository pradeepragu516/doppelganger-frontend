import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ChartPanel from '../../components/ChartPanel';
import { useMachines } from '../../context/MachineContext';

const AdminDashboard = () => {
  const { machines, anomalies, requests, systemEvents, users } = useMachines();

  const criticalMachines = machines.filter(m => m.status === 'Critical').length;
  const warningMachines = machines.filter(m => m.status === 'Warning').length;
  const openRequests = requests.filter(r => r.status !== 'Resolved').length;
  const criticalAnomalies = anomalies.filter(a => a.severity === 'Critical').length;

  const stats = [
    { label: 'Total Machines', value: machines.length, color: '#00d4ff', icon: '🏭' },
    { label: 'Critical Alerts', value: criticalMachines, color: '#ff3366', icon: '⚠' },
    { label: 'Open Requests', value: openRequests, color: '#ffaa00', icon: '🔧' },
    { label: 'Anomalies Today', value: criticalAnomalies, color: '#ff3366', icon: '🚨' }
  ];

  const avgHealth = machines.reduce((sum, m) => sum + m.healthScore, 0) / machines.length;
  const anomalyFrequency = machines.map(m => 
    anomalies.filter(a => a.machine === m.id).length
  );
  
  const technicianWorkload = users
    .filter(u => (u.role || '').toLowerCase() === 'maintenance')
    .map(tech => ({
      name: tech.name,
      count: requests.filter(r => (
        (r.assignedToId && tech.id ? r.assignedToId === tech.id : false) ||
        (r.assignedToEmail && tech.email ? r.assignedToEmail === tech.email : false) ||
        r.assignedTo === tech.name
      ) && r.status !== 'Resolved').length
    }));

  const tempData = machines.map(m => parseFloat(m.temperature));
  const vibData = machines.map(m => parseFloat(m.vibration));
  const labels = machines.map(m => m.id);

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">Control Center</h1>
          
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

          <div className="dashboard-grid-clean">
            <div className="dashboard-card">
              <h2 className="card-title">Fleet Health</h2>
              <div className="health-summary-clean">
                <div className="health-score-large">
                  <span className="score-value" style={{ color: avgHealth > 70 ? '#00ff88' : '#ffaa00' }}>
                    {avgHealth.toFixed(0)}%
                  </span>
                  <span className="score-label">Avg Health</span>
                </div>
                <div className="health-breakdown-clean">
                  <div className="breakdown-row">
                    <span className="breakdown-dot normal"></span>
                    <span className="breakdown-text">Normal: {machines.filter(m => m.status === 'Normal').length}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-dot warning"></span>
                    <span className="breakdown-text">Warning: {warningMachines}</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-dot critical"></span>
                    <span className="breakdown-text">Critical: {criticalMachines}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <h2 className="card-title">Technician Workload</h2>
              <div className="workload-list-clean">
                {technicianWorkload.map((tech, idx) => (
                  <div key={idx} className="workload-row">
                    <span className="tech-name-clean">{tech.name}</span>
                    <div className="workload-bar-clean">
                      <div 
                        className="workload-fill-clean" 
                        style={{ width: `${Math.min(tech.count * 25, 100)}%` }}
                      ></div>
                    </div>
                    <span className="workload-count-clean">{tech.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="charts-grid-clean">
            <ChartPanel title="Temperature Distribution" data={tempData} labels={labels} />
            <ChartPanel title="Vibration Levels" data={vibData} labels={labels} />
          </div>

          <div className="activity-card">
            <h2 className="card-title">System Activity</h2>
            <div className="activity-feed-clean">
              {systemEvents.slice(0, 8).map((event) => (
                <div key={event.id} className="event-row">
                  <span className={`event-dot ${event.severity}`}></span>
                  <span className="event-text">{event.message}</span>
                  <span className="event-time">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
