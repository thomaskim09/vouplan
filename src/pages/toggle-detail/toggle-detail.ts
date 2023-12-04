import { Component } from '@angular/core';
import { IonicPage, NavParams, AlertController } from 'ionic-angular';
import { ToggleService } from '../../providers/toggle/toggle.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonService } from '../../providers/common/common.service';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { isAfter, isBefore, parseISO } from 'date-fns';
import * as _ from 'lodash';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-toggle-detail',
  templateUrl: 'toggle-detail.html',
})
export class ToggleDetailPage {

  menuId: string;
  restaurantId: string;
  tabId: string;
  foodList: any;
  categoryList: any;
  voucherList: any;

  // Controller
  timer: any;
  timer2: any;
  needSpinner: boolean = false;
  firstEnter: boolean = true;
  toggleCounter: number = 0;

  constructor(
    public navParams: NavParams,
    public toggleService: ToggleService,
    public commonService: CommonService,
    public authenticationService: AuthenticationService,
    public alertCtrl: AlertController) { }

  ionViewDidEnter() {
    if (this.firstEnter) {
      this.firstEnter = false;
      const currentUser = this.authenticationService.currentUserValue;
      this.restaurantId = currentUser.restaurantId;
      this.menuId = currentUser.menuId;
      this.tabId = this.navParams.get('itemId');
      this.setUpItemList();
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
    clearTimeout(this.timer2);
  }

  doRefresh(refresher) {
    this.setUpItemList(refresher);
  }

  setUpItemList(refresher?) {
    switch (this.tabId) {
      case 'M': {
        this.toggleService.getFoodList(this.menuId, refresher).pipe(untilDestroyed(this)).subscribe(val2 => {
          if (refresher) { refresher.complete(); }
          if (val2) { this.foodList = this.processItemList(val2); }
        });
        break;
      }
      case 'C': {
        this.toggleService.getFoodList(this.menuId, refresher).pipe(untilDestroyed(this)).subscribe(val2 => {
          if (refresher) { refresher.complete(); }
          if (val2) { this.categoryList = val2.categoryDetails; }
        });
        break;
      }
      case 'V': {
        this.toggleService.getVoucherList(this.restaurantId, refresher).pipe(untilDestroyed(this)).subscribe(val2 => {
          if (refresher) { refresher.complete(); }
          if (val2) { this.voucherList = val2; }
        });
        break;
      }
    }
  }

  private processItemList(list) {
    const firstList = _(list.itemDetails)
      .groupBy(x => x.categoryId)
      .map((value, key) => ({ categoryId: key, itemList: value }))
      .value();

    const finalList = firstList.map(val => {
      const matched = list.categoryDetails.find(val2 => val2._id === val.categoryId);
      return {
        categoryName: matched ? matched.categoryName : 'Others',
        categoryId: val.categoryId,
        itemList: val.itemList
      };
    });
    return finalList;
  }

  getStatus(status) {
    switch (status) {
      case 'OP': return true;
      case 'HD': return false;
    }
  }

  voucherChecked(status) {
    switch (status) {
      case 'OP': return true;
      case 'WG': return true;
      case 'SO': return true;
      case 'HD': return false;
    }
  }

  checkIfStatusSO(status, soldOutTime) {
    switch (status) {
      case 'HD': return isAfter(new Date(), soldOutTime) ? true : false;
      case 'SO': return true;
      default: return false;
    }
  }

  private getStatusInvert(status) {
    switch (status) {
      case true: return 'OP';
      case false: return 'HD';
    }
  }

  toggleFood(ev, id, i, j) {
    this.needSpinner = true;
    const status = this.getStatusInvert(ev.value);
    this.toggleService.toggleFoodStatus(this.menuId, id, status).pipe(untilDestroyed(this)).subscribe(val => {
      if (status === 'OP') {
        this.commonService.presentToast('Item is opened');
      } else {
        this.commonService.presentToast('Item is hidden');
      }
      this.foodList[i].itemList[j].status = status;
      this.needSpinner = false;
    });
  }

  toggleCategory(ev, id, i) {
    this.needSpinner = true;
    const status = this.getStatusInvert(ev.value);
    this.toggleService.toggleCategoryStatus(this.menuId, id, status).pipe(untilDestroyed(this)).subscribe(val => {
      if (status === 'OP') {
        this.commonService.presentToast('Category is opened');
      } else {
        this.commonService.presentToast('Category is hidden');
      }
      this.categoryList[i].status = status;
      this.needSpinner = false;
    });
  }

  toggleVoucher(ev, id, item) {
    if (this.toggleCounter === 1) {
      this.toggleCounter = 0;
      return;
    }
    const resStatus = this.checkIfHideRestaurant(ev.value, this.voucherList);
    if (resStatus !== 'NV') {
      this.processToggle(id, ev, item, resStatus);
      return;
    }
    this.alertCtrl.create({
      title: 'Confirm to hide your last voucher?',
      subTitle: 'Vouchy need at least one voucher online',
      buttons: [
        {
          text: 'No',
          handler: data => {
            this.toggleCounter = 1;
            ev.checked = true;
          }
        },
        {
          text: 'Confirm',
          handler: data => {
            this.processToggle(id, ev, item, resStatus);
          }
        }
      ]
    }).present();
  }

  private processToggle(id, ev, item, resStatus) {
    const it = item.details;
    this.needSpinner = true;
    if (!ev.value) {
      this.changeVoucherStatus(id, 'HD', 'Voucher is hidden', resStatus);
      return;
    }
    if (it.startSellingTime && isBefore(new Date(), parseISO(it.startSellingTime))) {
      this.changeVoucherStatus(id, 'WG', 'Voucher is waiting for grab', resStatus);
    } else if (it.soldOutTime && isAfter(new Date(), parseISO(it.soldOutTime))) {
      this.changeVoucherStatus(id, 'SO', 'Voucher is visible and sold out', resStatus);
    } else {
      this.changeVoucherStatus(id, 'OP', 'Voucher is opened for sell', resStatus);
    }
  }

  private checkIfHideRestaurant(isChecked, list) {
    if (list.length === 1) {
      return isChecked ? 'OP' : 'NV';
    }
    let open = 0;
    list.map(val => {
      if (val.status === 'OP' || val.status === 'WG') {
        open++;
      }
    });
    if (!isChecked && open === 1) {
      return 'NV';
    } else if (isChecked && open === 0) {
      return 'OP';
    }
    return undefined;
  }

  private changeVoucherStatus(id, status, text, resStatus) {
    this.toggleService.toggleVoucherStatus(id, status, this.restaurantId, resStatus).pipe(untilDestroyed(this)).subscribe(val => {
      this.needSpinner = false;
      this.commonService.presentToast(text);
      const result = this.voucherList.find(val2 => val2._id === id);
      result['status'] = status;
    });
  }
}
