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

  constructor(
    private route: ActivatedRoute,
    private charityService: CharityService,
    private router: Router
  ) {}

backtocharty(){
  this.router.navigate(['/clients/charities']);
  
}


  ngOnInit(): void {
    this.charityId = Number(this.route.snapshot.paramMap.get('id'));

    this.charityService.getCharityDetails(this.charityId).subscribe({
      next: (res) => {
        this.charity = res.data;
      },
      error: (err) => {
        console.error('Error fetching details:', err);
      }
    });
  }
}
