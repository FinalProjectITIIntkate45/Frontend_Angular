import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CharityService } from '../../../Services/Charity.service';
import { Charity } from '../../../Models/Charity.model';

@Component({
  selector: 'app-charity-list',
  templateUrl: './charity-list.component.html',
  styleUrls: ['./charity-list.component.css'],
  standalone:false,
})
export class CharityListComponent implements OnInit {

  charities: Charity[] = [];

  constructor(
    private charityService: CharityService,
    private router: Router // ← مهم علشان نستخدمه في التنقل بين الصفحات
  ) {}

  ngOnInit(): void {
    this.charityService.getAllCharities().subscribe({
      next: (responce) => {
        console.log(responce)
        this.charities = responce.Data.map((charity: Charity) => ({
          ...charity,
          images: charity.CharityImages?.map(img => ({ url: img.ImageUrl })) || []
        }));
      },
      error: (err) => {
        console.error('Error fetching charities:', err);
      }
    });
  }

  viewDetails(charityId: number): void {
    this.router.navigate(['/client/charity-details', charityId]);
  }

  donate(charityId: number): void {
    this.router.navigate(['/client/donate', charityId]);
  }

}
