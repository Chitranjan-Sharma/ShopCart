import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';
import { OrderItem } from '../models/order';
import { MyOrderItem } from '../models/my-order';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly baseUrl = 'http://localhost:5062/api/';

  isLoggedIn = false;

  constructor(private http: HttpClient, public router: Router) {}

  UserData: User = new User();
  errorMessage = '';

  userLogin(email: string, password: string) {
    this.http.get(this.baseUrl + 'Users').subscribe((response) => {
      const allUsers = response as User[];

      if (allUsers != null) {
        allUsers.forEach((user) => {
          if (user.Email == email) {
            if (user.Password == password) {
              this.UserData = user;
              this.isLoggedIn = true;
              this.router.navigate(['']);
              this.getAllCartItems();
            } else {
              this.errorMessage = 'Incorrect password !';
            }
          } else {
            this.errorMessage = 'Email not registered, Please register first !';
          }
        });
      }
    });
  }

  postUser(email: string, password: string) {
    this.UserData.Email = email;
    this.UserData.Password = password;

    this.http.post(this.baseUrl + 'Users', this.UserData).subscribe(
      (res) => {
        this.router.navigate(['login_page']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

  //Fetching products datas

  productList: Product[] = [];
  ProductData: Product = new Product();

  getAllProducts() {
    this.http.get(this.baseUrl + 'ProductItems').subscribe(
      (response) => {
        this.productList = response as Product[];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //Fetching cart items
  allCartItems: CartItem[] = [];
  singleCartItem: CartItem = new CartItem();

  getAllCartItems() {
    this.allCartItems = [];
    this.http.get(this.baseUrl + 'CartItems').subscribe(
      (response) => {
        const list = response as CartItem[];
        list.forEach((item) => {
          if (item.UserId == this.UserData.UserId) {
            this.allCartItems.push(item);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSingleCartItem(id: number) {
    this.http.get(this.baseUrl + 'CartItems/' + id).subscribe((res) => {
      this.singleCartItem = res as CartItem;
    });
  }

  postCartItem(cartItem: CartItem) {
    this.http.post(this.baseUrl + 'CartItems', cartItem).subscribe(
      (res) => {
        alert('Item added to cart');
        this.getAllCartItems();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  putCartItem(cartItem: CartItem) {
    this.http
      .put(this.baseUrl + 'CartItems/' + cartItem.Id, cartItem)
      .subscribe(
        (res) => {
          this.getAllCartItems();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  deleteCartItem() {
    this.http
      .delete(this.baseUrl + 'CartItems/' + this.singleCartItem.Id)
      .subscribe(
        (res) => {
          this.getAllCartItems();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  //My order list
  myOrderList: MyOrderItem[] = [];
  singleOrderItem: MyOrderItem = new MyOrderItem();

  getMyOrders() {
    this.http.get(this.baseUrl + 'OrderItems').subscribe(
      (response) => {
        const orderList = response as OrderItem[];

        orderList.forEach((item) => {
          if (item.UserId == this.UserData.UserId) {
            const myOrderItem: MyOrderItem = new MyOrderItem();
            myOrderItem.Order = item;

            this.getSingleProduct(item.ProductId).subscribe(
              (res) => {
                myOrderItem.Product = res as Product;
              },
              (error) => {
                console.log(error);
              }
            );

            this.myOrderList.push(myOrderItem);
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSingleProduct(id: number) {
    return this.http.get(this.baseUrl + 'ProductItems/' + id);
  }

  //Post order data
  postOrderData(OrderData: OrderItem) {
    this.http.post(this.baseUrl + 'OrderItems', OrderData).subscribe(
      (res) => {
        this.allCartItems.forEach((item) => {
          this.http.delete(this.baseUrl + 'CartItems/' + item.Id).subscribe(
            (res) => {
              this.allCartItems.splice(this.allCartItems.indexOf(item), 1);
              console.log(res);
            },
            (error) => {
              console.log(error);
            }
          );
        });

        if (confirm('Order placed !')) {
          this.router.navigate(['']);
        } else {
          this.router.navigate(['']);
        }

        return;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
