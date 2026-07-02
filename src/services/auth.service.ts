import { axiosInstance } from '@/lib/axios';
import type { LoginRequest, TokenResponse, Admin, SuccessResponse } from '@/types/auth.types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    // We use the JSON endpoint for easier integration
    const response = await axiosInstance.post<SuccessResponse<TokenResponse>>('/auth/login/json', credentials);
    return response.data.data;
  },

  getMe: async (): Promise<Admin> => {
    const response = await axiosInstance.get<SuccessResponse<Admin>>('/auth/me');
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  }
};
