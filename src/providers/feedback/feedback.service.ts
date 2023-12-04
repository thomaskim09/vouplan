import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { environment } from '../environments/environments';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';

@Injectable()
export class FeedbackService {

  url: string = environment.url;
  cacheKey: string = 'IonicCache';
  feedbackCacheKey: string = 'FeedbackCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getFeedbackCount(restaurantId) {
    const api = `${this.url}/v1/feedbacks/count?restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getFeedbackCount called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  readFeedback(restaurantId) {
    const api = `${this.url}/v1/feedbacks/read?restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New readFeedback called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  calculateRating(restaurantId) {
    const api = `${this.url}/v1/feedbacks/rating?restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New calculateRating called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouplan_Feedback_Rating ' + api, req, this.cacheKey);
  }

  getFeedbackList(restaurantId, pageSize, pageNum, refresher) {
    const api = `${this.url}/v1/feedbacks/restaurants?restaurantId=${restaurantId}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getFeedbackList ${pageSize} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 12; // 12 hour
    const cacheString = 'Vouplan_Feedback_List ' + api;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.cacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey, ttl);
  }

  getFeedbackDetails(id) {
    const api = `${this.url}/v1/feedbacks?feedbackId=${id}`;
    const req = this.http.get(api).map(res => {
      this.logger.info('New getFeedbackDetails called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouplan_Feedback_Details ' + api, req, this.feedbackCacheKey + id);
  }

  replyFeedback(id, content) {
    const api = `${this.url}/v1/feedbacks/reply?feedbackId=${id}`;
    const req = this.http.put(api, { content: content }).map(res => {
      this.cacheService.clearGroup(this.feedbackCacheKey + id);
      this.logger.info('New replyFeedback called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

}
