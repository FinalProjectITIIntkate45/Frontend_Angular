import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddShopComponent } from "./Components/add-shop/add-shop.component";

const routes: Routes = [
  { path: 'add-shop', component: AddShopComponent },
  //   { path: 'add-product', component:  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderRoutingModule { }
