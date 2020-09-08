import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.sass']
})
export class ValidateComponent implements OnInit {
  @Input() eventData;
  timeIsValid: boolean;
  answerForm: FormGroup;
  userData;
  date;
  month;
  year;
  hour;
  minutes;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder
  ) {
    this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.userData = x[0]
      }
    });
  }

  ngOnInit(): void {
    this.checkTimeIsValid();
    this.answerForm = this.formBuilder.group({
      answer: ["", Validators.required],
      amount: ["", Validators.required]
    })
  }

  get f() { return this.answerForm.controls; }

  checkTimeIsValid() {
    let time = Number((Date.now() / 1000).toFixed(0))
    this.timeIsValid = this.eventData.endTime - time > 0;
    if (this.timeIsValid) { this.calculateDate() }
  }

  calculateDate() {
    let endTime = new Date(this.eventData.endTime * 1000);
    this.date = endTime.getDate() >= 10 ? endTime.getDate() : "0" + endTime.getDate();
    let month = endTime.getMonth();
    var monthtext = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this.month = monthtext[month];
    this.year = endTime.getFullYear();
    this.hour = endTime.getHours() >= 10 ? endTime.getHours() : "0" + endTime.getHours();
    this.minutes = endTime.getMinutes() >= 10 ? endTime.getMinutes() : "0" + endTime.getMinutes();
  }

}
