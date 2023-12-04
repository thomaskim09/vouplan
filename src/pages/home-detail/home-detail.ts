import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, Events, ModalController, Platform } from 'ionic-angular';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { NotificationService } from '../../providers/notification/notification.service';
import { SuperTabsComponent, SuperTabsController } from 'ionic2-super-tabs';
import { OrderService } from '../../providers/order/order.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonService } from '../../providers/common/common.service';
import { Vibration } from '@ionic-native/vibration';
import lo_remove from 'lodash/remove';
import { SoundService } from './../../providers/common/sound.service';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-home-detail',
  templateUrl: 'home-detail.html',
  providers: [BarcodeScanner]
})
export class HomeDetailPage {

  // SuperTabs
  @ViewChild(SuperTabsComponent) superTabs: SuperTabsComponent;
  tabBadge1: number;
  tabBadge2: number;
  tabBadge3: number;

  page: any = 'NotificationPage';
  initialPageInfo: any = [
    {
      categoryId: 'T',
      categoryName: 'Tables',
      needRefresh: false
    },
    {
      categoryId: 'R',
      categoryName: 'Reservations',
      needRefresh: false
    },
    {
      categoryId: 'V',
      categoryName: 'Vouchers',
      needRefresh: false
    }
  ];
  pageInfo: any;

  // Default properties
  restaurantName: string = 'Loading...';

  // JS properties
  currentUser: any;
  menuId: string;
  hasMenu: boolean;
  hasReservation: boolean;
  hasCallService: boolean;
  hasTableNoLock: boolean;
  isFullFeature: boolean;

  options: BarcodeScannerOptions;

  // Controller
  timer: any;

