import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import RequestTable from '../../components/RequestTable';
import { useMachines } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';

const MaintenanceRequests = () => {
  const { requests } = useMachines();
  const { user } = useAuth();

  // Only show requests that were submitted by operators (have reportedBy fields)
  // Admins see all operator-submitted requests; operators see only their own reported requests.
  const reportedRequests = requests.filter(r => r.reportedBy || r.reportedById || r.reportedByEmail);
  const visibleRequests = (user && (user.role || '').toLowerCase() === 'operator')
    ? reportedRequests.filter(r => (
        (r.reportedById && user.id ? r.reportedById === user.id : false) ||
        (r.reportedByEmail && user.email ? r.reportedByEmail === user.email : false) ||
        r.reportedBy === user.name
      ))
    : reportedRequests;

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">Maintenance Request Queue</h1>
          <RequestTable requests={requests} showSensorData={true} />
        </main>
      </div>
    </div>
  );
};

export default MaintenanceRequests;
