import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { OrderService } from '../../providers/order/order.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  // SuperTab
  page: any = 'OrderDetailPage';
  pageInfo: any;
  menu: any;

  // HTML properties
  orderLength: string;

  // Js Properties
  restaurantId: string;

  // Controller
  timer: any;

  // Tools
  loader: any;

  constructor(
    public navCtrl: NavController,
    public authenticationService: AuthenticationService,
    public orderService: OrderService,
    public events: Events) { }

  ngOnInit() {
    this.timer = setTimeout(() => {
      this.restaurantId = this.authenticationService.currentUserValue.restaurantId;
      this.setUpOrderList();
      this.getMenuSettings();
      this.listenToOrderRefresh();
    }, 500);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
    this.events.unsubscribe('orderRefresh');
  }

  private setUpOrderList() {
    this.orderLength = 'loading';
    this.orderService.getAllOrderListHeader(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
      this.setUpPageInfo(val);
    });
  }

  private setUpPageInfo(val2) {
    this.orderLength = String(val2.length);
    if (this.orderLength !== '0') {
      this.pageInfo = val2.map(val3 => ({
        itemName: val3.billDetails.tableNo || val3.billDetails.username,
        itemContent: val3,
      }));
    } else {
      this.pageInfo = [{
        itemName: 'No new order yet',
        itemContent: undefined,
      }];
    }
  }

  private getMenuSettings() {
    const menuId = this.authenticationService.currentUserValue.menuId;
    this.orderService.getMenuSettings(menuId).pipe(untilDestroyed(this)).subscribe(val => {
      // Cleanner code
      const ms = val.menuSettings;
      const sd = ms.securityDetails;
      const md = ms.modeDetails;
      const cd = ms.commonDetails;
      const td = ms.totalDetails;
      this.menu = {
        hasMenu: ms.hasMenu,
        sd: sd,
        md: md,
        cd: cd,
        td: td
      };
    });
  }

  private listenToOrderRefresh() {
    this.events.subscribe('orderRefresh', val => {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    });
  }

  getStatus(status) {
    switch (status) {
      case 'PC': return '(New)';
      case 'PD': return '(Paid)';
      default: return '';
    }
  }

  goToHistoryOrder() {
    this.navCtrl.parent.parent.push('HistoryOrderPage', {
      type: 'months'
    });
  }

}
