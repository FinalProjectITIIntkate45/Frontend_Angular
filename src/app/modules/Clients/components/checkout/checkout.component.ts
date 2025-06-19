import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { CartItemInterface } from '../../Models/CartItemInterface';
import { OrderCreateViewModel } from '../../Models/OrderCreateViewModel';
import { CartServicesService } from '../../Services/CardServices.service';
import { CheckoutService } from '../../Services/checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutModel: OrderCreateViewModel;
  currentStep: number = 1;
  deliveryMethod: string = 'ship'; // لتحديد ما إذا كان المستخدم يختار الشحن أو الاستلام من المتجر
  isLoading: boolean = false; // تعريف المتغير isLoading هنا
  error: string | null = null;

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartServicesService,
    private toastr: ToastrService
  ) {
    this.checkoutModel = {
      clientId: '',
      orderItems: [],
      totalPrice: 0,
      totalPoints: 0,
      usedPaidPoints: 0,
      usedFreePoints: 0,
      couponCode: '',
      paymentType: 0,
      billingData: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        apartment: '',
        floor: '',
        building: '',
        country: '',
        shippingMethod: '',
        email: '',
      },
      status: 0,
    };
  }

  ngOnInit(): void {
    this.loadCartData();  // تحميل بيانات العربة عند بداية تحميل المكون
  }
// In CheckoutComponent

loadCartData(): void {
  this.isLoading = true;
  this.error = null;

  this.cartService.getCartItems().subscribe(
    (cartItems) => {
      // تحويل CartItemInterface إلى OrderItemViewModel
      this.checkoutModel.orderItems = cartItems.Items.map((item: CartItemInterface) => ({
        productId: item.ProductId,
        quantity: item.Quantity,
        price: item.Price,
        points: item.points // إذا كان يوجد في CartItemInterface
      }));

      // تحديث باقي القيم في checkoutModel
      this.checkoutModel.totalPrice = cartItems.CartTotalPrice;
      this.checkoutModel.totalPoints = cartItems.CartTotalPoints;

      this.isLoading = false;
    },
    (error) => {
      console.error('Error loading cart data:', error);
      this.isLoading = false;
      this.toastr.error('Error loading cart data', 'Error');
    }
  );
}


  // عند اختيار طريقة التوصيل، نحدد ما إذا كان يجب إظهار التفاصيل
  selectDeliveryMethod(method: string): void {
    this.deliveryMethod = method;
    if (method === 'pickup') {
      this.checkoutModel.billingData.shippingMethod = 'pickup';
      this.currentStep = 2;  // الانتقال مباشرةً إلى خطوة الدفع
    } else {
      this.checkoutModel.billingData.shippingMethod = 'ship';
      this.currentStep = 1;  // العودة إلى خطوة الشحن
    }
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

  onPlaceOrder() {
    // تنفيذ منطق الطلب هنا
  }
}
