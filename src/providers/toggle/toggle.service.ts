import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { environment } from '../environments/environments';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';

@Injectable()
export class ToggleService {

  url: string = environment.url;
  cacheKey: any = 'IonicCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getFoodList(menuId, refresher) {
    const api = `${this.url}/v1/menus/categories_foods?menuId=${menuId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getFoodList called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 12; // 12 hour
    const cacheString = 'Vouplan_Food_List ' + api;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.cacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey);
  }

  getVoucherList(restaurantId, refresher) {
    const api = `${this.url}/v1/vouchers/restaurants?restaurantId=${restaurantId}&type=active&page_size=5&page_num=1`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getVoucherList 5 1 called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 12; // 12 hour
    const cacheString = 'Vouplan_Voucher_List ' + api;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.cacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey);
  }

  toggleFoodStatus(menuId, foodId, status) {
    const api = `${this.url}/v1/menus/foods/status?menuId=${menuId}&foodId=${foodId}&status=${status}`;
    const req = this.http.put<any>(api, {}).map(res => {
      this.logger.info('New toggleFoodStatus called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  toggleCategoryStatus(menuId, categoryId, status) {
    const api = `${this.url}/v1/menus/categories/status?menuId=${menuId}&categoryId=${categoryId}&status=${status}`;
    const req = this.http.put<any>(api, {}).map(res => {
      this.logger.info('New toggleCategoryStatus called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  toggleVoucherStatus(voucherId, status, restaurantId, restaurantStatus) {
    const api = `${this.url}/v1/vouchers?voucherId=${voucherId}`;
    const req = this.http.put<any>(api, {
      status: status,
      restaurantId: restaurantId,
      restaurantStatus: restaurantStatus,
    }).map(res => {
      this.logger.info('New toggleVoucherStatus called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }
}
