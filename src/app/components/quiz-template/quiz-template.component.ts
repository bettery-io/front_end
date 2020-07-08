import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { User } from '../../models/User.model';
import _ from 'lodash';
import { Answer } from '../../models/Answer.model';
import Web3 from 'web3';
import Contract from '../../contract/contract';
import * as CoinsActios from '../../actions/coins.actions';
import * as UserActions from '../../actions/user.actions';
import { PostService } from '../../services/post.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { RegistrationComponent } from '../registration/registration.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import web3Obj from '../../helpers/torus'
import maticInit from '../../contract/maticInit.js'

@Component({
  selector: 'quiz-template',
  templateUrl: './quiz-template.component.html',
  styleUrls: ['./quiz-template.component.sass']
})
export class QuizTemplateComponent implements OnInit, OnChanges {
  faCheck = faCheck;
  allUserData: User;

  errorValidator = {
    idError: null,
    message: undefined
  }

  constructor(
    private postService: PostService,
    private store: Store<AppState>,
    private modalService: NgbModal
  ) { }


  @Input() question: Object[];
  @Input("userData") userData: User;
  @Input() myAnswers: Answer;
  @Input() coinInfo: any;
  @Input() fromComponent: string;

  @Output() callGetData = new EventEmitter();
  @Output() deleteInvitationId = new EventEmitter<number>();

  ngOnInit() {
    this.allUserData = this.userData;
  }

  ngOnChanges(changes) {
    if (changes['userData'] !== undefined) {
      let currentValue = changes['userData'].currentValue;
      if (this.allUserData === undefined || currentValue._id !== this.allUserData._id) {
        this.allUserData = this.userData;
        console.log("work ngOnChanges")
      }
    }
  }


  getPosition(data) {
    let findParticipiant = _.findIndex(data.parcipiantAnswers, { "userId": this.allUserData._id })
    if (findParticipiant !== -1) {
      if (data.host == this.allUserData._id || data.host == true) {
        return 'Host, Participiant'
      } else {
        return "Participiant"
      }
    } else {
      let findValidator = _.findIndex(data.validatorsAnswers, { "userId": this.allUserData._id })
      if (findValidator !== -1) {
        if (data.host == this.allUserData._id) {
          return 'Host, Validator'
        } else {
          return "Validator"
        }
      } else {
        let findInParticInvites = _.findIndex(this.allUserData.invitationList, { "eventId": data.id })
        if (findInParticInvites !== -1) {
          return this.allUserData.invitationList[findInParticInvites].role === "Validate" ? "invited as validator" : "invited as participiant";
        } else {
          if (data.host == this.allUserData._id || data.host == true) {
            return 'Host'
          } else {
            return "Guest"
          }
        }
      }
    }
  }

