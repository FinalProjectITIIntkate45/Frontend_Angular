import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../../core/models/category.model';
import { CategoryAttribute } from '../../../../core/models/category-attribute.model';
import { CategoryService } from '../../../../core/services/category.service';
import { AttributeService } from '../../../../core/services/attribute.service';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { ProductAttribute } from '../../../../core/models/product-attribute.model';

@Component({
  selector: 'app-product-form-page',
  templateUrl: './product-form-page.component.html',
  styleUrls: ['./product-form-page.component.scss']
})
export class ProductFormPageComponent implements OnInit {
  form!: FormGroup;
  categories: Category[] = [];
  attributes: CategoryAttribute[] = [];
  attachments: File[] = [];
  imagePreviews: string[] = [];

  isEditMode: boolean = false;
  productId!: number;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private attributeService: AttributeService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
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
      attachments: [null]
    });

    this.route.paramMap.subscribe(params => {
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
    this.categoryService.getAllCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  onCategoryChange(categoryId: number, existingValues: ProductAttribute[] = []): void {
    this.attributeService.getAttributesByCategory(categoryId).subscribe(attrs => {
      this.attributes = attrs;

      attrs.forEach(attr => {
        const controlName = `attr_${attr.id}`;
        if (!this.form.contains(controlName)) {
          this.form.addControl(controlName, this.fb.control('', Validators.required));
        }

        // إذا كنا في وضع التعديل ووجدنا قيمة سابقة لها نفس الاسم
        const matched = existingValues.find(val => val.name === attr.name);
        if (matched) {
          this.form.get(controlName)?.setValue(matched.value);
        }
      });
    });
  }

  loadProductData(id: number): void {
    this.isLoading = true;
    this.productService.getById(id).subscribe(product => {
      this.isLoading = false;

      this.form.patchValue({
        name: product.name,
        description: product.description,
        stock: product.stock,
        basePrice: product.basePrice,
        points: product.points,
        categoryId: product.categoryId,
        isSpecialOffer: product.isSpecialOffer,
      });


      // تحميل خصائص الكاتيجوري مع تعبئة القيم الموجودة
      this.onCategoryChange(product.categoryId, product.attributes ?? []);
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.attachments = Array.from(files);

      this.imagePreviews = [];
      this.attachments.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
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
  }

  onSubmit(): void {
    const formData = new FormData();

    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('stock', this.form.get('stock')?.value);
    formData.append('basePrice', this.form.get('basePrice')?.value);
    formData.append('points', this.form.get('points')?.value);
    formData.append('categoryId', this.form.get('categoryId')?.value);
    formData.append('isSpecialOffer', this.form.get('isSpecialOffer')?.value);
    formData.append('increaseRate', this.form.get('increaseRate')?.value ?? '');
    formData.append('discountPercentage', this.form.get('discountPercentage')?.value ?? '');

    const productAttrVms = this.attributes.map(attr => ({
      attributeId: attr.id,
      value: this.form.get(`attr_${attr.id}`)?.value
    }));
    formData.append('productAttrVms', JSON.stringify(productAttrVms));

    this.attachments.forEach(file => {
      formData.append('attachments', file);
    });

    const action = this.isEditMode
      ? this.productService.updateProduct(this.productId, formData)
      : this.productService.createProduct(formData);

    action.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Product updated successfully' : 'Product created successfully');
        this.router.navigate(['/vendor/products']);
      },
      error: err => console.error('Failed to save product', err)
    });
  }
}
