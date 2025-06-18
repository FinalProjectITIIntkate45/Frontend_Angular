import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharityService } from '../../../Services/Charity.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css'],
  standalone:false
})
export class DonateComponent implements OnInit {
  donateForm!: FormGroup;
  charityId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private charityService: CharityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.charityId = Number(this.route.snapshot.paramMap.get('id'));
    this.donateForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }

  submitDonation(): void {
    if (this.donateForm.invalid) return;

    const donationData = {
      charityId: this.charityId,
      amount: this.donateForm.value.amount
    };

    this.charityService.donateToCharity(donationData).subscribe({
      next: (res) => {
        alert('Donation successful!');
        this.router.navigate(['/clients/charities']);
      },
      error: (err) => {
        console.error('Donation error:', err);
        alert('Donation failed. Try again.');
      }
    });
  }
}
