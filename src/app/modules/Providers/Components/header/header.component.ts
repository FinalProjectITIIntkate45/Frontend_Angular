import { Component } from '@angular/core';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false,
})
export class HeaderComponent {
  isDropdownOpen = false;

  constructor(private router: Router) {}

  logout(): void {
  // مسح البيانات المحددة فقط من localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('providerId');
  localStorage.removeItem('userId');

  // لو فيه أي حاجة كنتي بتحطيها في sessionStorage
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('providerId');
  sessionStorage.removeItem('userId');

  this.router.navigate(['/']); 
}

}
