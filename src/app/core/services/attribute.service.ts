// src/app/modules/vendor/services/attribute.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CategoryAttribute } from '../models/category-attribute.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  private baseUrl = `${environment.apiUrl}/attribute`;

  constructor(private http: HttpClient) {}

  getAttributesByCategory(categoryId: number): Observable<CategoryAttribute[]> {
    return this.http.get<{ data: CategoryAttribute[] }>(`${this.baseUrl}/by-category/${categoryId}`)
      .pipe(map(res => res.data));
  }
}
