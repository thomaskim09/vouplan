import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationService } from '../../providers/authentication/authentication.service';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-toggle',
  templateUrl: 'toggle.html',
})
export class TogglePage {

  page: any = 'ToggleDetailPage';
  pageInfo: any = [];

  // Controller
  timer: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.timer = setTimeout(() => {
      const currentUser = this.authenticationService.currentUserValue;
      const menuId = currentUser.menuId;
      const isFullFeature = currentUser.feature === '3';
      this.setUpTab(menuId, isFullFeature);
    }, 500);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  private setUpTab(menuId, isFullFeature) {
    if (menuId && isFullFeature) {
      this.pageInfo = [
        {
          itemId: 'M',
          itemName: 'Menu',
        },
        {
          itemId: 'C',
          itemName: 'Categories',
        },
        {
          itemId: 'V',
          itemName: 'Vouchers',
        }
      ];
    } else {
      this.pageInfo = [
        {
          itemId: 'V',
          itemName: 'Vouchers',
        }
      ];
    }
  }

  back() {
    this.navCtrl.pop();
  }
}
