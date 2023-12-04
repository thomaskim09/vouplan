import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';
import { CacheService } from 'ionic-cache';

@Injectable()
export class NotificationService {

  url: string = environment.url;
  cacheKey: string = 'IonicCache';
  tempNotiCacheKey: string = 'TempNotiCache';
  reservationNotiCacheKey: string = 'ReservationNotiCache';
  ticketNotiCacheKey: string = 'TicketNotiCache';
  ticketNotiCacheDetailKey: string = 'TicketNotiDetailCache';

  constructor(
    public http: HttpClient,
    public logger: NGXLogger,
    public rs: RetryService,
    public cacheService: CacheService) { }

  getTempNotification(adminId, pageSize, pageNum, refresher) {
    const api = `${this.url}/v1/admins/temp_notifications?id=${adminId}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getTempNotification ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 12; // 12 hour
    const cacheString = 'Vouplan_Table_Noti_List ' + api;
    if (refresher) {
      this.cacheService.clearGroup(this.tempNotiCacheKey);
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.tempNotiCacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.tempNotiCacheKey, ttl);
  }

  getTempNotificationCount(adminId) {
    const api = `${this.url}/v1/admins/temp_notifications/count?id=${adminId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getTempNotificationCount called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  readTempNotifications(adminId) {
    const api = `${this.url}/v1/admins/temp_notifications?id=${adminId}`;
    const req = this.http.put(api, {}).map(res => {
      this.logger.info(`New readTempNotifications called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getNotification(adminId, type, pageSize, pageNum, refresher) {
    const api = `${this.url}/v1/admins/notifications?id=${adminId}&type=${type}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getNotification ${type} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 12; // 12 hour
    const cacheString = 'Vouplan_Noti_List ' + api;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.cacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey, ttl);
  }

  getReservationNotification(adminId, isFilter, pageSize, pageNum, refresher) {
    const api = `${this.url}/v1/admins/reservation_notifications?adminId=${adminId}&filter=${isFilter}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getReservationNotification ${isFilter} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 12; // 12 hour
    const cacheString = `Vouplan_Reservation_Noti_List ${adminId} ${isFilter} ${pageNum}`;
    if (refresher) {
      this.cacheService.clearGroup(this.reservationNotiCacheKey);
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.reservationNotiCacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.reservationNotiCacheKey, ttl);
  }

  getReservationNotificationDetails(notificationId) {
    const api = `${this.url}/v1/admins/reservation_notifications/details?notificationId=${notificationId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getReservationNotificationDetails called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable(`Vouplan_Reservation_Noti_Details ${notificationId}`, req, this.cacheKey);
  }

  getNotificationCount(adminId, type) {
    const api = `${this.url}/v1/admins/notifications/count?id=${adminId}&type=${type}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getNotificationCount ${type} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  readNotifications(adminId, type) {
    const api = `${this.url}/v1/admins/notifications?id=${adminId}&type=${type}`;
    const req = this.http.put(api, {}).map(res => {
      this.logger.info(`New readNotifications ${type} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getTicketNotifications(restaurantId, isFilter, pageSize, pageNum, refresher) {
    const api = `${this.url}/v1/admins/ticket_notifications?restaurantId=${restaurantId}&filter=${isFilter}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getTicketNotifications ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 12; // 12 hour
    const cacheString = `Vouplan_Ticket_Noti_List ${restaurantId} ${isFilter} ${pageNum}`;
    if (refresher) {
      this.cacheService.clearGroup(this.ticketNotiCacheKey);
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.ticketNotiCacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.ticketNotiCacheKey, ttl);
  }

  getTicketNotificationsDetails(ticketId) {
    const api = `${this.url}/v1/admins/ticket_notifications/details?ticketId=${ticketId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getTicketNotificationsDetails called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable(`Vouplan_Ticket_Noti_Details ${ticketId}`, req, this.ticketNotiCacheDetailKey + ticketId);
  }

  getTicketNotificationCount(restaurantId) {
    const api = `${this.url}/v1/admins/ticket_notifications/count?restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getTicketNotificationCount called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  readTicketNotifications(restaurantId) {
    const api = `${this.url}/v1/admins/ticket_notifications/read?restaurantId=${restaurantId}`;
    const req = this.http.put(api, {}).map(res => {
      this.logger.info(`New readTicketNotifications called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }
}
