import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-payment-method',
  templateUrl: 'payment-method.html',
})
export class PaymentMethodPage {

  // HTML properties
  type: string;
  paymentMethodDineIn: string;
  paymentMethodOnline: string;
  tableNo: string;
  needTakeAway: boolean;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController) { }

  ngOnInit() {
    this.type = this.navParams.get('type');
    this.paymentMethodDineIn = this.navParams.get('paymentMethodDineIn');
    this.paymentMethodOnline = this.navParams.get('paymentMethodOnline');
    this.tableNo = this.navParams.get('tableNo');
    this.needTakeAway = this.navParams.get('needTakeAway');
  }

  getStatusText() {
    switch (this.type) {
      case 'Treat': return 'Hint: Gaining e-wallet point could save money too :)';
      case 'DineIn': {
        if (this.paymentMethodDineIn === 'onlyCash' || this.paymentMethodDineIn === 'all') {
          return 'Hint: You could pay by cash later at the counter :)';
        } else {
          return 'Hint: Gaining e-wallet point could save money too :)';
        }
      }
      case 'Online': {
        if (this.paymentMethodOnline === 'onlyCash' || this.paymentMethodDineIn === 'all') {
          return 'Hint: You could pay by cash later at the counter :)';
        } else {
          return 'Hint: Gaining e-wallet point could save money too :)';
        }
      }
      default: return 'Hint: Gaining e-wallet point could save money too :)';
    }
  }

  isCashless() {
    switch (this.type) {
      case 'Treat': return true;
      case 'DineIn': return this.paymentMethodOnline === 'onlyCash' ? false : true;
      case 'Online': return this.paymentMethodOnline === 'onlyCash' ? false : true;
      default: return false;
    }
  }

  isCash() {
    switch (this.type) {
      case 'Treat': return false;
      case 'DineIn': return this.paymentMethodOnline === 'onlyOnline' ? false : true;
      case 'Online': return this.paymentMethodOnline === 'onlyOnline' ? false : true;
      default: return false;
    }
  }

  choosePayment(type) {
    this.viewCtrl.dismiss({
      paymentMethod: type
    });
  }

  close() {
    this.viewCtrl.dismiss({
      paymentMethod: undefined
    });
  }
}
