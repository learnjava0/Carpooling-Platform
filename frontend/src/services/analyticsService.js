import api from './api';

export const analyticsService = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },
  downloadDashboardPdf: async () => {
    const response = await api.get('/analytics/dashboard/pdf', { responseType: 'blob' });
    return response.data;
  },
  downloadAuditPdf: async () => {
    const response = await api.get('/admin/audit/logs/pdf', { responseType: 'blob' });
    return response.data;
  }
};
