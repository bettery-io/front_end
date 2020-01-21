import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from "@angular/router"
import { AppState } from '../../app.state';
import { PostService } from '../../services/post.service';
import { Answer } from '../../models/Answer.model';
import _ from 'lodash';
import Web3 from 'web3';
import LoomEthCoin from '../../services/LoomEthCoin';
import Contract from '../../services/contract';
import * as CoinsActios from '../../actions/coins.actions';




@Component({
  selector: 'invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.sass']
})
export class InvitationComponent implements OnInit {
  UserSubscribe
  CoinsSubscribe
  userWallet: string = undefined;
  userData: any = [];
  coinInfo = null;
  spinner: boolean = true;
  myAnswers: Answer[] = [];
  myActivites: any = [];
  allData: any = [];
  parcipiantFilter: boolean = true;
  validateFilter: boolean = true;
  errorValidator = {
    idError: null,
    message: undefined
  }


  constructor(
    private store: Store<AppState>,
    private router: Router,
    private postService: PostService
  ) {
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
      this.getDataFromDb();
    }
  }

  getDataFromDb() {
    let data = {
      wallet: this.userWallet
    }
    this.postService.post("my_activites/invites", data)
      .subscribe(async (x) => {
        console.log(x)
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

  getActiveQuantity(from) {
    let data = this.allData.filter((x) => x.from === from);
    return data.length
  }

  getEndValidation(data) {
    let date = new Date(data.endTime * 1000);
    let x = date.setDate(date.getDate() + 7);
    return Number((new Date(x).getTime() / 1000).toFixed(0));
  }

  getValidatorsPercentage(answerIndex, questionIndex) {
    if (this.allData[questionIndex].validatorsAnswers !== undefined) {
      let quantity = this.allData[questionIndex].validatorsAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(this.allData[questionIndex].validatorsQuantity)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  getParticipantsPercentage(answerIndex, questionIndex) {
    if (this.allData[questionIndex].parcipiantAnswers !== undefined) {
      let quantity = this.allData[questionIndex].parcipiantAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(this.allData[questionIndex].answerQuantity)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  filter() {
    setTimeout(() => {
      let data = this.allData
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

  validateButton(data) {
    let result = this.getPosition(data);
    let z = result.search("Host")
    return z === -1 ? false : true;
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

  makeAnswer(data, i) {
    let index = _.findIndex(this.myAnswers, { 'event_id': data.id, 'from': data.from });
    this.myAnswers[index].answer = i;
    this.errorValidator.idError = null;
    this.errorValidator.message = undefined;
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

      this.getDataFromDb();
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

      this.getDataFromDb();
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

  deleteInvitation(value){
    console.log(value.id)
    let data = {
      id: value.id,
      wallet: this.userWallet,
      from: this.guardPath(value) ? 'listParticipantEvents' : 'listValidatorEvents'
    }
    this.postService.post("invites/delete", data)
      .subscribe(async (x) => {
         this.getDataFromDb()
      })
  }


  ngOnDestroy() {
    this.UserSubscribe.unsubscribe();
    this.CoinsSubscribe.unsubscribe();
  }

}
