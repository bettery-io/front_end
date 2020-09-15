import { Component, OnInit, Input } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard'
import _ from "lodash";

@Component({
  selector: 'app-private-end-event',
  templateUrl: './private-end-event.component.html',
  styleUrls: ['./private-end-event.component.sass']
})
export class PrivateEndEventComponent implements OnInit {
  @Input() eventData;
  winners = []
  losers = []


  constructor(
    private _clipboardService: ClipboardService
  ) { }

  ngOnInit(): void {
    console.log(this.eventData)
    this.letsFindWinner();
  }

  letsFindWinner(){
    for(let i = 0; i < this.eventData.parcipiantAnswers.length; i++){
      if(this.eventData.parcipiantAnswers[i].answer == Number(this.eventData.finalAnswer)){
        this.winners.push(this.eventData.parcipiantAnswers[i])
      }else{
        this.losers.push(this.eventData.parcipiantAnswers[i])
      }
    }
  }

  copyToClickBoard() {
    let href = window.location.hostname
    let path = href == "localhost" ? 'http://localhost:4200' : href
    this._clipboardService.copy(`${path}/public_event/${this.eventData.id}`)
  }

}
