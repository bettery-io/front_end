import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import _ from "lodash";
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.state';
import Contract from "../../../../../contract/contract";

@Component({
  selector: 'app-private-form',
  templateUrl: './private-form.component.html',
  styleUrls: ['./private-form.component.sass']
})
export class PrivateFormComponent implements OnInit {
  answerForm: FormGroup;
  @Input() data: any;
  count: boolean;
  formValid: boolean;
  @Output() changed = new EventEmitter<boolean>();
  userData;
  constructor(private formBuilder: FormBuilder, private store: Store<AppState>) {
    this.store.select('user').subscribe((x) => {
      if (x.length != 0) {
        this.userData = x[0];
        console.log(this.userData);
      }
    });

    this.answerForm = formBuilder.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  sendAnswer(answerForm: any) {
    if (answerForm.status === 'INVALID') {
      this.formValid = true;
      return;
    }
    const index = _.findIndex(this.data.answers, (el => { return el === answerForm.value.answer; }));
    this.sendToBlockchain(index, answerForm);

  }

  sendToBlockchain(anser, answerForm) {
    let id = this.data.id
    let wallet = this.userData.wallet
    let verifier = this.userData.verifier
    let contract = new Contract();
    try {
      let transaction = contract.participateOnPrivateEvent(id, anser, wallet, verifier);
      console.log(transaction)
    } catch (error) {
      console.log(error);
    }


  }

  sendToDb() {
    //    this.count = true;

  }

  change(increased: any) {
    this.changed.emit(increased);
  }
}
