import { Component, Input } from '@angular/core';

@Component({
  selector: 'ticket-cash',
  templateUrl: 'ticket-cash.html'
})
export class TicketCashComponent {

  @Input('ticketCash') input: any;

}
