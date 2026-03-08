import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useMachines } from '../../context/MachineContext';

const AnomalyMonitor = () => {
  const { anomalies } = useMachines();

  const getSeverityClass = (severity) => {
    if (severity === 'Critical') return 'severity-critical';
    if (severity === 'Warning') return 'severity-warning';
    return 'severity-normal';
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">Anomaly Event Log</h1>
          
          <div className="table-container">
            <table className="anomaly-table">
              <thead>
                <tr>
                  <th>Machine</th>
                  <th>Timestamp</th>
                  <th>Sensor Trigger</th>
                  <th>Anomaly Score</th>
                  <th>Severity</th>
                  <th>Action Taken</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.map((anomaly) => (
                  <tr key={anomaly.id}>
                    <td>{anomaly.machine}</td>
                    <td>{anomaly.timestamp}</td>
                    <td>{anomaly.issues}</td>
                    <td>{anomaly.score}</td>
                    <td>
                      <span className={`severity-badge ${getSeverityClass(anomaly.severity)}`}>
                        {anomaly.severity}
                      </span>
                    </td>
                    <td>{anomaly.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnomalyMonitor;
