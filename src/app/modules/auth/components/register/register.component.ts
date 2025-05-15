import { Component } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { UserRegisterViewModel } from '../../models/user-register.model';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  model: UserRegisterViewModel = {
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '', // We'll set a default or fetch from API
  };

  roles: string[] = [];
  errorMessage: string = '';

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    this.accountService.getRoles().subscribe({
      next: (res) => {
        this.roles = res.data;
      },
      error: (err) => {
        console.error('Failed to load roles:', err);
      },
    });
  }

  register() {
    this.accountService.register(this.model).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Registration successful!');
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = res.message;
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Registration failed.';
      },
    });
  }
}
