import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuPopOverComponent } from './menu-pop-over';

@NgModule({
  declarations: [
    MenuPopOverComponent
  ],
  imports: [
    IonicPageModule.forChild(MenuPopOverComponent),
  ],
  exports: [
    MenuPopOverComponent
  ]
})
export class MenuPopOverComponentModule {}
