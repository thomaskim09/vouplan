import { Component, Input } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { CommonService } from '../../../providers/common/common.service';

@Component({
  selector: 'confirm-order-main',
  templateUrl: 'confirm-order-main.html',
})
export class ConfirmOrderMainComponent {

  @Input('menu') menu: any;
  @Input('orderContent') orderContent: any;
  @Input('responseDetails') res: any;

  // Cleaner code
  itemCon: any;

  // Main content properties
  orderList: any;
  contact: string;
  contactString: string;
  tableNo: string;
  collectTime: string;
  isDineIn: boolean;
  needTakeAway: boolean;
  orderTime: any;

  constructor(public commonService: CommonService) { }

  ngOnChanges() {
    if (this.orderContent) {
      this.itemCon = this.orderContent.itemContent;
      if (this.itemCon.orderDetails) {
        this.setUpFormula();
      }
    }
  }

  private setUpFormula() {
    this.setUpOrderList();
    this.contact = `tel:${this.itemCon.billDetails.contact}`;
    this.contactString = this.itemCon.billDetails.contact;
    this.needTakeAway = this.itemCon.billDetails.needTakeAway;
    this.orderTime = this.removeTimeZero(format(parseISO(this.itemCon.createdTime), 'hh:mma'));
    this.setUpResponseDetails();
    this.tableNo = this.itemCon.billDetails.tableNo;
    this.collectTime = this.itemCon.billDetails.collectTime;
    this.isDineIn = this.itemCon.billDetails.isDineIn;
  }

  private removeTimeZero(value) {
    let result = value;
    if (result.charAt(0) === '0') {
      result = result.substr(1);
    }
    return result;
  }

  private setUpOrderList() {
    this.orderList = this.itemCon.orderDetails.map(val => {
      if (val.remarkObject) {
        const itemRemarks = val.remarkObject.map(val2 => {
          const result = val2.children.map(val3 => ({
            remarkShortName: this.getRemarkNameDifferently(val3.name, val3.shortName),
            remarkPrice: val3.price
          }));
          return result[0];
        });
        return {
          itemQuantity: val.quantity,
          itemShortName: this.getNameDifferently(val.itemName, val.itemShortName, val.itemCode),
          itemPrice: val.itemPrice,
          needTakeAway: val.needTakeAway,
          takeAwayFee: this.getTakeAwayFee(),
          itemRemarks: itemRemarks,
          extraRemark: val.extraRemark
        };
      } else {
        return {
          itemQuantity: val.quantity,
          itemShortName: this.getNameDifferently(val.itemName, val.itemShortName, val.itemCode),
          itemPrice: val.itemPrice,
          needTakeAway: val.needTakeAway,
          takeAwayFee: this.getTakeAwayFee(),
          extraRemark: val.extraRemark
        };
      }
    });
  }

  private getTakeAwayFee() {
    if (this.menu.td.hasTakeAway && this.menu.td.hasTakeAwayFee) {
      return (this.menu.td.hasTakeAwayPerPackage) ? this.menu.td.takeAwayFee.toFixed(2) : '-';
    } else {
      return '-';
    }
  }

  private getNameDifferently(full, short, code) {
    switch (this.menu.md.displayMode) {
      case 'fullName': return full;
      case 'shortName': return short || full;
      case 'itemCode': return code || short;
      default: return full;
    }
  }

  private getRemarkNameDifferently(full, short) {
    switch (this.menu.md.displayMode) {
      case 'fullName': return full;
      case 'shortName': return short || full;
      default: return full;
    }
  }

  private setUpResponseDetails() {
    if (this.itemCon.status !== 'PC' && this.itemCon.status !== 'CF') {
      const res = this.itemCon.responseDetails;
      if (res) {
        if (res.description) {
          this.setUpResDetails(res);
        }
      }
    }
  }

  private setUpResDetails(res) {
    this.res = {
      hasResponseDetails: true,
      description: res.description,
      newSubTotal: (res.subTotal).toFixed(2),
      amountType: res.amountType,
      descriptionPrice: (res.amountPrice).toFixed(2),
      newPackagingFee: (this.zero(res.packagingFee)).toFixed(2),
      newTaxCharge: this.zero(res.taxCharge).toFixed(2),
      newServiceCharge: this.zero(res.serviceCharge).toFixed(2),
      newRoundingType: res.roundingType,
      newRoundingValue: (res.roundingAdjustment).toFixed(2),
      newTotalPrice: (res.totalPrice).toFixed(2),
    };
  }

  private zero(value) {
    return value || 0;
  }

  getPrice(price) {
    return price === 0 ? '-' : price.toFixed(2);
  }

}
