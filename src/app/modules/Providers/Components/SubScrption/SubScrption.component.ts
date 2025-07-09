import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../Services/SubscrptionServece.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SubscriptionChangeRequest } from '../../Models/SubscriptionChangeRequest';
import { VendorService } from '../../Services/vendor.service';
import { VendorProfile } from '../../Models/vendor-profile.model';

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
  validationMessage: string | null = null;

  vendorProfile: VendorProfile | null = null;
  loadingProfile: boolean = false;
  profileError: string | null = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    this.fetchVendorProfile();
  }

  fetchVendorProfile() {
    this.loadingProfile = true;
    this.vendorService.getVendorProfile().subscribe({
      next: (profile) => {
        this.vendorProfile = profile;
        this.loadingProfile = false;
      },
      error: (err) => {
        this.profileError = 'Failed to load profile info';
        this.loadingProfile = false;
      },
    });
  }

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
    this.validationMessage = null;
    if (this.selectedPlan === null) {
      this.validationMessage = 'Please select a plan.';
      this.toastr.warning('Please make sure you select a plan');
      return;
    }

    if (this.selectedPlan === 1) {
      if (!this.paymentType && this.paymentType !== 0) {
        this.validationMessage = 'Please select a payment method.';
        this.toastr.warning('Please select a payment method');
        return;
      }

      if (this.paymentType === -1) {
        // Pay with Wallet
        this.subscriptionService.payForVIPWithWallet().subscribe({
          next: () => {
            this.toastr.success('تم تفعيل اشتراك VIP باستخدام المحفظة بنجاح');
            this.statusMessage = 'تم تفعيل اشتراك VIP باستخدام المحفظة بنجاح';
            this.fetchVendorProfile();
          },
          error: (err) => {
            const msg = err?.error?.message || 'فشل الدفع من المحفظة';
            this.validationMessage = msg;
            this.toastr.error(msg);
          },
        });
        return;
      }

      // Other payment methods
      const req: SubscriptionChangeRequest = {
        Type: this.selectedPlan,
        IsPaid: false,
        PaymentType: this.paymentType,
      };

      this.subscriptionService.changeSubscription(req).subscribe({
        next: (res: any) => {
          if (res.data?.PaymentUrl) {
            this.paymentUrl = res.data.PaymentUrl;

            setTimeout(() => {
              const transactionId = prompt('بعد الدفع، أدخل Transaction ID:');

              if (transactionId) {
                const verifyReq: SubscriptionChangeRequest = {
                  Type: this.selectedPlan!,
                  PaymentType: this.paymentType,
                  IsPaid: true,
                  transactionId: transactionId,
                };

                this.subscriptionService
                  .confirmSubscriptionChange(verifyReq)
                  .subscribe({
                    next: () => {
                      this.toastr.success('تم الاشتراك في VIP بنجاح');
                      this.statusMessage = 'تم الاشتراك في VIP بنجاح';
                      this.paymentUrl = null; // إخفاء iframe بعد الدفع
                      this.fetchVendorProfile(); // Refresh profile to show updated subscription
                    },
                    error: (err) => {
                      const msg =
                        err?.error?.message ||
                        'لم يتم التحقق من الدفع، حاول مجددًا';
                      this.validationMessage = msg;
                      this.toastr.error(msg);
                      this.statusMessage = 'فشل التحقق من الدفع';
                    },
                  });
              }
            }, 2000);
          } else {
            this.validationMessage = 'فشل في إنشاء رابط الدفع';
            this.toastr.error('فشل في إنشاء رابط الدفع');
            this.statusMessage = 'فشل في إنشاء رابط الدفع';
          }
        },
        error: (err) => {
          const msg = err?.error?.message || 'حدث خطأ أثناء تنفيذ الاشتراك';
          this.validationMessage = msg;
          this.toastr.error(msg);
          this.statusMessage = 'حدث خطأ أثناء تنفيذ الاشتراك';
        },
      });
    } else {
      // Free plan
      const req: SubscriptionChangeRequest = {
        Type: this.selectedPlan,
        IsPaid: true,
      };
      // You may want to handle free plan logic here
    }
  }

  payWithWallet() {
    this.subscriptionService.payForVIPWithWallet().subscribe({
      next: () => {
        this.toastr.success('تم تفعيل اشتراك VIP باستخدام المحفظة بنجاح');
        this.fetchVendorProfile();
      },
      error: (err) => {
        const msg = err?.error?.message || 'فشل الدفع من المحفظة';
        this.toastr.error(msg);
      },
    });
  }

  switchToBasic() {
    const req: SubscriptionChangeRequest = {
      Type: 0, // 0 for Basic
      IsPaid: true,
    };
    this.subscriptionService.changeSubscription(req).subscribe({
      next: () => {
        this.toastr.success('You have switched to the Basic plan.');
        this.statusMessage = 'You are now on the Basic plan.';
        this.fetchVendorProfile();
      },
      error: () => {
        this.toastr.error('Failed to switch to Basic plan.');
        this.statusMessage = 'Failed to switch to Basic plan.';
      },
    });
  }
}
