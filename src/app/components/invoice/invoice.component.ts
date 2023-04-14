import { Component } from '@angular/core';
import { MyOrderItem } from 'src/app/models/my-order';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent {
  myOrderData: MyOrderItem = new MyOrderItem();
  constructor(api: ApiService) {
    this.myOrderData = api.singleOrderItem;
  }

  printInvoice() {
    window.print();
  }
}
