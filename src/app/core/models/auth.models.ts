export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  userName: string;
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
