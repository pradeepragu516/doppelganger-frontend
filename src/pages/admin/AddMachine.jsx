import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useMachines } from '../../context/MachineContext';

const AddMachine = () => {
  const navigate = useNavigate();
  const { addMachine } = useMachines();
  
  const [formData, setFormData] = useState({
    id: '',
    location: '',
    temperature: '',
    pressure: '',
    vibration: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMachine(formData);
    navigate('/admin/machines');
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">Add New Machine</h1>
          
          <div className="form-container">
            <form onSubmit={handleSubmit} className="machine-form">
              <div className="form-group">
                <label>Machine ID</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="CNC-01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Factory Floor A"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="65"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Pressure (PSI)</label>
                <input
                  type="number"
                  step="0.1"
                  name="pressure"
                  value={formData.pressure}
                  onChange={handleChange}
                  placeholder="90"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Vibration (mm/s)</label>
                <input
                  type="number"
                  step="0.1"
                  name="vibration"
                  value={formData.vibration}
                  onChange={handleChange}
                  placeholder="3.2"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-submit">Add Machine</button>
                <button type="button" className="btn-cancel" onClick={() => navigate('/admin/machines')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddMachine;