  getValidatorsPercentage(questionData, answerIndex) {
    if (questionData.validatorsAnswers !== undefined) {
      let quantity = questionData.validatorsAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(questionData.validated)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  getParticipantsPercentage(questionData, answerIndex) {
    if (questionData.parcipiantAnswers !== undefined) {
      let quantity = questionData.parcipiantAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(questionData.answerAmount)) * 100).toFixed(0);
    } else {
      return 0
    }
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

  particCryptoGuard(data) {
    let findInParticInvites = _.findIndex(this.allUserData.invitationList, { "eventId": data.id })
    if (findInParticInvites === -1) {
      let timeNow = Number((new Date().getTime() / 1000).toFixed(0))
      if (data.endTime >= timeNow && data.currencyType !== "demo") {
        return true
      } else {
        return false
      }
    } else {
      if (data.currencyType !== "demo") {
        return this.allUserData.invitationList[findInParticInvites].role !== "Validate" ? true : false
      } else {
        return false
      }
    }
  }

  validGuard(data) {
    let findInParticInvites = _.findIndex(this.allUserData.invitationList, { "eventId": data.id })
    if (findInParticInvites === -1) {
      let timeNow = Number((new Date().getTime() / 1000).toFixed(0))
      if (data.endTime >= timeNow) {
        return false;
      } else {
        if (this.getPosition(data).search('Host') === -1) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return this.allUserData.invitationList[findInParticInvites].role === "Validate" ? true : false
    }
  }

  particDemoGuard(data) {
    let findInParticInvites = _.findIndex(this.allUserData.invitationList, { "eventId": data.id })
    if (findInParticInvites === -1) {
      let timeNow = Number((new Date().getTime() / 1000).toFixed(0))
      if (data.endTime >= timeNow && data.currencyType === "demo") {
        return true
      } else {
        return false
      }
    } else {
      if (data.currencyType === "demo") {
        return this.allUserData.invitationList[findInParticInvites].role !== "Validate" ? true : false
      } else {
        return false
      }
    }
  }


  getEndValidation(data) {
    let date = new Date(data.endTime * 1000);
    let x = date.setDate(date.getDate() + 7);
    return Number((new Date(x).getTime() / 1000).toFixed(0));
  }

  makeAnswer(i) {
    this.myAnswers.answer = i;
    this.errorValidator.idError = null;
    this.errorValidator.message = undefined;
  }

  setAnswer(dataAnswer, from) {
    let answer = this.myAnswers;
    if (this.allUserData._id != undefined) {
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
          if (from === "validate") {
            if (dataAnswer.currencyType === "demo") {
              this.validateWithDemoCoins(answer, dataAnswer);
            } else {
              if (this.userData.wallet === "null") {
                this.errorValidator.idError = dataAnswer.id
                this.errorValidator.message = "You must connect metamask"
              } else {
                this.setToLoomNetworkValidation(answer, dataAnswer);
              }
            }
          } else if (from === "demo") {
            this.partWithDemoCoins(answer, dataAnswer);
          } else {
            this.setToLoomNetwork(answer, dataAnswer);
          }
        }
      }
    } else {
      this.openRegistModal()
    }
  }

  partWithDemoCoins(answer, dataAnswer) {
    let dateNow = Math.round(new Date().getTime() / 1000);
    if (dataAnswer.money > this.allUserData.fakeCoins) {
      this.errorValidator.idError = dataAnswer.id
      this.errorValidator.message = "You don't have enough demo coins."
    } else {
      if (dataAnswer.startTime > dateNow) {
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Event not started yeat."
      } else if (dateNow > dataAnswer.endTime) {
        this.errorValidator.idError = dataAnswer.id
        this.errorValidator.message = "Already finished"
      } else {
        this.setToDB(answer, dataAnswer, "not-exist", "demo");
      }
    }
  }

  validateWithDemoCoins(answer, dataAnswer) {
    let dateNow = Math.round(new Date().getTime() / 1000);
    let finishEvent = Math.round(new Date().setHours(new Date().getHours() + 168) / 1000);
    if (dataAnswer.endTime > dateNow) {
      this.errorValidator.idError = dataAnswer.id
      this.errorValidator.message = "Event not started yeat."
    } else if (dateNow > finishEvent) {
      this.errorValidator.idError = dataAnswer.id
      this.errorValidator.message = "Already finished"
    } else {
      this.setToDBValidation(answer, dataAnswer, "not-exist");
    }
  }

  openRegistModal() {
    this.modalService.open(RegistrationComponent);
  }

