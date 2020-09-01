import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { ClipboardService } from 'ngx-clipboard'
import { GetService } from '../../../../services/get.service';


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
  eventData;

  constructor(
    private store: Store<AppState>,
    private _clipboardService: ClipboardService,
    private getSevice: GetService
  ) {
    this.store.select("user").subscribe((x) => {
      console.log(x)
      if (x.length !== 0) {
        this.nickName = x[0].nickName;
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
    this._clipboardService.copy(`www.bettery.io/${this.eventData._id}`)
  }

  generateID() {
    return this.getSevice.get("publicEvents/createId")
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

  sendToContract(id) {
    // this.created = true;
    // this.calculateDate()
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

}
