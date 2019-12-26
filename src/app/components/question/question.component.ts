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
            setTimeout(() => {
              this.info(question.id)
            }, 3000)
          } else {
            this.getDatafromDb(data);
          }
        });
      });
  }


  getDatafromDb(data) {
    this.postService.post("question/get_by_id", data)
      .subscribe((x: Question) => {
        if (x.id === undefined) {
          this.empty = true
          this.spinner = false
        } else {
          this.question = x
          let z = {
            event_id: this.question.id,
            answer: this.findAnswer(this.question),
            from: this.question.from,
            multy: this.question.multiChose,
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
    if (data.multiChose) {
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
      return ((quantity.length / Number(this.question.answerQuantity)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  getValidatorsPercentage(answerIndex) {
    if (this.question.validatorsAnswers !== undefined) {
      let quantity = this.question.validatorsAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(this.question.validatorsQuantity)) * 100).toFixed(0);
    } else {
      return 0
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
          this.setToLoomNetwork(this.myAnswers.answer, dataAnswer);
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
      wallet: this.userWallet,
      from: "participant",
      answerQuantity: dataAnswer.answerQuantity + 1
    }
    console.log(data);
    this.postService.post("answer", data).subscribe(async () => {
      let index = _.findIndex(this.myAnswers, { 'event_id': dataAnswer.id, 'from': dataAnswer.from });
      this.myAnswers[index].answered = true;
      this.errorValidator.idError = null;
      this.errorValidator.message = undefined;

      this.getDatafromDb(dataAnswer.id);
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

  setValidation(dataAnswer) {
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
          this.setToLoomNetworkValidation(this.myAnswers.answer, dataAnswer);
        }
      }
    }
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
      wallet: this.userWallet,
      from: "validator",
      validatorsQuantity: dataAnswer.validatorsQuantity + 1
    }
    console.log(data);
    this.postService.post("answer", data).subscribe(async () => {
      let index = _.findIndex(this.myAnswers, { 'event_id': dataAnswer.id, 'from': dataAnswer.from });
      this.myAnswers[index].answered = true;
      this.errorValidator.idError = null;
      this.errorValidator.message = undefined;

      this.getDatafromDb(dataAnswer.id);
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


  weiConvert(data) {
    let web3 = new Web3();
    return web3.utils.fromWei(String(data), 'ether')
  }

  ngOnDestroy() {
    this.CoinsSubscribe.unsubscribe();
    this.RouterSubscribe.unsubscribe();
    this.UserSubscribe.unsubscribe();
  }

}
