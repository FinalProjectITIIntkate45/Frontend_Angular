import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../Services/SubscrptionServece.service'; // تأكد إن المسار صحيح
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-SubScrption',
  templateUrl: './SubScrption.component.html',
  styleUrls: ['./SubScrption.component.css']
})
export class SubScrptionComponent implements OnInit {

  selectedPlan: string | null = null;
  userId: string = '123'; // مؤقتًا، بعدين تجيبه من الـ Login أو AuthService

  constructor(
    private router: Router,
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService
  ) {}

  selectPlan(plan: string) {
    this.selectedPlan = plan;
  }

  submitPlan() {
    if (!this.selectedPlan) return;

    if (this.selectedPlan === 'VIP') {

      this.router.navigate(['/payment'], { queryParams: { plan: this.selectedPlan } });
    } else {

      this.subscriptionService.updateSubscription(this.userId, this.selectedPlan).subscribe({
        next: () => {
          this.toastr.success('Successfully subscribed to Free plan');

        },
        error: () => {
          this.toastr.error('Subscription failed, please try again');
        }
      });
    }
  }

  ngOnInit(): void {}
}
