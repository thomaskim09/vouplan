import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { environment } from '../environments/environments';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';

@Injectable()
export class RestaurantService {

  url: string = environment.url;
  cacheKey: any = 'IonicCache';
  ticketDeCacheKey: any = 'TicketDetailsCache';
  ticketNotiCacheDetailKey: string = 'TicketNotiDetailCache';
  reservationNoticeKey: string = 'ReservationNoticeCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getTicketDetails(ticketCode, restaurantId) {
    const api = `${this.url}/v1/tickets/restaurants?ticketCode=${ticketCode}&restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getTicketDetails called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouplan_Ticket_Details ' + api, req, this.ticketDeCacheKey + ticketCode);
  }

  checkMonthly(ticketId, quantity) {
    const api = `${this.url}/v1/tickets/check_monthly?ticketId=${ticketId}&quantity=${quantity}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('checkMonthly called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  checkTicketVoucher(ticketId) {
    const api = `${this.url}/v1/tickets/check_ticket?ticketId=${ticketId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('checkTicketVoucher called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  claimTicketVoucher(ticketCode, object) {
    const api = `${this.url}/v1/tickets/vouchers?ticketCode=${ticketCode}`;
    const req = this.http.put(api, {
      object: object
    }).map(res => {
      this.cacheService.clearGroup(this.ticketDeCacheKey + ticketCode);
      this.cacheService.clearGroup(this.ticketNotiCacheDetailKey + object.ticketId);
      this.logger.info('New claimTicketVoucher called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  claimTicketReservation(ticketCode, restaurantId, object) {
    const api = `${this.url}/v1/tickets/reservations?ticketCode=${ticketCode}&restaurantId=${restaurantId}`;
    const req = this.http.put(api, {
      quantity: object.quantity,
      notificationId: object.notificationId
    }).map(res => {
      this.cacheService.clearGroup(this.ticketDeCacheKey + ticketCode);
      this.logger.info('New claimTicketReservation called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  checkReservation(notificationId, status) {
    const api = `${this.url}/v1/reservations/check?notificationId=${notificationId}&status=${status}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New checkReservation called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  replyReservation(notificationId, object) {
    const api = `${this.url}/v1/reservations?notificationId=${notificationId}`;
    const req = this.http.put(api, object).map(res => {
      this.logger.info(`New replyReservation ${object.status} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getTreatId() {
    const api = `${this.url}/v1/treats/id`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getTreatId called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  sendTreats(object) {
    const api = `${this.url}/v1/treats`;
    const req = this.http.post<any>(api, object).map(res => {
      this.logger.info('New sendTreats called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getReservationNotice(restaurantId) {
    const api = `${this.url}/v1/reservations/notice?restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getReservationNotice called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouplan_Reservation_Notice ' + api, req, this.reservationNoticeKey);
  }

  updateReservationNotice(restaurantId, noticeContent) {
    const api = `${this.url}/v1/reservations/notice?restaurantId=${restaurantId}`;
    const req = this.http.put<any>(api, { noticeContent: noticeContent }).map(res => {
      this.logger.info('New updateReservationNotice called');
      this.cacheService.clearGroup(this.reservationNoticeKey);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }
}
