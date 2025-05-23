// src/app/modules/vendor/services/attribute.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CategoryAttribute } from '../models/category-attribute.model';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../models/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  private baseUrl = `${environment.apiUrl}/attribute`; // Adjust according to your API base URL

  constructor(private http: HttpClient) {}

 getAttributesByCategory(categoryId: number): Observable<CategoryAttribute[]> {
  return this.http
    .get<APIResponse<CategoryAttribute[]>>(`${this.baseUrl}/by-category/${categoryId}`)
    .pipe(map(res => res.Data));
}

}
