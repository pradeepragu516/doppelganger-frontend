export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    'Normal': '#00ff88',
    'Warning': '#ffaa00',
    'Critical': '#ff3366',
    'Pending': '#ffaa00',
    'In Progress': '#00d4ff',
    'Resolved': '#00ff88'
  };
  return colors[status] || '#8b92a7';
};

export const calculateHealthScore = (temperature, pressure, vibration) => {
  const tempScore = Math.max(0, 100 - Math.abs(temperature - 65) * 2);
  const pressScore = Math.max(0, 100 - Math.abs(pressure - 90) * 1.5);
  const vibScore = Math.max(0, 100 - Math.abs(vibration - 3) * 10);
  return Math.round((tempScore + pressScore + vibScore) / 3);
};

export const generateMachineId = () => {
  return `CNC-${String(Date.now()).slice(-4)}`;
};

export const getAnomalyThresholds = () => {
  return {
    temperature: { warning: 75, critical: 80 },
    pressure: { warning: 95, critical: 100 },
    vibration: { warning: 4.5, critical: 5 }
  };
};
