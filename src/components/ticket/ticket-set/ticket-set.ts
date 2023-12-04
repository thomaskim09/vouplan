import { Component, Input } from '@angular/core';

@Component({
  selector: 'ticket-set',
  templateUrl: 'ticket-set.html'
})
export class TicketSetComponent {

  @Input('ticketSet') ticketSet: any;
  itemOpened = false;

  toggleSection() {
    this.itemOpened = !this.itemOpened;
  }

}
