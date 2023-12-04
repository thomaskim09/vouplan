import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { environment } from '../environments/environments';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';

@Injectable()
export class OrderService {

  url: string = environment.url;
  cacheKey: any = 'IonicCache';
  historyOrderCacheKey: any = 'HistoryOrderCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getAllOrderListHeader(restaurantId) {
    const api = `${this.url}/v1/orders/temp/restaurants?restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getAllOrderListHeader called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getTempOrderDetails(orderId) {
    const api = `${this.url}/v1/orders/temp?orderId=${orderId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getTempOrderDetails called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getOrderCount(restaurantId) {
    const api = `${this.url}/v1/orders/temp/admins/count?restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getOrderCount called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  readOrder(restaurantId) {
    const api = `${this.url}/v1/orders/temp/admins/read?restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New readOrder called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  checkOrderStatus(orderId, status) {
    const counter = Math.random().toFixed(5); // To avoid using the same cache rsponse from back end
    const api = `${this.url}/v1/orders/temp/check?orderId=${orderId}&status=${status}&counter=${counter}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New checkOrderStatus ${status} ${counter} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  changeOrderStatus(object) {
    const api = `${this.url}/v1/orders/temp/status?orderId=${object.orderId}`;
    const req = this.http.put<any>(api, object).map(res => {
      if (object.status === 'CD') {
        this.cacheService.clearGroup(this.historyOrderCacheKey);
      }
      this.logger.info('New changeOrderStatus called ' + object.status);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  sendOrderApproval(orderId, content, info) {
    const api = `${this.url}/v1/orders/temp?orderId=${orderId}`;
    const req = this.http.put<any>(api, { content: content, info: info }).map(res => {
      this.logger.info(`New sendOrderApproval ${content.status}called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getMenuSettings(menuId) {
    const api = `${this.url}/v1/menus/settings?menuId=${menuId}&type=mobile`;
    const req = this.http.get(api).map(res => {
      this.logger.info('New getMenuSettings called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouplan_Menu_Settings ' + api, req, this.cacheKey);
  }

  getHistoryMonths(restaurantId) {
    const api = `${this.url}/v1/orders/history/months?id=${restaurantId}&type=admin`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getHistoryMonths called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouplan_History_Months ' + api, req, this.historyOrderCacheKey);
  }

  getHistoryDays(restaurantId, startDate, endDate) {
    const api = `${this.url}/v1/orders/history/days?id=${restaurantId}&type=admin&start_date=${startDate}&end_date=${endDate}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getHistoryDays called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouplan_History_Days ' + api, req, this.historyOrderCacheKey);
  }

  getHistoryDaysOrders(restaurantId, startDate, endDate, pageSize, pageNum) {
    const api = `${this.url}/v1/orders/history/days-orders?id=${restaurantId}&type=admin&start_date=${startDate}&end_date=${endDate}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getHistoryDaysOrders called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouplan_History_Days_Orders ' + api, req, this.historyOrderCacheKey);
  }

  getOrderDetails(orderId) {
    const api = `${this.url}/v1/orders?orderId=${orderId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getOrderDetails called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouplan_Orders_Details ' + api, req, this.cacheKey);
  }

  notifyCustomer(content) {
    const api = `${this.url}/v1/orders/notify`;
    const req = this.http.post<any>(api, { content: content }).map(res => {
      this.logger.info('New notifyCustomer called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }
}
