export class OrderItem {
    OrderId:number = 0;
    UserId:number = 0;
    ProductId:number = 0;
    Quantity:number = 1;
    TotalPrice:number = 0;
    CustomerName:string= "";
    CustomerPhone:string = "";
    DeliveryAddress:string = "";
    OrderStatus:string = "Waiting for confirmation";
    PaymentMode:string = "Pay On Delivery";
}
