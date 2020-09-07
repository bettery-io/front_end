import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'event-start',
  templateUrl: './event-start.component.html',
  styleUrls: ['./event-start.component.sass']
})
export class EventStartComponent implements OnInit {
  @Input() eventData;
  letsJoin: boolean = false;
  info: boolean = false;
  goToAction: boolean = false;
  joinedAs: string = undefined;
  day;
  hour;
  minutes;
  seconds;

  constructor() { }

  ngOnInit(): void {
  }

  join() {
    this.letsJoin = true;
    this.calculateDate();
  }

  joinAsPlayer() {
    this.info = true;
    this.joinedAs = "player"

  }

  joinAsExpert() {
    this.info = true;
    this.joinedAs = "expert"
  }

  showEvent() {
    if (this.letsJoin && this.joinedAs == undefined) {
      return true;
    } else {
      return false;
    }
  }

  showInfo() {
    if (this.info && !this.goToAction) {
      return true;
    } else {
      return false;
    }
  }

  showParticipate() {
    if (this.joinedAs !== undefined && this.goToAction) {
      if (this.joinedAs == "player") {
        return true;
      } else {
        return false;
      }
    }
  }

  showValidate() {
    if (this.joinedAs !== undefined && this.goToAction) {
      if (this.joinedAs == "expert") {
        return true;
      } else {
        return false;
      }
    }
  }

  agree() {
    this.goToAction = true;
  }

  goBack() {
    this.info = false;
    this.joinedAs = undefined;
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
