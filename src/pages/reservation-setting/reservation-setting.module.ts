import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservationSettingPage } from './reservation-setting';

@NgModule({
  declarations: [
    ReservationSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservationSettingPage),
  ],
})
export class SettingPageModule { }
