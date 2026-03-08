export const requestService = {
  createRequest: (machineId, issue, assignedTo) => {
    return {
      id: `REQ-${Date.now()}`,
      machine: machineId,
      issue,
      priority: 'High',
      status: 'Pending',
      assignedTo,
      createdAt: new Date().toISOString()
    };
  },

  filterByStatus: (requests, status) => {
    return requests.filter(r => r.status === status);
  },

  filterByAssignee: (requests, assignee) => {
    return requests.filter(r => r.assignedTo === assignee);
  }
};
