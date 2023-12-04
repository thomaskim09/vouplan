import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationService } from '../../../providers/authentication/authentication.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'menu-pop-over',
  templateUrl: 'menu-pop-over.html',
  providers: [InAppBrowser]
})
export class MenuPopOverComponent {

  // Controller
  hasNotifications: boolean;
  feature: string;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public authenticationService: AuthenticationService,
    public navParams: NavParams,
    public iab: InAppBrowser) { }

  ngOnInit() {
    this.hasNotifications = this.navParams.get('hasNotifications');
    this.feature = this.authenticationService.currentUserValue.feature;
  }

  goToNotification() {
    this.navigate('CommonNotificationPage', { hasNotifications: this.hasNotifications });
  }

  goToToggle() {
    this.navigate('TogglePage');
  }

  goToSetting() {
    this.navigate('SettingPage');
  }

  goToReport() {
    this.iab.create('http://m.me/VouchyApp', '_system');
  }

  goToReservation() {
    this.navigate('ReservationSettingPage');
  }

  private navigate(pageName, object?) {
    this.navCtrl.push(pageName, object);
    if (pageName === 'CommonNotificationPage') {
      this.hasNotifications = false;
    }
    this.close();
  }

  close() {
    this.viewCtrl.dismiss({ hasNotifications: this.hasNotifications });
  }

}
