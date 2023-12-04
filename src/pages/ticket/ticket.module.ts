import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketPage } from './ticket';
import { TicketComponentsModule } from '../../components/ticket/ticket.module';

@NgModule({
  declarations: [
    TicketPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketPage),
    TicketComponentsModule
  ],
})
export class TicketPageModule { }
