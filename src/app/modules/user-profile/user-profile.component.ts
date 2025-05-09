import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone:false,
  templateUrl: './user-profile.component.html',
  styleUrls: []
})
export class UserProfileComponent {
  constructor(private router: Router) {}

  onSectionChange(section: string) {
    this.router.navigate([`/user-profile/${section}`]);
  }
}
