// src/app/core/services/notification-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UnifiedNotification } from '../Models/UnifiedNotification';

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  private baseUrl = `${environment.apiUrl}/notification`;

  constructor(private http: HttpClient) {}

  // ✅ جلب كل الإشعارات للمستخدم
  getMyNotifications(): Observable<UnifiedNotification[]> {
    return this.http.get<UnifiedNotification[]>(`${this.baseUrl}/my`);
  }

  // ✅ حذف إشعار محدد
  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // ✅ حذف كل الإشعارات
  deleteAllMyNotifications(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear`);
  }

  // ✅ تحديد إشعار كمقروء
  markAsRead(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/mark-read`, {});
  }
}
