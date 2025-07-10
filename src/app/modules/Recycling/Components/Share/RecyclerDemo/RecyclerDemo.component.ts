import { Component } from '@angular/core';

@Component({
  selector: 'app-RecyclerDemo',
  templateUrl: './RecyclerDemo.component.html',
  styleUrls: ['./RecyclerDemo.component.css'],
  standalone: false
})
export class RecyclerDemoComponent {
  
  onSectionChange(section: string) {
    console.log('Section changed to:', section);
  }
} 