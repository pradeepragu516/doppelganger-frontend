export const anomalyService = {
  createAnomaly: (machineId, score, severity, issues) => {
    return {
      id: `ANO-${Date.now()}`,
      machine: machineId,
      timestamp: new Date().toLocaleTimeString(),
      score: score.toFixed(2),
      severity,
      issues: issues.join(', ')
    };
  },

  filterBySeverity: (anomalies, severity) => {
    return anomalies.filter(a => a.severity === severity);
  },

  getAnomalyCount: (anomalies, machineId) => {
    return anomalies.filter(a => a.machine === machineId).length;
  }
};
