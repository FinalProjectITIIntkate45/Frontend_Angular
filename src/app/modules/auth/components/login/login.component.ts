import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/Auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    // Simulated successful login
    const fakeToken = 'fake-jwt-token';
    this.authService.userLogin(fakeToken);
    this.router.navigate(['/']); // Or navigate to returnUrl if you want
  }
  togglePassword() {
    const passwordField = document.getElementById(
      'password'
    ) as HTMLInputElement;
    const eyeIcon = document.getElementById('eye-icon') as HTMLElement;

    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      passwordField.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
    }
  }
}
