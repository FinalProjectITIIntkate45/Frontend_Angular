export interface UserRegisterViewModel {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: 'Client' | 'Provider';
}

export interface UserRegisterRequest {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'Client' | 'Provider';
}
