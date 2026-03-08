const AlertCard = ({ alert }) => {
  const getSeverityClass = (severity) => {
    if (severity === 'Critical') return 'alert-critical';
    if (severity === 'Warning') return 'alert-warning';
    return 'alert-info';
  };

  return (
    <div className={`alert-card ${getSeverityClass(alert.severity)}`}>
      <div className="alert-icon">⚠</div>
      <div className="alert-content">
        <h4>{alert.machine}</h4>
        <p>{alert.message}</p>
        <span className="alert-time">{alert.timestamp}</span>
      </div>
    </div>
  );
};

export default AlertCard;
