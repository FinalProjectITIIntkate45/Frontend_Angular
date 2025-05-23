import { environment } from './../../../environments/environment.development';
// src/app/modules/vendor/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/category`; // عدّل حسب API base URL

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
  return this.http.get<{ Data: Category[] }>(`${this.baseUrl}`)
    .pipe(
      map(response => response.Data) // ✅ استخدم "Data" الكبيرة زي ما هو في الـ JSON
    );
}

}
