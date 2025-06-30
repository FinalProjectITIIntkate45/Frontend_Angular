import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../../services/account.service';
import { APIResponse } from '../../../../core/models/APIResponse';
import { AuthService } from '../../../../core/services/Auth.service';

interface LoginModel {
  Method: string;
  Password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  model: LoginModel = {
    Method: '',
    Password: '',
  };
  errorMessage: string = '';
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService // Assuming ToastrService is imported and injected
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
    const PasswordInput = document.getElementById(
      'Password'
    ) as HTMLInputElement;
    const eyeIcon = document.getElementById('eye-icon');

    if (PasswordInput) {
      PasswordInput.type = this.showPassword ? 'text' : 'Password';
    }

    if (eyeIcon) {
      eyeIcon.className = this.showPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    }
  }

  login() {
    this.loading = true;
    this.errorMessage = '';

    this.accountService.login(this.model).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Response:', response);
        if (response.IsSuccess) {
          this.authService.setUserData(response.Data);

          const role = this.authService.getUserRole();
          if (role === 'Provider') {
            localStorage.setItem('token', response.Data.token);
            localStorage.setItem('role', response.Data.role);
            this.toastr.success("Logged in as provider successfully");
            this.router.navigate(['/provider']);
          } else if (role === 'Client') {
            this.router.navigate(['/client']);
          } else if (role === 'Recycler') {
            this.router.navigate(['/Recycler']);
          }
        } else {
          this.errorMessage = response.Message || 'Login failed';
          this.toastr.error(this.errorMessage);
          this.loading = false;
          console.error('Login failed:', this.errorMessage);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed';
        this.loading = false;
      },
    });
  }
}
