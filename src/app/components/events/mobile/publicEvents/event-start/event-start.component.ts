import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'event-start',
  templateUrl: './event-start.component.html',
  styleUrls: ['./event-start.component.sass']
})
export class EventStartComponent implements OnInit {
  @Input() eventData;
  letsJoin: boolean = false;
  day;
  hour;
  minutes;
  seconds

  constructor() { }

  ngOnInit(): void {
  }

  join() {
    this.letsJoin = true;
    this.calculateDate();
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
