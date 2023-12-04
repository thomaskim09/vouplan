import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthenticationService } from './../../providers/authentication/authentication.service';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { CommonService } from './../../providers/common/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-reservation-setting',
  templateUrl: 'reservation-setting.html',
  providers: [InAppBrowser]
})
export class ReservationSettingPage {

  form: FormGroup;

  currentUser: any;
  noticeContent: string;

  // Controller
  isFormChanged: boolean = false;
  needSpinner: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public authenticationService: AuthenticationService,
    public restaurantService: RestaurantService,
    public navCtrl: NavController,
    public commonService: CommonService,
    public alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.form = this.setUpForm();
    this.setUpNotice();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpForm() {
    return this.formBuilder.group({
      noticeContent: [''],
    });
  }

  private onChanges() {
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.isFormChanged = true;
    });
  }

  private setUpNotice() {
    this.restaurantService.getReservationNotice(this.currentUser.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
      if (val && val.reservationSettings) {
        const query = {
          noticeContent: val.reservationSettings.noticeContent
        };
        this.form.patchValue(query, { emitEvent: false, onlySelf: true });
      }
    });
  }

  updateNotice() {
    this.alertCtrl.create({
      title: 'Confirm update notice?',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: () => {
            this.needSpinner = true;
            this.restaurantService.updateReservationNotice(this.currentUser.restaurantId, this.form.value.noticeContent).pipe(untilDestroyed(this)).subscribe(val => {
              this.needSpinner = false;
              this.isFormChanged = false;
              this.commonService.presentToast('Notice content updated');
            });
          }
        }
      ]
    }).present();
  }

  back() {
    this.navCtrl.pop();
  }
}
