import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  constructor(private router: Router) {}

  onSectionChange(section: string) {
    this.router.navigate([`/user-profile/${section}`]);
      console.log('Routing to:', `/user-profile/${section}`);
  }
}
