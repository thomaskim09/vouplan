import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ConfirmOrderButtonComponent } from './confirm-order-button/confirm-order-button';
import { ConfirmOrderMainComponent } from './confirm-order-main/confirm-order-main';
import { OrderCallComponent } from './order-call/order-call';

@NgModule({
  declarations: [
    ConfirmOrderButtonComponent,
    ConfirmOrderMainComponent,
    OrderCallComponent
  ],
  imports: [
    IonicModule
  ],
  exports: [
    ConfirmOrderButtonComponent,
    ConfirmOrderMainComponent,
    OrderCallComponent
  ]
})
export class ConfirmOrderComponentsModule { }
