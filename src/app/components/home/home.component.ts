import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
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

  
}
