import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HomeDashboard } from '../Models/home-dashboard.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly apiUrl = `${environment.apiUrl}/Home`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<HomeDashboard> {
    return this.http.get<HomeDashboard>(`${this.apiUrl}/dashboard`);
  }
}
