export interface UserRegisterViewModel {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  PasswordConfirmed: string;
  role: 'Client' | 'Provider' | 'Recycler';
  recyclingCenterName: string;
}

export interface UserRegisterRequest {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  PasswordConfirmed: string;
  role: 'Client' | 'Provider' | 'Recycler';
  recyclingCenterName?: string; // Optional for Client and Provider roles
}
