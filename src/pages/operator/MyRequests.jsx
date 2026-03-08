import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useMachines } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';

const MyRequests = () => {
  const { requests, supportTickets } = useMachines();
  const { user } = useAuth();

  const myMaintenanceRequests = requests.filter(r => (
    (r.reportedById && user?.id) ? r.reportedById === user.id :
    (r.reportedByEmail && user?.email) ? r.reportedByEmail === user.email :
    r.reportedBy === user?.name
  ));

  const mySupportRequests = (supportTickets || []).filter(s => (
    (s.userId && user?.id) ? (s.userId === user.id || s.userId === user._id) :
    (s.reportedByEmail && user?.email) ? s.reportedByEmail === user.email :
    (s.reportedByName ? s.reportedByName === user?.name : false)
  )).map(s => ({
    id: s.id || s._id,
    machine: s.machineId || s.machine || '-',
    issue: s.subject || s.message || 'Support Request',
    priority: s.priority || 'Medium',
    status: s.status || 'Open',
    assignedTo: s.assignedTo || '-',
    createdAt: s.createdAt
  }));

  const myRequests = [...myMaintenanceRequests, ...mySupportRequests];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">My Reported Issues</h1>
          
          {myRequests.length === 0 ? (
            <div className="empty-state">
              <p>You haven't reported any issues yet.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="request-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Machine</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Reported Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.id}</td>
                      <td>{req.machine}</td>
                      <td>{req.issue}</td>
                      <td>
                        <span className={`priority-badge priority-${req.priority.toLowerCase()}`}>
                          {req.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${req.status.toLowerCase().replace(' ', '-')}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>{req.assignedTo}</td>
                      <td>{new Date(req.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyRequests;
