import { Component, OnInit, Input } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard'
import _ from "lodash";
import { Subscription } from "rxjs";
import { Store } from '@ngrx/store';
import { AppState } from "../../../../../app.state";

@Component({
  selector: 'app-private-end-event',
  templateUrl: './private-end-event.component.html',
  styleUrls: ['./private-end-event.component.sass']
})
export class PrivateEndEventComponent implements OnInit {
  @Input() eventData;
  winners = []
  losers = []
  userSub: Subscription;
  award = "none";


  constructor(
    private _clipboardService: ClipboardService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.userSub = this.store.select('user').subscribe((x) => {
      if (x.length != 0) {
        this.letsFindActivites(x[0]._id);
      }
    });
    this.letsFindWinner();
  }

  letsFindActivites(id) {
    console.log(this.eventData)
    let find = _.find(this.eventData.parcipiantAnswers, (o) => { return o.userId == id });
    if (find) {
      if (find.answer == Number(this.eventData.finalAnswer)) {
        this.award = "winner"
      } else {
        this.award = "loser"
      }
    }

  }

  letsFindWinner() {
    for (let i = 0; i < this.eventData.parcipiantAnswers.length; i++) {
      if (this.eventData.parcipiantAnswers[i].answer == Number(this.eventData.finalAnswer)) {
        this.winners.push(this.eventData.parcipiantAnswers[i])
      } else {
        this.losers.push(this.eventData.parcipiantAnswers[i])
      }
    }
  }

  copyToClickBoard() {
    let href = window.location.hostname
    let path = href == "localhost" ? 'http://localhost:4200' : href
    this._clipboardService.copy(`${path}/public_event/${this.eventData.id}`)
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

}
