import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ToggleDetailPage } from './toggle-detail';

@NgModule({
  declarations: [
    ToggleDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ToggleDetailPage),
  ],
})
export class ToggleDetailPageModule {}
