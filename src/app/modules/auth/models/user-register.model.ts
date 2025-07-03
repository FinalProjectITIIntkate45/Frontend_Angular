export interface UserRegisterViewModel {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  PasswordConfirmed: string;
  role: 'Client' | 'Provider' | 'Recycler';
}

export interface UserRegisterRequest {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  PasswordConfirmed: string;
  role: 'Client' | 'Provider' | 'Recycler';
}
