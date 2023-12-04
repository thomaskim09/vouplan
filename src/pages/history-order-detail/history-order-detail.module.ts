import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryOrderDetailPage } from './history-order-detail';
import { ConfirmOrderComponentsModule } from '../../components/confirm-order/confirm-order.components.module';

@NgModule({
  declarations: [
    HistoryOrderDetailPage,
  ],
  imports: [
    ConfirmOrderComponentsModule,
    IonicPageModule.forChild(HistoryOrderDetailPage),
  ],
})
export class HistoryOrderDetailPageModule { }
