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
  }

  copyToClickBoard() {
    let href = window.location.hostname
    let path = href == "localhost" ? 'http://localhost:4200' : href
    this._clipboardService.copy(`${path}/public_event/${this.eventData.id}`)
  }

}
