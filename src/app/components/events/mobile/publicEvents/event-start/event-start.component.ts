import {Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy} from '@angular/core';
import web3Obj from '../../../../../helpers/torus'
import {PostService} from '../../../../../services/post.service';
import * as UserActions from '../../../../../actions/user.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../app.state';
import {ClipboardService} from 'ngx-clipboard';
import _ from "lodash";
import {Subscription} from 'rxjs';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {WelcomePageComponent} from "../../../../share/welcome-page/welcome-page.component";


@Component({
  selector: 'event-start',
  templateUrl: './event-start.component.html',
  styleUrls: ['./event-start.component.sass']
})
export class EventStartComponent implements OnInit, OnChanges, OnDestroy {
  @Input('eventData') eventData;
  @Output() interacDone = new EventEmitter<number>();
  letsJoin: boolean = false;
  info: boolean = false;
  goToAction: boolean = false;
  joinedAs: string = undefined;
  validation: boolean = false;
  created: boolean = false;
  day;
  hour;
  minutes;
  seconds;
  userData = undefined
  participatedIndex;
  validatedIndex
  currentPool = 0;
  playersJoinde = 0;
  expertJoinned = 0;
  coinType;
  storeSub: Subscription
  postSub: Subscription
  spinnerLoading: boolean;

  saveUserLocStorage = [];


  constructor(
    private http: PostService,
    private store: Store<AppState>,
    private _clipboardService: ClipboardService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
  }

