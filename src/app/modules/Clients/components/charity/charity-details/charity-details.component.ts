import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharityService } from '../../../Services/Charity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-charity-details',
  templateUrl: './charity-details.component.html',
  styleUrls: ['./charity-details.component.css'],
  standalone:false
})
export class CharityDetailsComponent implements OnInit {
  charity: any;
  charityId!: number;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private charityService: CharityService,
    private router: Router
  ) {}

backToCharity(){
  this.router.navigate(['charities']);
}


  ngOnInit(): void {
    this.charityId = Number(this.route.snapshot.paramMap.get('id'));

    this.charityService.getCharityDetails(this.charityId).subscribe({
      next: (res) => {
        console.log(res);
        this.charity = res.data || res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching details:', err);
        this.loading = false;
      }
    });
  }
}
