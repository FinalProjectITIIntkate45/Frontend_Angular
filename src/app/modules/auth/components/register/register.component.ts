import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  UserRegisterViewModel,
  UserRegisterRequest,
} from '../../models/user-register.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false,
})
export class RegisterComponent {
  model: UserRegisterViewModel = {
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    PasswordConfirmed: '',
    role: 'Client',
    // Default role can be set to 'Client', 'Provider', or 'Recycler'

    recyclingCenterName: ''

  };

  loading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private accountService: AccountService, private router: Router) {}

  setRole(role: 'Client' | 'Provider' | 'Recycler') {
    this.model.role = role;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validatePasswords(): boolean {
    return (
      this.model.password !== '' &&
      this.model.PasswordConfirmed !== '' &&
      this.model.password === this.model.PasswordConfirmed &&
      this.model.password.length >= 6
    );
  }

  validateForm(): boolean {
    if (!this.model.userName || !this.model.email || !this.model.phoneNumber) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    if (!this.validatePasswords()) {
      this.errorMessage =
        'Password and Confirm Password must match and be at least 6 characters';
      return false;
    }

    return true;
  }

  register() {
    this.errorMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    // Map view model to API request model
    const registerRequest: UserRegisterRequest = {
      userName: this.model.userName.trim(),
      email: this.model.email.trim().toLowerCase(),
      phoneNumber: this.model.phoneNumber.trim(),
      password: this.model.password,
      PasswordConfirmed: this.model.PasswordConfirmed,
      role: this.model.role,
      recyclingCenterName: this.model.recyclingCenterName?.trim() || '', // Optional for Client and Provider roles  
    };

    console.log('Sending registration request:', {
      ...registerRequest,
      password: '[HIDDEN]',
    });

    this.accountService.register(registerRequest).subscribe({
      next: () => {
        console.log('Registration successful');
        this.router.navigate(['/account/login'], {
          queryParams: { registered: 'true' },
        });
      },
     error: (error) => {
            console.error('Registration error:', error);
            if (error.status === 400) {
              if (error.error?.errors) {
                const errorsObject = error.error.errors;
                const messages = Object.values(errorsObject).flat().join('\n');
                this.errorMessage = messages;
              } else {
                this.errorMessage =
                  error.error?.message || 'Invalid registration data';
              }
            } else if (error.status === 0) {
              this.errorMessage =
                'Unable to connect to the server. Please try again later.';
            } else {
              this.errorMessage = 'Registration failed. Please try again.';
            }
            this.loading = false;
          },

      complete: () => {
        this.loading = false;
      },
    });
  }
}
