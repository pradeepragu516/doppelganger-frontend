const HealthIndicator = ({ score }) => {
  const getHealthColor = () => {
    if (score >= 80) return '#00ff88';
    if (score >= 60) return '#ffaa00';
    return '#ff3366';
  };

  return (
    <div className="health-indicator">
      <span className="health-label">Health Score</span>
      <div className="health-bar">
        <div 
          className="health-fill" 
          style={{ 
            width: `${score}%`,
            background: getHealthColor()
          }}
        ></div>
      </div>
      <span className="health-value" style={{ color: getHealthColor() }}>
        {score}%
      </span>
    </div>
  );
};

export default HealthIndicator;
