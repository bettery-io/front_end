import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizErrorsComponent } from '../quiz-errors/quiz-errors.component';
import web3Obj from '../../../../helpers/torus';
import { PostService } from 'src/app/services/post.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import * as UserActions from '../../../../actions/user.actions';
import { Subscription } from 'rxjs';
import { User } from '../../../../models/User.model';

@Component({
  selector: 'quiz-action',
  templateUrl: './quiz-action.component.html',
  styleUrls: ['./quiz-action.component.sass']
})
export class QuizActionComponent implements OnDestroy {
  @Input() question: any;
  @Input() joinPlayer: boolean;
  @Input() becomeExpert: boolean;
  @Output() goBack = new EventEmitter();
  @Output() betEvent = new EventEmitter<Array<any>>();
  @Output() validateEvent = new EventEmitter<Array<any>>();

  allUserData = undefined;
  answerNumber: number = null;
  amount: number = 0;

  torusSub: Subscription
  storeUserSubscribe: Subscription;

  constructor(
    private modalService: NgbModal,
    private postService: PostService,
    private store: Store<AppState>
  ) {
    this.storeUserSubscribe = this.store.select('user').subscribe((x: User[]) => {
      if (x.length != 0) {
        this.allUserData = x[0];
      }
    });
  }

  async makeAnswer(i) {
    this.answerNumber = i;
    if (this.allUserData == undefined) {
      try {
        await web3Obj.initialize();
        this.setTorusInfoToDB();
      } catch (error) {
        await web3Obj.torus.cleanUp();
        console.error(error);
      }
    }
  }

  async participate() {
    if (this.allUserData != undefined) {
      if (this.answerNumber === null) {
        let modalRef = this.modalService.open(QuizErrorsComponent, { centered: true });
        modalRef.componentInstance.errType = 'error';
        modalRef.componentInstance.title = "Choose anwer";
        modalRef.componentInstance.description = "Choose at leas one answer";
        modalRef.componentInstance.nameButton = "fine";
      } else {
        if (Number(this.amount) <= 0) {
          const modalRef = this.modalService.open(QuizErrorsComponent, { centered: true });
          modalRef.componentInstance.errType = 'error';
          modalRef.componentInstance.title = "Low amount";
          modalRef.componentInstance.description = "Amount must be bigger than 0";
          modalRef.componentInstance.nameButton = "fine";
        } else {
          let data: any = {
            amount: this.amount,
            answer: this.answerNumber
          }
          this.betEvent.next(data);
        }

      }
    } else {
      try {
        await web3Obj.initialize();
        this.setTorusInfoToDB();
      } catch (error) {
        await web3Obj.torus.cleanUp();
        console.error(error);
      }
    }
  }

  async validate() {
    if (this.allUserData != undefined) {
      if (this.answerNumber === null) {
        let modalRef = this.modalService.open(QuizErrorsComponent, { centered: true });
        modalRef.componentInstance.errType = 'error';
        modalRef.componentInstance.title = "Choose anwer";
        modalRef.componentInstance.description = "Choose at leas one answer";
        modalRef.componentInstance.nameButton = "fine";
      } else {
        let data: any = {
          answer: this.answerNumber
        }
        this.validateEvent.next(data)
      }
    } else {
      try {
        await web3Obj.initialize();
        this.setTorusInfoToDB();
      } catch (error) {
        await web3Obj.torus.cleanUp();
        console.error(error);
      }
    }
  }

  cancel() {
    this.goBack.next()
  }

  getBackground(i) {
    if (this.joinPlayer) {
      return {
        'background': this.answerNumber == i ? '#34DDDD' : '#EBEBEB'
      }
    } else {
      return {
        'background': this.answerNumber == i ? '#BF94E4' : '#EBEBEB'
      }
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
    this.torusSub = this.postService.post('user/torus_regist', data)
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
            x.avatar,
            x._id,
            x.verifier
          );
        }, (err) => {
          console.log(err);
          let modalRef = this.modalService.open(QuizErrorsComponent, { centered: true });
          modalRef.componentInstance.errType = 'error';
          modalRef.componentInstance.title = "Unknown Error";
          modalRef.componentInstance.customMessage = String(err);
          modalRef.componentInstance.description = "Report this unknown error to get 1 BET token!"
          modalRef.componentInstance.nameButton = "report error";
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
      avatar: color,
      verifier: verifier
    }));
  }

  ngOnDestroy() {
    if (this.torusSub) {
      this.torusSub.unsubscribe()
    }
    if (this.storeUserSubscribe) {
      this.storeUserSubscribe.unsubscribe();
    }
  }

}
