import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonNotificationPage } from './common-notification';

@NgModule({
  declarations: [
    CommonNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(CommonNotificationPage),
  ],
})
export class CommonNotificationPageModule {}
