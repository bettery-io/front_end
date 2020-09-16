import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import web3Obj from '../../../../helpers/torus'
import {PostService} from '../../../../services/post.service';
import * as UserActions from '../../../../actions/user.actions';
import {Subscription} from 'rxjs';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {WelcomePageComponent} from "../../../share/welcome-page/welcome-page.component";

@Component({
  selector: 'set-question-tab',
  templateUrl: './set-question-tab.component.html',
  styleUrls: ['./set-question-tab.component.sass']
})
export class SetQuestionTabComponent implements OnInit, OnDestroy {
  @Input() formData;
  @Output() getData = new EventEmitter<Object[]>();

  questionForm: FormGroup;
  answesQuantity: number;
  faPlus = faPlus;
  submitted = false;
  registered = false;
  clicked = false;
  userSub: Subscription;
  postSub: Subscription;

  spinnerLoading: boolean;
  saveUserLocStorage = [];


  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private http: PostService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.userSub = this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.registered = true;
      }
    });
    this.questionForm = this.formBuilder.group({
      question: [this.formData.question, Validators.required],
      answers: new FormArray([]),
      details: [this.formData.resolutionDetalis]
    })

    this.answesQuantity = this.formData.answers.length == 0 ? 2 : this.formData.answers.length

    for (let i = this.t.length; i < this.answesQuantity; i++) {
      if (this.formData.answers.length != 0) {
        this.t.push(this.formBuilder.group({
          name: [this.formData.answers[i].name, Validators.required],
        }));
      } else {
        this.t.push(this.formBuilder.group({
          name: ['', Validators.required],
        }));
      }
    }
  }

  get f() {
    return this.questionForm.controls;
  }

  get t() {
    return this.f.answers as FormArray;
  }

  oneMoreAnswer() {
    this.t.push(this.formBuilder.group({
      name: ["", Validators.required],
    }));
    this.answesQuantity = this.answesQuantity + 1;
  }

  // delete one answer from the form
  deleteAnswer(index) {
    this.t.removeAt(index);
    this.answesQuantity = this.answesQuantity - 1;
  }

  onSubmit() {
    if (this.registered) {
      this.submitted = true;
      if (this.questionForm.invalid) {
        return;
      }
      this.getData.next(this.questionForm.value)
    } else {
      this.loginWithTorus();
    }

  }

  async loginWithTorus() {
    this.spinnerLoading = true;
    this.clicked = true;
    try {
      await web3Obj.initialize()
      this.setTorusInfoToDB()
    } catch (error) {
      this.spinnerLoading = false;
      console.error(error)
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
          if (this.clicked) {
            this.onSubmit()
          }
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

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.postSub) {
      this.postSub.unsubscribe();
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
