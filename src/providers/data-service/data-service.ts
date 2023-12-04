import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

class RefreshContent {
  refreshOrder: boolean;
  refreshFeedback: boolean;
}

@Injectable()
export class DataService {

  private refreshContentSource = new BehaviorSubject(new RefreshContent());
  currentRefreshContent = this.refreshContentSource.asObservable();

  changeRefreshContent(options: any) {
    this.refreshContentSource.next(options);
  }

}
