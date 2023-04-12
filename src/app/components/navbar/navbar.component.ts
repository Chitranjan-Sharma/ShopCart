import { Component } from '@angular/core';
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
    this.api.allCartItems = [];
    this.api.UserData = new User();
    this.api.ProductData = new Product();
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
}
