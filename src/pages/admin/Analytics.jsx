import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ChartPanel from '../../components/ChartPanel';
import { useMachines } from '../../context/MachineContext';

const Analytics = () => {
  const { machines, anomalies, requests } = useMachines();

  const machineAnomalyCount = machines.map(m => ({
    id: m.id,
    count: anomalies.filter(a => a.machine === m.id).length
  }));

  const machineAnomalies = machineAnomalyCount.map(m => m.count);
  const machineLabels = machineAnomalyCount.map(m => m.id);

  const maintenanceByMachine = machines.map(m => 
    requests.filter(r => r.machine === m.id).length
  );

  const avgTemp = machines.reduce((sum, m) => sum + parseFloat(m.temperature), 0) / machines.length;
  const avgPressure = machines.reduce((sum, m) => sum + parseFloat(m.pressure), 0) / machines.length;
  const avgVibration = machines.reduce((sum, m) => sum + parseFloat(m.vibration), 0) / machines.length;

  const sensorComparison = [avgTemp, avgPressure, avgVibration];
  const sensorLabels = ['Temperature', 'Pressure', 'Vibration'];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">System Analytics</h1>
          
          <div className="charts-grid">
            <ChartPanel 
              title="Machines with Most Anomalies" 
              data={machineAnomalies} 
              labels={machineLabels} 
            />
            <ChartPanel 
              title="Maintenance Frequency" 
              data={maintenanceByMachine} 
              labels={machineLabels} 
            />
            <ChartPanel 
              title="Average Sensor Values" 
              data={sensorComparison} 
              labels={sensorLabels} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
