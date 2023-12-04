import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoffeePayPage } from './coffee-pay';

@NgModule({
  declarations: [
    CoffeePayPage,
  ],
  imports: [
    IonicPageModule.forChild(CoffeePayPage),
  ],
})
export class CoffeePayPageModule {}
