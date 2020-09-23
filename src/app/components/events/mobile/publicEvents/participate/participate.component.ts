import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard'
import Web3 from "web3"
import Contract from '../../../../../contract/contract';
import _ from "lodash";
import { PostService } from '../../../../../services/post.service';
import web3Obj from '../../../../../helpers/torus'
import maticInit from '../../../../../contract/maticInit.js'
import * as CoinsActios from '../../../../../actions/coins.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'participate',
  templateUrl: './participate.component.html',
  styleUrls: ['./participate.component.sass']
})
export class ParticipateComponent implements OnInit, OnDestroy {
  @Input() eventData;
  @Output() goBack = new EventEmitter();
  @Output() goViewStatus = new EventEmitter<number>();
  userData;
  answerForm: FormGroup;
  coinType: string;
  answered: boolean = false;
  submitted: boolean = false;
  spinnerLoading: boolean = false;
  errorMessage: string;
  coinInfo;
  userSub: Subscription
  coinsSub: Subscription
  postSub: Subscription


  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private _clipboardService: ClipboardService,
    private postService: PostService,
  ) {
    this.userSub = this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.userData = x[0]
      }
    });
    this.coinsSub = this.store.select("coins").subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
      }
    })
  }

  ngOnInit(): void {
    this.coinType = this.eventData.currencyType == "token" ? "BTY" : "ETH"
    this.answerForm = this.formBuilder.group({
      answer: ["", Validators.required],
      amount: ["", [Validators.required, Validators.min(this.coinType == 'BTY' ? 1 : 0.01)]]
    })
  }

  get f() { return this.answerForm.controls; }

  copyToClickBoard() {
    let href = window.location.hostname
    let path = href == "localhost" ? 'http://localhost:4200' : href
    this._clipboardService.copy(`${path}/public_event/${this.eventData.id}`)
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
      this.spinnerLoading = true;
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
        this.spinnerLoading = false;
        this.errorMessage = "Event not started yeat."
      } else if (Number(validator) === 2) {
        this.spinnerLoading = false;
        this.errorMessage = "Event is finished"
      }
    }
  }

  setToDB(answer, dataAnswer, transactionHash, amount) {
    let web3 = new Web3();
    var _money = web3.utils.fromWei(String(amount), 'ether')
    let data = {
      event_id: dataAnswer.id,
      date: new Date(),
      answer: answer,
      transactionHash: transactionHash,
      userId: this.userData._id,
      from: "participant",
      currencyType: dataAnswer.currencyType,
      answerAmount: dataAnswer.answerAmount + 1,
      amount: Number(_money)
    }
    this.postSub = this.postService.post("answer", data).subscribe(async () => {
      await this.updateBalance();
      this.errorMessage = undefined;
      this.spinnerLoading = false
      this.answered = true;
    },
      (err) => {
        this.spinnerLoading = false
        console.log(err)
      })
  }

  viewStatus() {
    this.goViewStatus.next(this.eventData.id);
  }

  async updateBalance() {
    let web3 = new Web3(this.userData.verifier === "metamask" ? window.web3.currentProvider : web3Obj.torus.provider);
    let mainBalance = await web3.eth.getBalance(this.userData.wallet);

    let matic = new maticInit(this.userData.verifier);
    let MTXToken = await matic.getMTXBalance();
    let TokenBalance = await matic.getERC20Balance();

    let maticTokenBalanceToEth = web3.utils.fromWei(MTXToken, "ether");
    let mainEther = web3.utils.fromWei(mainBalance, "ether")
    let tokBal = web3.utils.fromWei(TokenBalance, "ether")

    this.store.dispatch(new CoinsActios.UpdateCoins({
      loomBalance: maticTokenBalanceToEth,
      mainNetBalance: mainEther,
      tokenBalance: tokBal
    }))
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.coinsSub) {
      this.coinsSub.unsubscribe();
    }
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
  }


}
