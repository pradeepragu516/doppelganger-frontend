import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useMachines } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';

const ReportIssue = () => {
  const { machines, addSupportTicket } = useMachines();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    machine: '',
    issue: '',
    priority: 'Medium',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        await addSupportTicket({
          ...formData,
          user: user.name,
          reportedBy: user.name,
          reportedById: user.id,
          reportedByEmail: user.email
        });
      } catch (err) {
        console.warn('Support submit failed:', err);
      } finally {
        navigate('/operator/myrequests');
      }
    })();
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">Report Machine Issue</h1>
          
          <div className="form-container">
            <form onSubmit={handleSubmit} className="issue-form">
              <div className="form-group">
                <label>Select Machine</label>
                <select
                  value={formData.machine}
                  onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                  required
                >
                  <option value="">Choose a machine...</option>
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.id} - {m.location} (Status: {m.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Issue Type</label>
                <select
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  required
                >
                  <option value="">Select issue type...</option>
                  <option value="Unusual noise">Unusual noise</option>
                  <option value="Overheating">Overheating</option>
                  <option value="Excessive vibration">Excessive vibration</option>
                  <option value="Performance degradation">Performance degradation</option>
                  <option value="Error codes">Error codes</option>
                  <option value="Leaking fluids">Leaking fluids</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low - Can wait</option>
                  <option value="Medium">Medium - Should be checked soon</option>
                  <option value="High">High - Urgent attention needed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what you observed in detail..."
                  rows="6"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">Submit Issue Report</button>
                <button type="button" className="btn-cancel" onClick={() => navigate('/operator/dashboard')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportIssue;