  // HTML controller
  hasNotifications: boolean = false;
  reservationStatusCounter: number = 0;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public authenticationService: AuthenticationService,
    public notificationService: NotificationService,
    public orderService: OrderService,
    public commonService: CommonService,
    public superTabsCtrl: SuperTabsController,
    public barcodeScanner: BarcodeScanner,
    public events: Events,
    public platform: Platform,
    public vibration: Vibration,
    public soundService: SoundService) { }

  ionViewDidLoad() {
    this.timer = setTimeout(() => {
      if (this.authenticationService.checkLoginStatus()) {
        this.currentUser = this.authenticationService.currentUserValue;
        this.restaurantName = this.currentUser.restaurantName;
        this.menuId = this.currentUser.menuId;
        this.hasMenu = this.currentUser.hasMenu;
        this.hasReservation = this.currentUser.hasReservation;
        this.setUpPageInfo();
      }
    }, 500);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    this.events.unsubscribe('Noti');
    this.events.unsubscribe('Common');
    this.events.unsubscribe('Interacted');
    clearTimeout(this.timer);
  }

  private setUpPageInfo() {
    if (this.menuId && this.hasMenu) {
      this.orderService.getMenuSettings(this.menuId).pipe(untilDestroyed(this)).subscribe(val => {
        const cd = val.menuSettings.commonDetails || {};
        const sd = val.menuSettings.securityDetails || {};
        this.hasCallService = cd.hasCallService;
        this.hasTableNoLock = sd.hasTableNoLock;
        this.isFullFeature = this.currentUser.feature === '3';
        this.processPageInfo();
      });
    } else {
      this.processPageInfo();
    }
  }

  private processPageInfo() {
    this.checkPageInfoRequirement();
    this.checkNotificationRequirement();
    this.pageInfo = this.initialPageInfo;
    this.listenNotification();
  }

  private checkPageInfoRequirement() {
    if (!this.hasCallService && !this.hasTableNoLock && !this.isFullFeature) {
      lo_remove(this.initialPageInfo, n => n.categoryId === 'T');
    }
    if (!this.hasReservation && !this.isFullFeature) {
      lo_remove(this.initialPageInfo, n => n.categoryId === 'R');
    }
  }

  private checkNotificationRequirement() {
    if (this.hasCallService || this.hasTableNoLock) {
      this.runNotificationCount('T');
    }
    if (this.hasReservation) {
      this.runNotificationCount('R');
    }
    this.runNotificationCount('V');
  }

  private listenNotification() {
    this.events.subscribe('Noti', val => {
      if (val.type === 'RN') {
        this.soundService.playSound2();
        this.vibration.vibrate([100, 100, 100]);
        this.reservationStatusCounter += 1;
        this.commonService.presentToast('');
      } else {
        this.addNotificationCounter(val.type);
      }
    });
    this.events.subscribe('Common', val => {
      this.soundService.playSound2();
      this.vibration.vibrate([100, 100, 100]);
      this.hasNotifications = true;
      this.commonService.presentToast('');
    });
    this.events.subscribe('Interacted', val => {
      if (val.categoryId === 'R') {
        this.reservationStatusCounter = 0;
        this.commonService.presentToast('');
      }
      this.readNotification(val.categoryId);
    });
  }

  private addNotificationCounter(type) {
    switch (type) {
      case 'T': this.addCounter('T', 1); break;
      case 'R': this.addCounter('R', 2); break;
      case 'V': this.addCounter('V', 3); break;
    }
  }

  private addCounter(type, numberValue) {
    this.soundService.playSound2();
    this.vibration.vibrate([100, 100, 100]);
    this[`tabBadge${numberValue}`] += 1;
    this.superTabsCtrl.setBadge(type, this[`tabBadge${numberValue}`], 'superTabs');
    this.commonService.presentToast('');
  }

  private runNotificationCount(type) {
    switch (type) {
      case 'T':
        this.notificationService.getTempNotificationCount(this.currentUser._id).pipe(untilDestroyed(this)).subscribe(val => {
          this.processCount(val, 'T', 1);
        });
        break;
      case 'R':
        this.notificationService.getNotificationCount(this.currentUser._id, 'R').pipe(untilDestroyed(this)).subscribe(val => {
          this.processCount(val, 'R', 2);
        });
        break;
      case 'V':
        this.notificationService.getTicketNotificationCount(this.currentUser.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
          this.processCount(val, 'V', 3);
        });
        break;
    }
  }

  private processCount(val, type, numberValue) {
    if (val[0].count !== 0) {
      this.soundService.playSound2();
      this.vibration.vibrate([100, 100, 100]);
      this[`tabBadge${numberValue}`] = val[0].count;
      this.superTabsCtrl.setBadge(type, val[0].count, 'superTabs');
      this.updatePageInfo(type, true);
    } else {
      this[`tabBadge${numberValue}`] = 0;
      this.updatePageInfo(type, false);
    }
    this.commonService.presentToast('');
  }

  private updatePageInfo(type, status) {
    this.initialPageInfo = this.initialPageInfo.map(val => {
      if (val.categoryId === type) {
        val.needRefresh = status;
      }
      return val;
    });
  }

  onTabSelect(ev: any) {
    this.readNotification(ev.id);
  }

  private readNotification(type) {
    switch (type) {
      case 'T': {
        if (this.tabBadge1 !== 0) {
          this.notificationService.readTempNotifications(this.currentUser._id).pipe(untilDestroyed(this)).subscribe(val => {
            this.notificationRead('T', 1);
          });
        }
        break;
      }
      case 'R': {
        this.reservationStatusCounter = 0;
        if (this.tabBadge2 !== 0) {
          this.notificationService.readNotifications(this.currentUser._id, 'R').pipe(untilDestroyed(this)).subscribe(val => {
            this.notificationRead('R', 2);
          });
        }
        break;
      }
      case 'V': {
        if (this.tabBadge3 !== 0) {
          this.notificationService.readTicketNotifications(this.currentUser.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
            this.notificationRead('V', 3);
          });
        }
        break;
      }
    }
  }

  private notificationRead(type, numberValue) {
    this.superTabsCtrl.clearBadge(type, 'superTabs');
    this[`tabBadge${numberValue}`] = 0;
  }

  insertCode() {
    this.alertCtrl.create({
      title: 'Ticket Code',
      inputs: [
        {
          name: 'ticketCode',
          placeholder: 'eg. V15423625'
        },
      ],
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
        },
        {
          text: 'Check',
          handler: data => {
            if (!data.ticketCode) {
              this.commonService.presentToast('Please insert a ticket code :)');
              return;
            }
            if (String(data.ticketCode).length !== 9) {
              this.commonService.presentToast('Please insert a valid Vouchy ticket code :)');
              return;
            }
            this.navCtrl.parent.parent.push('TicketPage', {
              ticketCode: data.ticketCode,
              restaurantName: this.restaurantName
            });
          }
        }
      ]
    }).present();
  }

  scanQr() {
    if (!this.platform.is('cordova')) {
      return;
    }
    this.options = {
      prompt: `Scan Ticket's QR Code`,
      disableSuccessBeep: true,
      showTorchButton: true,
    };
    this.barcodeScanner.scan(this.options).then(data => {
      if (!data.text) {
        return;
      }
      if (String(data.text).length !== 9) {
        this.commonService.presentToast('Please scan a valid Vouchy ticket QR code :)');
        return;
      }
      this.navCtrl.parent.parent.push('TicketPage', {
        ticketCode: data.text,
        restaurantName: this.restaurantName
      });
    });
  }

  presentMenu() {
    const modal = this.modalCtrl.create('MenuPopOverComponent', { hasNotifications: this.hasNotifications });
    modal.present();
    modal.onDidDismiss(data => {
      if (data && data.hasNotifications === false) {
        this.hasNotifications = false;
      }
    });
  }
}
