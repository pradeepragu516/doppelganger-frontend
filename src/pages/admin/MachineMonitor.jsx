import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import MachineCard from '../../components/MachineCard';
import { useMachines } from '../../context/MachineContext';

const MachineMonitor = () => {
  const { machines, removeMachine } = useMachines();
  const navigate = useNavigate();

  const criticalCount = machines.filter(m => m.status === 'Critical').length;
  const warningCount = machines.filter(m => m.status === 'Warning').length;
  const normalCount = machines.filter(m => m.status === 'Normal').length;

  const handleRemoveMachine = (machineId, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${machineId}?`)) {
      removeMachine(machineId);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <div className="page-header-clean">
            <div>
              <h1 className="page-title">Machine Fleet Monitor</h1>
              <div className="fleet-summary">
                <div className="summary-item">
                  <span className="summary-count critical">{criticalCount}</span>
                  <span className="summary-label">Critical</span>
                </div>
                <div className="summary-item">
                  <span className="summary-count warning">{warningCount}</span>
                  <span className="summary-label">Warning</span>
                </div>
                <div className="summary-item">
                  <span className="summary-count normal">{normalCount}</span>
                  <span className="summary-label">Normal</span>
                </div>
              </div>
            </div>
            <button className="btn-add-machine" onClick={() => navigate('/admin/machines/add')}>
              + Add Machine
            </button>
          </div>
          
          <div className="machines-grid">
            {machines.map((machine) => (
              <div key={machine.id} className="machine-card-wrapper">
                <MachineCard machine={machine} />
                <button 
                  className="btn-remove-machine" 
                  onClick={(e) => handleRemoveMachine(machine.id, e)}
                  title="Remove machine"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MachineMonitor;
