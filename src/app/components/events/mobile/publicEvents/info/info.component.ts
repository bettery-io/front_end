import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.sass']
})
export class InfoComponent implements OnInit {
  @Input() joinedAs;
  @Output() goBack = new EventEmitter();;
  @Output() agree = new EventEmitter();;

  constructor() { }

  ngOnInit(): void {
  }

  cancel() {
    this.goBack.next();
  }

  agreeButton() {
    this.agree.next();
  }

}
