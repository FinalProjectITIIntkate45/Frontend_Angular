import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false,
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private router: Router) {}

  register() {
    // Normally you'd call a registration API here
    alert('User registered (simulate)');
    this.router.navigate(['/login']);
  }
}
