import { App } from 'ionic-angular/components/app/app';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { AuthenticationService } from '../providers/authentication/authentication.service';
import { CacheService } from 'ionic-cache';
import { Component, ViewChild } from '@angular/core';
import { FcmService } from '../providers/fcm/fcm.service';
import { Network } from '@ionic-native/network';
import { NotificationPage } from '../pages/notification/notification';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { FeedbackPage } from './../pages/feedback/feedback';
import { Platform, Events, Nav, AlertController, IonicApp } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TokenService } from '../providers/authentication/token.service';
import { tap } from 'rxjs/operators/tap';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { Insomnia } from '@ionic-native/insomnia';
import { SoundService } from './../providers/common/sound.service';
import { LoginPage } from './../pages/login/login';

@Component({
  templateUrl: 'app.html',
  providers: [Network, ScreenOrientation, AppMinimize, Insomnia, MobileAccessibility]
})
export class MyApp {

  rootPage: any = 'HomePage';

  networkAlert: any;

  // To control double tap exit
  @ViewChild(Nav) nav: Nav;
  backSub: any;

  // Controller
  timer: any;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public appMinimize: AppMinimize,
    public authenticationService: AuthenticationService,
    public cacheService: CacheService,
    public events: Events,
    public fcm: FcmService,
    public ionicApp: IonicApp,
    public network: Network,
    public platform: Platform,
    public screenOrientation: ScreenOrientation,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public tokenService: TokenService,
    public insomnia: Insomnia,
    public mobileAccessibility: MobileAccessibility,
    public soundService: SoundService) {
    this.initializeApp();
  }

  initializeApp() {
    this.authenticationService.setUpUser();
    this.tokenService.setUpToken();
    this.soundService.setUpSound();
    this.platform.ready().then(() => {
      this.setUpCacheService();
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString('#ffffff');
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.mobileAccessibility.usePreferredTextZoom(false);
        this.listenNotification();
        this.listenNetworkConnection();
        this.insomnia.keepAwake().then();
        this.splashScreen.hide();
        this.soundService.loadSound();
      }
    });
  }

  ngOnInit() {
    this.setUpBackButton();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    if (this.backSub) {
      this.backSub();
    }
    clearTimeout(this.timer);
    if (this.platform.is('cordova')) {
      this.insomnia.allowSleepAgain().then();
    }
  }

  private setUpCacheService() {
    this.cacheService.setDefaultTTL(60 * 60 * 24);
    this.cacheService.setOfflineInvalidate(false);
  }

  private listenNotification() {
    this.timer = setTimeout(() => {
      this.fcm.listenToNotifications().pipe(tap(msg => {
        if (msg.content) {
          msg.content = JSON.parse(msg.content);
        }
        switch (msg.type) {
          case 'V': this.events.publish('Noti', { type: 'V' }); break;
          case 'R': this.events.publish('Noti', { type: 'R' }); break;
          case 'RN': this.events.publish('Noti', { type: 'RN' }); break;
          case 'T': this.events.publish('Noti', { type: 'T' }); break;
          case 'O': this.events.publish('Order', { type: 'O' }); break;
          case 'ON': this.events.publish('Order', { type: 'ON' }); break;
          case 'F': this.events.publish('Feedback'); break;
          case 'G': this.events.publish('Common'); break;
        }
      })).pipe(untilDestroyed(this)).subscribe();
    }, 1000);
  }

  private listenNetworkConnection() {
    this.network.onConnect().pipe(untilDestroyed(this)).subscribe(() => {
      this.networkAlert.dismiss();
    });
    this.network.onDisconnect().pipe(untilDestroyed(this)).subscribe(() => {
      const nav = this.app._appRoot._getActivePortal() || this.app.getActiveNav();
      const activeView = nav.getActive();
      if (activeView.isOverlay) {
        return;
      }
      this.networkAlert = this.alertCtrl.create({
        title: 'No internet... (O.O)',
        subTitle: `Are you connected to the internet?`,
        buttons: [
          {
            text: 'Yes',
          }
        ]
      });
      this.networkAlert.present();
    });
  }

  private setUpBackButton() {
    if (this.platform.is('cordova')) {
      this.backSub = this.platform.registerBackButtonAction(() => {
        const activeModal = this.ionicApp._modalPortal.getActive();
        if (activeModal) {
          activeModal.dismiss();
          return;
        } else if (this.nav.canGoBack()) {
          this.nav.pop();
        } else {
          const nav2 = this.app.getActiveNavs()[0];
          const page = nav2.getActive().instance;
          if (page instanceof NotificationPage || page instanceof OrderDetailPage || page instanceof FeedbackPage || page instanceof LoginPage) {
            this.appMinimize.minimize();
          } else {
            nav2.pop();
          }
        }
      });
    }
  }
}
