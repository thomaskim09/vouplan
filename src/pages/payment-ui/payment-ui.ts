import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Platform } from 'ionic-angular/platform/platform';
import { CommonService } from './../../providers/common/common.service';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-payment-ui',
  templateUrl: 'payment-ui.html',
})
export class PaymentUiPage {

  // Common params
  paymentDetails: any;

  // Params from coffee pay
  treatDetails: any;
  type: any;

  // Controller
  failCounter: number = 0;

  // Tools
  backSub: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restaurantService: RestaurantService,
    public events: Events,
    public platform: Platform,
    public commonService: CommonService) {
  }

  ngOnInit() {
    this.paymentDetails = this.navParams.get('paymentDetails');
    this.treatDetails = this.navParams.get('treatDetails');
    this.type = this.navParams.get('type');
    this.registerBackButton();
    this.setUpDifferently();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    if (this.backSub) {
      this.backSub();
    }
  }

  private setUpDifferently() {
    if (!this.platform.is('cordova')) {
      return;
    }
    switch (this.type) {
      case 'treat': {
        this.startTreatPayment();
        break;
      }
    }
  }

  private startTreatPayment() {
    (window as any).molpay.startMolpay(this.paymentDetails, val => {
      val = JSON.parse(val);
      if (val.status_code === '00') {
        this.createNewTreat(this.treatDetails);
      } else {
        if (this.failCounter === 0) {
          this.cancelPayment();
          this.failCounter++;
        }
      }
    });
  }

  private cancelPayment() {
    if (this.platform.is('cordova')) {
      (window as any).molpay.closeMolpay();
    }
    this.backTwice();
  }

  private createNewTreat(object) {
    this.restaurantService.sendTreats(object).pipe(untilDestroyed(this)).subscribe(val => {
      const text = object.details.isAnonymous ? 'Thank you for the support' : 'Thank you for the support, We will reply you soon :)';
      this.commonService.presentToast(text);
      this.backTwice();
    });
  }

  private registerBackButton() {
    if (this.platform.is('cordova')) {
      this.backSub = this.platform.registerBackButtonAction(() => {
        this.back();
      }, 1);
    }
  }

  private backTwice() {
    this.navCtrl.pop().then(() => this.navCtrl.pop());
  }

  back() {
    this.navCtrl.pop();
  }

}
