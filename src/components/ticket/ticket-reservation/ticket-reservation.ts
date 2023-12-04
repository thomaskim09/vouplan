import { Component, Input } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'ticket-reservation',
  templateUrl: 'ticket-reservation.html'
})
export class TicketReservationComponent {

  @Input('ticketReservation') input: any;
  date: any;
  time: string;

  ngOnChanges() {
    if (this.input) {
      this.date = format(parseISO(this.input.dateTime), 'dd-MM-yyyy');
      let timeString = format(parseISO(this.input.dateTime), 'hh:mm a');
      if (timeString.charAt(0) === '0') {
        timeString = timeString.substr(1);
      }
      this.time = timeString.toLowerCase();
    }
  }
}
