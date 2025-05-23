export interface LoginRequest {
  Method: string;
  Password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  username: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    userName: string;
    email: string;
    role: string;
  } | null;
}
