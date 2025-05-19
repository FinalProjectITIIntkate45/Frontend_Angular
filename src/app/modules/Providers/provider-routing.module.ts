import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddShopComponent } from "./Components/add-shop/add-shop.component";
import { ProductFormPageComponent } from "./Components/product-form-page/product-form-page.component";
import { authGuard } from "../../core/guards/Auth.guard";
import { ProductDetailsPageComponent } from "./Components/product-details-page/product-details-page.component";

const routes: Routes = [
  { path: 'add-shop', component: AddShopComponent },
  //   { path: 'add-product', component:  },
  {
    path: 'products/add',
    component: ProductFormPageComponent,
    data: { mode: 'add', expectedRoles: ['Provider'] },
    canActivate: [authGuard],
  },
  {
    path: 'products/edit/:id',
    component: ProductFormPageComponent,
    data: { mode: 'edit', expectedRoles: ['Provider'] },
    canActivate: [authGuard],
  },
  {
    path: 'products/details/:id',
    component: ProductDetailsPageComponent,
    data: { expectedRoles: ['Provider'] },
    canActivate: [authGuard]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderRoutingModule { }
