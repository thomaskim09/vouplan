import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Events, AlertController, Content, LoadingController } from 'ionic-angular';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { CommonService } from '../../providers/common/common.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { formatDistanceStrict, parseISO, format, isAfter } from 'date-fns';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  categoryId: string;
  currentUser: any;
  tableNotifications: any = [];
  reservationNotifications: any = [];
  voucherNotifications: any = [];

  // Refresher
  refresher: any;

  // Infinite scroll
  needInfiniteScroll: boolean = true;
  pageNum: number = 1;
  pageSize: number = 5;
  @ViewChild(Content) content: Content;

  // JS controller
  isReservationFilter: boolean = true;
  isTicketFilter: boolean = true;

  // HTML controller
  tableLoadEmpty: boolean = false;
  reservationLoadEmpty: boolean = false;
  voucherLoadEmpty: boolean = false;

  // Controller
  timer: any;
  disableToggle: boolean = false;
  loader: any;
  loader2: any;
  needSpinner: boolean = false;
  firstEnter: boolean = true;

  constructor(
    public navParams: NavParams,
    public events: Events,
    public authenticationService: AuthenticationService,
    public notificationService: NotificationService,
    public restaurantService: RestaurantService,
    public alertCtrl: AlertController,
    public commonService: CommonService,
    public loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.categoryId = this.navParams.get('categoryId');
  }

  ionViewDidEnter() {
    if (this.firstEnter) {
      this.firstEnter = false;
      this.timer = setTimeout(() => {
        this.currentUser = this.authenticationService.currentUserValue;
        this.setUpNotifications();
      }, 500);
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  ngAfterViewInit() {
    this.listenToScrollEnd();
  }

  private setUpNotifications(refresh?) {
    if (refresh) { this.events.publish('Interacted', { categoryId: this.categoryId }); }
    this.runNotification(refresh);
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.pageNum = 1;
    this.needInfiniteScroll = true;
    this.setUpNotifications(true);
  }

  toggleReservation(ev) {
    this.isReservationFilter = ev.value;
    this.reservationNotifications = [];
    this.disableToggle = true;
    this.pageNum = 1;
    this.needInfiniteScroll = true;
    this.runNotification();
  }

  toggleTicket(ev) {
    this.isTicketFilter = ev.value;
    this.voucherNotifications = [];
    this.disableToggle = true;
    this.pageNum = 1;
    this.needInfiniteScroll = true;
    this.runNotification();
  }

  private listenToScrollEnd() {
    this.content.ionScrollEnd.pipe(untilDestroyed(this)).subscribe(($event: any) => {
      const dimensions = this.content.getContentDimensions();
      const scrollTop = this.content.scrollTop;
      const contentHeight = dimensions.contentHeight;
      const scrollHeight = dimensions.scrollHeight;
      if ((scrollTop + contentHeight + 100) > scrollHeight && this.needInfiniteScroll) {
        this.runNotification();
      }
    });
  }

  private runNotification(refresh?) {
    switch (this.categoryId) {
      case 'T': {
        return this.notificationService.getTempNotification(this.currentUser.restaurantId, this.pageSize, this.pageNum, refresh).pipe(untilDestroyed(this)).subscribe(val => {
          this.process('tableNotifications', val, 'T', refresh);
        }, error => this.handleError());
      }
      case 'R': {
        return this.notificationService.getReservationNotification(this.currentUser.restaurantId, this.isReservationFilter, this.pageSize, this.pageNum, refresh).pipe(untilDestroyed(this)).subscribe(val => {
          this.process('reservationNotifications', val, 'R', refresh);
        }, error => this.handleError());
      }
      case 'V': {
        return this.notificationService.getTicketNotifications(this.currentUser.restaurantId, this.isTicketFilter, this.pageSize, this.pageNum, refresh).pipe(untilDestroyed(this)).subscribe(val => {
          this.process('voucherNotifications', val, 'V', refresh);
        }, error => this.handleError());
      }
    }
  }

  private handleError() {
    this.commonService.presentToast('Server not responding');
    if (this.refresher) { this.refresher.complete(); }
  }

  private process(listName, val, type, refresh?) {
    this.disableToggle = false;
    // Reset list on refresh
    if (refresh) {
      if (this.refresher) { this.refresher.complete(); }
      if (this.pageNum === 1) { return this.pageNum++; } // To take the second data
      this.pageNum = 1;
      this[listName] = [];
    }

    // Check if list is empty
    const isEmpty = (this[listName].length === 0 && val.length === 0);
    switch (type) {
      case 'T': this.tableLoadEmpty = isEmpty; break;
      case 'R': this.reservationLoadEmpty = isEmpty; break;
      case 'V': this.voucherLoadEmpty = isEmpty; break;
    }

    // Process list differently
    switch (type) {
      case 'T': val = this.processTempNotification(val); break;
      case 'R': val = this.processReservationNotification(val); break;
      case 'V': val = this.processTicketNotification(val); break;
    }

    // Combining list together
    this[listName] = [...this[listName], ...val];

    // Trigger DOM update
    this.commonService.presentToast('');

    // Check if list finished
    if (val.length < this.pageSize) {
      this.pageNum = 1;
      this.needInfiniteScroll = false;
    } else {
      this.pageNum++;
      this.needInfiniteScroll = true;
    }
  }

  private processTempNotification(val) {
    return val.map(val2 => ({
      title: val2.title,
      body: val2.body,
      reason: val2.content ? val2.content.reason : undefined,
      bgColor: this.getBgColor(val2.title, false),
      char: this.getChar(val2.title),
      time: this.getTime(val2.createdTime),
    }));
  }

  private processReservationNotification(val) {
    return val.map(val2 => {
      let isGrey = false;
      const re = val2.content.reservationDetails;
      const status = val2.content.status;
      if (status === 'CT' || status === 'CC' || status === 'CL' || status === 'RJ') {
        isGrey = true;
      } else if (isAfter(new Date(), parseISO(re.dateTime))) {
        isGrey = true;
      }
      return {
        _id: val2._id,
        title: val2.title,
        body: val2.body,
        content: val2.content,
        bgColor: this.getBgColor(val2.title, isGrey),
        char: this.getChar(val2.title),
        time: this.getTime(val2.createdTime),
        isGrey: isGrey
      };
    });
  }

  private processTicketNotification(val) {
    return val.map(val2 => {
      const isGrey = (val2.status === 'PC' || val2.status === 'HV');
      return {
        _id: val2._id,
        title: val2.title,
        body: val2.body,
        bgColor: this.getBgColor(val2.title, isGrey),
        char: this.getChar(val2.title),
        time: this.getTime(val2.createdTime),
        isGrey: isGrey
      };
    });
  }

  private getBgColor(title, isGrey) {
    return this.commonService.getBgColor(title, isGrey);
  }

  private getChar(title) {
    return (title.charAt(0)).toUpperCase();
  }

  private getTime(time) {
    return this.setUpLocale(formatDistanceStrict(parseISO(time), new Date()));
  }

  private setUpLocale(time: string) {
    const timeString = time.split(' ');
    let result = '';
    timeString.map(val => result += (+val === +val) ? val : timeFormat(val) + ' ');
    function timeFormat(word) {
      switch (word) {
        case 'seconds': case 'second': return 's';
        case 'minutes': case 'minute': return 'm';
        case 'hours': case 'hour': return 'h';
        case 'days': case 'day': return 'd';
        case 'months': case 'month': return 'M';
        case 'years': case 'year': return 'Y';
        default: return '';
      }
    }
    return result;
  }

  private rejectReservationStatus(notificationId, reason) {
    this.changeReservationStatus(notificationId, 'RJ', 'Reservation rejected', reason);
  }

  private changeReservationStatus(notificationId, status, message, reason?) {
    this.presentReplyLoading();
    this.restaurantService.checkReservation(notificationId, status).pipe(untilDestroyed(this)).subscribe(val => {
      // Retrieve notification reservation before accepting
      this.notificationService.getReservationNotificationDetails(notificationId).pipe(untilDestroyed(this)).subscribe(val2 => {
        const object = {
          status: status,
          userId: val2.senderId,
          adminId: val2.receiverId,
          restaurantId: this.currentUser.restaurantId,
          restaurantName: this.currentUser.restaurantName,
          content: val2.content,
          reason: reason
        };
        // Send to change notification and reservation status
        this.restaurantService.replyReservation(notificationId, object).pipe(untilDestroyed(this)).subscribe(val3 => {
          this.loader2.dismiss();
          this.setToCurrentList(notificationId, status);
          this.commonService.presentToast(message);
        });
      });
    }, err => {
      this.loader2.dismiss();
      this.alertCtrl.create({
        title: 'Reservation status updated',
        subTitle: err.error.message,
        buttons: [
          {
            text: 'Got It'
          }]
      }).present();
    });
  }

  rejectReservation(item) {
    event.stopPropagation();
    // Ask restaurant reason rejecting reservation
    this.alertCtrl.create({
      title: `Reject reason`,
      subTitle: 'Please choose one from below ',
      inputs: [
        {
          type: 'radio',
          label: 'We are sorry, it has passed the reserve date time',
          value: 'We are sorry, it has passed the reserve date time'
        },
        {
          type: 'radio',
          label: 'Reserve slot just finished at that time',
          value: 'Reserve slot just finished at that time'
        },
        {
          type: 'radio',
          label: 'Shop is holding event at that time',
          value: 'Shop is holding event at that time'
        },
        {
          type: 'radio',
          label: 'Shop is not open at that time',
          value: 'Shop is not open at that time'
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
          text: 'Send',
          handler: data => {
            if (data === 'others') {
              this.alertReservationRejectOthers(item._id);
            } else if (data) {
              // Change reservation status to RJ
              this.rejectReservationStatus(item._id, data);
            } else {
              this.commonService.presentToast(`Please specify a reason :)`);
              return false;
            }
          }
        }]
    }).present();
  }

  private alertReservationRejectOthers(notificationId) {
    this.alertCtrl.create({
      title: 'Confirm to reject reservation?',
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
              // Change reservation status to RJ
              this.rejectReservationStatus(notificationId, data.reason);
            } else {
              this.commonService.presentToast(`Please specify a reason :)`);
              return false;
            }
          }
        }]
    }).present();
  }

  acceptReservation(item) {
    event.stopPropagation();
    if (isAfter(new Date(), parseISO(item.content.reservationDetails.dateTime))) {
      this.commonService.presentToast('It has passed the reserve date, please cancel it with response');
      return;
    }
    this.alertCtrl.create({
      title: 'Approve reservation?',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
        },
        {
          text: 'Approve',
          handler: data => {
            this.changeReservationStatus(item._id, 'AC', 'Reservation accepted');
          }
        }
      ]
    }).present();
  }

  viewTableReason(item) {
    if (item.reason) {
      this.alertCtrl.create({
        title: 'Customer: ',
        subTitle: item.reason,
      }).present();
    }
  }

  viewReservationRemark(notificationId) {
    if (this.needSpinner) {
      this.commonService.presentToast('Loading reservation details... Please wait :)');
      return;
    }
    this.needSpinner = true;
    this.notificationService.getReservationNotificationDetails(notificationId).pipe(untilDestroyed(this)).subscribe(val => {
      // Prepare list item
      const details = val.content.reservationDetails;
      const keyNames = Object.keys(details);
      let message = `<ul class='alertList'>`;
      keyNames.map(val2 => {
        const value = details[val2];
        switch (val2) {
          case 'extraRemark': {
            value.map(val3 => message += `<li>${val3}</li>`);
            break;
          }
          case 'contact':
          case 'name': {
            message += `<li>${value}</li>`;
            break;
          }
          case 'dateTime': {
            message += `<li>${format(parseISO(value), 'dd MMM yyyy')}</li>`;
            let timeString = format(parseISO(value), 'hh:mm a');
            if (timeString.charAt(0) === '0') {
              timeString = timeString.substr(1);
            }
            message += `<li>${timeString.toLowerCase()}</li>`;
            break;
          }
          case 'pax': {
            message += `<li>${value} People</li>`;
            break;
          }
        }
      });
      message += '</ul>';
      // Present information
      this.alertCtrl.create({
        title: 'Reservation Details',
        message: message,
      }).present();
      this.needSpinner = false;
    });
  }

  viewTicketDetails(ticketId) {
    if (this.needSpinner) {
      this.commonService.presentToast('Loading voucher details... Please wait :)');
      return;
    }
    this.needSpinner = true;
    this.notificationService.getTicketNotificationsDetails(ticketId).pipe(untilDestroyed(this)).subscribe(val => {
      // Prepare list item
      let message = `<ul class='alertList'>`;
      let counter = 0;
      const details = val[0];
      for (const key in details) {
        if (!details.hasOwnProperty(key)) { continue; }
        const obj = details[key];
        if (obj) {
          if (counter === 0) {
            counter++;
            continue;
          } else if (counter === 3) {
            message += `<li>${obj} Unit</li>`;
          } else if (counter === 5) {
            message += `<li>${obj} Claimed</li>`;
          } else {
            message += `<li>${obj}</li>`;
          }
        }
        counter++;
      }
      message += '</ul>';
      // Present information
      this.alertCtrl.create({
        title: 'Voucher Details',
        message: message,
      }).present();
      this.needSpinner = false;
    });
  }

  private setToCurrentList(notificationId, status) {
    // Change current list status to display reservation status
    const result = this.reservationNotifications.find(value => value._id === notificationId);
    result['content']['status'] = status;
    result['isGrey'] = (status === 'CT' || status === 'CL' || status === 'RJ');
    if (status === 'RJ') {
      result['bgColor'] = this.commonService.getBgColor('', result['isGrey']);
    }
  }

  private presentReplyLoading() {
    this.loader2 = this.loadingCtrl.create({
      content: 'Replying reservation...',
    });
    this.loader2.present();
  }

}
