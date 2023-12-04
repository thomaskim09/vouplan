import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ModalController, Keyboard } from 'ionic-angular';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { FcmService } from '../../providers/fcm/fcm.service';
import { Platform } from 'ionic-angular/platform/platform';
import { CommonService } from './../../providers/common/common.service';
declare const ClientJS: any;
import 'clientjs';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  usernameInput: string;
  passwordInput: string;
  deviceToken: string;
  fingerprint: any;

  // Controller
  timer: any;
  needSpinner: boolean = false;

  constructor(
    public navCtrl: NavController,
    public authenticationService: AuthenticationService,
    public events: Events,
    public fcm: FcmService,
    public modalCtrl: ModalController,
    public keyboard: Keyboard,
    public platform: Platform,
    public commonService: CommonService) { }

  ngOnInit() {
    this.listenToLoggedIn();
    this.unsubscribeHomePageEvents();
    this.fingerprint = new ClientJS().getFingerprint();
    if (this.platform.is('cordova')) {
      this.setUpFirebaseDevice();
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    this.events.unsubscribe('loggedIn');
    this.events.unsubscribe('loggedInFail');
    clearTimeout(this.timer);
  }

  private listenToLoggedIn() {
    setTimeout(() => {
      this.events.subscribe('loggedIn', () => {
        this.navCtrl.setRoot('HomePage');
        this.timer = setTimeout(() => {
          this.needSpinner = false;
        }, 2000);
      });
      this.events.subscribe('loggedInFail', val => {
        this.needSpinner = false;
        if (val.err.status === 429) {
          this.commonService.presentToast('Exceed login limit, please try again 3 mins later');
        } else {
          this.commonService.presentToast(val.err.error.message);
        }
      });
    }, 1000);
  }

  private unsubscribeHomePageEvents() {
    this.events.unsubscribe('T');
    this.events.unsubscribe('R');
    this.events.unsubscribe('V');
    this.events.unsubscribe('notLoggedIn');
  }

  private setUpFirebaseDevice() {
    this.fcm.getToken().then(val => this.deviceToken = val);
  }

  checkValid() {
    return (this.usernameInput && this.passwordInput) ? true : false;
  }

  login() {
    this.needSpinner = true;
    const object = {
      username: this.usernameInput,
      password: this.passwordInput,
      deviceToken: this.deviceToken,
      fingerprint: this.fingerprint
    };
    this.authenticationService.login(object);
  }

  presentTermPicker() {
    this.modalCtrl.create('TermPickerPage').present();
  }
}
