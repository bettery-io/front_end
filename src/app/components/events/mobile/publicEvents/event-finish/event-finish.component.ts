import { Component, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../../../../share/info-modal/info-modal.component'
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'event-finish',
  templateUrl: './event-finish.component.html',
  styleUrls: ['./event-finish.component.sass']
})
export class EventFinishComponent implements OnDestroy {
  @Input() eventData;
  status = "TODO"
  amount = "TODO"
  userSub: Subscription
  userData;

  constructor(
    private modalService: NgbModal,
    private store: Store<AppState>
  ) {
    this.userSub = this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.userData = x[0]
        this.letsFindWinner();
      }
    });
  }

  letsFindWinner(){
     console.log(this.eventData);
  }

  totalBet() {
    let count = 0
    let coinType = this.eventData.currencyType == "token" ? "BTY" : "ETH"
    if (this.eventData.parcipiantAnswers == undefined) {
      return count + " " + coinType;
    }
    this.eventData.parcipiantAnswers.forEach(x => {
      count += x.amount;
    });
    return count + " " + coinType;
  }

  getPartPos(i) {
    let index = [4, 3, 2, 1]
    return {
      'z-index': index[i],
      'position': 'relative',
      'right': (i * 10) + "px"
    }
  }

  playersCount() {
    return this.eventData.parcipiantAnswers == undefined ? 0 : this.eventData.parcipiantAnswers.length
  }

  expertCount() {
    return this.eventData.validatorsAnswers == undefined ? 0 : this.eventData.validatorsAnswers.length
  }

  openInfoModal(title, name, link) {
    const modalRef = this.modalService.open(InfoModalComponent, { centered: true });
    modalRef.componentInstance.boldName = title;
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.link = link;
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

}
