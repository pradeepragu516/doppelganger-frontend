import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const MachineContext = createContext();

export const useMachines = () => useContext(MachineContext);

const generateRandomMachine = (index) => {
  const types = ['CNC', 'PRESS', 'LATHE', 'MILL', 'DRILL'];
  const locations = ['Floor A-1', 'Floor A-2', 'Floor B-1', 'Floor B-2', 'Floor C-1', 'Floor C-2'];
  const type = types[Math.floor(Math.random() * types.length)];
  const temp = 60 + Math.random() * 30;
  const pressure = 80 + Math.random() * 30;
  const vibration = 2 + Math.random() * 4;
  
  return {
    id: `${type}-${String(index).padStart(2, '0')}`,
    location: locations[Math.floor(Math.random() * locations.length)],
    temperature: temp,
    pressure: pressure,
    vibration: vibration,
    status: 'Normal',
    healthScore: 85,
    history: {
      temperature: [temp],
      pressure: [pressure],
      vibration: [vibration],
      timestamps: [new Date().toLocaleTimeString()]
    },
    logs: [{
      timestamp: new Date().toLocaleTimeString(),
      message: 'Machine initialized and operational'
    }],
    addedAt: new Date().toISOString()
  };
};

const calculateAnomalyScore = (temp, pressure, vibration) => {
  let score = 0;
  if (temp > 80) score += (temp - 80) / 20;
  if (pressure > 100) score += (pressure - 100) / 20;
  if (vibration > 5) score += (vibration - 5) / 5;
  return Math.min(score, 1);
};

