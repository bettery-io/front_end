import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import _ from 'lodash';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../app.state';
import Contract from '../../../../../contract/contract';
import {PostService} from '../../../../../services/post.service';
import {Subscription} from 'rxjs';
import {PrivEventMobile} from '../../../../../models/PrivEventMobile.model';
import {User} from '../../../../../models/User.model';


@Component({
  selector: 'app-private-form',
  templateUrl: './private-form.component.html',
  styleUrls: ['./private-form.component.sass']
})
export class PrivateFormComponent implements OnInit, OnDestroy {
  answerForm: FormGroup;
  @Input() data: PrivEventMobile;
  formValid: boolean;
  @Output() changed = new EventEmitter<boolean>();
  userData: User;
  errorMessage = undefined;
  userSub: Subscription;
  postSub: Subscription;
  spinnerLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private postService: PostService,
  ) {
    this.userSub = this.store.select('user').subscribe((x: User[]) => {
      if (x.length != 0) {
        this.userData = x[0];
      }
    });

    this.answerForm = formBuilder.group({
      answer: ['', Validators.required]
    });
  }

  get f() {
    return this.answerForm.controls;
  }


  ngOnInit(): void {
  }

  sendAnswer(answerForm: any) {
    if (answerForm.status === 'INVALID') {
      this.formValid = true;
      return;
    }
    const index = _.findIndex(this.data.answers, (el => {
      return el === answerForm.value.answer;
    }));
    this.sendToBlockchain(index);
  }

  async sendToBlockchain(answer) {
    this.spinnerLoading = true;
    let id = this.data.id;
    let wallet = this.userData.wallet;
    let verifier = this.userData.verifier;
    let contract = new Contract();
    let contr = await contract.privateEventContract();
    let validator = await contr.methods.timeAnswerValidation(id).call();
    switch (Number(validator)) {
      case 0:
        try {
          let transaction = await contract.participateOnPrivateEvent(id, answer, wallet, verifier);
          if (transaction.transactionHash !== undefined) {
            this.sendToDb(transaction.transactionHash, answer);
          }
        } catch (error) {
          this.spinnerLoading = false;
          console.log(error);
        }
        break;
      case 1:
        this.spinnerLoading = false;
        this.errorMessage = 'Event not started yeat.';
        break;
      case 2:
        this.spinnerLoading = false;
        this.errorMessage = 'Event is finished.';
        break;
    }
  }

  sendToDb(txHash, answer) {
    let data = {
      eventId: this.data.id,
      date: new Date(),
      answer: answer,
      transactionHash: txHash,
      from: this.userData._id,
    };
    this.postSub = this.postService.post('privateEvents/participate', data).subscribe(async () => {
      this.spinnerLoading = false;
      this.betOrBackBtn(false);
      this.errorMessage = undefined;
    }, (err) => {
      this.spinnerLoading = false;
      console.log(err);
    });
  }

  betOrBackBtn(increased: any) {
    this.changed.emit(increased);
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
