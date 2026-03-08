const RequestTable = ({ requests, showActions = false, showSensorData = false, onUpdate }) => {
  const getPriorityClass = (priority) => {
    if (priority === 'High') return 'priority-high';
    if (priority === 'Medium') return 'priority-medium';
    return 'priority-low';
  };

  const getStatusClass = (status) => {
    if (status === 'Resolved') return 'status-resolved';
    if (status === 'In Progress') return 'status-progress';
    return 'status-pending';
  };

  return (
    <div className="table-container">
      <table className="request-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Machine</th>
            <th>Issue</th>
            {showSensorData && <th>Sensor Values</th>}
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.machine}</td>
              <td>{req.issue}</td>
              {showSensorData && req.sensorValues && (
                <td className="sensor-values">
                  T: {req.sensorValues.temp}°C, P: {req.sensorValues.pressure} PSI, V: {req.sensorValues.vibration} mm/s
                </td>
              )}
              <td><span className={`priority-badge ${getPriorityClass(req.priority)}`}>{req.priority}</span></td>
              <td><span className={`status-badge ${getStatusClass(req.status)}`}>{req.status}</span></td>
              <td>{req.assignedTo}</td>
              {showActions && (
                <td>
                  <button className="btn-action" onClick={() => onUpdate(req.id)}>Update</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
