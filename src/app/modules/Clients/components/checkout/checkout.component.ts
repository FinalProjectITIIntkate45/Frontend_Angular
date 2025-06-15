import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { CheckoutResultVM } from '../../Models/CheckoutResultVM';
import { PaymentType } from '../../Models/CheckoutResultVM';
import { OrderCreateViewModel } from '../../Models/OrderCreateViewModel';
import { CartServicesService } from '../../Services/CardServices.service';
import { CheckoutService } from '../../Services/checkout.service';
import { APIResponse } from '../../../../core/models/APIResponse';// استيراد ToastrService

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartData: any;
  isLoading = false;
  error: string | null = null;
  paymentResult: CheckoutResultVM | null = null;
  checkoutModel: OrderCreateViewModel;
  currentStep = 1;
  deliveryMethod: string = 'ship';

  constructor(
    private cartService: CartServicesService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService  // إضافة ToastrService
  ) {
    // تهيئة الـ checkoutModel مع قيم افتراضية
    this.checkoutModel = {
      clientId: '',
      orderItems: [],
      totalPrice: 0,
      totalPoints: 0,
      usedPaidPoints: 0,
      usedFreePoints: 0,
      couponCode: '',
      paymentType: PaymentType.CashOnDelivery,
      billingData: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: '',
        country: '',
        state: '',
        apartment: '',
        floor: '',
        street: '',
        building: '',
        shippingMethod: '',
      },
      status: 0,
    };
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  // تحميل عناصر العربة (Cart)
  loadCartItems(): void {
    this.isLoading = true;
    this.error = null;

    this.cartService.getCartItems().subscribe({
      next: (data) => {
        this.cartData = data;

        // تحويل بيانات العربة إلى نموذج الطلب
        this.checkoutModel.orderItems = this.cartData.Items.map(
          (item: any) => ({
            productId: item.ProductId,
            quantity: item.Quantity,
            price: item.Price,
          })
        );

        // تحديث الأسعار والنقاط في نموذج الطلب
        this.checkoutModel.totalPrice = this.cartData.CartTotalPrice;
        this.checkoutModel.totalPoints = this.cartData.CartTotalPoints;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'فشل تحميل عناصر العربة';
        this.isLoading = false;
      },
    });
  }

  selectDeliveryMethod(method: string): void {
    this.deliveryMethod = method;
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // تنفيذ عملية الدفع
  proceedToCheckout(): void {
    this.isLoading = true;

    // إرسال البيانات إلى الـ Backend
    this.checkoutService.checkoutOrder(this.checkoutModel).subscribe({
      next: (result: APIResponse<CheckoutResultVM>) => {
        this.isLoading = false;

        if (result.IsSuccess) {
          
          this.paymentResult = result.Data; // حفظ نتيجة الدفع
          // عرض رابط الدفع أو تفاصيل التأكيد
          this.toastr.success('Checkout completed successfully!', 'Success'); // رسالة نجاح
        } else {
          // في حالة فشل الدفع، عرض الرسالة المناسبة
          this.toastr.error(
            result.Message || 'فشل في إتمام عملية الدفع. يرجى المحاولة لاحقاً.',
            'Error'
          );
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('فشل في إتمام عملية الدفع. يرجى المحاولة لاحقاً.', 'Error'); // رسالة فشل
      },
    });
  }
}
