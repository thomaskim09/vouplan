import { Component } from '@angular/core';
import { NavController, IonicPage, Events, AlertController, Platform } from 'ionic-angular';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { OrderService } from '../../providers/order/order.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Vibration } from '@ionic-native/vibration';
import { CommonService } from './../../providers/common/common.service';
import { DataService } from '../../providers/data-service/data-service';
import { App } from 'ionic-angular/components/app/app';
import { OrderDetailPage } from './../order-detail/order-detail';
import { FeedbackPage } from './../feedback/feedback';
import { FeedbackService } from './../../providers/feedback/feedback.service';
import { SoundService } from './../../providers/common/sound.service';
import { Storage } from '@ionic/storage';
import lo_isEmpty from 'lodash/isEmpty';
import { ToggleService } from './../../providers/toggle/toggle.service';
import { parseISO, subDays, isWithinInterval, formatDistanceStrict, addDays, isBefore } from 'date-fns';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // HTML properties
  homeTabBadge: number = 0;
  orderTabBadge: number = 0;
  orderStatusCounter: number = 0;
  feedbackTabBadge: number = 0;

  // JS properties
  adminId: string;
  fingerprint: string;
  restaurantId: string;
  hasMenu: boolean;
  isFullFeature: boolean;

  // Cache key
  voucherKey: string = 'Vouplan_ActiveVoucher';

  pages: any = [
    { pageName: 'HomeDetailPage', icon: 'custom-home-outline-thin' },
    { pageName: 'OrderPage', icon: 'custom-menu-outline' },
    { pageName: 'FeedbackPage', icon: 'custom-comment-outline' }
  ];

  // Controller
  timer: any;
  isWaited: boolean = false;

  constructor(
    public navCtrl: NavController,
    public authenticationService: AuthenticationService,
    public platform: Platform,
    public events: Events,
    public orderService: OrderService,
    public feedbackService: FeedbackService,
    public alertCtrl: AlertController,
    public vibration: Vibration,
    public commonService: CommonService,
    public dataService: DataService,
    public app: App,
    public soundService: SoundService,
    public storage: Storage,
    public toggleService: ToggleService) { }

  ngOnInit() {
    this.listenNotLogin();
    this.timer = setTimeout(() => {
      if (this.authenticationService.checkLoginStatus()) {
        const currentUser = this.authenticationService.currentUserValue;
        this.adminId = currentUser._id;
        this.fingerprint = currentUser.fingerprint;
        this.hasMenu = currentUser.hasMenu;
        this.isFullFeature = currentUser.feature === '3';
        this.restaurantId = currentUser.restaurantId;
        this.isWaited = true;
        this.checkAdminStatus();
        this.checkFeedbackCount();
        this.checkVoucherActive();
        if (this.isFullFeature && this.platform.is('cordova')) {
          this.checkOrderCount(this.hasMenu);
          this.listenOrderNotification();
        }
        this.listenOrderFeedbackRefresh();
        this.listenToHomeNotification();
        this.listenToFeedbackNotification();
      } else {
        this.navCtrl.setRoot('LoginPage');
      }
    }, 1000);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    this.events.unsubscribe('notLoggedIn');
    this.events.unsubscribe('Noti');
    this.events.unsubscribe('Order');
    this.events.unsubscribe('Feedback');
    clearTimeout(this.timer);
  }

  private listenNotLogin() {
    this.events.subscribe('notLoggedIn', () => {
      this.authenticationService.logout();
      this.navCtrl.setRoot('LoginPage');
    });
  }

  private listenOrderFeedbackRefresh() {
    this.dataService.currentRefreshContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (val.refreshOrder) {
          this.readOrder();
        } else if (val.refreshFeedback) {
          this.readFeedback();
        }
      }
    });
  }

  private listenOrderNotification() {
    this.events.subscribe('Order', val => {
      if (val.type === 'O') {
        this.soundService.playSound();
        this.vibration.vibrate([100, 100, 100]);
        this.orderTabBadge += 1;
        this.commonService.presentToast('');
      } else if (val.type === 'ON') {
        this.soundService.playSound();
        this.vibration.vibrate([100, 100, 100]);
        this.orderStatusCounter += 1;
        this.commonService.presentToast('');
      }
    });
  }

  private listenToHomeNotification() {
    this.events.subscribe('Noti', () => {
      const nav2 = this.app.getActiveNavs()[0];
      const page = nav2.getActive().instance;
      if (page instanceof OrderDetailPage || page instanceof FeedbackPage) {
        this.homeTabBadge += 1;
        this.commonService.presentToast('');
      }
    });
  }

  private listenToFeedbackNotification() {
    this.events.subscribe('Feedback', () => {
      this.soundService.playSound2();
      this.vibration.vibrate([100, 100, 100]);
      this.feedbackTabBadge += 1;
      this.commonService.presentToast('');
    });
  }

  private checkAdminStatus() {
    this.authenticationService.checkAdminStatus(this.adminId).pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        return;
      }
      this.authenticationService.logout();
      this.navCtrl.setRoot('LoginPage');
    });
  }

  private checkOrderCount(hasMenu) {
    if (!hasMenu) {
      return;
    }
    this.orderService.getOrderCount(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
      if (this.orderTabBadge !== 0) {
        this.orderTabBadge = val[0].count;
        this.soundService.playSound();
        this.vibration.vibrate([100, 100, 100]);
        this.commonService.presentToast('');
      }
    });
  }

  private checkFeedbackCount() {
    this.feedbackService.getFeedbackCount(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
      if (this.feedbackTabBadge !== 0) {
        this.feedbackTabBadge = val[0].count;
        this.soundService.playSound2();
        this.vibration.vibrate([100, 100, 100]);
        this.commonService.presentToast('');
      }
    });
  }

  private checkVoucherActive() {
    this.storage.get(this.voucherKey).then(val => {
      if (val && val.lastNoticeTime) {
        const threeDayAfter = addDays(val.lastNoticeTime, 1);
        if (isBefore(new Date(), threeDayAfter)) {
          return;
        }
      }
      this.toggleService.getVoucherList(this.restaurantId, false).pipe(untilDestroyed(this)).subscribe(val2 => {
        let message;
        const statusList = [];
        if (!val2 || !val2.length) {
          message = 'You have no active voucher selling now, please create new voucher';
          statusList.push(true);
        } else {
          message = `<ul class='alertList'>`;
          val2.map(val3 => {
            const de = val3.details;
            const date = parseISO(de.voucherRules.validUntil);
            const threeDayBefore = subDays(date, 3);
            if (isWithinInterval(new Date(), { start: threeDayBefore, end: date })) {
              message += `<li>${de.voucherName} will expire in <b>${formatDistanceStrict(date, new Date())}</b></li>`;
              statusList.push(true);
            } else {
              statusList.push(false);
            }
          });
          message += '</ul>';
        }
        if (statusList.some(val3 => val3)) {
          this.alertCtrl.create({
            title: 'Reminder',
            subTitle: message,
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'Got It',
                handler: data => {
                  this.storage.set(this.voucherKey, { lastNoticeTime: new Date() });
                }
              }]
          }).present();
        }
      });
    });
  }

  removeHomeBadge() {
    if (this.homeTabBadge !== 0) {
      this.homeTabBadge = 0;
    }
  }

  readOrder() {
    if (this.orderTabBadge !== 0) {
      this.orderService.readOrder(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
        this.orderTabBadge = 0;
      });
    }
    this.orderStatusCounter = 0;
  }

  readFeedback() {
    if (this.feedbackTabBadge !== 0) {
      this.feedbackService.readFeedback(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
        this.feedbackTabBadge = 0;
      });
    }
  }
}
