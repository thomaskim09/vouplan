import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TogglePage } from './toggle';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    TogglePage,
  ],
  imports: [
    IonicPageModule.forChild(TogglePage),
    SuperTabsModule
  ],
})
export class TogglePageModule { }
