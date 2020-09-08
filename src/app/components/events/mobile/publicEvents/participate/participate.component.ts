import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard'
import Web3 from "web3"
import Contract from '../../../../../contract/contract';
import _ from "lodash";
import { PostService } from '../../../../../services/post.service';

@Component({
  selector: 'participate',
  templateUrl: './participate.component.html',
  styleUrls: ['./participate.component.sass']
})
export class ParticipateComponent implements OnInit {
  @Input() eventData;
  @Output() goBack = new EventEmitter();
  @Output() goViewStatus = new EventEmitter();
  userData;
  answerForm: FormGroup;
  coinType: string;
  answered: boolean = false;
  submitted: boolean = false;
  errorMessage: string;
  coinInfo;


  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private _clipboardService: ClipboardService,
    private postService: PostService,
  ) {
    this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.userData = x[0]
      }
    });
    this.store.select("coins").subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
      }
    })
  }

  ngOnInit(): void {
    this.answerForm = this.formBuilder.group({
      answer: ["", Validators.required],
      amount: ["", Validators.required]
    })
    this.coinType = this.eventData.currencyType == "token" ? "BTY" : "ETH"
  }

  get f() { return this.answerForm.controls; }

  copyToClickBoard() {
    this._clipboardService.copy(`www.bettery.io/public_event/${this.eventData.id}`)
  }

  cancel() {
    this.goBack.next();
  }

  async bet() {
    this.submitted = true;
    if (this.answerForm.invalid) {
      return;
    }
    let balance = this.eventData.currencyType == "token" ? this.coinInfo.tokenBalance : this.coinInfo.loomBalance;

    if (Number(balance) < Number(this.answerForm.value.amount)) {
      this.errorMessage = "Don't have enough " + this.coinType
    } else {
      let web3 = new Web3();
      let contract = new Contract();
      var _question_id = this.eventData.id;
      var _whichAnswer = _.findIndex(this.eventData.answers, (o) => { return o == this.answerForm.value.answer; });
      var _money = web3.utils.toWei(String(this.answerForm.value.amount), 'ether')
      let contr = await contract.publicEventContract()
      let validator = await contr.methods.setTimeAnswer(_question_id).call();
      if (Number(validator) === 0) {
        if (this.eventData.currencyType == "token") {
          await contract.approveBETToken(this.userData.wallet, _money, this.userData.verifier)
        } else {
          await contract.approveWETHToken(this.userData.wallet, _money, this.userData.verifier)
        }
        let sendToContract = await contract.participateOnPublicEvent(_question_id, _whichAnswer, _money, this.userData.wallet, this.userData.verifier)
        if (sendToContract.transactionHash !== undefined) {
          this.setToDB(_whichAnswer, this.eventData, sendToContract.transactionHash, _money)
        }
      } else if (Number(validator) === 1) {
        this.errorMessage = "Event not started yeat."
      } else if (Number(validator) === 2) {
        this.errorMessage = "Event is finished"
      }
    }
  }

  setToDB(answer, dataAnswer, transactionHash, amount) {
    let data = {
      event_id: dataAnswer.id,
      date: new Date(),
      answer: answer,
      transactionHash: transactionHash,
      userId: this.userData._id,
      from: "participant",
      currencyType: dataAnswer.currencyType,
      answerAmount: dataAnswer.answerAmount + 1,
      money: amount
    }
    console.log(data);
      this.postService.post("answer", data).subscribe(async () => {
        this.errorMessage = undefined;
        this.answered = true;
      },
        (err) => {
          console.log(err)
        })
  }

  viewStatus(){
    this.goViewStatus.next();
  }

}
