import api from './axios';
import type { ApiResponse, User } from '../types';

export const usersService = {

  async getAll(): Promise<User[]> {
    const res = await api.get<ApiResponse<{ data: User[]; count: number }>>('/users');
    return res.data.data.data;
  },
};
