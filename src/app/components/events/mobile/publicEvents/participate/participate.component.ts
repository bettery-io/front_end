import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'participate',
  templateUrl: './participate.component.html',
  styleUrls: ['./participate.component.sass']
})
export class ParticipateComponent implements OnInit {
  @Input() eventData;
  @Output() goBack = new EventEmitter();;
  userData;
  answerForm: FormGroup;


  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder
  ) {
    this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        console.log(x);
        this.userData = x[0]
      }
    });
  }

  ngOnInit(): void {
    this.answerForm = this.formBuilder.group({
      answer: ["", Validators.required],
      amount: [0, Validators.required]
    })
  }

  cancel() {
    this.goBack.next();
  }

  bet() {

  }

}
