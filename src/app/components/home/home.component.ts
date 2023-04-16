import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { WishListItem } from 'src/app/models/wishlist';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(public api: ApiService, private router: Router) {
    api.getAllProducts();
  }

  gotoProductDetailPage(product: Product) {
    this.api.ProductData = product;
    this.router.navigate(['product_details']);
  }

  addToWishlist(p: Product) {
    const wishlistItem: WishListItem = new WishListItem();
    if (this.api.UserData.UserId != 0) {
      wishlistItem.UserId = this.api.UserData.UserId;
      wishlistItem.ProductId = p.ProductId;
      this.api.postWishListItem(wishlistItem);
    }
  }
}
