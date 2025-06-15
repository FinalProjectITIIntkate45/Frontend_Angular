import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { CheckoutResultVM } from '../../Models/CheckoutResultVM';
import { PaymentType } from '../../Models/CheckoutResultVM';
import { OrderCreateViewModel } from '../../Models/OrderCreateViewModel';
import { CartServicesService } from '../../Services/CardServices.service';
import { CheckoutService } from '../../Services/checkout.service';
import { OrderService } from '../../Services/order.service';
import { APIResponse } from '../../../../core/models/APIResponse';

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
    private toastr: ToastrService,  // إضافة ToastrService,

    private orderService: OrderService
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
    if (method === 'ship') {
      this.checkoutModel.billingData.shippingMethod = 'ship';
    } else {
      this.checkoutModel.billingData.shippingMethod = 'pickup';
      this.currentStep = 2;
    }
  }



  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
    if (this.currentStep === 1) {
      this.checkoutModel.billingData = {
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
      };
    }
  }
   // Validation function for the delivery section// Validation function for the delivery section
// Validation function for the delivery section
isDeliveryValid(): boolean {
  if (this.deliveryMethod === 'pickup') {
    this.checkoutModel.billingData.shippingMethod = 'pickup';
    return true;
  } else if (this.deliveryMethod === 'ship') {
    this.checkoutModel.billingData.shippingMethod = 'ship';
    const billingData = this.checkoutModel.billingData;
    const isValid =
      billingData.firstName !== '' &&
      billingData.lastName !== '' &&
      billingData.phoneNumber !== '' &&
      billingData.street !== '' &&
      billingData.city !== '' &&
      billingData.state !== '' &&
      billingData.country !== '' &&
      billingData.email !== '';

    // If all fields are valid, automatically go to next step
    if (isValid) {
      this.currentStep++; // Automatically go to the next step
    }

    return isValid;
  } else {
    return false;
  }
}



  // Validation function for the payment section
  // Validation function for the payment section
isPaymentValid(): boolean {
  return !!this.checkoutModel.paymentType;
}



  // Function to check if the form is valid
  isFormValid(): boolean {

    if (this.currentStep === 1) {
      return this.isDeliveryValid();
    } else if (this.currentStep === 2) {
      return this.isPaymentValid();
    }

    return true; // For confirmation step
  }

  // Proceed to next step
  nextStep(): void {
  if (this.isFormValid()) {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  } else {
    this.toastr.error('Please complete the required fields.', 'Error');
  }
}





  // Proceed to checkout
  proceedToCheckout(): void {
    if (this.isFormValid()) {
      this.checkoutService.checkoutOrder(this.checkoutModel).subscribe({
        next: (result) => {
          console.log(result);
          if (result.IsSuccess) {
            this.paymentResult = result.Data;
            this.toastr.success('Checkout completed successfully!', 'Success');
          } else {
            this.toastr.error(result.Message, 'Error');
          }
        },
        error: (err) => {
          this.toastr.error('Checkout failed. Please try again later.', 'Error');
        },
      });
    } else {
      this.toastr.error('Please complete the form before proceeding.', 'Error');
    }
  }


  // placeOrder(): void {
  //   this.isLoading = true;

  //   // إرسال البيانات إلى خدمة الـ OrderService
  //   this.orderService.confirmOrder(this.checkoutModel).subscribe({
  //     next: (orderResult) => {
  //       this.isLoading = false;
  //       // عرض النتيجة
  //       this.toastr.success('Order confirmed successfully!', 'Success');
  //       // إعادة توجيه أو تنفيذ أي عملية بعد تأكيد الطلب
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       this.toastr.error('Failed to confirm order. Please try again later.', 'Error');
  //     },
  //   });
  // }



  // تنفيذ عملية الدفع
  // proceedToCheckout(): void {
  //   this.isLoading = true;

  //   // إرسال البيانات إلى الـ Backend
  //   this.checkoutService.checkoutOrder(this.checkoutModel).subscribe({
  //     next: (result: APIResponse<CheckoutResultVM>) => {
  //       this.isLoading = false;

  //       if (result.IsSuccess) {

  //         this.paymentResult = result.Data; // حفظ نتيجة الدفع


  //         // عرض رابط الدفع أو تفاصيل التأكيد
  //         this.toastr.success('Checkout completed successfully!', 'Success'); // رسالة نجاح
  //       } else {
  //         // في حالة فشل الدفع، عرض الرسالة المناسبة
  //         this.toastr.error(
  //           result.Message || 'فشل في إتمام عملية الدفع. يرجى المحاولة لاحقاً.',
  //           'Error'
  //         );
  //       }
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       this.toastr.error('فشل في إتمام عملية الدفع. يرجى المحاولة لاحقاً.', 'Error'); // رسالة فشل
  //     },
  //   });
  // }
}
