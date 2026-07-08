import api from './axios';
import type { ApiResponse } from '../types';

export interface DashboardStats {
  pendingTasks: number;
  activeProjects: number;
  completedToday: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data;
  },
};
