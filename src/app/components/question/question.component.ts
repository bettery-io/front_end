import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Question } from '../../models/Question.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router"
import Contract from '../../services/contract';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Answer } from 'src/app/models/Answer.model';
import _ from 'lodash';
import Web3 from 'web3';
import LoomEthCoin from '../../services/LoomEthCoin';
import * as CoinsActios from '../../actions/coins.actions';
import * as UserActions from '../../actions/user.actions';
import { User } from '../../models/User.model';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.sass']
})
export class QuestionComponent implements OnInit, OnDestroy {
  private spinner: boolean = true;
  private empty: boolean = false;
  private registError: boolean = false;
  private question: any;
  private singleAnswer: number;
  faCheck = faCheck;
  myAnswers: Answer;
  userWallet: any = undefined;
  errorValidator = {
    idError: null,
    message: undefined
  };
  infoData: any = undefined;
  coinInfo: any;
  userData: any = [];
  CoinsSubscribe;
  RouterSubscribe;
  UserSubscribe;
  historyAction: any = []

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private store: Store<AppState>,
  ) {
    this.CoinsSubscribe = this.store.select("coins").subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
      }
    })
  }

  ngOnInit() {
    this.RouterSubscribe = this.route.params
      .subscribe((question) => {
        let data = {
          id: Number(question.id)
        }

        this.UserSubscribe = this.store.select("user").subscribe((x) => {
          if (x.length !== 0) {
            this.userWallet = x[0].wallet
            this.userData = x[0]
            this.getDatafromDb(data);
            this.getHistoryById(data)
            setTimeout(() => {
              this.info(question.id)
            }, 3000)
          } else {
            this.getDatafromDb(data);
            this.getHistoryById(data);
          }
        });
      });
  }


  getDatafromDb(data) {
    this.postService.post("question/get_by_id", data)
      .subscribe((x: any) => {
        console.log(x)
        if (x.id === undefined) {
          this.empty = true
          this.spinner = false
        } else {
          this.question = x
          let z = {
            event_id: this.question.id,
            answer: this.findAnswer(this.question),
            from: this.question.from,
            multy: this.question.multiChoise,
            answered: this.findAnswered(this.question),
            multyAnswer: this.findMultyAnswer(this.question)
          }
          this.myAnswers = z;
          this.errorValidator.idError = null;
          this.errorValidator.message = undefined;
          this.spinner = false;
        }
      })
  }

  getHistoryById(id) {
    this.postService.post("history_quize/get_by_id", id)
      .subscribe((x: any) => {
       this.historyAction = x 
      }, (err) => {
        console.log(err)
      })
  }

  getMultyIcon(answers, i) {
    let index = answers.indexOf(i);
    return index !== -1 ? true : false
  }

  makeAnswer(i) {
    this.myAnswers.answer = i;
    this.errorValidator.idError = null;
    this.errorValidator.message = undefined;
  }


  findMultyAnswer(data) {
    let z = []
    let part = _.filter(data.parcipiantAnswers, { 'wallet': this.userWallet });
    part.forEach((x) => {
      z.push(x.answer)
    })
    if (z.length === 0) {
      let part = _.filter(data.validatorsAnswers, { 'wallet': this.userWallet });
      part.forEach((x) => {
        z.push(x.answer)
      })
      return z;
    } else {
      return z;
    }
  }

  findAnswer(data) {
    let findParticipiant = _.findIndex(data.parcipiantAnswers, { "wallet": this.userWallet })
    if (findParticipiant === -1) {
      let findValidators = _.findIndex(data.validatorsAnswers, { "wallet": this.userWallet })
      return findValidators !== -1 ? data.validatorsAnswers[findValidators].answer : undefined;
    } else {
      return data.parcipiantAnswers[findParticipiant].answer
    }
  }

  findAnswered(data) {
    if (data.multiChoise) {
      return this.findMultyAnswer(data).length !== 0 ? true : false;
    } else {
      return this.findAnswer(data) !== undefined ? true : false;
    }
  }

  sendAnswer() {
    this.store.select("user").subscribe((x) => {
      if (x.length === 0) {
        this.registError = true;
      } else {
        this.registError = false;
      }
    });
  }

  getPosition(data) {
    let findParticipiant = _.findIndex(data.parcipiantAnswers, { "wallet": this.userWallet })
    if (findParticipiant !== -1) {
      if (data.host == this.userWallet) {
        return 'Host, Participiant'
      } else {
        return "Participiant"
      }
    } else {
      let findValidator = _.findIndex(data.validatorsAnswers, { "wallet": this.userWallet })
      if (findValidator !== -1) {
        if (data.host === this.userData.wallet) {
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
            if (data.host === this.userData.wallet) {
              return 'Host'
            } else {
              return "Guest"
            }
          }
        }
      }
    }
  }

  validatorGuard(data) {
    if (data.finalAnswer !== null) {
      return true
    } else {
      if (this.getPosition(data) === "Guest") {
        return false
      } else if (this.getPosition(data) === 'invited as validator') {
        return false
      } else {
        return true
      }
    }
  }


  async info(id) {
    let contract = new Contract();
    let contr = await contract.initContract()
    this.infoData = await contr.methods.getQuestion(id).call();
    this.spinner = false
    console.log(this.infoData);
  }

  getEndValidation(data) {
    let date = new Date(data.endTime * 1000);
    let x = date.setDate(date.getDate() + 7);
    return Number((new Date(x).getTime() / 1000).toFixed(0));
  }


  getParticipantsPercentage(answerIndex) {
    if (this.question.parcipiantAnswers !== undefined) {
      let quantity = this.question.parcipiantAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(this.question.answerAmount)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  getValidatorsPercentage(answerIndex) {
    if (this.question.validatorsAnswers !== undefined) {
      let quantity = this.question.validatorsAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(this.question.validated)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  nameGuard(data) {
    let timeNow = Number((new Date().getTime() / 1000).toFixed(0))
    if (data >= timeNow) {
      return "Participate"
    } else {
      return "Validate"
    }
  }

  setAnswer(dataAnswer) {
    if (this.myAnswers.multy) {
      if (this.myAnswers.multyAnswer.length === 0) {
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Chose at leas one answer"
      } else {
        if (this.userWallet === undefined) {
          this.errorValidator.idError = dataAnswer.id
          this.errorValidator.message = "You must registr first"
        } else {
          // multy answer
          //  this.setToDB(answer, dataAnswer)
        }
      }
    } else {
      if (this.myAnswers.answer === undefined) {
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Chose at leas one answer"
      } else {
        if (this.userWallet === undefined) {
          this.errorValidator.idError = dataAnswer.id
          this.errorValidator.message = "You must registr first"
        } else {
          if (this.nameGuard(dataAnswer.endTime) === "Participate") {
            this.setToLoomNetwork(this.myAnswers, dataAnswer);
          } else {
            this.setToLoomNetworkValidation(this.myAnswers, dataAnswer);
          }
        }
      }
    }
  }

  async setToLoomNetwork(answer, dataAnswer) {
    if (Number(this.coinInfo.loomBalance) < dataAnswer.money) {
      this.errorValidator.idError = dataAnswer.id
      this.errorValidator.message = "Don't have enough money"
    } else {
      let web3 = new Web3();
      let contract = new Contract();
      var _question_id = dataAnswer.id;
      var _whichAnswer = answer.answer;
      console.log(_whichAnswer)
      var _money = web3.utils.toWei(String(dataAnswer.money), 'ether')
      let contr = await contract.initContract()
      let validator = await contr.methods.setTimeAnswer(_question_id).call();
      if (Number(validator) === 0) {
        let sendToContract = await contr.methods.setAnswer(_question_id, _whichAnswer).send({
          value: _money
        });
        if (sendToContract.transactionHash !== undefined) {
          this.setToDB(answer, dataAnswer, sendToContract.transactionHash)
        }
      } else if (Number(validator) === 1) {
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Event not started yeat."
      } else if (Number(validator) === 2) {
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Already finished"
      }
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
      userId: this.userData._id,
      from: "participant",
      answerAmount: dataAnswer.answerAmount + 1,
      money: dataAnswer.money
    }
    console.log(data);
    this.postService.post("answer", data).subscribe(async () => {
      this.myAnswers.answered = true;
      this.errorValidator.idError = null;
      this.errorValidator.message = undefined;

      let data = {
        id: Number(dataAnswer.id)
      }
      this.updateUser();
      this.getDatafromDb(data);
      this.info(dataAnswer.id);

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

  async setToLoomNetworkValidation(answer, dataAnswer) {

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
          this.setToDBValidation(answer, dataAnswer, sendToContract.transactionHash)
        }
        break;
      case 1:
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Event not started yeat."
        break;
      case 2:
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Event is finished."
        break;
      case 3:
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "You have been like the participant in this event. The participant can't be the validator."
        break;
    }
  }

  setToDBValidation(answer, dataAnswer, transactionHash) {
    let data = {
      multy: answer.multy,
      event_id: answer.event_id,
      date: new Date(),
      answer: answer.answer,
      multyAnswer: answer.multyAnswer,
      transactionHash: transactionHash,
      userId: this.userData._id,
      from: "validator",
      validated: dataAnswer.validated + 1,
      money: dataAnswer.money
    }
    console.log(data);
    this.postService.post("answer", data).subscribe(async () => {
      this.myAnswers.answered = true;
      this.errorValidator.idError = null;
      this.errorValidator.message = undefined;

      let data = {
        id: Number(dataAnswer.id)
      }
      this.getDatafromDb(data);

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

  updateUser() {
    let data = {
      wallet: this.userWallet
    }
    this.postService.post("user/validate", data)
      .subscribe(
        (currentUser: User) => {
          this.store.dispatch(new UserActions.UpdateUser({
            _id: currentUser._id,
            email: currentUser.email,
            nickName: currentUser.nickName,
            wallet: currentUser.wallet,
            listHostEvents: currentUser.listHostEvents,
            listParticipantEvents: currentUser.listParticipantEvents,
            listValidatorEvents: currentUser.listValidatorEvents,
            historyTransaction: currentUser.historyTransaction,
            avatar: currentUser.avatar
          }))
        })
  }

  participantGuard(data) {
    if (data.showDistribution === true) {
      return true
    } else {
      if (this.myAnswers.answered === true) {
        return true
      } else {
        return false
      }
    }
  }


  weiConvert(data) {
    let web3 = new Web3();
    let number = web3.utils.fromWei(String(data), 'ether')
    return Number(number).toFixed(4);
  }

  ngOnDestroy() {
    this.CoinsSubscribe.unsubscribe();
    this.RouterSubscribe.unsubscribe();
    this.UserSubscribe.unsubscribe();
  }

}
