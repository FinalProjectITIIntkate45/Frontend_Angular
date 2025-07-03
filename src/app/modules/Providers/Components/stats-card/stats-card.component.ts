import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css'],  
  standalone: false,
})
export class StatsCardComponent {
  @Input() title: string = '';
  constructor() { }
}