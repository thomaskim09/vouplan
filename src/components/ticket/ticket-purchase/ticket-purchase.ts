import { Component, Input } from '@angular/core';

@Component({
  selector: 'ticket-purchase',
  templateUrl: 'ticket-purchase.html'
})
export class TicketPurchaseComponent {

  @Input('ticketPurchase') input: any;

  totalPrice: any;
  paymentMethod: string;

  ngOnChanges() {
    if (this.input) {
      this.paymentMethod = this.getPaymentMethod(this.input.paymentMethod);
      this.totalPrice = this.roundUpPrice(this.input.quantity * this.input.pricePerUnit).toFixed(2);
    }
  }

  private getPaymentMethod(method) {
    switch (method) {
      case 'BOOST': return 'Boost';
      case 'TNG-EWALLET': return `Touch'n Go`;
      case 'fpx': return 'Online Banking';
    }
  }

  private roundUpPrice(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }
}
