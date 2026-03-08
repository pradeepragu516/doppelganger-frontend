import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useMachines } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';

const SupportRequests = () => {
  const { supportTickets, addSupportTicket, machines } = useMachines();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    machine: '',
    issue: '',
    priority: 'Medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addSupportTicket({
      ...formData,
      user: user.name
    });
    setFormData({ machine: '', issue: '', priority: 'Medium' });
    setShowForm(false);
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Support Requests</h1>
            <button className="btn-add" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Report Issue'}
            </button>
          </div>

          {showForm && (
            <div className="form-container">
              <form onSubmit={handleSubmit} className="support-form">
                <div className="form-group">
                  <label>Machine</label>
                  <select
                    value={formData.machine}
                    onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                    required
                  >
                    <option value="">Select Machine</option>
                    {machines.map(m => (
                      <option key={m.id} value={m.id}>{m.id}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Issue Description</label>
                  <textarea
                    value={formData.issue}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    placeholder="Describe the issue..."
                    rows="4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <button type="submit" className="btn-submit">Submit Report</button>
              </form>
            </div>
          )}

          <div className="table-container">
            <table className="support-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>User</th>
                  <th>Machine</th>
                  <th>Issue</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {supportTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.user}</td>
                    <td>{ticket.machine}</td>
                    <td>{ticket.issue}</td>
                    <td>
                      <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge status-pending">{ticket.status}</span>
                    </td>
                    <td>{new Date(ticket.createdAt).toLocaleString()}</td>
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

export default SupportRequests;
