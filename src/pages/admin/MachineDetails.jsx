import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ChartPanel from '../../components/ChartPanel';
import SensorInputForm from '../../components/SensorInputForm';
import HealthIndicator from '../../components/HealthIndicator';
import { useMachines } from '../../context/MachineContext';

const MachineDetails = () => {
  const { id } = useParams();
  const { machines, updateMachineSensors, anomalies } = useMachines();
  
  const machine = machines.find(m => m.id === id);

  if (!machine) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-content">
          <Sidebar />
          <main className="main-content">
            <h1 className="page-title">Machine not found</h1>
          </main>
        </div>
      </div>
    );
  }

  const machineAnomalies = anomalies.filter(a => a.machine === id);

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">Machine Details - {id}</h1>
          
          <div className="machine-info-card">
            <h2>Machine Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Machine ID</span>
                <span className="info-value">{machine.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">{machine.location}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className={`status-badge status-${machine.status.toLowerCase()}`}>
                  {machine.status}
                </span>
              </div>
            </div>
            
            <HealthIndicator score={machine.healthScore} />
          </div>

          <SensorInputForm machineId={id} onUpdate={updateMachineSensors} />

          <div className="activity-logs">
            <h2>Activity Logs</h2>
            <div className="logs-container">
              {machine.logs && machine.logs.length > 0 ? (
                machine.logs.map((log, idx) => (
                  <div key={idx} className="log-entry">
                    <span className="log-time">{log.timestamp}</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))
              ) : (
                <p className="no-logs">No activity logs yet</p>
              )}
            </div>
          </div>

          <div className="charts-grid">
            <ChartPanel 
              title="Temperature Trend" 
              data={machine.history.temperature} 
              labels={machine.history.timestamps} 
            />
            <ChartPanel 
              title="Pressure Trend" 
              data={machine.history.pressure} 
              labels={machine.history.timestamps} 
            />
            <ChartPanel 
              title="Vibration Trend" 
              data={machine.history.vibration} 
              labels={machine.history.timestamps} 
            />
          </div>

          {machineAnomalies.length > 0 && (
            <div className="anomaly-history">
              <h2>Anomaly History</h2>
              <div className="table-container">
                <table className="anomaly-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Score</th>
                      <th>Severity</th>
                      <th>Issues</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {machineAnomalies.map((anomaly) => (
                      <tr key={anomaly.id}>
                        <td>{anomaly.timestamp}</td>
                        <td>{anomaly.score}</td>
                        <td>
                          <span className={`severity-badge severity-${anomaly.severity.toLowerCase()}`}>
                            {anomaly.severity}
                          </span>
                        </td>
                        <td>{anomaly.issues}</td>
                        <td>{anomaly.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MachineDetails;
