import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationService } from '../../providers/notification/notification.service';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonService } from '../../providers/common/common.service';
import { formatDistanceStrict, parseISO } from 'date-fns';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-common-notification',
  templateUrl: 'common-notification.html',
})
export class CommonNotificationPage {

  currentUser: any;
  notifications: any = [];
  hasNotifications: boolean;

  // Infinite scroll
  needInfiniteScroll: boolean = true;
  pageNum: number = 1;
  pageSize: number = 10;

  isRead: boolean = false;

  // Controller
  timer: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public notificationService: NotificationService,
    public authenticationService: AuthenticationService,
    public commonService: CommonService) { }

  ngOnInit() {
    this.hasNotifications = this.navParams.get('hasNotifications');
    this.currentUser = this.authenticationService.currentUserValue;
    this.setUpNotificationsList(this.currentUser._id);
    this.readNotifications();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private setUpNotificationsList(id, infiniteScroll?) {
    this.notificationService.getNotification(id, 'G', this.pageSize, this.pageNum, this.hasNotifications).pipe(untilDestroyed(this)).subscribe(val => {
      const result = this.processNotification(val, this.hasNotifications);
      this.notifications = [...this.notifications, ...result];
      this.checkListFinish(val, infiniteScroll);
    });
  }

  private readNotifications() {
    if (this.notifications && this.notifications.length > 0 && this.hasNotifications) {
      this.notificationService.readNotifications(this.currentUser._id, 'G').pipe(untilDestroyed(this)).subscribe();
    }
  }

  loadMore(infiniteScroll) {
    this.setUpNotificationsList(this.currentUser._id, infiniteScroll);
  }

  private checkListFinish(val, infiniteScroll?) {
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
  }

  private processNotification(list, refresh) {
    if (refresh) {
      this.notifications = [];
    }
    return list.map(val => ({
      title: val.title,
      body: val.body,
      bgColor: this.getBgColor(val.title),
      char: this.getChar(val.title),
      time: this.getTime(val.createdTime),
    }));
  }

  private getBgColor(title) {
    return this.commonService.getBgColor(title);
  }

  private getChar(title) {
    return (title.charAt(0)).toUpperCase();
  }

  private getTime(time) {
    return this.setUpLocale(formatDistanceStrict(parseISO(time), new Date()));
  }

  private setUpLocale(time: string) {
    const timeString = time.split(' ');
    let result = '';
    timeString.map(val => result += (+val === +val) ? val : timeFormat(val) + ' ');
    function timeFormat(word) {
      switch (word) {
        case 'seconds': case 'second': return 's';
        case 'minutes': case 'minute': return 'm';
        case 'hours': case 'hour': return 'h';
        case 'days': case 'day': return 'd';
        case 'months': case 'month': return 'M';
        case 'years': case 'year': return 'Y';
        default: return '';
      }
    }
    return result;
  }

  back() {
    this.navCtrl.pop();
  }

}
