import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CacheService } from 'ionic-cache';
import { Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';
import { Storage } from '@ionic/storage';
import { environment } from '../environments/environments';
import { untilDestroyed } from 'ngx-take-until-destroy';

class Admin {
  _id: string;
  contact: string;
  email: string;
  restaurantId?: string;
  restaurantName?: string;
  hasMenu?: boolean;
  menuId?: string;
  hasReservation?: boolean;
  feature: string;
  deviceToken?: string;
  fingerprint: string;
}

@Injectable()
export class AuthenticationService {

  url: string = environment.url;
  currentUserKey = 'Vouplan_Current_User';
  cryptoKey: string = 'ionicCryKey';
  cacheKey: string = 'IonicCache';

  // User information
  currentUserSubject = new BehaviorSubject<Admin>(undefined);

  list: any = [];

  constructor(
    public cacheService: CacheService,
    public events: Events,
    public http: HttpClient,
    public logger: NGXLogger,
    public rs: RetryService,
    public storage: Storage) { }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  setUpUser() {
    this.storage.get(this.currentUserKey).then(val => {
      if (val) {
        this.currentUserSubject = new BehaviorSubject<Admin>(val);
        this.events.publish('loggedIn');
        this.logger.info('Logged in');
      } else {
        this.events.publish('notLoggedIn');
        this.logger.info('Not logged in');
      }
    });
  }

  get currentUserValue(): Admin {
    return this.currentUserSubject.value;
  }

  login(object) {
    const api = `${this.url}/v1/admins/login?type=mobile`;
    this.http.post<any>(api, object).retryWhen(this.rs.retryFunction()).pipe(untilDestroyed(this)).subscribe(val => {
      this.logger.info('New login is called');
      this.updateCurrentUser(val);
      this.events.publish('loggedIn');
    }, err => this.events.publish('loggedInFail', { err: err }));
  }

  logout() {
    if (!this.currentUserValue) {
      return;
    }
    const object = {
      adminId: this.currentUserValue._id,
      deviceToken: this.currentUserValue.deviceToken
    };
    const api = `${this.url}/v1/admins/logout`;
    this.http.post<any>(api, object).retryWhen(this.rs.retryFunction()).pipe(untilDestroyed(this)).subscribe(val => {
      this.logger.info('New logout is called');
      this.events.publish('logout');
      this.storage.clear();
      this.currentUserSubject.next(undefined);
      this.cacheService.clearAll();
    });
  }

  private updateCurrentUser(currentUser) {
    this.currentUserSubject.next(currentUser);
    this.storage.set(this.currentUserKey, currentUser);
  }

  checkLoginStatus() {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      return (currentUser._id) ? true : false;
    } else {
      return false;
    }
  }

  checkAdminStatus(adminId) {
    const api = `${this.url}/v1/admins/status?adminId=${adminId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New checkAdminStatus called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouplan_Check_Admin_Status', req, this.cacheKey);
  }

}
