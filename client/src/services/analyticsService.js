import api from './api';

const analyticsService = {
  // Get unified analytics data for the dashboard
  getDashboardStats: async () => {
<<<<<<< HEAD
    const response = await api.get('/analytics');
    return response.data;
  }
=======
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  // Get activity counts for the last 7 days
  getActivityChart: async () => {
    const response = await api.get('/analytics/activity');
    return response.data;
  },
>>>>>>> c76f504 (updating changes)
};

export default analyticsService;
