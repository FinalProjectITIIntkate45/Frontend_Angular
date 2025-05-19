import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { UserRegisterViewModel } from '../../models/user-register.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false,
})
export class RegisterComponent implements OnInit {
  model: UserRegisterViewModel = {
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
  };

  roles: string[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    this.loadRoles();
  }

  private loadRoles() {
    this.accountService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles.filter((role) => role !== 'Admin'); // Exclude Admin role from registration
      },
      error: (error) => {
        console.error('Failed to load roles:', error);
        this.errorMessage = 'Failed to load available roles';
      },
    });
  }

  register() {
    if (this.model.password !== this.model.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.accountService.register(this.model).subscribe({
      next: (response) => {
        this.router.navigate(['/account/login'], {
          queryParams: { registered: 'true' },
        });
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Registration failed';
        this.loading = false;
      },
    });
  }
}
