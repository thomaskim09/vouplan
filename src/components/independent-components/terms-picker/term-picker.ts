import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-term-picker',
  templateUrl: 'term-picker.html',
})
export class TermPickerPage {

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController) {
  }

  goToTerm() {
    this.navCtrl.push('TermPage');
  }

  goToMerchantTerm() {
    this.navCtrl.push('MerchantTermPage');
  }

  goToPrivacy() {
    this.navCtrl.push('PrivacyPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
