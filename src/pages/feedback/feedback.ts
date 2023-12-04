import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FeedbackService } from '../../providers/feedback/feedback.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonService } from '../../providers/common/common.service';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { formatDistanceStrict, parseISO } from 'date-fns';
import { DataService } from './../../providers/data-service/data-service';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  restaurantId: string;
  feedbackList: any = [];

  // Infinite scroll
  needInfiniteScroll: boolean = true;
  pageNum: number = 1;
  pageSize: number = 10;

  // Controller
  needSpinner: boolean = false;

  ratingKey: string = 'Vouplan_Rating';

  constructor(
    public navCtrl: NavController,
    public feedbackService: FeedbackService,
    public commonService: CommonService,
    public authenticationService: AuthenticationService,
    public dataService: DataService) { }

  ngOnInit() {
    this.restaurantId = this.authenticationService.currentUserValue.restaurantId;
    this.setUpFeedbackList();
    this.calculateRating();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private calculateRating() {
    this.feedbackService.calculateRating(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => val);
  }

  private setUpFeedbackList(refresher?, infiniteScroll?) {
    this.feedbackService.getFeedbackList(this.restaurantId, this.pageSize, this.pageNum, refresher).pipe(untilDestroyed(this)).subscribe(val => {
      if (refresher) {
        refresher.complete();
        this.feedbackList = [];
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }

      const result = this.processFeedback(val);
      this.feedbackList = [...this.feedbackList, ...result];

      if (val.length < this.pageSize) {
        this.pageNum = 1;
        this.needInfiniteScroll = false;
      } else {
        this.pageNum++;
        this.needInfiniteScroll = true;
      }
    });
  }

  doRefresh(refresher) {
    this.pageNum = 1;
    this.needInfiniteScroll = true;
    this.setUpFeedbackList(refresher);
    this.dataService.changeRefreshContent({ refreshFeedback: true });
  }

  loadMore(infiniteScroll) {
    this.setUpFeedbackList(false, infiniteScroll);
  }

  private processFeedback(list) {
    return list.map(val => ({
      _id: val._id,
      username: val.username,
      rating: val.rating,
      content: val.content,
      bgColor: this.getBgColor(val.username),
      char: this.getChar(val.username),
      time: this.getTime(val.feedbackTime),
      replyStatus: val.replyStatus
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
    const timeString = time.split(' ');
    let result = '';
    timeString.map(val => result += (+val === +val) ? val : timeFormat(val) + ' ');
    return result;
  }

  goToFeedbackDetails(id) {
    event.stopPropagation();
    this.needSpinner = true;
    this.navCtrl.parent.parent.push('FeedbackDetailPage', {
      feedbackId: id
    });
    this.needSpinner = false;
  }
}
