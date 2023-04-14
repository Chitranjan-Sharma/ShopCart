import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AboutComponent } from './components/about/about.component';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { InvoiceComponent } from './components/invoice/invoice.component';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"login_page",component:LoginComponent},
  {path:"register_page",component:RegisterComponent},
  {path:"about_page",component:AboutComponent},
  {path:"cart_page",component:CartComponent},
  {path:"orders_page",component:OrdersComponent},
  {path:"product_details",component:ProductDetailsComponent},
  {path:"invoice_page",component:InvoiceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
