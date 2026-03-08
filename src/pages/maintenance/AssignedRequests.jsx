import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import RequestTable from '../../components/RequestTable';
import { useMachines } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';

const AssignedRequests = () => {
  const navigate = useNavigate();
  const { requests } = useMachines();
  const { user } = useAuth();

  const assignedRequests = requests.filter(r => (
    // include requests assigned to this user
    r.assignedToId && user?.id ? r.assignedToId === user.id :
    r.assignedToEmail && user?.email ? r.assignedToEmail === user.email :
    r.assignedTo === user?.name
  ));

  // also show unassigned tasks so technicians can claim them
  const unassigned = requests.filter(r => !r.assignedToId && !r.assignedToEmail && (!r.assignedTo || r.assignedTo === 'Unassigned'));
  const visibleRequests = [...assignedRequests, ...unassigned];

  const handleUpdate = (id) => {
    navigate(`/maintenance/update/${id}`);
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">My Assigned Tasks</h1>
          <RequestTable requests={visibleRequests} showActions={true} showSensorData={true} onUpdate={handleUpdate} />
        </main>
      </div>
    </div>
  );
};

export default AssignedRequests;
