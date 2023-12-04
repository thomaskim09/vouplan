import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetailPage } from './order-detail';
import { ConfirmOrderComponentsModule } from '../../components/confirm-order/confirm-order.components.module';

@NgModule({
  declarations: [
    OrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderDetailPage),
    ConfirmOrderComponentsModule
  ],
})
export class OrderDetailPageModule { }
