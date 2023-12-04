import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermPickerPage } from './term-picker';

@NgModule({
  declarations: [
    TermPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(TermPickerPage),
  ],
})
export class TermPickerPageModule { }
