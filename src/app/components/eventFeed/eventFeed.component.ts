import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router";
import { GetService } from '../../services/get.service';
import { Answer } from '../../models/Answer.model';
import _ from 'lodash';
import Web3 from 'web3';
import Contract from '../../services/contract';
import { PostService } from '../../services/post.service';
import LoomEthCoin from '../../services/LoomEthCoin';
import * as CoinsActios from '../../actions/coins.actions';
import * as UserActions from '../../actions/user.actions';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/User.model';


@Component({
  selector: 'eventFeed',
  templateUrl: './eventFeed.component.html',
  styleUrls: ['./eventFeed.component.sass']
})
export class EventFeedComponent implements OnDestroy {
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
  userData: any = [];
  storeUserSubscribe;
  storeCoinsSubscrive;
  allData = [];
  parcipiantFilter = true;
  validateFilter = true;
  historyFilter = false;

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
        this.userWallet = x[0].wallet
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
      this.myAnswers = [];
      let data = _.orderBy(x, ['endTime'], ['asc']);
      console.log(data)
      this.allData = data

      this.questions = _.filter(data, (o) => { return o.finalAnswers === null })
      this.myAnswers = this.questions.map((data) => {
        return {
          event_id: data.id,
          answer: this.findAnswer(data),
          from: data.from,
          multy: data.multiChose,
          answered: this.findAnswered(data),
          multyAnswer: this.findMultyAnswer(data)
        }
      });
      this.spinner = false;
    })
  }

  validationGuard(data) {
    let timeNow = Number((new Date().getTime() / 1000).toFixed(0))
    if (data.finalAnswers === null) {
      if (data.endTime <= timeNow && data.hostWallet === this.userWallet) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }

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

  validatorGuard(data) {
    if (data.finalAnswers !== null) {
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

  getEndValidation(data) {
    let date = new Date(data.endTime * 1000);
    let x = date.setDate(date.getDate() + 7);
    return Number((new Date(x).getTime() / 1000).toFixed(0));
  }

  timeGuard(data) {
    let dateNow = Number((new Date().getTime() / 1000).toFixed(0));
    if (data.startTime > dateNow) {
      return true
    } else {
      return false;
    }
  }

  getActiveQuantity(from) {
    let timeNow = Number((new Date().getTime() / 1000).toFixed(0))
    if (from === "participant") {
      return _.filter(this.allData, (o) => { return o.endTime >= timeNow }).length
    } else if (from === "validator") {
      return this.allData.filter((data) => {
        return data.endTime <= timeNow && data.hostWallet !== this.userWallet
      }).length
    } else if (from === "history") {
      return _.filter(this.allData, (o) => { return o.finalAnswers !== null }).length
    }
  }

  filter() {
    setTimeout(() => {
      let timeNow = Number((new Date().getTime() / 1000).toFixed(0))
      let z

      if (this.parcipiantFilter && this.validateFilter && this.historyFilter) {
        z = this.allData;
      } else if (!this.parcipiantFilter && !this.validateFilter && !this.historyFilter) {
        z = []
      } else if (!this.parcipiantFilter && this.validateFilter && this.historyFilter) {
        let x = _.filter(this.allData, (o) => { return o.endTime <= timeNow })
        let y = _.filter(this.allData, (o) => { return o.finalAnswers !== null })
        y.forEach((e) => {
          x.push(e)
        })
        z = _.orderBy(x, ['endTime'], ['asc']);
      } else if (this.parcipiantFilter && !this.validateFilter && this.historyFilter) {
        let x = _.filter(this.allData, (o) => { return o.endTime >= timeNow })
        let y = _.filter(this.allData, (o) => { return o.finalAnswers !== null })

        y.forEach((e) => {
          x.push(e)
        })
        z = _.orderBy(x, ['endTime'], ['asc']);
      } else if (!this.parcipiantFilter && this.validateFilter && !this.historyFilter) {
        z = _.filter(this.allData, (o) => { return o.endTime <= timeNow })
      } else if (this.parcipiantFilter && !this.validateFilter && !this.historyFilter) {
        z = _.filter(this.allData, (o) => { return o.endTime >= timeNow })
      } else if (this.parcipiantFilter && this.validateFilter && !this.historyFilter) {
        z = _.filter(this.allData, (o) => { return o.finalAnswers === null })
      } else if (!this.parcipiantFilter && !this.validateFilter && this.historyFilter) {
        z = _.filter(this.allData, (o) => { return o.finalAnswers !== null })
      }

      this.myAnswers = z.map((data, i) => {
        return {
          event_id: data.id,
          answer: this.findAnswer(data),
          from: data.from,
          multy: data.multiChose,
          answered: this.findAnswered(data),
          multyAnswer: this.findMultyAnswer(data)
        }
      })

      this.questions = z;
    }, 100)
  }

  makeAnswer(data, i) {
    let index = _.findIndex(this.myAnswers, { 'event_id': data.id, 'from': data.from });
    this.myAnswers[index].answer = i;
    this.errorValidator.idError = null;
    this.errorValidator.message = undefined;
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
        if (this.nameGuard(dataAnswer.endTime) === "Participate") {
          this.setToLoomNetwork(answer, dataAnswer);
        } else {
          this.setToLoomNetworkValidation(answer, dataAnswer)
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
    this.postService.post("answer", data).subscribe(async () => {
      let index = _.findIndex(this.myAnswers, { 'event_id': dataAnswer.id, 'from': dataAnswer.from });
      this.myAnswers[index].answered = true;
      this.errorValidator.idError = null;
      this.errorValidator.message = undefined;

      this.updateUser();
      this.getData();

      let web3 = new Web3(window.web3.currentProvider);
      let loomEthCoinData = new LoomEthCoin()
      await loomEthCoinData.load(web3)

      this.coinInfo = await loomEthCoinData._updateBalances()
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

  updateUser() {
    let data = {
      wallet: this.userWallet
    }
    this.postService.post("user/validate", data)
      .subscribe(
        (currentUser: User) => {
          this.store.dispatch(new UserActions.UpdateUser({
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

  participantGuard(data, i) {
    if (data.showDistribution === true) {
      return true
    } else {
      if (this.myAnswers[i].answered === true) {
        return true
      } else {
        return false
      }
    }
  }

  ngOnDestroy() {
    this.storeUserSubscribe.unsubscribe();
    this.storeCoinsSubscrive.unsubscribe();
  }


}
