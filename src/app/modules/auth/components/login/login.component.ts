import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/Auth.service';
import { AccountService } from '../../services/account.service';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  model: LoginModel = {
    email: '',
    password: '',
  };
  errorMessage: string = '';
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById(
      'password'
    ) as HTMLInputElement;
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordInput) {
      passwordInput.type = this.showPassword ? 'text' : 'password';
    }

    if (eyeIcon) {
      eyeIcon.className = this.showPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    }
  }

  login() {
    this.loading = true;
    this.errorMessage = '';

    this.accountService.login(this.model).subscribe({
      next: (response: any) => {
        this.authService.setUserData(response);
        const role = this.authService.getUserRole();
        if (role === 'Provider') {
          this.router.navigate(['/provider']);
        } else {
          this.router.navigate(['/client']);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed';
        this.loading = false;
      },
    });
  }
}
