import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../../../../share/info-modal/info-modal.component';;;;
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.state';
import { Subscription } from 'rxjs';
import _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard';
import {PubEventMobile} from '../../../../../models/PubEventMobile.model';

@Component({
  selector: 'event-finish',
  templateUrl: './event-finish.component.html',
  styleUrls: ['./event-finish.component.sass']
})
export class EventFinishComponent implements OnInit, OnDestroy {
  @Input() eventData: PubEventMobile;
  status = undefined;
  hostStatus = undefined;
  amount = undefined;
  info = undefined;
  userSub: Subscription;
  userData = undefined;
  pool = 0;
  currencyType: string;
  viewMore: number = null;
  coinType: string = undefined;
  host: boolean = false;
  role: string = undefined;
  winner: boolean = false;
  playerIndex: number;

  constructor(
    private modalService: NgbModal,
    private store: Store<AppState>,
    private _clipboardService: ClipboardService
  ) {}

  ngOnInit() {
    this.currencyType = this.eventData.currencyType == "token" ? "BTY" : "ETH";
    if (this.eventData.parcipiantAnswers != undefined) {
      this.eventData.parcipiantAnswers.forEach(x => {
        this.pool = this.pool + Number(x.amount);
      });
    }
    this.userSub = this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.userData = x[0]
        if (this.eventData.host.id === x[0]._id) {
          this.host = true;
        }
        this.letsFindWinner(x[0]);
      } else {
        this.status = undefined;
        this.amount = undefined;
        this.info = undefined;
        this.userData = undefined;
        this.pool = 0;
        this.host = false;
        this.role = undefined;
        this.winner = false;
        this.playerIndex = undefined;
      }
    });
  }

  viewMoreToggle(i) {
    this.viewMore == i ? this.viewMore = null : this.viewMore = i;
  }

  letsFindWinner(user) {
    let findValidator = _.findIndex(this.eventData.validatorsAnswers, (x) => { return x.userId == user._id })
    if (findValidator !== -1) {
      this.playerIndex = findValidator;
      this.role = "Expert"
      this.winner = this.eventData.validatorsAnswers[findValidator].answer == this.eventData.finalAnswer;
      this.status = this.eventData.validatorsAnswers[findValidator].answer == this.eventData.finalAnswer ? "YOU EARNED" : "";
      this.amount = this.eventData.validatorsAnswers[findValidator].answer == this.eventData.finalAnswer ? this.letsCalcalteWinner("expert", 0) : "YOU WERE WRONG";
      this.info = this.eventData.validatorsAnswers[findValidator].answer == this.eventData.finalAnswer ? `Soon, users will get extra BTY minted from events.` : "You’ll lose Rep once Reputation system is added.";
    } else {
      if (this.eventData.parcipiantAnswers != undefined) {
        let findPlayer = _.findIndex(this.eventData.parcipiantAnswers, (x) => { return x.userId == user._id })
        if (findPlayer !== -1) {
          this.playerIndex = findPlayer;
          this.role = "Player"
          this.winner = this.eventData.parcipiantAnswers[findPlayer].answer == this.eventData.finalAnswer;
          this.status = this.eventData.parcipiantAnswers[findPlayer].answer == this.eventData.finalAnswer ? "YOU WON" : "YOU LOST";
          this.amount = this.eventData.parcipiantAnswers[findPlayer].answer == this.eventData.finalAnswer ? this.letsCalcalteWinner("player", this.eventData.parcipiantAnswers[findPlayer].amount) : this.eventData.parcipiantAnswers[findPlayer].amount + " " + this.currencyType;
          this.info = this.eventData.parcipiantAnswers[findPlayer].answer == this.eventData.finalAnswer ? "Soon, users will get extra BTY minted from events." : `You didn’t win, but have 1 BTY to win next time!`;
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
      this.info = `Soon, users will get extra BTY minted from events.`;
    }
  }

  getHostWin() {
    return this.letsCalcalteWinner("host", 0);
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
      let validators = 0
      for (let i = 0; i < this.eventData.validatorsAnswers.length; i++) {
        if (this.eventData.validatorsAnswers[i].answer == this.eventData.finalAnswer) {
          validators++;
        }
      }
      return (this.getPercent(loserPool, 5) / validators).toFixed(2) + " " + this.currencyType
    } else if (from == "player") {
      return (amount + ((this.getPercent(loserPool, 90) * amount) / winnerPool)).toFixed(2) + " " + this.currencyType;
    } else if (from == "host") {
      return this.getPercent(loserPool, 3).toFixed(2) + " " + this.currencyType;
    }
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
    if (text == "") {
      return {
        'color': '#C10000',
        'font-size': '24px',
        'padding-top': '25px',
        'padding-bottom': '29px'
      }
    } else if (z !== -1 || x !== -1) {
      return {
        'color': '#C10000'
      }
    } else {
      return {
        'color': '#FFD200'
      }
    }
  }

  playersBet(i) {
    if (this.eventData.parcipiantAnswers == undefined) {
      return 0
    } else {
      let data = _.filter(this.eventData.parcipiantAnswers, (x) => { return x.answer == i })
      return data.length
    }
  }

  expertsBet(i) {
    if (this.eventData.validatorsAnswers == undefined) {
      return 0
    } else {
      let data = _.filter(this.eventData.validatorsAnswers, (x) => { return x.answer == i })
      return data.length + "/" + this.eventData.validatorsAnswers.length
    }
  }

  playersPers(i) {
    return ((this.playersBet(i) * 100) / this.playersCount()) + "%";
  }

  totalBetAmount(i) {
    let data = _.filter(this.eventData.parcipiantAnswers, (x) => { return x.answer == i })
    if (data.length != 0) {
      let amount = 0;
      data.forEach(x => {
        amount += x.amount
      });
      return amount;
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

  biggestWin() {
    let loserPool = 0;
    let biggest = 0;
    let winnerPool = 0;
    let totalPart = this.eventData.parcipiantAnswers;
    let finalAnswer = this.eventData.finalAnswer
    for (let i = 0; i < totalPart.length; i++) {
      // get loser pool
      if (totalPart[i].answer != finalAnswer) {
        loserPool += totalPart[i].amount
      }
      // get winner pool
      if (totalPart[i].answer == finalAnswer) {
        winnerPool += totalPart[i].amount
      }
      // fing biggest win
      if (totalPart[i].amount > biggest && totalPart[i].answer == finalAnswer) {
        biggest = totalPart[i].amount;
      }
    }
    let percent = this.getPercent(loserPool, 90)
    return (biggest + ((percent * biggest) / winnerPool)).toFixed(2)
  }

  getPercent(from, percent) {
    return (from * percent) / 100;
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  createEventText() {
    if (!this.userData) {
      return 'CREATE YOUR OWN EVENT'
    } else {
      if (this.host) {
        return 'HOST ANOTHER EVENT'
      } else {
        return 'HOST YOUR OWN EVENT'
      }
    }
  }

  getImgFlag() {
    if (!this.userData) {
      return "flagImg hostFlag"
    } else {
      if (this.host) {
        return "flagImg hostFlag"
      } else if (this.role == "Expert") {
        return "flagImg expertFlag"
      } else if (this.role == "Player") {
        return "flagImg playerFlag"
      }
    }
  }

  titleColor() {
    if (!this.userData) {
      return "color: #FFD300"
    } else {
      if (this.host) {
        return "color: #FFD300"
      } else if (this.role == "Expert") {
        return "color: #BF94E4"
      } else if (this.role == "Player") {
        return "color: #34DDDD"
      }
    }
  }

  roleColor() {
    if (this.role == "Expert") {
      return "color: #BF94E4"
    } else if (this.role == "Player") {
      return "color: #34DDDD"
    }
  }

  copyToClickBoard() {
    let href = window.location.hostname
    let path = href == "localhost" ? 'http://localhost:4200' : href
    this._clipboardService.copy(`${path}/public_event/${this.eventData.id}`)
  }

}
