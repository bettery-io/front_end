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

  playersCount() {
    return this.eventData.parcipiantAnswers == undefined ? 0 : this.eventData.parcipiantAnswers.length
  }

  expertCount() {
    return this.eventData.validatorsAnswers == undefined ? 0 : this.eventData.validatorsAnswers.length
  }


}
