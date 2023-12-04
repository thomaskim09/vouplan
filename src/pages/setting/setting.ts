import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController, Events } from 'ionic-angular';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { CommonService } from '../../providers/common/common.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SoundService } from './../../providers/common/sound.service';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
  providers: [InAppBrowser]
})
export class SettingPage {

  coffeeTitle: string = 'Treat us a<br>coffee';
  termTitle: string = 'Terms &<br>conditions';

  soundOption: any;

  constructor(
    public navCtrl: NavController,
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public iab: InAppBrowser,
    public soundService: SoundService,
    public events: Events) {
  }

  ngOnInit() {
    this.soundOption = this.soundService.currentSoundValue;
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    this.events.unsubscribe('logout');
  }

  goToCoffee() {
    this.navCtrl.push('CoffeePage');
  }

  presentTermPicker() {
    this.modalCtrl.create('TermPickerPage').present();
  }

  goToCustomer() {
    this.iab.create('http://m.me/VouchyApp', '_system');
  }

  toggleSound(ev) {
    this.soundOption.needSound = ev.value;
    this.soundService.updateSoundUption(this.soundOption);
    const text = ev.value ? 'Sound is turn on' : 'Sound is turn off';
    this.commonService.presentToast(text, 1500);
  }

  signOut() {
    this.events.subscribe('logout', () => {
      this.navCtrl.setRoot('LoginPage');
      this.commonService.presentToast('Log out successfully');
    });
    this.alertCtrl.create({
      title: 'Confirm to sign out?',
      buttons: [
        {
          text: 'Back',
        },
        {
          text: 'Confirm',
          handler: data => {
            this.authenticationService.logout();
          }
        }]
    }).present();
  }

  back() {
    this.navCtrl.pop();
  }
}
