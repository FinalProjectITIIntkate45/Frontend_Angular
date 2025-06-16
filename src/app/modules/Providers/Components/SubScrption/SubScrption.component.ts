import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../Services/SubscrptionServece.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SubscriptionChangeRequest } from '../../Models/SubscriptionChangeRequest';

@Component({
  selector: 'app-SubScrption',
  templateUrl: './SubScrption.component.html',
  styleUrls: ['./SubScrption.component.css'],
  standalone: false,
})
export class SubScrptionComponent implements OnInit {
  showPaymentOptions: boolean = false;
  selectedPlan: number | null = null;
  paymentType: number = 5044395; // القيمة الافتراضية
  statusMessage: string | null = null;
  paymentUrl: string | null = null;


  constructor(
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {}

  selectPlan(plan: 'VIP' | 'Free') {
    if (plan === 'VIP') {
      this.selectedPlan = 1;
      this.showPaymentOptions = true;
      this.paymentType = this.paymentType || 5044395;
    } else {
      this.selectedPlan = 0;
      this.showPaymentOptions = false;
      this.paymentType = 0;
    }
  }

  submitPlan() {
    if (this.selectedPlan === null) {
      this.toastr.warning('Please make sure you select a plan');
      return;
    }

    if (this.selectedPlan === 1) {
      if (!this.paymentType) {
        this.toastr.warning('Please select a payment method');
        return;
      }

      const req: SubscriptionChangeRequest = {
        Type: this.selectedPlan,
        IsPaid: false,
        PaymentType: this.paymentType,
      };

      this.subscriptionService.changeSubscription(req).subscribe({
        next: (res: any) => {
          if (res.data?.PaymentUrl) {
          this.paymentUrl = res.data.PaymentUrl;
          console.log(this.paymentUrl);
          

  setTimeout(() => {
    const transactionId = prompt('بعد الدفع، أدخل Transaction ID:');

    if (transactionId) {
      const verifyReq: SubscriptionChangeRequest = {
        Type: this.selectedPlan!,
        PaymentType: this.paymentType,
        IsPaid: true,
        transactionId: transactionId,
      };

      this.subscriptionService.confirmSubscriptionChange(verifyReq).subscribe({
        next: () => {
          this.toastr.success('تم الاشتراك في VIP بنجاح');
          this.statusMessage = 'تم الاشتراك في VIP بنجاح';
          this.paymentUrl = null; // إخفاء iframe بعد الدفع
        },
        error: () => {
          this.toastr.error('لم يتم التحقق من الدفع، حاول مجددًا');
          this.statusMessage = 'فشل التحقق من الدفع';
        }
      });
    }
  }, 2000);

          } else {
            this.toastr.error('فشل في إنشاء رابط الدفع');
            this.statusMessage = 'فشل في إنشاء رابط الدفع';
          }
        },
        error: () => {
          this.toastr.error('حدث خطأ أثناء تنفيذ الاشتراك');
          this.statusMessage = 'حدث خطأ أثناء تنفيذ الاشتراك';
        }
      });
    } else {
      // Free plan
      const req: SubscriptionChangeRequest = {
        Type: this.selectedPlan,
        IsPaid: true,
      };
    }
  }
}
