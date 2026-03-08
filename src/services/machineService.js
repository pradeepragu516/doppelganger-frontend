export const machineService = {
  calculateHealth: (temperature, pressure, vibration) => {
    const tempScore = Math.max(0, 100 - Math.abs(temperature - 65) * 2);
    const pressScore = Math.max(0, 100 - Math.abs(pressure - 90) * 1.5);
    const vibScore = Math.max(0, 100 - Math.abs(vibration - 3) * 10);
    return Math.round((tempScore + pressScore + vibScore) / 3);
  },

  detectAnomaly: (temperature, pressure, vibration) => {
    let score = 0;
    let issues = [];

    if (temperature > 80) {
      score += (temperature - 80) / 20;
      issues.push('High temperature');
    }
    if (pressure > 100) {
      score += (pressure - 100) / 20;
      issues.push('High pressure');
    }
    if (vibration > 5) {
      score += (vibration - 5) / 5;
      issues.push('High vibration');
    }

    score = Math.min(score, 1);

    let severity = 'Normal';
    if (score >= 0.8) severity = 'Critical';
    else if (score >= 0.6) severity = 'Warning';

    return { score, severity, issues };
  }
};
