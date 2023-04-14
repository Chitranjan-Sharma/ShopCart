import { Component } from '@angular/core';
import { MyOrderItem } from 'src/app/models/my-order';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent {
  constructor(public api: ApiService) {
    api.getMyOrders();
    console.log(api.myOrderList);
  }
  
  printInvoice(o:MyOrderItem){
    this.api.singleOrderItem = o;
    this.api.router.navigate(["invoice_page"]);
  }
}