  async setToLoomNetwork(answer, dataAnswer) {
    let balance;

    if (dataAnswer.currencyType === "ether") {
      balance = this.coinInfo.loomBalance
    } else {
      balance = this.coinInfo.tokenBalance
    }

    if (Number(balance) < dataAnswer.money) {
      this.errorValidator.idError = dataAnswer.id
      this.errorValidator.message = "Don't have enough " + dataAnswer.currencyType
    } else {
      let web3 = new Web3();
      let contract = new Contract();
      var _question_id = dataAnswer.id;
      var _whichAnswer = answer.answer;
      var _money = web3.utils.toWei(String(dataAnswer.money), 'ether')
      let contr = await contract.initContract()
      let validator = await contr.methods.setTimeAnswer(_question_id).call();
      if (Number(validator) === 0) {
        if (dataAnswer.currencyType === "token") {
          await this.approveToken(_money)
        }
        let sendToContract = await contr.methods.setAnswer(_question_id, _whichAnswer).send({
          value: dataAnswer.currencyType === "ether" ? _money : 0
        });
        if (sendToContract.transactionHash !== undefined) {
          this.setToDB(answer, dataAnswer, sendToContract.transactionHash, dataAnswer.currencyType)
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

  async approveToken(amount) {
    let contract = new Contract();
    let quizAddress = contract.quizeAddress();
    return await contract.approve(quizAddress, amount);
  }


  setToDB(answer, dataAnswer, transactionHash, currencyType) {
    let data = {
      multy: answer.multy,
      event_id: answer.event_id,
      date: new Date(),
      answer: answer.answer,
      multyAnswer: answer.multyAnswer,
      transactionHash: transactionHash,
      userId: this.userData._id,
      from: "participant",
      currencyType: currencyType,
      answerAmount: dataAnswer.answerAmount + 1,
      money: dataAnswer.money
    }
    this.postService.post("answer", data).subscribe(async () => {
      this.myAnswers.answered = true;
      this.errorValidator.idError = null;
      this.errorValidator.message = undefined;

      this.updateUser();
      this.callGetData.next();

      if (dataAnswer.currencyType !== 'demo') {
        this.updateBalance();
      }

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
      userId: this.userData._id,
      from: "validator",
      currencyType: dataAnswer.currencyType,
      validated: dataAnswer.validated + 1,
      money: dataAnswer.money
    }
    this.postService.post("answer", data).subscribe(async () => {
      this.myAnswers.answered = true;
      this.errorValidator.idError = null;
      this.errorValidator.message = undefined;

      this.callGetData.next();

      if (dataAnswer.currencyType !== 'demo') {
        this.updateBalance();
      }

    },
      (err) => {
        console.log(err)
      })
  }

  async updateBalance() {
    let gorliProvider = new Web3(this.allUserData.verifier === "metamask" ? window.web3.currentProvider : web3Obj.torus.provider);
    let mainBalance = await gorliProvider.eth.getBalance(this.userData.wallet);

    let matic = new maticInit(this.allUserData.verifier);
    let MTXToken = await matic.getMTXBalance();
    let TokenBalance = await matic.getERC20Balance();

    let web3 = new Web3();
    let maticTokenBalanceToEth = web3.utils.fromWei(MTXToken, "ether");
    let mainEther = web3.utils.fromWei(mainBalance, "ether")
    let tokBal = web3.utils.fromWei(TokenBalance, "ether")

    this.store.dispatch(new CoinsActios.UpdateCoins({
      loomBalance: maticTokenBalanceToEth,
      mainNetBalance: mainEther,
      tokenBalance: tokBal
    }))
    this.coinInfo.loomBalance = maticTokenBalanceToEth;
    this.coinInfo.tokenBalance = tokBal;
  }

  updateUser() {
    let data = {
      id: this.allUserData._id
    }
    this.postService.post("user/getUserById", data)
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
            invitationList: currentUser.invitationList,
            avatar: currentUser.avatar,
            fakeCoins: currentUser.fakeCoins,
            verifier: currentUser.verifier
          }))
        })
  }

  deleteInvitation(data) {
    let id = data.id;
    this.deleteInvitationId.next(id)
  }

  whichComponent() {
    if (this.fromComponent === "invitation") {
      return true
    } else {
      return false
    }
  }

  validateDeleteButton(data) {
    if (this.fromComponent === "myEvent") {
      let result = this.getPosition(data);
      let z = result.search("Host")
      if (z !== -1) {
        if (data.answerAmount >= 1) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    } else {
      false
    }
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


  finalAnswerGuard(question) {
    if (question.finalAnswer !== null || question.reverted) {
      return true;
    } else {
      return false;
    }
  }

  deleteFromDb(id) {
    let data = {
      id: id
    }
    this.postService.post("delete_event", data)
      .subscribe(() => {
        this.callGetData.next()
      },
        (err) => {
          console.log("from delete wallet")
          console.log(err)
        })
  }

}
