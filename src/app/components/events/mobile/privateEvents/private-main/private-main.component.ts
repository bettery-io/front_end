import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from "../../../../../services/post.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import web3Obj from "../../../../../helpers/torus";
import * as UserActions from '../../../../../actions/user.actions';
import { Store } from '@ngrx/store';
import { AppState } from "../../../../../app.state";
import _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {InfoModalComponent} from '../../../../share/info-modal/info-modal.component'

@Component({
  selector: 'app-private-main',
  templateUrl: './private-main.component.html',
  styleUrls: ['./private-main.component.sass']
})
export class PrivateMainComponent implements OnInit, OnDestroy {
  data: any;

  answerForm: FormGroup;
  badRequest: boolean;
  condition: boolean;
  counts: any = 1;
  expert: boolean;
  expertPage: boolean;
  hideBtn: boolean;
  ifTimeValid: boolean;
  participatedIndex: number;
  finised: boolean = false;
  spinnerLoading: boolean = false;

  routeSub: Subscription;
  userSub: Subscription;
  postSub: Subscription
  userData;
  id: any;
  allTime: any = {
    day: '',
    hour: '',
    minutes: '',
    seconds: '',
  };

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private modalService: NgbModal
  ) {
    this.answerForm = formBuilder.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = {
        id: Number(params.id)
      };
    });

    this.userSub = this.store.select('user').subscribe((x) => {
      if (x.length != 0) {
        this.userData = x[0];
        this.letsFindActivites(x[0]._id);
      }
    });

    this.letsGetDataFromDB();
  }

  letsGetDataFromDB() {
    this.postSub = this.postService.post('privateEvents/get_by_id', this.id).subscribe((value: any) => {
      console.log(value)
      if (value.finalAnswer !== '') {
        this.finised = true;
      }
      this.data = value;
      if (this.userData) {
        this.letsFindActivites(this.userData._id)
      }
    }, (err) => {
      console.log(err);
      if (err.status === 404) {
        this.badRequest = true;
      }
    });
  }

  letsFindActivites(userID) {
    if (this.data.parcipiantAnswers) {
      let findParts = _.find(this.data.parcipiantAnswers, (o) => { return o.userId == userID; });
      if (findParts) {
        this.participatedIndex = findParts.answer;
        this.hideBtn = true;
      }
    }
  }

  async changePage() {
    if (await this.loginWithTorus()) {
      this.calculateDate();
      const timeNow = Number((Date.now() / 1000).toFixed(0));

      if (this.data.endTime - timeNow > 0) {
        this.expert = true;
        this.condition = true;
      } else {
        this.condition = true;
      }
    }
  }

  async loginWithTorus() {
    if (!this.userData) {
      try {
        this.spinnerLoading = true;
        await web3Obj.initialize();
        this.setTorusInfoToDB();
        return true;
      } catch (error) {
        this.spinnerLoading = false;
        console.error(error);
        return false;
      }
    } else {
      return true;
    }
  }

  async setTorusInfoToDB() {
    const userInfo = await web3Obj.torus.getUserInfo('');
    const userWallet = (await web3Obj.web3.eth.getAccounts())[0];
    const data: object = {
      _id: null,
      wallet: userWallet,
      nickName: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.profileImage,
      verifier: userInfo.verifier,
      verifierId: userInfo.verifierId,
    };
    this.postService.post('user/torus_regist', data)
      .subscribe(
        (x: any) => {
          this.spinnerLoading = false;
          this.addUser(
            x.email,
            x.nickName,
            x.wallet,
            x.listHostEvents,
            x.listParticipantEvents,
            x.listValidatorEvents,
            x.historyTransaction,
            x.invitationList,
            x.avatar,
            x._id,
            x.verifier
          );
        }, (err) => {
          console.log(err);
        });
  }

  addUser(
    email: string,
    nickName: string,
    wallet: string,
    listHostEvents: object,
    listParticipantEvents: object,
    listValidatorEvents: object,
    historyTransaction: object,
    invitationList: object,
    color: string,
    _id: number,
    verifier: string
  ) {

    this.store.dispatch(new UserActions.AddUser({
      _id: _id,
      email: email,
      nickName: nickName,
      wallet: wallet,
      listHostEvents: listHostEvents,
      listParticipantEvents: listParticipantEvents,
      listValidatorEvents: listValidatorEvents,
      historyTransaction: historyTransaction,
      invitationList: invitationList,
      avatar: color,
      verifier: verifier
    }));
  }

  prevPage() {
    this.counts = 1;
  }

  nextPage() {
    this.counts = 2;
  }

  onExpertPage() {
    this.expertPage = true;
  }

  onChanged(increased: boolean) {
    if (increased) {
      this.prevPage();
    } else {
      this.hideBtn = true;
      this.expertPage = false;
      this.expert = false;
      this.prevPage();
    }
    this.letsGetDataFromDB();
  }

  onChanged2($event: boolean) {
    if ($event) {
      this.expertPage = false;
    }
    this.letsGetDataFromDB();
  }

  calculateDate() {
    const startDate = new Date();
    const endTime = new Date(this.data.endTime * 1000);
    var diffMs = (endTime.getTime() - startDate.getTime());
    this.allTime.day = Math.floor(Math.abs(diffMs / 86400000));
    const hour = Math.floor(Math.abs((diffMs % 86400000) / 3600000));
    const minutes = Math.floor(Math.abs(((diffMs % 86400000) % 3600000) / 60000));
    const second = Math.round(Math.abs((((diffMs % 86400000) % 3600000) % 60000) / 1000));

    this.allTime.hour = Number(hour) > 9 ? hour : '0' + hour;
    this.allTime.minutes = Number(minutes) > 9 ? minutes : '0' + minutes;
    if (second === 60) {
      this.allTime.seconds = '00';
    } else {
      this.allTime.seconds = second > 9 ? second : '0' + second;
    }
    setTimeout(() => {
      this.calculateDate();
    }, 1000);
  }

  getPartPos(i) {
    let size = this.data.parcipiantAnswers ? this.data.parcipiantAnswers.length : 0;
    let index = [4, 3, 2, 1]
    if (size === 1) {
      return {
        'z-index': index[i],
        'position': 'relative',
        'right': "20px"
      }
    } else {
      return {
        'z-index': index[i],
        'position': 'relative',
        'right': (i * 10) + "px"
      }
    }
  }

  modalAboutExpert() {
    const modalRef = this.modalService.open(InfoModalComponent, { centered: true });
    modalRef.componentInstance.name = 'Validate the result of the event, what actually happened. Depending on event type and how many Players joined, you can earn BTY tokens for being an Expert.';
    modalRef.componentInstance.boldName ='Expert - ';
    modalRef.componentInstance.link ='Learn more about roles on Bettery';
  }

  modalAboutPlayers(){
    const modalRef = this.modalService.open(InfoModalComponent, { centered: true });
    modalRef.componentInstance.name = ' Bet on the event outcome. The prize pool is taken from the losers pot which is shared to all winning Players, the Host, and Experts. The higher your bet is, the bigger amount you will win.';
    modalRef.componentInstance.boldName ='Player - ';
    modalRef.componentInstance.link ='Learn more about roles on Bettery';
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
  }
}
