import { Component } from '@angular/core';
import { CartData } from 'src/app/models/cart';
import { CartItem } from 'src/app/models/cart-item';
import { MyOrderItem } from 'src/app/models/my-order';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(public api: ApiService) {
    if (api.UserData.Email != '') {
      api.getAllCartItems();
    }
  }

  searchData: string = '';

  logOutUser() {
    this.api.isLoggedIn = false;
    this.api.UserData = new User();
    this.api.ProductData = new Product();
    this.api.allCartItems = [];
    this.api.myOrderList = [];
    this.api.singleCartItem = new CartItem();
    this.api.singleOrderItem = new MyOrderItem();
  }

  searchProducts() {
    const list: Product[] = [];
    this.api.productList.forEach((item) => {
      if (
        item.BrandName.toLowerCase == this.searchData.toLocaleLowerCase ||
        item.ProductName.toLowerCase == this.searchData.toLowerCase ||
        item.Description.toLowerCase == this.searchData.toLowerCase
      ) {
        list.push(item);
      }
    });

    this.api.productList = list;
    this.api.router.navigate(['']);

    return;
  }

  myOrderPage() {
    if (this.api.isLoggedIn) {
      this.api.router.navigate(['orders_page']);
    } else {
      this.api.router.navigate(['login_page']);
    }
  }
}
