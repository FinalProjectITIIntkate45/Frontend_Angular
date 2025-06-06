import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

import { AttributeWithValue } from '../../../../core/models/AttributeWithValue';
import { CategoryAttribute } from '../../../../core/models/category-attribute.model';
import { Category } from '../../../../core/models/category.model';
import { ProductAttribute } from '../../../../core/models/product-attribute.model';
import { AttributeService } from '../../../../core/services/attribute.service';
import { CategoryService } from '../../../../core/services/category.service';
import { ProductService } from '../../../../core/services/product.service';
import { SubscriptionService } from '../../../../core/services/subscription.service';

@Component({
  standalone: false,
  selector: 'app-product-form-page',
  templateUrl: './product-form-page.component.html',
  styleUrls: ['./product-form-page.component.css'],
})
export class ProductFormPageComponent implements OnInit {
  form!: FormGroup;
  categories: Category[] = [];
  // attributes: CategoryAttribute[] = [];
  attributes: AttributeWithValue[] = [];

  attachments: File[] = [];
  imagePreviews: string[] = [];

  isEditMode = false;
  productId!: number;
  isLoading = false;
  stepIndex = 0;
  subscriptionType: 'Basic' | 'VIP' = 'Basic';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private attributeService: AttributeService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    const savedDraft = localStorage.getItem('productDraft');

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      stock: [1, Validators.required],
      basePrice: [1, Validators.required],
      points: [1, Validators.required],
      categoryId: [null, Validators.required],
      isSpecialOffer: [false],
      increaseRate: [],
      discountPercentage: [],
      attachments: [null],
    });
    this.subscriptionService.getSubscriptionType().subscribe({
      next: (type) => {
        this.subscriptionType = type;
        console.log('🔁 User subscription type:', this.subscriptionType);
      },
      error: (err) => {
        console.error(' Failed to load subscription type', err);
      },
    });

    // ✅ Apply draft if available
    if (savedDraft) {
      this.form.patchValue(JSON.parse(savedDraft));
      this.toastr.info('Draft loaded automatically');
    }

    // ✅ Auto save draft
    this.form.valueChanges.subscribe(() => {
      localStorage.setItem(
        'productDraft',
        JSON.stringify(this.form.getRawValue())
      );
    });

    // ✅ Watch for category change
    this.form.get('categoryId')?.valueChanges.subscribe((newCategoryId) => {
      if (!this.isEditMode) {
        this.onCategoryChange(newCategoryId);
      }
    });

    // ✅ Edit mode setup
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProductData(this.productId);
      }
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((cats) => {
      this.categories = cats;

      if (this.categories.length > 0 && !this.isEditMode) {
        const defaultCategoryId = this.categories[0].Id;
        this.onCategoryChange(defaultCategoryId);
      }
    });
  }

  // onCategoryChange(event: Event | number, existingValues: ProductAttribute[] = []): void {
  //   let categoryId: number;

  //   if (event instanceof Event) {
  //     const select = event.target as HTMLSelectElement;
  //     categoryId = Number(select.value);
  //   } else {
  //     categoryId = event;
  //   }

  //   if (!categoryId || isNaN(categoryId)) return;

  //   this.attributes.forEach((attr) => {
  //     const controlName = `attr_${attr.id}`;
  //     if (this.form.contains(controlName)) {
  //       this.form.removeControl(controlName);
  //     }
  //   });

  //   this.attributeService.getAttributesByCategory(categoryId).subscribe((attrs) => {
  //     this.attributes = attrs;

  //     attrs.forEach((attr) => {
  //       const controlName = `attr_${attr.id}`;
  //       this.form.addControl(controlName, this.fb.control('', Validators.required));

  //       const matched = existingValues.find((val) => val.name === attr.name);
  //       if (matched) {
  //         this.form.get(controlName)?.setValue(matched.value);
  //       }
  //     });
  //   });
  // }
  onCategoryChange(
    event: Event | number,
    existingValues: ProductAttribute[] = []
  ): void {
    let categoryId: number;

    if (event instanceof Event) {
      const select = event.target as HTMLSelectElement;
      categoryId = Number(select.value);
    } else {
      categoryId = event;
    }

    if (!categoryId || isNaN(categoryId)) return;

    console.log('🔁 Changing category to:', categoryId);

    // 🧹 Remove old attribute controls
    this.attributes.forEach((attr) => {
      const controlName = `attr_${attr.id}`;
      if (this.form.contains(controlName)) {
        this.form.removeControl(controlName);
      }
    });

    //  Fetch new attributes
    this.attributeService.getAttributesByCategory(categoryId).subscribe({
      next: (attrs) => {
        console.log(' Loaded new attributes:', attrs);
        this.attributes = attrs.map((attr) => {
          const matched = existingValues.find(
            (val) => val.attributeId === attr.Id
          );
          const value = matched ? matched.value : '';
          const controlName = `attr_${attr.Id}`;
          this.form.addControl(
            controlName,
            this.fb.control(value, Validators.required)
          );

          return {
            id: attr.Id,
            name: attr.Name,
            value: value,
          };
        });
      },
      error: (err) => {
        console.error(' Failed to load attributes:', err);
        this.attributes = [];
      },
    });
  }

  loadProductData(id: number): void {
    this.isLoading = true;
    this.productService.getById(id).subscribe((product) => {
      this.isLoading = false;
      this.form.patchValue({
        name: product.Name,
        description: product.Description,
        stock: product.Stock,
        basePrice: product.BasePrice,
        points: product.Points,
        categoryId: product.CategoryId,
        isSpecialOffer: product.IsSpecialOffer,
      });
      this.onCategoryChange(product.CategoryId, product.Attributes ?? []);
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.attachments = Array.from(files);
      this.imagePreviews = [];

      this.attachments.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.attachments.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  resetForm(): void {
    this.form.reset();
    this.attributes = [];
    this.attachments = [];
    this.imagePreviews = [];
    this.stepIndex = 0;
    localStorage.removeItem('productDraft');
  }

  nextStep(): void {
    if (this.stepIndex < 2) this.stepIndex++;
  }

  prevStep(): void {
    if (this.stepIndex > 0) this.stepIndex--;
  }

  canProceed(step: number): boolean {
    if (step === 0) {
      return (
        !!this.form.get('name')?.valid &&
        !!this.form.get('description')?.valid &&
        !!this.form.get('stock')?.valid &&
        !!this.form.get('basePrice')?.valid &&
        !!this.form.get('points')?.valid
      );
    }
    if (step === 1) {
      return !!this.form.get('categoryId')?.valid;
    }
    return true;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;

    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('stock', this.form.get('stock')?.value);
    formData.append('basePrice', this.form.get('basePrice')?.value);
    formData.append('points', this.form.get('points')?.value);
    formData.append('categoryId', this.form.get('categoryId')?.value);
    formData.append('isSpecialOffer', this.form.get('isSpecialOffer')?.value);
    formData.append('increaseRate', this.form.get('increaseRate')?.value ?? '');
    formData.append(
      'discountPercentage',
      this.form.get('discountPercentage')?.value ?? ''
    );

    this.attributes.forEach((attr, index) => {
      formData.append(`productAttrVms[${index}].AtrrId`, attr.id.toString());
      formData.append(
        `productAttrVms[${index}].AtrrValue`,
        this.form.get(`attr_${attr.id}`)?.value || ''
      );
    });

    // formData.append('productAttrVms', JSON.stringify(productAttrVms));

    this.attachments.forEach((file) => {
      formData.append('attachments', file);
    });

    const action = this.isEditMode
      ? this.productService.updateProduct(this.productId, formData)
      : this.productService.createProduct(formData);

    action.subscribe({
      next: () => {
        this.toastr.success(
          this.isEditMode
            ? 'Product updated successfully'
            : 'Product created successfully'
        );
        localStorage.removeItem('productDraft');
        this.router.navigate(['/provider/products']);
      },
      error: (err) => {
        this.toastr.error('Failed to save product');
        console.error('Failed to save product', err);
        this.isLoading = false;
      },
    });
  }
}
