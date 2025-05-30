import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../Services/SubscrptionServece.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../auth/services/account.service'; // تأكد من المسار الصحيح
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SubscriptionChangeRequest } from '../../Models/SubscriptionChangeRequest';
@Component({
  selector: 'app-SubScrption',
  templateUrl: './SubScrption.component.html',
  styleUrls: ['./SubScrption.component.css']
})
export class SubScrptionComponent implements OnInit {

  selectedPlan: string | null = null;
  userId: string | null = null;

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
  }

  submitPlan() {
  if (!this.selectedPlan ) {
    this.toastr.warning('Please make sure you Select a plan');
    return;
  }

   if ( !this.userId) {
    this.toastr.warning('Please make sure you are logged in');
    return;
  }

  if (this.selectedPlan === 'VIP') {
    // أول مرة → يبدأ الدفع
    const req : SubscriptionChangeRequest  = {
      type: 'VIP',
      paymentMethod: 'OnlineCard', // تقدر تخليها متغيرة لو عندك اختيارات أكتر
      isPaid: false
    };

    this.subscriptionService.changeSubscription(req).subscribe({
      next: (res: any) => {
        if (res.data?.paymentUrl) {
          // افتح صفحة الدفع
          window.open(res.data.paymentUrl, '_blank');

          // بعد الدفع، اطلب من المستخدم يدخل Transaction ID
          setTimeout(() => {
            const transactionId = prompt('بعد الدفع، أدخل Transaction ID:');

            if (transactionId) {
              const verifyReq : SubscriptionChangeRequest = {
                type: 'VIP',
                transactionId,
                isPaid: true
              };

              this.subscriptionService.changeSubscription(verifyReq).subscribe({
                next: () => {
                  this.toastr.success('تم الاشتراك في VIP بنجاح');
                },
                error: () => {
                  this.toastr.error('لم يتم التحقق من الدفع، حاول مجددًا');
                }
              });
            }
          }, 2000);
        } else {
          this.toastr.error('فشل في إنشاء رابط الدفع');
        }
      },
      error: () => {
        this.toastr.error('حدث خطأ أثناء تنفيذ الاشتراك');
      }
    });

  } else {
    // اشتراك مجاني
    const req : SubscriptionChangeRequest = {
      type: 'Free',
      isPaid: true
    };

    this.subscriptionService.changeSubscription(req).subscribe({
      next: () => {
        this.toastr.success('تم الاشتراك بالخطة المجانية');
      },
      error: () => {
        this.toastr.error('فشل الاشتراك بالخطة المجانية');
      }
    });
  }
}
}
