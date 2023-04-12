import { Component } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item';
import { Product } from 'src/app/models/product';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent {
  constructor(public api: ApiService) {
    api.getAllProducts();
  }

  productDetails(product: Product) {
    this.api.ProductData = product;
    this.api.router.navigate(['product_details']);
  }

  addtoCart() {
    if (this.api.UserData.Email != '') {
      if (this.api.ProductData.ProductName != '') {
        const cartItem = new CartItem();
        cartItem.ProductId = this.api.ProductData.ProductId;
        cartItem.UserId = this.api.UserData.UserId;

        this.api.postCartItem(cartItem);
      }
    } else {
      this.api.router.navigate(['login_page']);
    }
  }

  buyNow() {
    if (this.api.UserData.Email != '') {
      if (this.api.ProductData.ProductName != '') {
        const cartItem = new CartItem();
        cartItem.ProductId = this.api.ProductData.ProductId;
        cartItem.UserId = this.api.UserData.UserId;

        this.api.postCartItem(cartItem);
        this.api.router.navigate(["cart_page"]);
      }
    } else {
      this.api.router.navigate(['login_page']);
    }
  }
}
