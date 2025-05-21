import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  // مش فاهم بيعمل ايه 
import { CartItemInterface } from '../models/CartItemInterface';


@Injectable({
  providedIn: 'root'
})
export class CardServicesService {

private readonly baseUrl = 'https://localhost:7109/api/cart';

constructor(private http : HttpClient ) { }


AddToCard(item:Partial<CartItemInterface>):Observable<any>
{
  return this.http.post(`${this.baseUrl}/add/`,item)
}

GetCardItems (clientId : string) :Observable<CartItemInterface[]>
{
    return this.http.get<CartItemInterface[]>(`${this.baseUrl}/list?${clientId}`);
}

removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${cartItemId}`);
  }

  clearCart(clientId: string): Observable<any> {   // add in backend
    return this.http.delete(`${this.baseUrl}/clear?clientId=${clientId}`);
  }

}
