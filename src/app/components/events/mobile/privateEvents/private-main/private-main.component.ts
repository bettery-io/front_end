import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from "../../../../../services/post.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import web3Obj from "../../../../../helpers/torus";
import * as UserActions from '../../../../../actions/user.actions';
import { Store } from '@ngrx/store';
import { AppState } from "../../../../../app.state";

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

  routeSub: Subscription;
  id: any;
  allTime: any = {
    day: '',
    hour: '',
    minutes: '',
    seconds: '',
  };

  constructor(private postService: PostService, private formBuilder: FormBuilder, private route: ActivatedRoute, private store: Store<AppState>) {
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
    this.postService.post('privateEvents/get_by_id', this.id).subscribe((value: object) => {
      this.data = value;
    }, (err) => {
      console.log(err);
      if (err.status === 404) {
        this.badRequest = true;
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
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
    try {
      await web3Obj.initialize();
      this.setTorusInfoToDB();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async setTorusInfoToDB() {
    const userInfo = await web3Obj.torus.getUserInfo('');
    const userWallet = (await web3Obj.web3.eth.getAccounts())[0];

    console.log(userInfo);
    console.log(userWallet);

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
          console.log(x);
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
    console.log(increased);
    if (increased) {
      this.prevPage();
    } else {
      this.hideBtn = true;
      this.expertPage = false;
      this.expert = false;
      this.prevPage();
    }
  }

  onChanged2($event: boolean) {
    if ($event) {
      this.expertPage = false;
    }
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
}
