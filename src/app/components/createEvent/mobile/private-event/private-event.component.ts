import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GetService } from '../../../../services/get.service';
import { PostService } from '../../../../services/post.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import maticInit from '../../../../contract/maticInit.js';
import Contract from '../../../../contract/contract';
import { ClipboardService } from 'ngx-clipboard'
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { timeStamp } from 'console';

@Component({
  selector: 'private-event-modile',
  templateUrl: './private-event.component.html',
  styleUrls: ['./private-event.component.sass']
})
export class PrivateEventComponent implements OnInit, OnDestroy {
  @Input() formData;
  @Output() goBack = new EventEmitter();
  spinner: boolean = false;
  host;
  created = false;
  eventData;
  day;
  hour;
  minutes;
  seconds;
  userSub: Subscription
  idSub: Subscription
  postSub: Subscription
  createSub: Subscription
  spinnerLoading: boolean = false;



  constructor(
    private getSevice: GetService,
    private postService: PostService,
    private store: Store<AppState>,
    private _clipboardService: ClipboardService,
    private router: Router
  ) {
    this.userSub = this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.host = x;
      }
    });
  }

  ngOnInit(): void { }

  cancel() {
    this.goBack.next();
  }

  copyToClickBoard() {
    let href = window.location.hostname
    let path = href == "localhost" ? 'http://localhost:4200' : href
    this._clipboardService.copy(`${path}/private_event/${this.eventData._id}`)
  }

  generateID() {
    return this.getSevice.get("privateEvents/createId")
  }

  getStartTime() {
    return Number((Date.now() / 1000).toFixed(0));
  }

  getEndTime() {
    return Number((this.formData.privateEndTime.date / 1000).toFixed(0));
  }

  createEvent() {
    this.spinnerLoading = true;
    let id = this.generateID()
    this.idSub = id.subscribe((x: any) => {
      this.sendToContract(x._id);
    }, (err) => {
      this.spinnerLoading = false;
      console.log(err)
      console.log("error from generate id")
    })
  }

  async sendToContract(id) {
    console.log(this.host)
    this.spinner = true;
    let matic = new maticInit(this.host[0].verifier);
    let userWallet = await matic.getUserAccount()
    let startTime = this.getStartTime();
    let endTime = this.getEndTime();
    let winner = this.formData.winner;
    let loser = this.formData.losers;
    let questionQuantity = this.formData.answers.length;
    // TO DO
    let correctAnswerSetter = userWallet

    console.log(startTime, endTime, winner, loser, questionQuantity, userWallet)

    try {
      let contract = new Contract()
      let sendToContract = await contract.createPrivateEvent(id, startTime, endTime, winner, loser, questionQuantity, correctAnswerSetter, userWallet, this.host[0].verifier);
      if (sendToContract.transactionHash !== undefined) {
        this.setToDb(id, sendToContract.transactionHash);
      }

    } catch (err) {
      this.spinnerLoading = false;
      console.log(err);
      this.deleteEvent(id);
    }
  }

  deleteEvent(id) {
    let data = {
      id: id
    }
    this.postSub = this.postService.post("delete_event_id", data)
      .subscribe(() => {
        this.spinner = false;
      },
        (err) => {
          console.log("from delete wallet")
          console.log(err)
        })
  }

  setToDb(id, transactionHash) {

    this.eventData = {
      _id: id,
      host: this.host[0]._id,
      status: "deployed",
      answers: this.formData.answers.map((x) => {
        return x.name
      }),
      question: this.formData.question,
      startTime: this.getStartTime(),
      endTime: this.getEndTime(),
      transactionHash: transactionHash,
      winner: this.formData.winner,
      loser: this.formData.losers
    }

    this.createSub = this.postService.post("privateEvents/createEvent", this.eventData)
      .subscribe(
        () => {
          this.spinnerLoading = false;
          this.calculateDate();
          this.spinner = false;
          this.created = true;
        },
        (err) => {
          console.log("set qestion error");
          console.log(err);
        })
  }

  calculateDate() {
    let startDate = new Date();
    let endTime = new Date(this.eventData.endTime * 1000);
    var diffMs = (endTime.getTime() - startDate.getTime());
    this.day = Math.floor(Math.abs(diffMs / 86400000));
    let hour = Math.floor(Math.abs((diffMs % 86400000) / 3600000));
    let minutes = Math.floor(Math.abs(((diffMs % 86400000) % 3600000) / 60000));
    let second = Math.round(Math.abs((((diffMs % 86400000) % 3600000) % 60000) / 1000));

    this.hour = Number(hour) > 9 ? hour : "0" + hour;
    this.minutes = Number(minutes) > 9 ? minutes : "0" + minutes;
    if (second === 60) {
      this.seconds = "00"
    } else {
      this.seconds = second > 9 ? second : "0" + second;

    }


    setTimeout(() => {
      this.calculateDate()
    }, 1000);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.idSub.unsubscribe();
    this.postSub.unsubscribe();
    this.createSub.unsubscribe();
  }

}
