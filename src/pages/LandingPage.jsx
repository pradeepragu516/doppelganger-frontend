import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1 className="hero-title">AI Powered Predictive Maintenance</h1>
        <p className="hero-subtitle">
          Monitor industrial machines in real-time and detect anomalies before failures occur.
        </p>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-secondary" onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>

      <div className="features-section">
        <h2>Platform Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Monitoring</h3>
            <p>Track temperature, pressure, and vibration sensors across all equipment</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Anomaly Detection</h3>
            <p>Machine learning algorithms identify potential failures before they occur</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Maintenance Tracking</h3>
            <p>Streamlined workflow for maintenance requests and technician assignments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
