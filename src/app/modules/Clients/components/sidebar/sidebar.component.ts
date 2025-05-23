import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../../core/services/Auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: [],
})
export class SidebarComponent {
  @Output() sectionChange = new EventEmitter<string>();
  selectedSection: string = 'profile';

  constructor(private authService: AuthService) {}

  selectSection(section: string) {
    this.selectedSection = section;
    this.sectionChange.emit(section);
  }

  logout() {
    this.authService.logout();
  }
}
