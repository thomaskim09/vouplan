import { Component, SecurityContext } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-order-response',
  templateUrl: 'order-response.html',
})
export class OrderResponsePage {

  responseInput: string;
  type: string = '+';
  amountInput: any;

  subTotal: any;
  descriptionPrice: any = '0.00';
  hasTakeAwayFee: any;
  packagingFee: any;
  hasTax: any;
  taxPercentage: any;
  taxCharge: any;
  hasServiceCharge: any;
  serviceChargePercentage: any;
  serviceCharge: any;
  rounding: any = {};
  totalPrice: any;

  // Controller
  needSpinner: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public sanitizer: DomSanitizer,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    this.subTotal = this.navParams.get('subTotal');
    this.hasTax = this.navParams.get('hasTax');
    this.taxPercentage = this.navParams.get('taxPercentage');
    this.hasServiceCharge = this.navParams.get('hasServiceCharge');
    this.serviceChargePercentage = this.navParams.get('serviceChargePercentage');
    this.hasTakeAwayFee = this.navParams.get('hasTakeAwayFee');
    this.packagingFee = this.navParams.get('packagingFee');
    this.rounding['type'] = this.navParams.get('roundingType');
    this.rounding['value'] = this.navParams.get('roundingValue');
    this.setUpDefaultResult();
  }

  private setUpDefaultResult() {
    // Calculate taxCharge
    let taxCharge;
    if (this.hasTax && this.packagingFee) {
      taxCharge = (this.subTotal + this.packagingFee) * (this.taxPercentage / 100);
    } else {
      taxCharge = this.subTotal * (this.taxPercentage / 100);
    }
    // Calculate serviceCharge
    let serviceCharge;
    if (this.hasServiceCharge && this.packagingFee) {
      serviceCharge = (this.subTotal + this.packagingFee) * (this.serviceChargePercentage / 100);
    } else {
      serviceCharge = this.subTotal * (this.serviceChargePercentage / 100);
    }
    // Calculate packaging fee
    if (this.hasTakeAwayFee && this.packagingFee) {
      this.packagingFee = this.packagingFee.toFixed(2);
    }

    // Calculate rounding and totalPrice
    let totalPrice = this.subTotal + this.floatZero(taxCharge) + this.floatZero(serviceCharge) + this.floatZero(this.packagingFee);
    if (this.rounding.value === '0') {
      totalPrice = totalPrice;
    } else if (this.rounding.type === '+') {
      totalPrice += this.rounding.value;
    } else if (this.rounding.type === '-') {
      totalPrice -= this.rounding.value;
    }
    // Display to HTML
    this.taxCharge = taxCharge.toFixed(2);
    this.serviceCharge = serviceCharge.toFixed(2);
    this.subTotal = this.subTotal.toFixed(2);
    this.totalPrice = totalPrice.toFixed(2);
  }

  toggleType() {
    this.type = (this.type === '+') ? '-' : '+';
    this.calculateResult();
  }

  amountChanged() {
    this.amountInput = this.amountInput || '0';
    this.calculateResult();
  }

  private calculateResult() {
    // Calculate newSubTotal
    let newSubTotal = 0;
    if (this.type === '+') {
      newSubTotal = parseFloat(this.subTotal) + this.floatZero(this.amountInput);
    } else {
      newSubTotal = parseFloat(this.subTotal) - this.floatZero(this.amountInput);
    }
    this.descriptionPrice = this.amountInput ? parseFloat(this.amountInput).toFixed(2) : '0.00';
    // Calculate taxCharge
    let taxCharge;
    if (this.hasTax && this.packagingFee) {
      taxCharge = (newSubTotal + parseFloat(this.packagingFee)) * (this.taxPercentage / 100);
    } else {
      taxCharge = newSubTotal * (this.taxPercentage / 100);
    }
    // Calculate serviceCharge
    let serviceCharge;
    if (this.hasServiceCharge && this.packagingFee) {
      serviceCharge = (newSubTotal + parseFloat(this.packagingFee)) * (this.serviceChargePercentage / 100);
    } else {
      serviceCharge = newSubTotal * (this.serviceChargePercentage / 100);
    }
    // Calculate rounding and totalPrice
    let totalPrice = newSubTotal + this.floatZero(taxCharge) + this.floatZero(serviceCharge) + this.floatZero(this.packagingFee);
    const rounding = this.getRoundingAdjustment(totalPrice.toFixed(2));
    if (rounding.value === '0') {
      totalPrice = totalPrice;
    } else if (rounding.type === '+') {
      totalPrice += parseFloat(rounding.value);
    } else if (rounding.type === '-') {
      totalPrice -= parseFloat(rounding.value);
    }
    // Display to HTML
    this.taxCharge = taxCharge.toFixed(2);
    this.serviceCharge = serviceCharge.toFixed(2);
    this.rounding = rounding;
    this.totalPrice = totalPrice.toFixed(2);
  }

  sendChanges() {
    this.alertCtrl.create({
      title: 'Confirm send edit response?',
      subTitle: 'Customers will need to decide whether to accept the edited response.',
      buttons: [
        {
          text: 'back',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: data => {
            this.needSpinner = true;
            const response = this.sanitizer.sanitize(SecurityContext.HTML, this.responseInput);
            if (parseFloat(this.totalPrice) > 0) {
              this.viewCtrl.dismiss({
                description: response,
                amountType: this.type,
                amountPrice: this.floatZero(this.amountInput),
                subTotal: this.floatZero(this.subTotal),
                packagingFee: this.floatZero(this.packagingFee, true),
                taxCharge: this.floatZero(this.taxCharge),
                serviceCharge: this.floatZero(this.serviceCharge),
                roundingType: this.rounding.type,
                roundingAdjustment: this.floatZero(this.rounding.value),
                totalPrice: this.floatZero(this.totalPrice),
              });
            }
            this.needSpinner = false;
          }
        }
      ]
    }).present();
  }

  getPrice(price) {
    return price ? parseFloat(price).toFixed(2) : 0.00;
  }

  checkValid() {
    if (this.responseInput && this.amountInput &&
      this.amountInput !== '0' && this.amountInput !== 0 &&
      parseFloat(this.totalPrice) > 0 &&
      /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/g.test(this.amountInput)) {
      return true;
    } else {
      return false;
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  private getRoundingAdjustment(price) {
    const last = price.slice(-1);
    switch (last) {
      case '1': return { value: '0.01', type: '-' };
      case '2': return { value: '0.02', type: '-' };
      case '3': return { value: '0.02', type: '+' };
      case '4': return { value: '0.01', type: '+' };
      case '5': return { value: '0', type: '' };
      case '6': return { value: '0.01', type: '-' };
      case '7': return { value: '0.02', type: '-' };
      case '8': return { value: '0.02', type: '+' };
      case '9': return { value: '0.01', type: '+' };
      case '0': return { value: '0', type: '' };
    }
  }

  private floatZero(value, needEmpty?) {
    if (value) {
      return parseFloat(value);
    } else {
      return needEmpty ? undefined : 0.00;
    }
  }
}
