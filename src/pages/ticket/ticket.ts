import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { CommonService } from '../../providers/common/common.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { format, parseISO, endOfDay, isAfter, isSameDay } from 'date-fns';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {

  input: any;
  userToken: any;
  currentUser: any;
  restaurantId: string;
  ticketCode: any;
  restaurantName: string;
  quantity: number = 1;
  quantityLeft: number;

  // HTML properties
  title: string = 'No Record';
  mainText: string;
  quantityLeftText: string;
  voucherType: string;
  voucherTypeText: string;
  buttonText: string;
  notFoundTitle: string = 'No record<br>found<br>for your restaurant';

  // HTML controller
  isVoucher: boolean;
  needSpinner: boolean = false;
  canClaim: boolean = true;

  // Pass to components
  ticketSet: any;
  ticketCash: any;
  ticketQuantity: any;
  ticketMonthly: any;
  ticketPurchase: any;
  ticketReservation: any;

  // Tools
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restaurantService: RestaurantService,
    public alertCtrl: AlertController,
    public commonService: CommonService,
    public events: Events,
    public authenticationService: AuthenticationService,
    public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.ticketCode = this.navParams.get('ticketCode');
    this.restaurantName = this.navParams.get('restaurantName');
    this.currentUser = this.authenticationService.currentUserValue;
    this.restaurantId = this.currentUser.restaurantId;
    this.setUpTicketDetails();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  private setUpTicketDetails() {
    this.presentLoading('Loading ticket...');
    this.restaurantService.getTicketDetails(this.ticketCode, this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
      this.loader.dismiss();
      if (!val || val.length === 0) {
        return;
      }
      this.input = val;
      this.userToken = val.userToken;
      this.title = this.getTitle();
      this.mainText = this.getMainText();
      this.buttonText = this.getButtonText();
      this.isVoucher = this.checkIsVoucher();

      if (val.voucherDetails) {
        const vo = val.voucherDetails;
        const pu = val.purchaseDetails;
        this.voucherType = vo.voucherType;
        this.voucherTypeText = this.getVoucherTypeText();
        this.quantityLeftText = this.getQuantityLeft();
        this.canClaim = this.checkCanClaim();
        // Purchase Content
        this.ticketPurchase = {
          purchaseTime: this.getDate(pu.purchaseTime),
          paymentMethod: pu.paymentMethod,
          pricePerUnit: pu.pricePerUnit,
          quantity: pu.quantity,
        };
        switch (vo.voucherType) {
          case 'SV':
            this.ticketSet = {
              setDetails: vo.setDetails,
            };
            break;
          case 'CV':
            this.ticketCash = {
              basePrice: vo.basePrice,
              minimumSpend: vo.minimumSpend,
            };
            break;
          case 'QV':
            this.ticketQuantity = {
              quantityDetails: vo.quantityDetails,
            };
            break;
          case 'MV':
            this.ticketMonthly = {
              limitPerDay: vo.limitPerDay,
              monthlyExpiryDate: this.getDate(pu.monthlyExpiryDate),
              monthlyDetails: vo.monthlyDetails,
            };
            break;
        }
      } else if (val.reservationDetails) {
        const re = val.reservationDetails;
        this.ticketReservation = {
          restaurantName: this.restaurantName,
          name: re.name,
          contact: re.contact,
          pax: re.pax,
          dateTime: re.dateTime,
          remark: re.remark,
          notificationId: re.notificationId
        };
      }
    }, err => this.loader.dismiss());
  }

  private getTitle() {
    if (this.input) {
      if (this.input.voucherId) {
        return 'Voucher';
      } else if (this.input.reservationDetails) {
        return 'Reservation';
      }
    }
  }

  private getMainText() {
    const val = this.input;
    if (val.voucherId) {
      return val.voucherDetails.voucherName;
    } else if (val.reservationDetails) {
      const de = val.reservationDetails;
      let timeString = format(parseISO(de.dateTime), 'hh:mm a');
      if (timeString.charAt(0) === '0') {
        timeString = timeString.substr(1);
      }
      timeString = timeString.toLowerCase();
      return `${de.name} - ${de.pax} people at ${timeString}`;
    }
  }

  private getButtonText() {
    if (this.input) {
      if (this.input.voucherId) {
        return 'Confirm Voucher';
      } else if (this.input.reservationDetails) {
        return 'Confirm Arrival';
      }
    } else {
      return 'No Record';
    }
  }

  private checkIsVoucher() {
    if (this.input.voucherId) {
      return true;
    } else if (this.input.reservationDetails) {
      return false;
    }
  }

  private getQuantityLeft() {
    const vo = this.input.voucherDetails;
    const voucherType = vo.voucherType;
    if (voucherType === 'MV') {
      const claimList = this.input.claimTime;
      if (claimList) {
        const last = claimList[claimList.length - 1];
        let total = 0;
        if (isSameDay(parseISO(last.time), new Date())) {
          claimList.map(val => {
            if (isSameDay(parseISO(last.time), parseISO(val.time))) {
              total += val.quantity;
            }
          });
        }
        this.quantityLeft = vo.limitPerDay - total;
        return `${this.quantityLeft} units`;
      }
      this.quantityLeft = vo.limitPerDay;
      return `${this.quantityLeft} units`;
    }
    const quantityUnit = vo.quantityUnit;
    const purchased = this.input.purchaseDetails.quantity;
    const claimed = this.input.claimed;
    if (quantityUnit) {
      this.quantityLeft = quantityUnit * purchased - claimed;
      return `${quantityUnit} x ${purchased} = ${quantityUnit * purchased} units`;
    } else {
      this.quantityLeft = purchased - claimed;
      return `${this.quantityLeft} units`;
    }
  }

  private getVoucherTypeText() {
    switch (this.input.voucherDetails.voucherType) {
      case 'QV': return 'Quantity Voucher';
      case 'CV': return 'Cash Voucher';
      case 'SV': return 'Set Voucher';
      case 'MV': return 'Monthly Voucher';
    }
  }

  private checkCanClaim() {
    if (this.input.voucherDetails.voucherType !== 'MV') {
      return true;
    } else {
      const claimList = this.input.claimTime;
      if (claimList) {
        const last = claimList[claimList.length - 1];
        const lastTime = parseISO(last.time);
        if (isAfter(new Date(), endOfDay(lastTime))) {
          return true;
        }
        let total = 0;
        if (isSameDay(lastTime, new Date())) {
          claimList.map(val => {
            if (isSameDay(lastTime, parseISO(val.time))) {
              total += val.quantity;
            }
          });
        }
        if (this.input.voucherDetails.limitPerDay - total > 0) {
          return true;
        }
        return false;
      }
      return true;
    }
  }

  getDate(time) {
    return format(parseISO(time), 'dd-MM-yyyy (hh:mm a)');
  }

  subtractQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addQuantity() {
    if (this.quantity < this.quantityLeft) {
      this.quantity++;
    }
  }

  confirm() {
    if (this.input.voucherId) {
      this.presentAlert('Confirm claim?', `Will claim <b>${this.quantity} units</b> of voucher`, 'Claim', 'voucher');
    } else {
      this.presentAlert('Confirm arrival?', '', 'Confirm', 'reservation');
    }
  }

  private presentAlert(title, subtitle, buttonText, type) {
    this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
        },
        {
          text: buttonText,
          handler: data => {
            this.handleButton(type);
          }
        }
      ]
    }).present();
  }

  private handleError(text?) {
    this.loader.dismiss();
    this.needSpinner = false;
    this.alertVoucher(text);
  }

  private handleButton(type) {
    this.needSpinner = true;
    if (type === 'voucher') {
      if (!this.canClaim) {
        this.commonService.presentToast('Ticket has reached everyday max claim limit, please claim again tomorrow');
        return;
      }
      if (this.voucherType !== 'MV') {
        this.restaurantService.checkTicketVoucher(this.input._id).pipe(untilDestroyed(this)).subscribe(val => {
          this.claimVoucher();
        }, err => this.handleError(err.error.error));
        return;
      }
      this.restaurantService.checkMonthly(this.input._id, this.quantity).pipe(untilDestroyed(this)).subscribe(val => {
        this.claimVoucher();
      }, err => this.handleError(err.error.error));
    } else {
      const object = {
        quantity: 1,
        notificationId: this.ticketReservation.notificationId
      };
      this.restaurantService.claimTicketReservation(this.ticketCode, this.restaurantId, object).pipe(untilDestroyed(this)).subscribe(val => {
        this.needSpinner = false;
        this.commonService.presentToast('Arrival confirmed');
        this.navCtrl.pop();
      });
    }
  }

  private claimVoucher() {
    const object = {
      ticketId: this.input._id,
      restaurantId: this.restaurantId,
      quantity: this.quantity,
      quantityUnit: this.input.voucherDetails.quantityUnit,
      claimed: this.input.claimed,
      quantityPurchased: this.input.purchaseDetails.quantity,
      voucherType: this.voucherType
    };
    this.presentLoading('Claiming ticket...');
    this.restaurantService.claimTicketVoucher(this.ticketCode, object).pipe(untilDestroyed(this)).subscribe(val2 => {
      this.loader.dismiss();
      this.needSpinner = false;
      this.commonService.presentToast(`${this.quantity} units of voucher claimed`);
      this.navCtrl.pop();
    }, err => this.handleError());
  }

  private alertVoucher(message) {
    if (!message) {
      return;
    }
    this.alertCtrl.create({
      title: 'Our apologies :(',
      subTitle: message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Got It',
          handler: data => {
            this.navCtrl.pop();
          }
        }
      ]
    }).present();
  }

  private presentLoading(text) {
    this.loader = this.loadingCtrl.create({ content: text, });
    this.loader.present();
  }

  back() {
    this.navCtrl.pop();
  }
}
