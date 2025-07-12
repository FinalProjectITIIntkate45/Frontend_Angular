import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-RecyclerLayout',
  templateUrl: './RecyclerLayout.component.html',
  styleUrls: ['./RecyclerLayout.component.css'],
  standalone: false
})
export class RecyclerLayoutComponent {
  @Output() sectionChange = new EventEmitter<string>();
  
  onSectionChange(section: string) {
    this.sectionChange.emit(section);
    console.log('Section changed to:', section);
  }
} 