import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../../../../share/info-modal/info-modal.component'
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.state';
import { Subscription } from 'rxjs';
import _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard'

@Component({
  selector: 'event-finish',
  templateUrl: './event-finish.component.html',
  styleUrls: ['./event-finish.component.sass']
})
export class EventFinishComponent implements OnInit, OnDestroy {
  @Input() eventData;
  status = "TODO"
  amount = "TODO"
  info = undefined;
  userSub: Subscription
  userData;
  pool = 0;
  currencyType;

  constructor(
    private modalService: NgbModal,
    private store: Store<AppState>,
    private _clipboardService: ClipboardService
  ) {
    this.userSub = this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.userData = x[0]
        this.letsFindWinner(x[0]);
      }
    });
  }

  ngOnInit() {
    this.currencyType = this.eventData.currencyType == "token" ? "BTY" : "ETH";
    if (this.eventData.parcipiantAnswers != undefined) {
      this.eventData.parcipiantAnswers.forEach(x => {
        this.pool = this.pool + Number(x.amount);
      });
    }

  }

  letsFindWinner(user) {
    let findValidator = _.findIndex(this.eventData.validatorsAnswers, (x) => { return x.userId == user._id })
    if (findValidator !== -1) {
      this.status = this.eventData.validatorsAnswers[findValidator].answer == this.eventData.finalAnswer ? "YOU WON" : "YOU WERE WRONG";
      this.amount = this.eventData.validatorsAnswers[findValidator].answer == this.eventData.finalAnswer ? this.letsCalcalteWinner("expert", 0) : "5% Expert rank";
      this.info = this.eventData.validatorsAnswers[findValidator].answer == this.eventData.finalAnswer ? `Bettery grows by social knowledge from events. In return, enjoy an extra <span style='color: #FFD300'>23 BTY</span> as our thanks!` : "will be taken away from you once ranking system is in place.";
    } else {
      if (this.eventData.parcipiantAnswers != undefined) {
        let findPlayer = _.findIndex(this.eventData.parcipiantAnswers, (x) => { return x.userId == user._id })
        if (findPlayer !== -1) {
          this.status = this.eventData.parcipiantAnswers[findPlayer].answer == this.eventData.finalAnswer ? "YOU WON" : "YOU LOST";
          this.amount = this.eventData.parcipiantAnswers[findPlayer].answer == this.eventData.finalAnswer ? this.letsCalcalteWinner("player", this.eventData.parcipiantAnswers[findPlayer].amount) : this.eventData.parcipiantAnswers[findPlayer].amount + " " + this.currencyType;
          this.info = `Bettery grows by social knowledge from events. In return, enjoy an extra <span style='color: #FFD300'>23 BTY</span> as our thanks!`;
        } else {
          this.findHost(user)
        }
      } else {
        this.findHost(user)
      }
    }
  }

  findHost(user) {
    if (this.eventData.host.id === user._id) {
      this.status = "You earned";
      this.amount = this.letsCalcalteWinner("host", 0);
      this.info = `Bettery grows by social knowledge from events. In return, enjoy an extra <span style='color: #FFD300'>23 BTY</span> as our thanks!`;
    }
  }

  letsCalcalteWinner(from, amount) {
    let loserPool = 0;
    let winnerPool = 0;
    if (this.eventData.parcipiantAnswers != undefined) {
      this.eventData.parcipiantAnswers.forEach(x => {
        if (x.answer != this.eventData.finalAnswer) {
          loserPool = loserPool + Number(x.amount);
        }
      });
    }
    winnerPool = this.pool - loserPool;
    if (from == "expert") {
      let findPercForExpert = (loserPool * 3) / 100;
      return (findPercForExpert / this.eventData.validatorsAnswers.length).toFixed(2) + " " + this.currencyType
    } else if (from == "player") {
      let playersFee = (loserPool * 90) / 100
      return (amount + ((playersFee * amount) / winnerPool)).toFixed(2) + " " + this.currencyType;
    } else if (from == "host") {
      return ((loserPool * 5) / 100).toFixed(2) + " " + this.currencyType;
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

  getAmountColor(text) {
    let z = text.indexOf("LOST")
    let x = text.indexOf("WRONG")
    if (z !== -1 || x !== -1) {
      return {
        'color': '#C10000'
      }
    } else {
      return {
        'color': '#FFD200'
      }
    }
  }

  playersBet() {
    if (this.eventData.parcipiantAnswers == undefined) {
      return 0
    } else {
      let data = _.filter(this.eventData.parcipiantAnswers, (x) => { return x.answer == this.eventData.finalAnswer })
      return data.length
    }
  }

  expertsBet() {
    if (this.eventData.validatorsAnswers == undefined) {
      return 0
    } else {
      let data = _.filter(this.eventData.validatorsAnswers, (x) => { return x.answer == this.eventData.finalAnswer })
      return data.length
    }
  }

  playersPers() {
    return ((this.playersBet() * 100) / this.playersCount()) + "%";
  }

  expertPers() {
    return ((this.expertsBet() * 100) / this.expertCount()) + "%";
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

  copyToClickBoard() {
    let href = window.location.hostname
    let path = href == "localhost" ? 'http://localhost:4200' : href
    this._clipboardService.copy(`${path}/public_event/${this.eventData.id}`)
  }

}
