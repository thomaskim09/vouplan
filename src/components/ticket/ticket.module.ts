import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TicketPurchaseComponent } from './ticket-purchase/ticket-purchase';
import { TicketReservationComponent } from './ticket-reservation/ticket-reservation';
import { TicketSetComponent } from './ticket-set/ticket-set';
import { TicketQuantityComponent } from './ticket-quantity/ticket-quantity';
import { TicketMonthlyComponent } from './ticket-monthly/ticket-monthly';
import { TicketCashComponent } from './ticket-cash/ticket-cash';

@NgModule({
  declarations: [
    TicketPurchaseComponent,
    TicketReservationComponent,
    TicketSetComponent,
    TicketCashComponent,
    TicketQuantityComponent,
    TicketMonthlyComponent
  ],
  imports: [
    IonicModule
  ],
  exports: [
    TicketPurchaseComponent,
    TicketReservationComponent,
    TicketSetComponent,
    TicketCashComponent,
    TicketQuantityComponent,
    TicketMonthlyComponent
  ]
})
export class TicketComponentsModule { }
