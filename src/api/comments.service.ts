import api from './axios';
import type { ApiResponse, Comment } from '../types';

export const commentsService = {

  async getByTask(taskId: string): Promise<Comment[]> {
    const res = await api.get<ApiResponse<{ data: Comment[]; count: number }>>(`/comments/task/${taskId}`);
    return res.data.data.data;
  },

  async create(data: { content: string; taskId: string }): Promise<Comment> {
    const res = await api.post<ApiResponse<{ data: Comment }>>('/comments', data);
    return res.data.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/comments/${id}`);
  },
};
