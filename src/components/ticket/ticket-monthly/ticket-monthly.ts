import { Component, Input } from '@angular/core';

@Component({
  selector: 'ticket-monthly',
  templateUrl: 'ticket-monthly.html'
})
export class TicketMonthlyComponent {

  @Input('ticketMonthly') input: any;

  itemOpened = false;

  toggleSection() {
    this.itemOpened = !this.itemOpened;
  }
}