const getSeverity = (score) => {
  if (score >= 0.8) return 'Critical';
  if (score >= 0.6) return 'Warning';
  return 'Normal';
};

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [requests, setRequests] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [systemEvents, setSystemEvents] = useState([]);
  const [users, setUsers] = useState([]);

  const addSystemEvent = (type, message, severity = 'info') => {
    const event = {
      id: `EVT-${Date.now()}`,
      type,
      message,
      severity,
      timestamp: new Date().toISOString()
    };
    setSystemEvents(prev => [event, ...prev].slice(0, 100));
  };

  const addMachineLog = (machineId, message) => {
    setMachines(prev => prev.map(m => {
      if (m.id === machineId) {
        const log = { timestamp: new Date().toLocaleTimeString(), message };
        return { ...m, logs: [log, ...(m.logs || [])].slice(0, 50) };
      }
      return m;
    }));
  };

  const detectAnomaly = (machine) => {
    const temp = parseFloat(machine.temperature);
    const pressure = parseFloat(machine.pressure);
    const vibration = parseFloat(machine.vibration);
    const score = calculateAnomalyScore(temp, pressure, vibration);
    const severity = getSeverity(score);

    if (score > 0.6) {
      const issues = [];
      if (temp > 80) issues.push('High temperature');
      if (pressure > 100) issues.push('High pressure');
      if (vibration > 5) issues.push('High vibration');

      const anomaly = {
        id: `ANO-${Date.now()}`,
        machine: machine.id,
        timestamp: new Date().toLocaleTimeString(),
        score: score.toFixed(2),
        severity,
        issues: issues.join(', '),
        action: severity === 'Critical' ? 'Maintenance Request Generated' : 'Alert Sent'
      };
      
      setAnomalies(prev => [anomaly, ...prev].slice(0, 100));
      addMachineLog(machine.id, `Anomaly detected: ${severity} (Score: ${score.toFixed(2)})`);
      addSystemEvent('anomaly', `${machine.id}: ${issues.join(', ')} - ${severity}`, severity.toLowerCase());

      if (severity === 'Critical') {
        createMaintenanceRequest(machine, issues.join(', '), { temp, pressure, vibration });
      }
    }

    return { score, severity };
  };

  const createMaintenanceRequest = (machine, issue, sensorValues) => {
    // Atomically check and add request to avoid race conditions/stale closures
    setRequests(prev => {
      const alreadyOpen = prev.some(r => r.machine === machine.id && r.status && !['Closed', 'Resolved', 'Completed'].includes(r.status));
      if (alreadyOpen) return prev;

      const technicians = users.filter(u => (u.role || '').toLowerCase() === 'maintenance');
      const tech = technicians.length ? technicians[Math.floor(Math.random() * technicians.length)] : null;
      const assignedTo = tech ? tech.name : 'Unassigned';
      const assignedToId = tech ? tech.id : null;
      const assignedToEmail = tech ? tech.email : null;

      const request = {
        id: `REQ-${Date.now()}`,
        machine: machine.id,
        issue,
        priority: 'High',
        status: 'Pending',
        assignedTo,
        assignedToId,
        assignedToEmail,
        createdAt: new Date().toISOString(),
        sensorValues
      };

      // side-effects here are safe and only executed when a new request is actually created
      addMachineLog(machine.id, `Maintenance request ${request.id} created`);
      addSystemEvent('maintenance', `Request ${request.id} created for ${machine.id} - ${issue}`, 'warning');

      return [request, ...prev];
    });
  };

  const simulateSensorUpdate = () => {
    setMachines(prev => prev.map(m => {
      const tempChange = (Math.random() - 0.5) * 3;
      const pressureChange = (Math.random() - 0.5) * 2;
      const vibrationChange = (Math.random() - 0.5) * 0.5;

      const newTemp = Math.max(55, Math.min(95, m.temperature + tempChange));
      const newPressure = Math.max(75, Math.min(110, m.pressure + pressureChange));
      const newVibration = Math.max(1.5, Math.min(7, m.vibration + vibrationChange));

      const updated = {
        ...m,
        temperature: newTemp,
        pressure: newPressure,
        vibration: newVibration,
        history: {
          temperature: [...m.history.temperature, newTemp].slice(-20),
          pressure: [...m.history.pressure, newPressure].slice(-20),
          vibration: [...m.history.vibration, newVibration].slice(-20),
          timestamps: [...m.history.timestamps, new Date().toLocaleTimeString()].slice(-20)
        }
      };

      const anomalyResult = detectAnomaly(updated);
      updated.status = anomalyResult.severity;
      updated.healthScore = Math.round((1 - anomalyResult.score) * 100);

      return updated;
    }));
  };

  useEffect(() => {
    // load machines from backend if available
    let mounted = true;
    (async () => {
      try {
        const remote = await apiClient.get('/machines');
        const normalizeMachine = (m, idx) => {
          const temp = parseFloat(m.temperature) || (m.history?.temperature?.[0]) || 65;
          const press = parseFloat(m.pressure) || (m.history?.pressure?.[0]) || 90;
          const vib = parseFloat(m.vibration) || (m.history?.vibration?.[0]) || 3;
          return {
            id: m.id || m._id || `M-${idx}`,
            name: m.name || m.id || `Machine ${idx}`,
            location: m.location || 'Unknown',
            temperature: temp,
            pressure: press,
            vibration: vib,
            status: m.status || 'Normal',
            healthScore: typeof m.healthScore === 'number' ? m.healthScore : Math.round((1 - calculateAnomalyScore(temp, press, vib)) * 100),
            history: m.history || { temperature: [temp], pressure: [press], vibration: [vib], timestamps: [new Date().toLocaleTimeString()] },
            logs: m.logs || [],
            addedAt: m.addedAt || new Date().toISOString()
          };
        };

        if (mounted && Array.isArray(remote) && remote.length) {
          setMachines(remote.map((m, i) => normalizeMachine(m, i + 1)));
        } else {
          // fallback to generated machines
          const initial = [];
          for (let i = 1; i <= 12; i++) initial.push(generateRandomMachine(i));
          if (mounted) setMachines(initial);
        }
      } catch (err) {
        const initial = [];
        for (let i = 1; i <= 12; i++) initial.push(generateRandomMachine(i));
        if (mounted) setMachines(initial);
      }
    })();

    // load users from backend if available
    (async () => {
      try {
        const remoteUsers = await apiClient.get('/users');
        if (Array.isArray(remoteUsers)) {
          // normalize to expected shape without passwords
          const normalized = remoteUsers.map((u) => ({
            id: u._id || u.id || Date.now(),
            name: u.name || u.email,
            email: u.email,
            role: (u.role || 'maintenance').charAt(0).toUpperCase() + (u.role || 'maintenance').slice(1),
            status: 'Active'
          }));
          setUsers(normalized);
        }
      } catch (e) {
        // keep empty or fallback if desired
      }
    })();

    // load requests, anomalies, support from backend
    (async () => {
      try {
        const [remoteRequests, remoteAnomalies, remoteSupport] = await Promise.all([
          apiClient.get('/requests'),
          apiClient.get('/anomalies'),
          apiClient.get('/support')
        ]);

        if (Array.isArray(remoteRequests)) {
          const mapped = remoteRequests.map(r => ({
            id: r.id || r._id,
            machine: r.machine || r.machineId,
            issue: r.issue,
            priority: r.priority || (r.severity === 'High' ? 'High' : (r.severity === 'Medium' ? 'Medium' : 'Low')),
            status: r.status || 'Pending',
            assignedTo: r.assignedTo ? r.assignedTo.name : (r.assignedToName || 'Unassigned'),
            assignedToId: r.assignedTo ? r.assignedTo.id || r.assignedTo._id : null,
            assignedToEmail: r.assignedTo ? r.assignedTo.email : null,
            createdAt: r.createdAt
          }));
          setRequests(mapped);
        }

        if (Array.isArray(remoteAnomalies)) {
          const mappedA = remoteAnomalies.map(a => ({
            id: a._id || a.id,
            machine: a.machineId || a.machine,
            timestamp: a.detectedAt || a.timestamp || new Date().toLocaleTimeString(),
            score: a.score || null,
            severity: a.severity,
            issues: a.issues || '',
            action: a.action || ''
          }));
          setAnomalies(mappedA);
        }

        if (Array.isArray(remoteSupport)) {
          const mappedS = remoteSupport.map(s => ({
            id: s._id || s.id,
            userId: s.userId?._id || s.userId || null,
            userName: s.userId?.name || (s.userName || ''),
            subject: s.subject,
            message: s.message,
            status: s.status,
            createdAt: s.createdAt
          }));
          setSupportTickets(mappedS);
        }
      } catch (err) {
        // ignore fetch errors; keep local state
      }
    })();

    const interval = setInterval(simulateSensorUpdate, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const addMachine = (machineData) => {
    (async () => {
      try {
        const payload = { ...machineData };
        const created = await apiClient.post('/machines', payload);
        const machineObj = {
          ...created,
          logs: created.logs || [{ timestamp: new Date().toLocaleTimeString(), message: 'Machine registered in system' }],
          history: created.history || {
            temperature: [parseFloat(created.temperature || machineData.temperature)],
            pressure: [parseFloat(created.pressure || machineData.pressure)],
            vibration: [parseFloat(created.vibration || machineData.vibration)],
            timestamps: [new Date().toLocaleTimeString()]
          },
          addedAt: created.addedAt || new Date().toISOString()
        };
        const anomalyResult = detectAnomaly(machineObj);
        machineObj.status = anomalyResult.severity;
        machineObj.healthScore = Math.round((1 - anomalyResult.score) * 100);

        setMachines(prev => [...prev, machineObj]);
        addSystemEvent('machine', `New machine ${machineObj.id} added to system`, 'info');
        // call AI service to get more accurate anomaly detection
        (async () => {
          try {
            const res = await apiClient.post('/ai/predict', {
              machineId: machineObj.id,
              location: machineObj.location,
              temperature: machineObj.temperature,
              pressure: machineObj.pressure,
              vibration: machineObj.vibration
            });
            if (res) {
              // store ML response on the machine object if returned
              setMachines(prev => prev.map(m => m.id === machineObj.id ? { ...m, lastPrediction: res } : m));
            }
          } catch (e) {
            // ignore ai errors; local detection already applied
          }
        })();
      } catch (err) {
        // fallback to local add
        const newMachine = {
          ...machineData,
          logs: [{ timestamp: new Date().toLocaleTimeString(), message: 'Machine registered in system' }],
          history: {
            temperature: [parseFloat(machineData.temperature)],
            pressure: [parseFloat(machineData.pressure)],
            vibration: [parseFloat(machineData.vibration)],
            timestamps: [new Date().toLocaleTimeString()]
          },
          addedAt: new Date().toISOString()
        };
        const anomalyResult = detectAnomaly(newMachine);
        newMachine.status = anomalyResult.severity;
        newMachine.healthScore = Math.round((1 - anomalyResult.score) * 100);
        setMachines(prev => [...prev, newMachine]);
        addSystemEvent('machine', `New machine ${newMachine.id} added to system (local)`, 'info');
      }
    })();
  };

  const updateMachineSensors = (machineId, sensorData) => {
    setMachines(prev => prev.map(m => {
      if (m.id === machineId) {
        const updated = {
          ...m,
          temperature: sensorData.temperature,
          pressure: sensorData.pressure,
          vibration: sensorData.vibration,
          history: {
            temperature: [...m.history.temperature, parseFloat(sensorData.temperature)].slice(-20),
            pressure: [...m.history.pressure, parseFloat(sensorData.pressure)].slice(-20),
            vibration: [...m.history.vibration, parseFloat(sensorData.vibration)].slice(-20),
            timestamps: [...m.history.timestamps, new Date().toLocaleTimeString()].slice(-20)
          }
        };
        
        const anomalyResult = detectAnomaly(updated);
        updated.status = anomalyResult.severity;
        updated.healthScore = Math.round((1 - anomalyResult.score) * 100);
        addMachineLog(machineId, 'Sensor data manually updated');
        
        return updated;
      }
      return m;
    }));

    // call AI service asynchronously to refine detection
    (async () => {
      try {
        const machine = machines.find(x => x.id === machineId) || {};
        const res = await apiClient.post('/ai/predict', {
          machineId,
          location: machine.location,
          temperature: sensorData.temperature,
          pressure: sensorData.pressure,
          vibration: sensorData.vibration
        });
        if (res) {
          setMachines(prev => prev.map(m => {
            if (m.id === machineId) {
              // store prediction and update status/health if available
              const newStatus = res.status === 'Anomaly' ? 'Critical' : 'Normal';
              const score = typeof res.score === 'number' ? res.score : null;
              const newHealth = score !== null ? Math.max(0, Math.min(100, Math.round(50 + score * 10))) : (res.status === 'Anomaly' ? Math.max((m.healthScore || 100) - 50, 10) : Math.min((m.healthScore || 50) + 40, 100));
              return { ...m, status: newStatus, healthScore: newHealth, lastPrediction: res };
            }
            return m;
          }));
        }
      } catch (e) {
        // ignore ai errors
      }
    })();

    // persist sensor reading to backend
    (async () => {
      try {
        await apiClient.post('/sensor/add', {
          machineId,
          temperature: parseFloat(sensorData.temperature),
          pressure: parseFloat(sensorData.pressure),
          vibration: parseFloat(sensorData.vibration)
        });
      } catch (e) {
        // ignore network error; local update already applied
      }
    })();
  };

  const updateRequestStatus = (requestId, status, notes, partsReplaced) => {
    // persist status change to backend then update local state
    (async () => {
      try {
        const res = await apiClient.put(`/requests/${requestId}`, { status });
        // if successful, update local
        setRequests(prev => prev.map(r => {
          if (r.id === requestId) {
            const updated = { ...r, status: res.status || status, notes, partsReplaced, updatedAt: new Date().toISOString() };
            addMachineLog(r.machine, `Maintenance ${requestId}: ${updated.status}`);
            addSystemEvent('maintenance', `Request ${requestId} updated: ${updated.status}`, 'info');
            return updated;
          }
          return r;
        }));
      } catch (e) {
        // fallback to local update
        setRequests(prev => prev.map(r => {
          if (r.id === requestId) {
            const updated = { ...r, status, notes, partsReplaced, updatedAt: new Date().toISOString() };
            addMachineLog(r.machine, `Maintenance ${requestId}: ${status}`);
            addSystemEvent('maintenance', `Request ${requestId} updated: ${status}`, 'info');
            return updated;
          }
          return r;
        }));
      }
    })();
  };

  const assignRequestToUser = (requestId, user) => {
    (async () => {
      try {
        await apiClient.put(`/requests/${requestId}`, { assignedToId: user?.id || user?._id });
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, assignedTo: user?.name || user?.username || 'You', assignedToId: user?.id || user?._id, assignedToEmail: user?.email || null } : r));
        addSystemEvent('maintenance', `Request ${requestId} claimed by ${user?.name}`, 'info');
      } catch (e) {
        // fallback local assign
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, assignedTo: user?.name || 'You', assignedToId: user?.id || null, assignedToEmail: user?.email || null } : r));
      }
    })();
  };

  const addSupportTicket = (ticketData) => {
    const technicians = users.filter(u => (u.role || '').toLowerCase() === 'maintenance');
    const tech = technicians[Math.floor(Math.random() * technicians.length)];
    const assignedTo = tech ? tech.name : 'Unassigned';
    const assignedToId = tech ? tech.id : null;
    const assignedToEmail = tech ? tech.email : null;
    
    const ticket = {
      ...ticketData,
      id: `TKT-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Open'
    };
    setSupportTickets(prev => [ticket, ...prev]);
    addSystemEvent('support', `Support ticket ${ticket.id} created for ${ticket.machine}`, 'info');

    // persist support ticket to backend (include machine and reporter info)
    const persistPromise = (async () => {
      try {
        return await apiClient.post('/support/create', {
          userId: ticket.reportedById || ticket.userId || null,
          subject: ticket.issue || ticket.subject || 'Support Request',
          message: ticket.description || ticket.message || ticket.issue || '',
          machineId: ticket.machine || null,
          priority: ticket.priority || 'Medium',
          reportedById: ticket.reportedById || ticket.userId || null,
          reportedByEmail: ticket.reportedByEmail || ticket.userEmail || null,
          reportedByName: ticket.reportedBy || ticket.user || null
        });
      } catch (e) {
        // ignore network error but return rejected promise to allow caller to handle
        throw e;
      }
    })();

    const request = {
      id: `REQ-${Date.now()}`,
      machine: ticket.machine,
      issue: ticket.issue,
      priority: ticket.priority,
      status: 'Pending',
      assignedTo,
      assignedToId,
      assignedToEmail,
      createdAt: new Date().toISOString(),
      reportedBy: ticket.reportedBy || ticket.user,
      reportedById: ticket.reportedById || ticket.userId || null,
      reportedByEmail: ticket.reportedByEmail || ticket.userEmail || null,
      sensorValues: {}
    };
    setRequests(prev => [request, ...prev]);
    addSystemEvent('maintenance', `Request ${request.id} created from user report`, 'warning');

    return persistPromise;
  };

  const addUser = (userData) => {
    const newUser = { ...userData, id: Date.now(), status: 'Active' };
    setUsers(prev => [...prev, newUser]);
  };

  const removeMachine = (machineId) => {
    setMachines(prev => prev.filter(m => m.id !== machineId));
    addSystemEvent('machine', `Machine ${machineId} removed from system`, 'info');
  };

  return (
    <MachineContext.Provider value={{
      machines,
      anomalies,
      requests,
      supportTickets,
      systemEvents,
      users,
      addMachine,
      removeMachine,
      updateMachineSensors,
      updateRequestStatus,
      addSupportTicket,
      addUser,
      assignRequestToUser
    }}>
      {children}
    </MachineContext.Provider>
  );
};
