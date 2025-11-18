import api from './api';
import { LoginRequest, LoginResponse, User } from '@/types';

export const authService = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/users/login', data),

  getUsers: () => api.get<User[]>('/users'),

  createUser: (data: any) => api.post('/users/create', data),
};
