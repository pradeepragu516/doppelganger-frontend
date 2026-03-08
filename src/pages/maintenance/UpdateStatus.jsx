import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useMachines } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';

const UpdateStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateRequestStatus, requests } = useMachines();
  const { assignRequestToUser } = useMachines();
  const { user } = useAuth();
  const [status, setStatus] = useState('Pending');
  const [notes, setNotes] = useState('');
  const [partsReplaced, setPartsReplaced] = useState('');

  const request = requests.find(r => r.id === id);

  useEffect(() => {
    // if the request is unassigned, claim it for the current user when opened
    if (request && (!request.assignedToId && !request.assignedToEmail && (!request.assignedTo || request.assignedTo === 'Unassigned')) && user) {
      assignRequestToUser(id, user);
    }
  }, [request, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateRequestStatus(id, status, notes, partsReplaced);
    navigate('/maintenance/requests');
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">Update Request - {id}</h1>
          
          {request && (
            <div className="request-info">
              <h3>Request Details</h3>
              <p><strong>Machine:</strong> {request.machine}</p>
              <p><strong>Issue:</strong> {request.issue}</p>
              {request.sensorValues && (
                <p><strong>Sensor Values:</strong> Temp: {request.sensorValues.temp}°C, Pressure: {request.sensorValues.pressure} PSI, Vibration: {request.sensorValues.vibration} mm/s</p>
              )}
            </div>
          )}
          
          <div className="update-form-container">
            <form onSubmit={handleSubmit} className="update-form">
              <div className="form-group">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Parts Replaced</label>
                <input
                  type="text"
                  value={partsReplaced}
                  onChange={(e) => setPartsReplaced(e.target.value)}
                  placeholder="e.g., Cooling fan, Bearing assembly"
                />
              </div>
              
              <div className="form-group">
                <label>Repair Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter repair notes and observations..."
                  rows="6"
                  required
                />
              </div>
              
              <button type="submit" className="btn-submit">Update Request</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateStatus;
