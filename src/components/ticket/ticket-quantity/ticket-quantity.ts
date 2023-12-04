import { Component, Input } from '@angular/core';

@Component({
  selector: 'ticket-quantity',
  templateUrl: 'ticket-quantity.html'
})
export class TicketQuantityComponent {

  @Input('ticketQuantity') input: any;

  itemOpened = false;

  toggleSection() {
    this.itemOpened = !this.itemOpened;
  }

}
