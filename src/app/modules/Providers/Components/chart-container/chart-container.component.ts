import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css'],
  standalone: false,
})
export class ChartContainerComponent {
  @Input() type: string = 'revenue';
  constructor() { }
}