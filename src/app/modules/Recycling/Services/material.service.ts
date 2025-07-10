import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecyclingMaterialViewModel } from '../Models/RecyclingMaterialViewModel';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private api = 'http://localhost:5037/api/RecyclingMaterials';

  constructor(private http: HttpClient) {}

  getAllMaterials(): Observable<RecyclingMaterialViewModel[]> {
    return this.http.get<{ data: RecyclingMaterialViewModel[] }>(`${this.api}/getall`).pipe(map(res => res.data));
  }
}

