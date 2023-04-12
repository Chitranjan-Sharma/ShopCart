import { Component } from '@angular/core';
import { CartData } from 'src/app/models/cart';
import { OrderItem } from 'src/app/models/order';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  constructor(public api: ApiService) {
    this.fetchCartProducts();
  }

  OrderData: OrderItem = new OrderItem();
  totalPrice: number = 0;

  cartProductList: CartData[] = [];

  fetchCartProducts() {
    this.cartProductList = [];
    this.totalPrice = 0;
    this.api.allCartItems.forEach((item) => {
      this.api.productList.forEach((product) => {
        if (product.ProductId == item.ProductId) {
          const cartData: CartData = new CartData();
          cartData.ProductData = product;
          cartData.Quantity = item.Quantity;
          this.cartProductList.push(cartData);

          this.totalPrice += item.Quantity * product.Price;
        }
      });
    });
  }

  minusQuantity(cartItem: CartData) {
    this.api.allCartItems.forEach((item) => {
      if (
        item.ProductId == cartItem.ProductData.ProductId &&
        item.Quantity > 1
      ) {
        item.Quantity -= 1;
        this.api.putCartItem(item);
        this.fetchCartProducts();
        return;
      }
    });
  }

  addQuantity(cartItem: CartData) {
    this.api.allCartItems.forEach((item) => {
      if (item.ProductId == cartItem.ProductData.ProductId) {
        item.Quantity += 1;
        this.api.putCartItem(item);
        this.fetchCartProducts();
        return;
      }
    });
  }

  removeFromCart(cartData: CartData) {
    this.api.allCartItems.forEach((item) => {
      if (item.ProductId == cartData.ProductData.ProductId) {
        this.api.singleCartItem = item;
        this.api.deleteCartItem();
        this.cartProductList.splice(this.cartProductList.indexOf(cartData), 1);
        this.totalPrice -= cartData.ProductData.Price * cartData.Quantity;
        return;
      }
    });
  }

  placeOrder() {
    if (this.cartProductList.length != 0) {
      if (this.OrderData.CustomerName != '') {
        if (this.OrderData.CustomerPhone != '') {
          if (this.OrderData.DeliveryAddress != '') {
            this.cartProductList.forEach((item) => {
              this.OrderData.ProductId = item.ProductData.ProductId;
              this.OrderData.Quantity = item.Quantity;
              this.OrderData.TotalPrice =
                item.Quantity * item.ProductData.Price;
              this.OrderData.UserId = this.api.UserData.UserId;
              this.api.postOrderData(this.OrderData);
            });
          } else {
            alert('Please fill delivery address !');
          }
        } else {
          alert('Please fill phone number !');
        }
      } else {
        alert('Please fill customer name !');
      }
    } else {
      alert('Add products in cart first !');
    }
    return;
  }
}
