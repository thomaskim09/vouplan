import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OrderService } from '../../providers/order/order.service';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { parse, format, startOfMonth, endOfMonth, startOfDay, endOfDay, parseISO } from 'date-fns';
import lo_orderBy from 'lodash/orderBy';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-history-order',
  templateUrl: 'history-order.html',
})
export class HistoryOrderPage {

  title: string;

  type: string;
  restaurantId: string;

  monthList: any;
  dayList: any;
  orderList: any = [];

  // Infinite scroll
  needInfiniteScroll: boolean = true;
  pageNum: number = 1;
  pageSize: number = 10;

  startDate: string;
  endDate: string;

  // Ads properties
  androidId: string;
  iosId: string;

  // Controller
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public orderService: OrderService,
    public authenticationService: AuthenticationService,
    public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.type = this.navParams.get('type');
    this.restaurantId = this.authenticationService.currentUserValue.restaurantId;
    this.setUpList();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  private setUpList() {
    this.presentLoading();
    switch (this.type) {
      case 'months': {
        this.title = 'History Orders';
        this.orderService.getHistoryMonths(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
          if (val.length) {
            const list = lo_orderBy(val, ['_id.year', '_id.month'], ['desc', 'desc']);
            this.monthList = list.map(val2 => ({
              year: val2._id.year,
              month: val2._id.month,
              count: val2.count
            }));
          }
          this.loader.dismiss();
        }, err => this.loader.dismiss());
        break;
      }
      case 'days': {
        const year = this.navParams.get('year');
        const month = this.navParams.get('month');
        this.title = `${this.getMonthFormat(month)} ${year}`;
        const monthSelected = parse(`${year} ${month}`, 'yyyy M', new Date());
        const startDate = startOfMonth(monthSelected).toISOString();
        const endDate = endOfMonth(monthSelected).toISOString();
        this.orderService.getHistoryDays(this.restaurantId, startDate, endDate).pipe(untilDestroyed(this)).subscribe(val => {
          if (val.length) {
            const list = lo_orderBy(val, ['_id.day'], ['desc']);
            this.dayList = list.map(val2 => ({
              day: val2._id.day,
              year: year,
              month: month,
              count: val2.count
            }));
          }
          this.loader.dismiss();
        }, err => this.loader.dismiss());
        break;
      }
      case 'orders': {
        const year = this.navParams.get('year');
        const month = this.navParams.get('month');
        const day = this.navParams.get('day');
        this.title = `${day} ${this.getMonthFormat(month)}`;
        const daySelected = parse(`${year} ${month} ${day}`, 'yyyy M d', new Date());
        this.startDate = startOfDay(daySelected).toISOString();
        this.endDate = endOfDay(daySelected).toISOString();
        this.setUpOrderList(this.startDate, this.endDate);
        break;
      }
    }
  }

  viewMonth(item) {
    this.navCtrl.push('HistoryOrderPage', {
      type: 'days',
      year: item.year,
      month: item.month,
    });
  }

  viewDay(item) {
    this.navCtrl.push('HistoryOrderPage', {
      type: 'orders',
      year: item.year,
      month: item.month,
      day: item.day,
    });
  }

  viewOrder(item) {
    this.navCtrl.push('HistoryOrderDetailPage', {
      orderId: item._id,
      username: item.username,
      tableNo: item.tableNo
    });
  }

  loadMore(infiniteScroll) {
    this.setUpOrderList(this.startDate, this.endDate, infiniteScroll);
  }

  private setUpOrderList(startDate, endDate, infiniteScroll?) {
    this.orderService.getHistoryDaysOrders(this.restaurantId, startDate, endDate, this.pageSize, this.pageNum).pipe(untilDestroyed(this)).subscribe(val => {
      if (val.length) {
        val = lo_orderBy(val, ['createdTime'], ['desc']);
        const list = val.map(val2 => ({
          _id: val2._id,
          username: val2.billDetails.username,
          tableNo: val2.billDetails.tableNo,
          totalPrice: val2.billDetails.totalPrice,
          newTotalPrice: val2.responseDetails ? val2.responseDetails.totalPrice : undefined,
          createdTime: val2.createdTime,
        }));
        this.orderList = [...this.orderList, ...list];
      }

      if (infiniteScroll) {
        infiniteScroll.complete();
      }

      if (val.length < this.pageSize) {
        this.pageNum = 1;
        this.needInfiniteScroll = false;
      } else {
        this.pageNum++;
        this.needInfiniteScroll = true;
      }
      this.loader.dismiss();
    }, err => this.loader.dismiss());
  }

  getTotalPrice(item) {
    return item.newTotalPrice ? item.newTotalPrice.toFixed(2) : item.totalPrice.toFixed(2);
  }

  getMonthFormat(value) {
    return format(parse(value, 'M', new Date()), 'MMM');
  }

  getTime(value) {
    return format(parseISO(value), 'hh:mm a');
  }

  private presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: 'Loading History...',
    });
    this.loader.present();
  }

  back() {
    this.navCtrl.pop();
  }
}
