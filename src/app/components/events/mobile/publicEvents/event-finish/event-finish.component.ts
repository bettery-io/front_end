import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'event-finish',
  templateUrl: './event-finish.component.html',
  styleUrls: ['./event-finish.component.sass']
})
export class EventFinishComponent implements OnInit {
  @Input() eventData;
  status = "TODO"
  amount = "TODO"

  constructor() { }

  ngOnInit(): void {
  }

  getPartPos(i) {
    let index = [4, 3, 2, 1]
    return {
      'z-index': index[i],
      'position': 'relative',
      'right': (i * 10) + "px"
    }
  }

  playersCount(){
    return this.eventData.parcipiantAnswers == undefined ? 0 : this.eventData.parcipiantAnswers.length
  }

  expertCount(){
    return this.eventData.validatorsAnswers == undefined ? 0 : this.eventData.validatorsAnswers.length
  }


}
