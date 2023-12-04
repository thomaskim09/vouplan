import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderService } from '../../providers/order/order.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-history-order-detail',
  templateUrl: 'history-order-detail.html',
})
export class HistoryOrderDetailPage {

  title: string;

  // Parameter pass to components
  item: any = {};
  menu: any;
  responseDetails: any;
  orderContent: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public orderService: OrderService) { }

  ngOnInit() {
    const username = this.navParams.get('username');
    const orderId = this.navParams.get('orderId');
    const tableNo = this.navParams.get('tableNo');
    this.title = username || `Table ${tableNo}`;
    this.setUpOrderDetails(orderId);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpOrderDetails(orderId) {
    this.orderService.getOrderDetails(orderId).pipe(untilDestroyed(this)).subscribe(val => {
      this.item['itemContent'] = val;
      this.orderContent = {};
      this.orderContent['itemContent'] = val;
      this.menu = {
        md: val.menuSettings.modeDetails,
        td: val.menuSettings.totalDetails
      };
    });
  }

  back() {
    this.navCtrl.pop();
  }
}
