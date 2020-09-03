import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { ClipboardService } from 'ngx-clipboard'
import { GetService } from '../../../../services/get.service';
import { PostService } from '../../../../services/post.service'
import maticInit from '../../../../contract/maticInit.js'
import Contract from '../../../../contract/contract';


@Component({
  selector: 'public-event-mobile',
  templateUrl: './public-event.component.html',
  styleUrls: ['./public-event.component.sass']
})
export class PublicEventComponent implements OnInit {
  @Input() formData;
  @Output() goBack = new EventEmitter();
  created = false;
  day;
  hour;
  minutes;
  seconds;
  nickName;
  host
  quizData;

  constructor(
    private store: Store<AppState>,
    private _clipboardService: ClipboardService,
    private getSevice: GetService,
    private PostService: PostService
  ) {
    this.store.select("user").subscribe((x) => {
      console.log(x)
      if (x.length !== 0) {
        this.nickName = x[0].nickName;
        this.host = x;
      }
    })
  }

  ngOnInit(): void {
    console.log(this.formData)
  }

  cancel() {
    this.goBack.next();
  }

  timeToBet() {
    if (this.formData.exactTimeBool) {
      return `${this.formData.exactDay} ${this.formData.exactMonth} ${this.formData.exactYear}, ${this.formData.exactHour} : ${this.formData.exactMinutes}`;
    } else {
      return this.formData.publicEndTime.name
    }
  }

  expertsName() {
    if (this.formData.expertsCountType === "company") {
      return "10% of Players"
    } else {
      return this.formData.expertsCount
    }
  }

  betWith() {
    if (this.formData.tokenType === "token") {
      return "BTY (Minimum bet is 1 BTY)"
    } else {
      return "ETH (Minimum bet is 0.001 ETH)"
    }
  }

  tokenCharacter() {
    if (this.formData.tokenType === "token") {
      return "BTY"
    } else {
      return "ETH"
    }
  }

  copyToClickBoard() {
    this._clipboardService.copy(`www.bettery.io/public_event/${this.quizData._id}`)
  }

  generateID() {
    return this.getSevice.get("publicEvents/createId")
  }

  getStartTime() {
    return Number((new Date().getTime() / 1000).toFixed(0));
  }

  getTimeStamp(strDate) {
    return Number((new Date(strDate).getTime() / 1000).toFixed(0));
  }

  getEndTime() {
    if (!this.formData.exactTimeBool) {
      return (this.formData.publicEndTime.date / 1000).toFixed(0);
    } else {
      let day = this.formData.exactDay;
      let month = this.formData.exactMonth;
      let year = this.formData.exactYear;
      let hour = this.formData.exactHour;
      let minute = this.formData.exactMinutes;
      let second = 0;
      return this.getTimeStamp(`${month}/${day}/${year} ${hour}:${minute}:${second}`)
    }
  }

  createEvent() {
    let id = this.generateID()
    id.subscribe((x: any) => {
      this.sendToContract(x._id);
    }, (err) => {
      console.log(err)
      console.log("error from generate id")
    })
  }

  async sendToContract(id) {
    let matic = new maticInit(this.host[0].verifier);
    let userWallet = await matic.getUserAccount()
    let contract = new Contract()

    let payEther = this.formData.tokenType === "token" ? false : true;
    let startTime = this.getStartTime();
    let endTime = Number(this.getEndTime());
    let percentHost = 0;
    let percentValidator = 0;
    let questionQuantity = this.formData.answers.length;
    let validatorsAmount = this.formData.expertsCountType === "company" ? 0 : this.formData.expertsCount;
    let validatorsQuantityWay = this.formData.expertsCountType === "company" ? true : false

    try {
      let sendToContract = await contract.createPublicEvent(
        id,
        startTime,
        endTime,
        percentHost,
        percentValidator,
        questionQuantity,
        validatorsAmount,
        true, //_pathHoldMoney
        payEther,
        validatorsQuantityWay,
        userWallet,
        this.host[0].verifier
      )
      if (sendToContract.transactionHash !== undefined) {
        this.setToDb(id, sendToContract.transactionHash);
      }
    } catch (error) {
      console.log(error);
      this.deleteEvent(id)
    }
  }

  setToDb(id, transactionHash) {
    // think about status

    this.quizData = {
      _id: id,
      status: "deployed",
      host: this.host[0]._id,
      question: this.formData.question,
      hashtags: [], // TO DO
      answers: this.formData.answers.map((x) => {
        return x.name
      }),
      multiChoise: false, // TO DO
      startTime: this.getStartTime(),
      endTime: Number(this.getEndTime()),
      private: false, // TO DO
      parcipiant: [], // TO DO
      validators: [], // TO DO
      answerAmount: 0,
      validated: 0,
      validatorsAmount: this.formData.expertsCountType === "company" ? 0 : this.formData.expertsCount, // TO DO
      money: 0, // TO DO
      finalAnswer: undefined,
      transactionHash: transactionHash,
      showDistribution: true, // TO DO
      getCoinsForHold: 0,
      currencyType: this.formData.tokenType
    }

    this.PostService.post("publicEvents/set", this.quizData)
      .subscribe(
        () => {
          this.created = true;
          this.calculateDate()
          console.log("set to db DONE")
        },
        (err) => {
          console.log("set qestion error");
          console.log(err);
        })
  }

  deleteEvent(id) {
    let data = {
      id: id
    }
    this.PostService.post("delete_event_id", data)
      .subscribe(() => {
      },
        (err) => {
          console.log("from delete wallet")
          console.log(err)
        })
  }

  calculateDate() {
    let startDate = new Date();
    let endTime = new Date(this.quizData.endTime * 1000);
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

}
