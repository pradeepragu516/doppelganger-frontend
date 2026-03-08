import { useNavigate } from 'react-router-dom';

const MachineCard = ({ machine }) => {
  const navigate = useNavigate();

  const getStatusClass = (status) => {
    if (status === 'Normal') return 'status-normal';
    if (status === 'Warning') return 'status-warning';
    return 'status-critical';
  };

  return (
    <div className="machine-card" onClick={() => navigate(`/admin/machines/${machine.id}`)}>
      <div className="machine-header">
        <h3>{machine.id}</h3>
        <span className={`status-badge ${getStatusClass(machine.status)}`}>
          {machine.status}
        </span>
      </div>
      <div className="machine-metrics">
        <div className="metric">
          <span className="metric-label">Temp</span>
          <span className="metric-value">{parseFloat(machine.temperature).toFixed(1)}°C</span>
        </div>
        <div className="metric">
          <span className="metric-label">Pressure</span>
          <span className="metric-value">{parseFloat(machine.pressure).toFixed(1)} PSI</span>
        </div>
        <div className="metric">
          <span className="metric-label">Vibration</span>
          <span className="metric-value">{parseFloat(machine.vibration).toFixed(1)} mm/s</span>
        </div>
        <div className="metric">
          <span className="metric-label">Health</span>
          <span className="metric-value" style={{ 
            color: machine.healthScore > 70 ? '#00ff88' : machine.healthScore > 50 ? '#ffaa00' : '#ff3366' 
          }}>
            {machine.healthScore}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
