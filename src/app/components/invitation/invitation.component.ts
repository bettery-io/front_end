import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from "@angular/router"
import { AppState } from '../../app.state';
import { PostService } from '../../services/post.service';
import { Answer } from '../../models/Answer.model';
import _ from 'lodash';
import * as InvitesAction from '../../actions/invites.actions';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/User.model';
import * as UserActions from '../../actions/user.actions';



@Component({
  selector: 'invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.sass']
})
export class InvitationComponent implements OnInit {
  UserSubscribe
  CoinsSubscribe
  userId: number;
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
  faCheck = faCheck;
  fromComponent = "invitation"


  constructor(
    private store: Store<AppState>,
    private router: Router,
    private postService: PostService
  ) {
    this.UserSubscribe = this.store.select("user").subscribe((x: User[]) => {
      if (x.length === 0) {
        this.userId = null;
        this.userData = [];
        this.router.navigate(['~ki339203/home'])
      } else {
        this.userId = x[0]._id
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
    if (this.userId != undefined) {
      this.getData();
    }
  }

  getData() {
    let data = {
      id: this.userId
    }
    this.postService.post("my_activites/invites", data)
      .subscribe(async (x) => {
        this.myAnswers = [];
        this.myActivites = x;
        this.allData = x;
        this.myAnswers = this.allData.map((data, i) => {
          return {
            event_id: data.event.id,
            answer: this.findAnswer(data.event),
            from: data.role,
            multy: data.event.multiChoise,
            answered: this.findAnswered(data.event),
            multyAnswer: this.findMultyAnswer(data.event)
          }
        });
        console.log(this.allData)
        this.store.dispatch(new InvitesAction.UpdateInvites({ amount: this.allData.length }));
        this.spinner = false;
      }, (err) => {
        console.log(err);
      })
  }

  findAnswer(data) {
    let findParticipiant = _.findIndex(data.parcipiantAnswers, { "userId": this.userId })
    if (findParticipiant === -1) {
      let findValidators = _.findIndex(data.validatorsAnswers, { "userId": this.userId })
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


  findMultyAnswer(data) {
    let z = []
    let part = _.filter(data.parcipiantAnswers, { 'userId': this.userId });
    part.forEach((x) => {
      z.push(x.answer)
    })
    if (z.length === 0) {
      let part = _.filter(data.validatorsAnswers, { 'userId': this.userId });
      part.forEach((x) => {
        z.push(x.answer)
      })
      return z;
    } else {
      return z;
    }
  }

  getActiveQuantity(role) {
    let data = this.allData.filter((x) => x.role === role);
    return data.length
  }

  getValidatorsPercentage(answerIndex, questionIndex) {
    if (this.allData[questionIndex].validatorsAnswers !== undefined) {
      let quantity = this.allData[questionIndex].validatorsAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(this.allData[questionIndex].validated)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  getParticipantsPercentage(answerIndex, questionIndex) {
    if (this.allData[questionIndex].parcipiantAnswers !== undefined) {
      let quantity = this.allData[questionIndex].parcipiantAnswers.filter((x) => x.answer === answerIndex);
      return ((quantity.length / Number(this.allData[questionIndex].answerAmount)) * 100).toFixed(0);
    } else {
      return 0
    }
  }

  filter() {
    setTimeout(() => {
      let data = this.allData
      if (!this.parcipiantFilter) {
        data = data.filter((x) => x.role !== "Participant");
      }
      if (!this.validateFilter) {
        data = data.filter((x) => x.role !== "Validate");
      }
      this.myActivites = data;
    }, 100)
  }

  deleteInvitation(id) {
    let findId = _.find(this.allData, function(o) { return o.event.id == id; });
    let data = {
      id: findId.id
    }
    this.postService.post("invites/delete", data)
      .subscribe(async (x) => {
        this.updateUser();
        this.getData();
      })
  }

  updateUser() {
    let data = {
      id: this.userData._id
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
            onlyRegistered: false,
            fakeCoins: currentUser.fakeCoins,
            socialRegistration: currentUser.socialRegistration
          }))
        })
  }


  ngOnDestroy() {
    this.UserSubscribe.unsubscribe();
    this.CoinsSubscribe.unsubscribe();
  }

}
