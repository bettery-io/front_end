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


  ngOnInit() {
    this.calculateDate()
  }

  calculateDate() {
    const oneDay = 24 * 60 * 60 * 1000; 
    let startDate = new Date();
    let endTime = new Date(this.timer * 1000);

    let hour = Math.abs(startDate.getHours() - endTime.getHours());
    let minutes = Math.abs(startDate.getMinutes() - endTime.getMinutes());

    this.day = Math.round(Math.abs((startDate.getTime() - endTime.getTime()) / oneDay));
    this.hour = hour > 9 ? hour : "0" + hour;
    this.minutes = minutes > 9 ? minutes : "0" + minutes;

    if(startDate > endTime){
      this.future = 'sinse'
    }else{
      this.future = 'in'
    }


    setTimeout(() => {
      this.calculateDate()
    }, 1000);
  }

}
