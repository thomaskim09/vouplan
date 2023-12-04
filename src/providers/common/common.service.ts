import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class CommonService {

  colorList = ['#eccc68', '#ff7f50', '#ff6b81', '#ffa502', '#ff6348', '#70a1ff', '#2ed573', '#1e90ff'];
  greyColor: string = '#c4c1c1';

  constructor(
    public toastCtrl: ToastController) {
  }

  presentToast(title, duration = 2500) {
    this.toastCtrl.create({
      message: title,
      duration: duration,
      position: 'top'
    }).present();
  }

  getBgColor(title, isGrey?) {
    if (isGrey) {
      return this.greyColor;
    }
    const charCodeArray = String(title.charCodeAt(0)).split('');
    const numberArray = charCodeArray.map(val => Number(val));
    const result = numberArray.reduce((a, c) => a + c, 0);
    const output = Math.round(parseFloat('0.' + result) * this.colorList.length);
    return this.colorList[output];
  }
}
