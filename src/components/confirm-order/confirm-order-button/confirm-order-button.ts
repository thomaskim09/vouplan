import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, AlertController } from 'ionic-angular';
import { AuthenticationService } from '../../../providers/authentication/authentication.service';
import { OrderService } from '../../../providers/order/order.service';
import { CommonService } from '../../../providers/common/common.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'confirm-order-button',
  templateUrl: 'confirm-order-button.html'
})
export class ConfirmOrderButtonComponent {

  @Input('menu') menu: any;
  @Input('orderContent') orderContent: any;

  // Output to orderDetails
  @Output() response = new EventEmitter<any>();

  // Output to orderCall
  @Output() toggle = new EventEmitter<boolean>();

  // Cleaner code
  orderCon: any;
  status: any;
  bill: any;
  order: any;

  // HTML properties
  takeAwayCounter: number = 0;
  subTotal: any;
  taxCharge: any;
  serviceCharge: any;
  packagingFee: any;
  rounding: any = {};
  totalPrice: any;

  // JS Properties
  restaurantId: string;
  restaurantName: string;

  // Controller
  itemOpened: boolean = false;
  needSpinner: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public authenticationService: AuthenticationService,
    public orderService: OrderService,
    public alertCtrl: AlertController,
    public commonService: CommonService) { }

  ngOnChanges() {
    if (this.orderContent && this.menu) {
      const currentUser = this.authenticationService.currentUserValue;
      this.restaurantName = currentUser.restaurantName;
      this.restaurantId = currentUser.restaurantId;
      this.orderCon = this.orderContent.itemContent;
      this.status = this.orderCon.status;
      this.bill = this.orderCon.billDetails;
      this.order = this.orderCon.orderDetails;
      this.getTakeAwayCounter();
      this.setUpDefaultConfirmDetail();
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private getTakeAwayCounter() {
    this.order.map(val => {
      if (val.needTakeAway || !this.bill.isDineIn || this.bill.needTakeAway) {
        this.takeAwayCounter += val.quantity;
      }
    });
  }

  private setUpDefaultConfirmDetail() {
    this.subTotal = this.bill.subTotal.toFixed(2);
    this.taxCharge = this.bill.taxCharge ? this.bill.taxCharge.toFixed(2) : undefined;
    this.serviceCharge = this.bill.serviceCharge ? this.bill.serviceCharge.toFixed(2) : undefined;
    this.packagingFee = this.bill.packagingFee ? this.bill.packagingFee.toFixed(2) : undefined;
    this.rounding['type'] = this.bill.roundingType;
    this.rounding['value'] = this.bill.roundingAdjustment;
    const res = this.orderCon.responseDetails;
    this.totalPrice = res ? res.totalPrice.toFixed(2) : this.bill.totalPrice.toFixed(2);
  }

  toggleList() {
    this.itemOpened = !this.itemOpened;
    this.updateCallToggle(this.status);
  }

  private updateCallToggle(status) {
    if (this.menu.cd && this.menu.cd.hasNotifyService) {
      this.emitToggle({
        toggle: this.itemOpened,
        status: status
      });
    }
  }

  confirmOrder() {
    const tableNo = this.bill.tableNo;
    const username = this.bill.username;
    const isDineIn = this.bill.isDineIn;

    if (isDineIn) {
      if (this.status === 'CF' || this.status === 'AC') {
        const subTitle = `Has customers from table (${tableNo}) made their payment?`;
        this.alertForAction('Order paid?', 'CD', subTitle);
        return;
      } else {
        const subTitle = `Please confirm customer is at table (${tableNo}) or in restaurant before accepting the order`;
        this.alertForAction('Confirm customer?', 'CF', subTitle);
        return;
      }
    } else {
      if (this.status === 'CF' || this.status === 'AC') {
        const subTitle = `Has customers made their payment for their take aways?`;
        this.alertForAction('Confirm customer?', 'CD', subTitle);
        return;
      } else {
        const subTitle = `Customer (${username}) had selected to take-away, you could contact your customers any time.`;
        this.alertForAction('Confirm customer?', 'CF', subTitle);
        return;
      }
    }
  }

  cancelOrder() {
    // Ask restaurant why reject reservation
    this.alertCtrl.create({
      title: 'Confirm cancel order?',
      subTitle: 'Please reply customer with a reason :)',
      inputs: [
        {
          type: 'radio',
          label: 'Shop is not opened at this time',
          value: 'shop is not opened at this time'
        },
        {
          type: 'radio',
          label: 'Item ordered is not available',
          value: 'item ordered is not available'
        },
        {
          type: 'radio',
          label: 'No response for a long time',
          value: 'no response for a long time'
        },
        {
          type: 'radio',
          label: 'Others',
          value: 'others'
        }],
      buttons: [
        {
          text: 'Back',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: data => {
            if (data === 'others') {
              this.promptAlertCancelOrder();
            } else if (data) {
              this.changeStatus('CC', 'Order is cancelled', '', data);
            } else {
              this.commonService.presentToast(`Please specify a reason :)`);
              return false;
            }
          }
        }]
    }).present();
  }

  private promptAlertCancelOrder() {
    this.alertCtrl.create({
      title: 'Confirm cancel order?',
      subTitle: 'Please specify a reason :)',
      inputs: [
        {
          name: 'reason',
          placeholder: 'Reason',
          max: 50
        }],
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: data => {
            if (data.reason) {
              this.changeStatus('CC', 'Order is cancelled', '', data.reason);
            } else {
              this.commonService.presentToast(`Please specify a reason :)`);
              return false;
            }
          }
        }]
    }).present();
  }

  closeOrder() {
    this.alertForAction('Remove order?', 'OR');
  }

  presentResponse() {
    const modal = this.modalCtrl.create('OrderResponsePage', {
      subTotal: this.bill.subTotal,
      hasTax: this.menu.td.hasTax,
      taxPercentage: this.menu.td.taxPercentage,
      hasServiceCharge: this.menu.td.hasServiceCharge,
      serviceChargePercentage: this.menu.td.serviceChargePercentage,
      hasTakeAwayFee: this.menu.td.hasTakeAwayFee,
      packagingFee: this.bill.packagingFee,
      roundingType: this.bill.roundingType,
      roundingValue: this.bill.roundingAdjustment,
      totalPrice: this.bill.totalPrice
    });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        const content = {
          description: data.description,
          amountType: data.amountType,
          amountPrice: data.amountPrice,
          subTotal: data.subTotal,
          packagingFee: data.packagingFee,
          taxCharge: data.taxCharge,
          serviceCharge: data.serviceCharge,
          roundingType: data.roundingType,
          roundingAdjustment: data.roundingAdjustment,
          totalPrice: data.totalPrice,
          status: 'PA'
        };
        const info = {
          restaurantName: this.authenticationService.currentUserValue.restaurantName,
          userId: this.orderCon.userId,
          userToken: this.bill.userToken
        };
        this.orderService.checkOrderStatus(this.orderCon._id, 'PA').pipe(untilDestroyed(this)).subscribe(val => {
          this.orderService.sendOrderApproval(this.orderCon._id, content, info).pipe(untilDestroyed(this)).subscribe(val2 => {
            this.commonService.presentToast('Response send for approval');
            this.emitResponse(content);
            this.status = 'PA';
          });
        }, error => {
          this.errorAlert(error.error.message);
        });
      }
    });
  }

  private errorAlert(message) {
    this.alertCtrl.create({
      title: 'Order status is updated',
      subTitle: message,
      buttons: [
        {
          text: 'Got It'
        }]
    }).present();
  }

  getButtonStatusText(status) {
    if (status === 'CF' || status === 'AC') {
      return `Pay ${this.totalPrice}`;
    } else {
      return `RM ${this.totalPrice}`;
    }
  }

  getStatusText(status) {
    switch (status) {
      case 'CC': return 'Order Cancelled';
      case 'CD': return 'Payment Done';
      case 'CF': return 'Confirmed & Pending Payment';
      case 'OR': return 'Order Removed';
      case 'PA': return 'Wait For <br> Response';
      case 'RJ': return 'Response <br> Rejected';
      case 'UC': return 'Customer Cancelled';
    }
  }

  private alertForAction(title, status?, subTitle?) {
    this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: () => {
            switch (status) {
              case 'OR':
                this.changeStatus('OR', 'Order is closed and removed');
                break;
              case 'CF':
                this.updateCallToggle('CF');
                this.changeStatus('CF', `Order confirmed, Let's start making that order`);
                break;
              case 'CD':
                this.orderCon['menuSettings'] = this.menu;
                this.changeStatus('CD', 'Payment paid', this.orderCon);
                break;
            }
          }
        }
      ]
    }).present();
  }

  private changeStatus(status, text, orderContent?, reason?) {
    const object = {
      // OR, CD
      fingerprint: this.orderCon.fingerprint,
      restaurantId: this.restaurantId,
      receiverId: this.orderCon.userId,
      // CF, PA, CC
      restaurantName: this.restaurantName,
      userToken: this.bill.userToken,
      orderId: this.orderCon._id,
      status: status,
      content: orderContent,
      reason: reason
    };
    this.needSpinner = true;
    this.orderService.checkOrderStatus(object.orderId, object.status).pipe(untilDestroyed(this)).subscribe(val => {
      this.orderService.changeOrderStatus(object).pipe(untilDestroyed(this)).subscribe(val2 => {
        this.needSpinner = false;
        this.commonService.presentToast(text);
        this.status = status;
      });
    }, error => {
      this.needSpinner = false;
      this.errorAlert(error.error.message);
    });
  }

  private emitResponse(content) {
    this.response.emit(content);
  }

  private emitToggle(content) {
    this.toggle.emit(content);
  }

  getTotalPrice() {
    if (this.orderCon) {
      if (this.orderCon.responseDetails) {
        return `RM ${this.orderCon.responseDetails.totalPrice.toFixed(2)}`;
      } else {
        return `RM ${this.bill.totalPrice.toFixed(2)}`;
      }
    }
  }
}
