import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard'
import Contract from '../../../../../contract/contract';
import { PostService } from '../../../../../services/post.service';
import _ from "lodash";
import { Subscription } from 'rxjs';

@Component({
  selector: 'validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.sass']
})
export class ValidateComponent implements OnInit, OnDestroy {
  @Input() eventData;
  @Output() goBack = new EventEmitter();
  @Output() goViewStatus = new EventEmitter<number>();
  timeIsValid: boolean;
  submitted: boolean = false;
  spinnerLoading: boolean = false

  answerForm: FormGroup;
  errorMessage: string;
  userData;
  hour;
  minutes;
  seconds
  userSub: Subscription;
  postSub: Subscription;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private postService: PostService,
    private _clipboardService: ClipboardService
  ) {
    this.userSub = this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.userData = x[0]
      }
    });
  }

  ngOnInit(): void {
    this.checkTimeIsValid();
    this.answerForm = this.formBuilder.group({
      answer: ["", Validators.required],
    })
  }

  get f() {
    return this.answerForm.controls;
  }

  playersAmount() {
    return this.eventData.parcipiantAnswers == undefined ? 0 : this.eventData.parcipiantAnswers.length
  }

  checkTimeIsValid() {
    let time = Number((Date.now() / 1000).toFixed(0))
    this.timeIsValid = this.eventData.endTime - time > 0;
    if (this.timeIsValid) {
      this.calculateDate()
    }
  }

  calculateDate() {
    let startDate = new Date();
    let endTime = new Date(this.eventData.endTime * 1000);
    var diffMs = (endTime.getTime() - startDate.getTime());
    let hour = Math.floor(Math.abs((diffMs % 86400000) / 3600000));
    let minutes = Math.floor(Math.abs(((diffMs % 86400000) % 3600000) / 60000));
    let second = Math.round(Math.abs((((diffMs % 86400000) % 3600000) % 60000) / 1000));

    this.hour = Number(hour) > 9 ? hour : "0" + hour;
    this.minutes = Number(minutes) > 9 ? minutes : "0" + minutes;
    if (second === 60) {
      this.seconds = "00"
    } else {
      this.seconds = second > 9 ? second : "0" + second;
    }
    setTimeout(() => {
      this.calculateDate()
    }, 1000);
  }

  cancel() {
    this.goBack.next();
  }

  copyToClickBoard() {
    let href = window.location.hostname
    let path = href == "localhost" ? 'http://localhost:4200' : href
    this._clipboardService.copy(`${path}/public_event/${this.eventData.id}`)
  }

  remainderExperts() {
    let expertDone = this.eventData.validatorsAnswers == undefined ? 0 : this.eventData.validatorsAnswers.length
    let epxertIn = this.eventData.validatorsAmount == 0 ? this.expertAmount() : this.eventData.validatorsAmount
    return epxertIn - expertDone;
  }

  expertAmount() {
    let part = this.eventData.parcipiantAnswers == undefined ? 0 : this.eventData.parcipiantAnswers.length;
    if (part == 0) {
      return 3;
    } else {
      return (part * 10) / 100 <= 3 ? 3 : Number(((part * 10) / 100).toFixed(0));
    }
  }

  validate() {
    this.submitted = true;
    if (this.answerForm.invalid) {
      return
    }
    this.setValidation()
  }

  async setValidation() {
    this.spinnerLoading = true;

    let contract = new Contract();
    var _question_id = this.eventData.id;
    var _whichAnswer = _.findIndex(this.eventData.answers, (o) => { return o == this.answerForm.value.answer; });
    let contr = await contract.publicEventContract()
    let validator = await contr.methods.setTimeValidator(_question_id).call();

    switch (Number(validator)) {
      case 0:
        let sendToContract = await contract.validateOnPublicEvent(_question_id, _whichAnswer, this.userData.wallet, this.userData.verifier)
        if (sendToContract.transactionHash !== undefined) {
          this.setToDBValidation(_whichAnswer, this.eventData, sendToContract.transactionHash)
        }
        break;
      case 1:
        this.spinnerLoading = false;
        this.errorMessage = "Event not started yeat."
        break;
      case 2:
        this.spinnerLoading = false;
        this.errorMessage = "Event is finished."
        break;
      case 3:
        this.spinnerLoading = false;
        this.errorMessage = "You have been like the participant in this event. The participant can't be the validator."
        break;
    }
  }

  setToDBValidation(answer, dataAnswer, transactionHash) {
    let data = {
      event_id: dataAnswer.id,
      date: new Date(),
      answer: answer,
      transactionHash: transactionHash,
      userId: this.userData._id,
      from: "validator",
      currencyType: dataAnswer.currencyType,
      validated: dataAnswer.validated + 1,
      amount: 0
    }
    this.postSub = this.postService.post("answer", data).subscribe(async () => {
      this.errorMessage = undefined;
      this.spinnerLoading = false;
      this.viewStatus();
    },
      (err) => {
        this.spinnerLoading = false;
        console.log(err)
      })
  }

  viewStatus() {
    this.goViewStatus.next(this.eventData.id);
  }


  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
  }

}
