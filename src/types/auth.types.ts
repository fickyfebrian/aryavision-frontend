export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Admin {
  id: number;
  username: string;
}

export interface SuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
