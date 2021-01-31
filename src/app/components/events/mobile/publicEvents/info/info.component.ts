import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {PubEventMobile} from '../../../../../models/PubEventMobile.model';

@Component({
  selector: 'info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.sass']
})
export class InfoComponent implements OnInit {
  @Input() joinedAs: string;
  @Input() eventData: PubEventMobile;
  @Output() goBack = new EventEmitter();
  @Output() agree = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  cancel() {
    this.goBack.next();
  }

  agreeButton() {
    this.agree.next();
  }

  showTerms() {
    const timeNow = Number((Date.now() / 1000).toFixed(0));
    if (this.joinedAs == "player") {
      return true
    } else {
      return !(this.eventData.endTime - timeNow > 0)
    }
  }

  buttonText() {
    const timeNow = Number((Date.now() / 1000).toFixed(0));
    if (this.joinedAs == "player") {
      return "AGREE"
    } else {
      return !(this.eventData.endTime - timeNow > 0) ? "AGREE" : "NEXT"
    }
  }

}
