import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesOverviewViewModel } from '../Models/sales-overview.model';
import { environment } from '../../../../environments/environment.development'; // ✅ ضيفي import زي التاني

@Injectable({
  providedIn: 'root'
})
export class SalesOverviewService {
  private apiUrl = `${environment.apiUrl}/Dashboard`; // ✅ استخدمي environment

  constructor(private http: HttpClient) {}

  getOverviewData(): Observable<SalesOverviewViewModel> {
    return this.http.get<SalesOverviewViewModel>(`${this.apiUrl}/Stats`);
  }
}
