import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../Services/SubscrptionServece.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../auth/services/account.service'; // تأكد من المسار الصحيح
import { FormControl } from '@angular/forms';
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
  selectedPlan: string | null = null;
  paymentType: string = 'OnlineCard'; // القيمة الافتراضية
  userId: string | null = null;
  statusMessage: string | null = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    this.userId = this.cookieService.get('userId'); 
  }

  selectPlan(plan: string) {
    this.selectedPlan = plan;

    // اذا اخترت VIP نعرض خيارات الدفع، اما لو Free نخلي paymentType افتراضية
    if (plan === 'Free') {
      this.paymentType = '';
    } else if (plan === 'VIP' && !this.paymentType) {
      this.paymentType = 'OnlineCard';
    }
  }

  submitPlan() {
    if (!this.selectedPlan) {
      this.toastr.warning('Please make sure you select a plan');
      return;
    }

    if (!this.userId) {
      this.toastr.warning('Please make sure you are logged in');
      return;
    }

    if (this.selectedPlan === 'VIP') {
      if (!this.paymentType) {
        this.toastr.warning('Please select a payment method');
        return;
      }

      const req: SubscriptionChangeRequest = {
        type: 'VIP',
        PaymentType: this.paymentType as 'OnlineCard' | 'VodafoneCash' | 'MeezaQR',
        isPaid: false
      };

      this.subscriptionService.changeSubscription(req).subscribe({
        next: (res: any) => {
          if (res.data?.paymentUrl) {
            window.open(res.data.paymentUrl, '_blank');

            setTimeout(() => {
              const transactionId = prompt('بعد الدفع، أدخل Transaction ID:');

              if (transactionId) {
                const verifyReq: SubscriptionChangeRequest = {
                  type: 'VIP',
                  transactionId,
                  isPaid: true
                };

                this.subscriptionService.confirmSubscriptionChange(JSON.stringify(verifyReq)).subscribe({
                  next: () => {
                    this.toastr.success('تم الاشتراك في VIP بنجاح');
                    this.statusMessage = 'تم الاشتراك في VIP بنجاح';
                  },
                  error: () => {
                    this.toastr.error('لم يتم التحقق من الدفع، حاول مجددًا');
                    this.statusMessage = 'فشل التحقق من الدفع';
                  }
                });
              }
            }, 2000);              } else {
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
      // خطة مجانية
      const req: SubscriptionChangeRequest = {
        type: 'Free',
        isPaid: true
      };

      this.subscriptionService.changeSubscription(req).subscribe({
        next: () => {
          this.toastr.success('تم الاشتراك بالخطة المجانية');
          this.statusMessage = 'تم الاشتراك بالخطة المجانية';
        },
        error: () => {
          this.toastr.error('فشل الاشتراك بالخطة المجانية');
          this.statusMessage = 'فشل الاشتراك بالخطة المجانية';
        }
      });
    }
  }}

