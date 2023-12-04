import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../../../providers/authentication/authentication.service';
import { OrderService } from '../../../providers/order/order.service';
import { CommonService } from '../../../providers/common/common.service';
import { AlertController } from 'ionic-angular';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'order-call',
  templateUrl: 'order-call.html'
})
export class OrderCallComponent {

  @Input('orderContent') orderContent: any;
  @Input('toggle') toggle: any;

  itemCon: any;
  status: string;
  userId: string;
  adminId: string;
  restaurantName: string;

  // Controller
  notifyClicked: boolean = false;
  countDownNotify: number;
  intervalNotify: any;

  constructor(
    public orderService: OrderService,
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public alertCtrl: AlertController) { }

  ngOnInit() {
    const currentUser = this.authenticationService.currentUserValue;
    this.adminId = currentUser._id;
    this.restaurantName = currentUser.restaurantName;
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearInterval(this.intervalNotify);
  }

  ngOnChanges() {
    if (this.orderContent) {
      this.itemCon = this.orderContent.itemContent;
      this.status = this.itemCon.status;
      this.userId = this.itemCon.userId;
    }
  }

  notifyUser() {
    if (!this.notifyClicked) {
      this.alertCtrl.create({
        title: 'Order done notification',
        subTitle: 'Customer will be notified that order is done.',
        buttons: [
          {
            text: 'Back',
            role: 'cancel',
          },
          {
            text: 'Send',
            handler: data => {
              const content = {
                senderId: this.adminId,
                receiverId: this.userId,
                title: `${this.restaurantName}`,
                body: 'Hi there, your order is done :)',
                type: 'N',
                userToken: this.orderContent.itemContent.billDetails.userToken
              };
              this.orderService.notifyCustomer(content).pipe(untilDestroyed(this)).subscribe(val => {
                this.notifyClicked = true;
                this.countDownNotify = 30;
                this.intervalNotify = setInterval(() => {
                  this.countDownNotify -= 1;
                  if (this.countDownNotify === 0) {
                    clearInterval(this.intervalNotify);
                    this.notifyClicked = false;
                  }
                }, 1000);
                this.commonService.presentToast('Order done notification sent :)');
              });
            }
          }]
      }).present();
    }
  }

}
