import { Component } from '@angular/core';
import { IonicPage, NavParams, Events } from 'ionic-angular';
import { OrderService } from '../../providers/order/order.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DataService } from './../../providers/data-service/data-service';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  // Receive from order page
  item: any;

  // Parameter pass to components
  menu: any;
  orderContent: any;
  responseDetails: any;
  toggle: boolean;

  // HTML properties
  status: string;
  userToken: string;

  // Controller
  hasResponseDetails: boolean = false;
  needItemCode: boolean = false;
  timer: any;
  firstEnter: boolean = true;

  constructor(
    public navParams: NavParams,
    public orderService: OrderService,
    public dataService: DataService,
    public events: Events) { }

  ngOnInit() {
    this.menu = this.navParams.get('menu');
    this.item = this.navParams.get('item');
  }

  ionViewDidEnter() {
    if (this.firstEnter) {
      this.firstEnter = false;
      this.getOrderDetails();
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  doRefresh(refresher) {
    this.events.publish('orderRefresh');
    this.dataService.changeRefreshContent({ refreshOrder: true });
    refresher.complete();
  }

  private getOrderDetails() {
    if (this.item.itemContent) {
      this.orderService.getTempOrderDetails(this.item.itemContent._id).pipe(untilDestroyed(this)).subscribe(val => {
        this.orderContent = {};
        this.orderContent['itemContent'] = val;
        this.status = val.status;
        this.userToken = val.billDetails.userToken;
      });
    }
  }

  emitResponse(res) {
    if (res.status !== 'PC') {
      this.responseDetails = {
        hasResponseDetails: true,
        description: res.description,
        newSubTotal: res.subTotal.toFixed(2),
        amountType: res.amountType,
        descriptionPrice: res.amountPrice.toFixed(2),
        newPackagingFee: this.zero(res.packagingFee).toFixed(2),
        newTaxCharge: this.zero(res.taxCharge).toFixed(2),
        newServiceCharge: this.zero(res.serviceCharge).toFixed(2),
        newRoundingType: res.roundingType,
        newRoundingValue: res.roundingAdjustment.toFixed(2),
        newTotalPrice: res.totalPrice.toFixed(2),
      };
    }
  }

  private zero(value) {
    return value || 0;
  }

  emitToggle(ev) {
    this.toggle = ev.toggle;
    this.status = ev.status;
  }

}
