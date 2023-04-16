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
    this.getWishlist();
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
    this.api.MyWishList = [];
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

  imageUpdating: boolean = false;
  btnChangePasswordClicked: boolean = false;
  btnChangeEmailClicked: boolean = false;

  selectedImage(e: any) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file != null) {
        const reader = new FileReader();
        reader.onload = (e) =>
          (this.api.UserData.ProfilePictureUrl = reader.result as string);
        reader.readAsDataURL(file);
      } else {
        alert('Error in image loading !');
      }
    }
  }

  updateProfilePicture() {
    if (this.api.UserData.ProfilePictureUrl != 'assets/profile_icon.png') {
      this.imageUpdating = true;
      this.api.putUserData().subscribe(
        (res) => {
          this.imageUpdating = false;
        },
        (er) => {
          console.log(er);
          this.imageUpdating = false;
        }
      );
    }
  }

  currentPassword: string = '';
  newPassword: string = '';
  newEmail: string = '';
  errorMessage: string = '';

  updateEmail() {
    if (this.currentPassword != '' && this.newEmail != '') {
      if (this.api.UserData.UserId != 0) {
        if (this.api.UserData.Password == this.currentPassword) {
          this.api.UserData.Email = this.newEmail;
          this.api.putUserData().subscribe(
            (res) => {
              this.btnChangeEmailClicked = false;
            },
            (err) => {
              this.errorMessage = err;
            }
          );
        } else {
          this.errorMessage = 'Incorrect Password !';
        }
      } else {
        this.errorMessage = 'Please login first and try again !';
      }
    } else {
      this.errorMessage = 'Both field required !';
    }
  }

  changePassword() {
    if (this.currentPassword != '' && this.newPassword != '') {
      if (this.api.UserData.UserId != 0) {
        if (this.api.UserData.Password == this.currentPassword) {
          this.api.UserData.Password = this.newPassword;
          this.api.putUserData().subscribe(
            (res) => {
              this.btnChangePasswordClicked = false;
            },
            (err) => {
              this.errorMessage = err;
            }
          );
        } else {
          this.errorMessage = 'Incorrect Current Password !';
        }
      } else {
        this.errorMessage = 'Please login first and try again !';
      }
    } else {
      this.errorMessage = 'Both field required !';
    }
  }

  wishListProducts: Product[] = [];
  getWishlist() {
    this.wishListProducts = [];
    this.api.MyWishList.forEach((w) => {
      this.api.productList.forEach((p) => {
        if (p.ProductId == w.ProductId) {
          this.wishListProducts.push(p);
        }
      });
    });

  }

  gotoProductDetailPage(p: Product) {
    this.api.ProductData = p;
    this.api.router.navigate(['product_details']);
  }

  resetBtn() {
    this.btnChangeEmailClicked = false;
    this.btnChangePasswordClicked = false;
  }
}
