import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router";
import { GetService } from '../../services/get.service';
import * as moment from 'moment';
import { Answer } from '../../models/Answer.model';
import _ from 'lodash';
import Web3 from 'web3';
import Contract from '../../services/contract';
import { PostService } from '../../services/post.service';
import LoomEthCoin from '../../services/LoomEthCoin';
import * as CoinsActios from '../../actions/coins.actions';
import { faCheck } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.sass']
})
export class ValidateComponent implements OnDestroy {
  private spinner: boolean = true;
  private questions: any;
  myAnswers: Answer[] = [];
  userWallet: any;
  coinInfo = null;
  faCheck = faCheck;
  errorValidator = {
    idError: null,
    message: undefined
  }
  userData: any = []
  storeUserSubscribe;
  storeCoinsSubscrive;




  constructor(
    private store: Store<AppState>,
    private router: Router,
    private getService: GetService,
    private postService: PostService
  ) {
    this.storeUserSubscribe = this.store.select("user").subscribe((x) => {
      if (x.length === 0) {
        this.router.navigate(['~ki339203/home'])
      } else {
        this.userWallet = x[0].wallet;
        this.userData = x[0];
        this.getData();
      }
    });
    this.storeCoinsSubscrive = this.store.select("coins").subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
      }
    })
  }

  getMultyIcon(answers, i) {
    let index = answers.indexOf(i);
    return index !== -1 ? true : false
  }

  getData() {
   this.getService.get("question/get_all_private").subscribe((x) => {
      this.questions = _.orderBy(x, ['endTime'], ['asc']);
      this.questions.forEach((data, i) => {
        let z = {
          event_id: data.id,
          answer: this.findAnswer(data),
          from: data.from,
          multy: data.multiChose,
          answered: this.findAnswered(data),
          multyAnswer: this.findMultyAnswer(data)
        }

        this.myAnswers.push(z);
      });
      this.spinner = false;

      console.log(this.questions)
    })
  }


  findMultyAnswer(data) {
    let z = []
    let search = _.filter(data.validatorsAnswers, { 'wallet': this.userWallet });
    search.forEach((x) => {
      z.push(x.answer)
    })
    return z
  }

  findAnswer(data) {
    let findParticipiant = _.findIndex(data.validatorsAnswers, { "wallet": this.userWallet })
    return findParticipiant !== -1 ? data.validatorsAnswers[findParticipiant].answer : undefined;
  }

  findAnswered(data) {
    if (data.multiChose) {
      return this.findMultyAnswer(data).length !== 0 ? true : false;
    } else {
      return this.findAnswer(data) !== undefined ? true : false;
    }
  }


  getParticipantsPercentage(answerIndex, questionIndex) {
    if (this.questions[questionIndex].parcipiantAnswers !== undefined) {
      let quantity = this.questions[questionIndex].parcipiantAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(this.questions[questionIndex].answerQuantity)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  getValidatorsPercentage(answerIndex, questionIndex) {
    if (this.questions[questionIndex].validatorsAnswers !== undefined) {
      let quantity = this.questions[questionIndex].validatorsAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(this.questions[questionIndex].validatorsQuantity)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  getPosition(data) {
    let findParticipiant = _.findIndex(data.parcipiantAnswers, { "wallet": this.userWallet })
    if (findParticipiant !== -1) {
      let findInHost = _.findIndex(this.userData.listHostEvents, { "event": data.id })
      if (findInHost !== -1) {
        return 'Host, Participiant'
      } else {
        return "Participiant"
      }
    } else {
      let findValidator = _.findIndex(data.validatorsAnswers, { "wallet": this.userWallet })
      if (findValidator !== -1) {
        let findInHost = _.findIndex(this.userData.listHostEvents, { "event": data.id })
        if (findInHost !== -1) {
          return 'Host, Validator'
        } else {
          return "Validator"
        }
      } else {
        let findInParticInvites = _.findIndex(this.userData.listParticipantEvents, { "event": data.id })
        if (findInParticInvites !== -1) {
          return "invited as participiant"
        } else {
          let findInValidatorInvites = _.findIndex(this.userData.listValidatorEvents, { "event": data.id })
          if (findInValidatorInvites !== -1) {
            return 'invited as validator'
          } else {
            let findInHost = _.findIndex(this.userData.listHostEvents, { "event": data.id })
            if (findInHost !== -1) {
              return 'Host'
            } else {
              return "Guest"
            }
          }
        }
      }
    }
  }


  getEndValidation(data) {
    let date = new Date(data.endTime * 1000);
    let x = date.setDate(date.getDate() + 7);
    return Number((new Date(x).getTime() / 1000).toFixed(0));
  }

  timeGuardText(data) {
    let dateNow = Number((new Date().getTime() / 1000).toFixed(0));
    if (data.endTime > dateNow) {
      let date = new Date(data.endTime * 1000);
      return "Start " + moment(date, "YYYYMMDDhhmm").fromNow();
    } else {
      return "Validate now!";
    }

  }

  timeGuard(data) {
    let dateNow = Number((new Date().getTime() / 1000).toFixed(0));
    if (data.endTime > dateNow) {
      return true
    } else {
      return false;
    }
  }

  makeAnswer(data, i) {
    let index = _.findIndex(this.myAnswers, { 'event_id': data.id, 'from': data.from });
    this.myAnswers[index].answer = i;
    this.errorValidator.idError = null;
    this.errorValidator.message = undefined;
  }

  setAnswer(dataAnswer) {
    let answer = _.find(this.myAnswers, { 'event_id': dataAnswer.id, 'from': dataAnswer.from });
    if (answer.multy) {
      if (answer.multyAnswer.length === 0) {
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Chose at leas one answer"
      } else {
        // multy answer
        //  this.setToDB(answer, dataAnswer)
      }
    } else {
      if (answer.answer === undefined) {
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Chose at leas one answer"
      } else {
        this.setToLoomNetwork(answer, dataAnswer);
      }
    }
  }

  async setToLoomNetwork(answer, dataAnswer) {

    let contract = new Contract();
    var _question_id = dataAnswer.id;
    var _whichAnswer = answer.answer;
    let contr = await contract.initContract()
    let validator = await contr.methods.setTimeValidator(_question_id).call();
    console.log("validatin number: " + validator);

    switch (Number(validator)) {
      case 0:
        let sendToContract = await contr.methods.setValidator(_question_id, _whichAnswer).send();
        if (sendToContract.transactionHash !== undefined) {
          this.setToDB(answer, dataAnswer, sendToContract.transactionHash)
        }
        break;
      case 1:
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Event not started yeat."
        break;
      case 2:
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Event not started yeat."
        break;
      case 3:
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "You have been like the participant in this event. The participant can't be the validator."
        break;
    }

  }


  setToDB(answer, dataAnswer, transactionHash) {
    let data = {
      multy: answer.multy,
      event_id: answer.event_id,
      date: new Date(),
      answer: answer.answer,
      multyAnswer: answer.multyAnswer,
      transactionHash: transactionHash,
      wallet: this.userWallet,
      from: "validator",
      validatorsQuantity: dataAnswer.validatorsQuantity + 1
    }
    console.log(data);
    this.postService.post("answer", data).subscribe(async () => {
      let index = _.findIndex(this.myAnswers, { 'event_id': dataAnswer.id, 'from': dataAnswer.from });
      this.myAnswers[index].answered = true;

      this.getData();
      let web3 = new Web3(window.web3.currentProvider);
      let loomEthCoinData = new LoomEthCoin()
      await loomEthCoinData.load(web3)

      this.coinInfo = await loomEthCoinData._updateBalances()
      console.log(this.coinInfo)
      this.store.dispatch(new CoinsActios.UpdateCoins({ loomBalance: this.coinInfo.loomBalance, mainNetBalance: this.coinInfo.mainNetBalance }))

    },
      (err) => {
        console.log(err)
      })
  }

  ngOnDestroy(){
    this.storeUserSubscribe.unsubscribe();
    this.storeCoinsSubscrive.unsubscribe();
  }


}

