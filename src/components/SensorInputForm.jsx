import { useState } from 'react';

const SensorInputForm = ({ machineId, onUpdate }) => {
  const [temperature, setTemperature] = useState('');
  const [pressure, setPressure] = useState('');
  const [vibration, setVibration] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(machineId, { temperature, pressure, vibration });
    setTemperature('');
    setPressure('');
    setVibration('');
  };

  return (
    <form onSubmit={handleSubmit} className="sensor-form">
      <h3>Update Sensor Data</h3>
      <div className="sensor-inputs">
        <div className="form-group">
          <label>Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="65"
            required
          />
        </div>
        <div className="form-group">
          <label>Pressure (PSI)</label>
          <input
            type="number"
            step="0.1"
            value={pressure}
            onChange={(e) => setPressure(e.target.value)}
            placeholder="90"
            required
          />
        </div>
        <div className="form-group">
          <label>Vibration (mm/s)</label>
          <input
            type="number"
            step="0.1"
            value={vibration}
            onChange={(e) => setVibration(e.target.value)}
            placeholder="3.2"
            required
          />
        </div>
      </div>
      <button type="submit" className="btn-submit">Update Sensors</button>
    </form>
  );
};

export default SensorInputForm;