  getUsers() {
    this.storeSub = this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.userData = x[0]
        this.letsFindActivites(x[0]);
        this.calculatePool()
      }
    });
  }

  ngOnChanges(changes) {
    if (changes['eventData'] !== undefined) {
      if (changes['eventData'].currentValue !== undefined) {
        const timeNow = Number((Date.now() / 1000).toFixed(0));
        if (!(this.eventData.endTime - timeNow > 0)) {
          this.validation = true;
        }
        this.coinType = this.eventData.currencyType == "token" ? "BTY" : "ETH"
        this.currentPool = 0;
        this.playersJoinde = 0;
        this.expertJoinned = 0;
        this.remainderExperts();
        this.getUsers();
      }
    }
  }

  remainderExperts() {
    let expertDone = this.eventData.validatorsAnswers === undefined ? 0 : this.eventData.validatorsAnswers.length
    let epxertIn = this.eventData.validatorsAmount == 0 ? this.expertAmount() : this.eventData.validatorsAmount
    return epxertIn - expertDone;
  }

  expertAmount() {
    let part = this.eventData.parcipiantAnswers == undefined ? 0 : this.eventData.parcipiantAnswers.length;
    if (part == 0) {
      return 3;
    } else {
      return (part * 10) / 100 <= 3 ? 3 : Number(((part * 10) / 100).toFixed(0));
    }
  }

  letsFindActivites(userData) {
    if (this.eventData.parcipiantAnswers) {
      let findParts = _.find(this.eventData.parcipiantAnswers, (o) => {
        return o.userId == userData._id;
      });
      if (findParts) {
        this.participatedIndex = findParts.answer;
        this.created = true;
      }
    }
    if (this.eventData.validatorsAnswers) {
      let findValid = _.find(this.eventData.validatorsAnswers, (o) => {
        return o.userId == userData._id;
      });
      if (findValid) {
        this.participatedIndex = findValid.answer;
        this.created = true;
      }
    }
  }

  calculatePool() {
    if (this.eventData.parcipiantAnswers) {
      this.eventData.parcipiantAnswers.forEach(x => {
        this.currentPool += x.amount;
        this.playersJoinde += 1;
      });
    }
    if (this.eventData.validatorsAnswers) {
      this.eventData.validatorsAnswers.forEach(() => {
        this.expertJoinned += 1;
      });
    }
  }

  getPartPos(i, from) {
    let size = from == "part" ? this.eventData.parcipiantAnswers.length : this.eventData.validatorsAnswers.length
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

  poolName() {
    return this.validation ? "TOTAL" : "CURRENT"
  }

  clickBoardName() {
    return this.validation ? "Invite friends to join as an Expert" : "share event with friends!"

  }

  async join() {
    if (await this.loginWithTorus()) {
      this.letsJoin = true;
      this.calculateDate();
    }
  }

  async loginWithTorus() {
    if (!this.userData) {
      try {
        this.spinnerLoading = true;
        await web3Obj.initialize()
        this.setTorusInfoToDB()
        return true;
      } catch (error) {
        console.error(error)
        return false;
      }
    } else {
      return true;
    }

  }

  async setTorusInfoToDB() {
    let userInfo = await web3Obj.torus.getUserInfo("")
    let userWallet = (await web3Obj.web3.eth.getAccounts())[0]

     this.localStoreUser(userInfo)

    let data: Object = {
      _id: null,
      wallet: userWallet,
      nickName: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.profileImage,
      verifier: userInfo.verifier,
      verifierId: userInfo.verifierId,
    }
    this.postSub = this.http.post("user/torus_regist", data)
      .subscribe(
        (x: any) => {
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
          console.log(err)
        })
  }

  addUser(
    email: string,
    nickName: string,
    wallet: string,
    listHostEvents: Object,
    listParticipantEvents: Object,
    listValidatorEvents: Object,
    historyTransaction: Object,
    invitationList: Object,
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
    }))
  }

  joinAsPlayer() {
    this.info = true;
    this.joinedAs = "player"

  }

  joinAsExpert() {
    this.info = true;
    this.joinedAs = "expert"
  }

  showEvent() {
    return this.letsJoin && this.joinedAs == undefined
  }

  showInfo() {
    return this.info && !this.goToAction;
  }

  showParticipate() {
    if (this.joinedAs !== undefined && this.goToAction) {
      return this.joinedAs == "player";
    }
  }

  showValidate() {
    if (this.joinedAs !== undefined && this.goToAction) {
      return this.joinedAs == "expert";
    }
  }

  timeToLeftDisplay() {
    if (this.created) {
      return false;
    } else if (this.validation) {
      return false;
    } else {
      return true;
    }
  }

  goToInfo(from) {
    this.info = true;
    this.joinedAs = from
    this.goToAction = false;
  }

  agree() {
    this.goToAction = true;
  }

  goBack() {
    this.info = false;
    this.joinedAs = undefined;
  }

  interactionDone(data) {
    this.letsJoin = true;
    this.info = false;
    this.goToAction = false;
    this.joinedAs = undefined;
    this.created = true;
    //  this.getUsers();
    this.interacDone.next(data);
  }

  calculateDate() {
    let startDate = new Date();
    let endTime = new Date(this.eventData.endTime * 1000);
    var diffMs = (endTime.getTime() - startDate.getTime());
    this.day = Math.floor(Math.abs(diffMs / 86400000));
    let hour = Math.floor(Math.abs((diffMs % 86400000) / 3600000));
    let minutes = Math.floor(Math.abs(((diffMs % 86400000) % 3600000) / 60000));
    let second = Math.round(Math.abs((((diffMs % 86400000) % 3600000) % 60000) / 1000));

    this.hour = Number(hour) > 9 ? hour : "0" + hour;
    this.minutes = Number(minutes) > 9 ? minutes : "0" + minutes;
    if (second === 60) {
      this.seconds = "00"
    } else {
      this.seconds = second > 9 ? second : "0" + second;
    }
    setTimeout(() => {
      this.calculateDate()
    }, 1000);
  }

  copyToClickBoard() {
    let href = window.location.hostname
    let path = href == "localhost" ? 'http://localhost:4200' : href
    this._clipboardService.copy(`${path}/public_event/${this.eventData.id}`)
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    if (this.postSub) {
      this.postSub.unsubscribe()
    }
  }

  localStoreUser(userInfo): void {
    if (localStorage.getItem('userBettery') === undefined || localStorage.getItem('userBettery') == null) {
      localStorage.setItem('userBettery', JSON.stringify(this.saveUserLocStorage));
    }
    const getItem = JSON.parse(localStorage.getItem('userBettery'));
    if (getItem.length === 0 || !getItem.includes(userInfo.email)) {
      const array = JSON.parse(localStorage.getItem('userBettery'));
      array.push(userInfo.email);
      localStorage.setItem('userBettery', JSON.stringify(array));
      this.modalService.open(WelcomePageComponent);
    }
  }

}
