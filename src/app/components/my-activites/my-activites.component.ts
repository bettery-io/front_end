import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router"
import { PostService } from '../../services/post.service';
import * as moment from 'moment';
import { Answer } from '../../models/Answer.model';
import _ from 'lodash';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Contract from '../../services/contract';
import Web3 from 'web3';
import LoomEthCoin from '../../services/LoomEthCoin';
import * as CoinsActios from '../../actions/coins.actions';
import { NgbTabsetConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'my-activites',
  templateUrl: './my-activites.component.html',
  styleUrls: ['./my-activites.component.sass'],
  providers: [NgbTabsetConfig]
})
export class MyActivitesComponent implements OnInit {
  faCheck = faCheck;
  userWallet: string = undefined;
  allData: any = [];
  myActivites: any = [];
  spinner: boolean = true;
  hostFilet: boolean = true;
  parcipiantFilter: boolean = true;
  validateFilter: boolean = true;
  myAnswers: Answer[] = [];
  idErrorMoney: number = null;
  coinInfo = null;
  spinnerAnswer: number = 0;
  errorValidator = {
    idError: null,
    message: undefined
  }
  pathForApi = 'current';
  userData: any = [];
  UserSubscribe;
  CoinsSubscribe;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private postService: PostService,
    tabs: NgbTabsetConfig
  ) {
    tabs.justify = 'center';
    this.UserSubscribe = this.store.select("user").subscribe((x) => {
      if (x.length === 0) {
        this.router.navigate(['~ki339203/home'])
      } else {
        this.userWallet = x[0].wallet
        this.userData = x[0];
      }
    });
    this.CoinsSubscribe = this.store.select("coins").subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
      }
    })
  }

  ngOnInit() {
    if (this.userWallet != undefined) {
      this.getDataFromDb(this.pathForApi);
    }
  }

  tabChange($event: NgbTabChangeEvent) {
    this.hostFilet = true;
    this.parcipiantFilter = true;
    this.validateFilter = true;
    switch ($event.nextId) {
      case 'invitations':
        this.pathForApi = 'invites';
        this.spinner = true;
        this.getDataFromDb("invites");
        break;
      case 'current_events':
        this.pathForApi = 'current';
        this.spinner = true;
        this.getDataFromDb("current");
        break;
      case 'past_events':
        this.pathForApi = 'past';
        this.spinner = true;
        this.getDataFromDb("past");
        break;
      case 'host':
        this.pathForApi = 'host';
        this.spinner = true;
        this.getDataFromDb("host");
        break;
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

  validateDeleteButton(data) {
    let result = this.getPosition(data);
    let z = result.search("Host")
    if (z !== -1) {
      if (data.answerQuantity >= 1) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

  guardPath(data) {
    let result = this.getPosition(data);
    let searchHost = result.search("Host")
    if (searchHost === -1) {
      let searchValidator = result.search("articipiant")
      if (searchValidator === -1) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  getDataFromDb(from) {
    let data = {
      wallet: this.userWallet
    }
    this.postService.post("my_activites/" + from, data)
      .subscribe(async (x) => {
        this.myAnswers = [];
        this.myActivites = x;
        this.allData = x;
        this.allData.forEach((data, i) => {
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
      }, (err) => {
        console.log(err);
      })
  }

  removeDuplicates(array, key) {
    let lookup = {};
    let result = [];
    for (let i = 0; i < array.length; i++) {
      if (!lookup[array[i][key]]) {
        lookup[array[i][key]] = true;
        result.push(array[i]);
      }
    }
    return result;
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

  timeGuard(data) {
    let dateNow = Number((new Date().getTime() / 1000).toFixed(0));
    if (data.endTime > dateNow) {
      return true
    } else {
      return false;
    }
  }

  getEndValidation(data) {
    let date = new Date(data.endTime * 1000);
    let x = date.setDate(date.getDate() + 7);
    return Number((new Date(x).getTime() / 1000).toFixed(0));
  }

  filter() {
    setTimeout(() => {
      let data = this.allData
      if (!this.hostFilet) {
        data = data.filter((x) => x.from !== "Host");
      }
      if (!this.parcipiantFilter) {
        data = data.filter((x) => x.from !== "Participant");
      }
      if (!this.validateFilter) {
        data = data.filter((x) => x.from !== "Validator");
      }
      // let z = this.removeDuplicates(data, 'id');
      this.myActivites = data;
    }, 100)
  }

  getActiveQuantity(from) {
    let data = this.allData.filter((x) => x.from === from);
    // let z = this.removeDuplicates(data, 'id');
    return data.length
  }

  makeAnswer(data, i) {
    let index = _.findIndex(this.myAnswers, { 'event_id': data.id, 'from': data.from });
    this.myAnswers[index].answer = i;
    this.errorValidator.idError = null;
    this.errorValidator.message = undefined;
  }

  getParticipantsPercentage(answerIndex, questionIndex) {
    if (this.allData[questionIndex].parcipiantAnswers !== undefined) {
      let quantity = this.allData[questionIndex].parcipiantAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(this.allData[questionIndex].answerQuantity)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  getValidatorsPercentage(answerIndex, questionIndex) {
    if (this.allData[questionIndex].validatorsAnswers !== undefined) {
      let quantity = this.allData[questionIndex].validatorsAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(this.allData[questionIndex].validatorsQuantity)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  makeMultyAnswer(data, i, event) {
    this.errorValidator.idError = null;
    this.errorValidator.message = undefined;
    if (event.path[0].checked) {
      let findAnswer = _.findIndex(this.myAnswers, { 'event_id': data.id, 'from': data.from });
      this.myAnswers[findAnswer].multyAnswer.push(i);
    } else {
      let findAnswer = _.findIndex(this.myAnswers, { 'event_id': data.id, 'from': data.from });
      let index = this.myAnswers[findAnswer].multyAnswer.indexOf(i);
      if (index !== -1) {
        this.myAnswers[findAnswer].multyAnswer.splice(index, 1);
      }
    }
  }

  getMultyIcon(answers, i) {
    let index = answers.indexOf(i);
    return index !== -1 ? true : false
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
        if (this.guardPath(dataAnswer)) {
          this.setParticipiation(answer, dataAnswer);
        } else {
          this.setValidation(answer, dataAnswer)
        }
      }
    }
  }

  async setParticipiation(answer, dataAnswer) {
    console.log("setParticipiation work")
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

      switch (Number(validator)) {
        case 0:
          let sendToContract = await contr.methods.setAnswer(_question_id, _whichAnswer).send({
            value: _money
          });
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
          this.errorValidator.message = "Already finished"
          break;
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

      this.getDataFromDb(this.pathForApi);
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

  async setValidation(answer, dataAnswer) {
    console.log("validation work")
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

      this.getDataFromDb(this.pathForApi);
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


  async deleteEvent(data) {
    let id = data.id
    let contract = new Contract();
    let contr = await contract.initContract()
    let deleteValidator = await contr.methods.deleteEventValidator(id).call();
    if (Number(deleteValidator) === 0) {
      this.letsDeleteEvent(id, contr);
    } else if (Number(deleteValidator) === 1) {
      this.errorValidator.idError = id
      this.errorValidator.message = "You can't delete event because event has money on balance."
    } else if (Number(deleteValidator) === 2) {
      this.errorValidator.idError = id
      this.errorValidator.message = "You are now a owner of event, only owner can delete event."
    }

  }

  async letsDeleteEvent(id, contr) {
    let deleteEvent = await contr.methods.deleteEvent(id).send();
    if (deleteEvent.transactionHash !== undefined) {
      this.deleteFromDb(id);
    } else {
      this.errorValidator.idError = id
      this.errorValidator.message = "error from contract. Check console log."
    }
  }

  deleteFromDb(id) {
    let data = {
      id: id
    }
    this.postService.post("delete_event", data)
      .subscribe(() => {
        this.getDataFromDb(this.pathForApi);
      },
        (err) => {
          console.log("from delete wallet")
          console.log(err)
        })
  }

  ngOnDestroy() {
    this.UserSubscribe.unsubscribe();
    this.CoinsSubscribe.unsubscribe();
  }

}
