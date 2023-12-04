import { Component, SecurityContext } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { FeedbackService } from '../../providers/feedback/feedback.service';
import { GalleryModal } from 'ionic-gallery-modal';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonService } from '../../providers/common/common.service';
import { format, parseISO } from 'date-fns';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from './../../providers/authentication/authentication.service';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-feedback-detail',
  templateUrl: 'feedback-detail.html',
})
export class FeedbackDetailPage {

  feedback: any;

  feedbackId: string;
  replyModel: string;

  // Controller
  needSpinner: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public feedbackService: FeedbackService,
    public modalCtrl: ModalController,
    public commonService: CommonService,
    public sanitizer: DomSanitizer,
    public alertCtrl: AlertController,
    public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.feedbackId = this.navParams.get('feedbackId');
    this.setUpTicketFeedbackList(this.feedbackId);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpTicketFeedbackList(feedbackId) {
    this.feedbackService.getFeedbackDetails(feedbackId).pipe(untilDestroyed(this)).subscribe(val => {
      this.feedback = val[0];
    });
  }

  getTime(time) {
    return format(parseISO(time), 'dd-MM-yyyy');
  }

  presentImage(category, index) {
    const photos = category.photos.map(o => ({ url: o }));
    this.modalCtrl.create(GalleryModal, {
      photos: photos,
      initialSlide: index
    }).present();
  }

  sendReply() {
    this.alertCtrl.create({
      title: 'Confirm replying feedback?',
      subTitle: 'The content could not be edited afterward.',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: () => {
            const reply = this.sanitizer.sanitize(SecurityContext.HTML, this.replyModel);
            if (reply) {
              const currentUser = this.authenticationService.currentUserValue;
              this.needSpinner = true;
              const notiObject = {
                reply: reply,
                senderId: currentUser._id,
                receiverId: this.feedback.userId,
                title: `${currentUser.restaurantName} replied`,
                userToken: this.feedback.userToken
              };
              this.feedbackService.replyFeedback(this.feedbackId, notiObject).pipe(untilDestroyed(this)).subscribe(val => {
                this.commonService.presentToast('Feedback replied');
                this.needSpinner = false;
                // update feedback reply status
                this.feedback.replyStatus = true;
                this.feedback.replyContent = reply;
              });
            } else {
              this.commonService.presentToast('Please insert a reply before sending');
            }
          }
        }
      ]
    }).present();
  }

  back() {
    this.navCtrl.pop();
  }

}
