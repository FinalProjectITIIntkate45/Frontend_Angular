import { Component, OnInit } from '@angular/core';
import { SalesOverviewService } from '../../Services/sales-overview.service';
import { SalesOverviewViewModel } from '../../Models/sales-overview.model';

@Component({
  selector: 'app-sales-overview',
  templateUrl: './sales-overview.component.html',
  styleUrls: ['./sales-overview.component.css'],

  standalone: false,
})
export class SalesOverviewComponent implements OnInit {
  overviewData!: SalesOverviewViewModel;

  constructor(private salesOverviewService: SalesOverviewService) {}

  ngOnInit(): void {
    this.salesOverviewService.getOverviewData().subscribe({
      next: (data: SalesOverviewViewModel) => {
        this.overviewData = data;
        console.log('✅ Overview Data:', this.overviewData);
      },
      error: (err: any) => {
        console.error('❌ Error loading overview data', err);
      }
    });
  }
}
