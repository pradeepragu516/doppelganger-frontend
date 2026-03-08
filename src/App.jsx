import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MachineProvider } from './context/MachineContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import MachineMonitor from './pages/admin/MachineMonitor';
import MachineDetails from './pages/admin/MachineDetails';
import AnomalyMonitor from './pages/admin/AnomalyMonitor';
import MaintenanceRequests from './pages/admin/MaintenanceRequests';
import Analytics from './pages/admin/Analytics';
import UserManagement from './pages/admin/UserManagement';
import AddMachine from './pages/admin/AddMachine';
import MaintenanceDashboard from './pages/maintenance/MaintenanceDashboard';
import AssignedRequests from './pages/maintenance/AssignedRequests';
import UpdateStatus from './pages/maintenance/UpdateStatus';
import OperatorDashboard from './pages/operator/OperatorDashboard';
import ReportIssue from './pages/operator/ReportIssue';
import MyRequests from './pages/operator/MyRequests';

function App() {
  return (
    <AuthProvider>
      <MachineProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/machines" element={<MachineMonitor />} />
            <Route path="/admin/machines/add" element={<AddMachine />} />
            <Route path="/admin/machines/:id" element={<MachineDetails />} />
            <Route path="/admin/anomalies" element={<AnomalyMonitor />} />
            <Route path="/admin/requests" element={<MaintenanceRequests />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/users" element={<UserManagement />} />
            
            <Route path="/maintenance/dashboard" element={<MaintenanceDashboard />} />
            <Route path="/maintenance/requests" element={<AssignedRequests />} />
            <Route path="/maintenance/update/:id" element={<UpdateStatus />} />
            
            <Route path="/operator/dashboard" element={<OperatorDashboard />} />
            <Route path="/operator/report" element={<ReportIssue />} />
            <Route path="/operator/myrequests" element={<MyRequests />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </MachineProvider>
    </AuthProvider>
  );
}

export default App;
