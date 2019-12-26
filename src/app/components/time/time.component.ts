import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.sass']
})
export class TimeComponent implements OnInit {

  @Input() timer: any

  day;
  hour: any;
  minutes: any;
  future: any;
  oneDay = 24 * 60 * 60 * 1000;
  oneHours = 60 * 60 * 1000;


  ngOnInit() {
    this.calculateDate()
  }

  calculateDate() {
    let startDate = new Date();

    let endTime = new Date(this.timer * 1000);
    var diffMs = (endTime.getTime() - startDate.getTime()); 
    this.day = Math.floor(Math.abs(diffMs / 86400000)); 
    let hour= Math.floor(Math.abs((diffMs % 86400000) / 3600000)); 
    let minutes = Math.round(Math.abs(((diffMs % 86400000) % 3600000) / 60000)); 

    this.hour = Number(hour) > 9 ? hour : "0" + hour;
    this.minutes = minutes > 9 ? minutes : "0" + minutes;

    if (startDate > endTime) {
      this.future = 'sinse'
    } else {
      this.future = 'in'
    }


    setTimeout(() => {
      this.calculateDate()
    }, 1000);
  }

}
