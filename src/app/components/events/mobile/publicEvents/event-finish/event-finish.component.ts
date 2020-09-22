import { Component, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../../../../share/info-modal/info-modal.component'
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.state';
import { Subscription } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'event-finish',
  templateUrl: './event-finish.component.html',
  styleUrls: ['./event-finish.component.sass']
})
export class EventFinishComponent implements OnDestroy {
  @Input() eventData;
  status = "TODO"
  amount = "TODO"
  type = undefined;
  userSub: Subscription
  userData;

  constructor(
    private modalService: NgbModal,
    private store: Store<AppState>
  ) {
    this.userSub = this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.userData = x[0]
        this.letsFindWinner(x[0]);
      }
    });
  }

  letsFindWinner(user) {
    let currencyType = this.eventData.currencyType == "token" ? "BTY" : "ETH";
    let findValidator = _.findIndex(this.eventData.validatorsAnswers, (x) => { return x.userId == user._id })
    if (findValidator !== -1) {
      this.status = this.eventData.validatorsAnswers[findValidator].answer == this.eventData.finalAnswer ? "YOU WON" : "YOU WERE WRONG";
      this.amount = this.eventData.validatorsAnswers[findValidator].answer == this.eventData.finalAnswer ? this.letsCalcalteWinner("expert", 0) : "5% Expert rank";
      this.type = this.eventData.validatorsAnswers[findValidator].answer == this.eventData.finalAnswer ? "expert win" : "expert lost";
    } else {
      let findPlayer = _.findIndex(this.eventData.parcipiantAnswers, (x) => { return x.userId == user._id })
      if (findPlayer !== -1) {
        this.status = this.eventData.parcipiantAnswers[findPlayer].answer == this.eventData.finalAnswer ? "YOU WON" : "YOU LOST";
        this.amount = this.eventData.parcipiantAnswers[findPlayer].answer == this.eventData.finalAnswer ? this.letsCalcalteWinner("player", this.eventData.parcipiantAnswers[findPlayer].amount) : this.eventData.parcipiantAnswers[findPlayer].amount + " " + currencyType;
        this.type = this.eventData.parcipiantAnswers[findPlayer].answer == this.eventData.finalAnswer ? "player win" : "player lost";
      } else {
        // to do host
      }
    }
    console.log(this.eventData);
  }

  letsCalcalteWinner(from, amount) {
    let currencyType = this.eventData.currencyType == "token" ? "BTY" : "ETH";
    let pool = 0;
    let loserPool = 0;
    let winnerPool = 0;
    this.eventData.parcipiantAnswers.forEach(x => {
      pool = pool + Number(x.amount);
    });
    this.eventData.parcipiantAnswers.forEach(x => {
      if (x.answer != this.eventData.finalAnswer) {
        loserPool = loserPool + Number(x.amount);
      }
    });

    winnerPool = pool - loserPool;
    if (from == "expert") {
      let findPercForExpert = (loserPool * 3) / 100;
      return (findPercForExpert / this.eventData.validatorsAnswers.length).toFixed(2) + " " + currencyType
    } else {
      let playersFee = (loserPool * 90) / 100
      return (amount + ((playersFee * amount) / winnerPool)).toFixed(2) + " " + currencyType;
    }
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
