import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Question } from '../../models/Question.model';
import { faTimesCircle, faPlus, faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faTwitter, faInstagram} from '@fortawesome/fontawesome-free-brands'
import { GetService } from '../../services/get.service';
import { PostService } from '../../services/post.service'
import { User } from '../../models/User.model';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Contract from '../../services/contract';
import * as UserActions from '../../actions/user.actions';
import * as InvitesAction from '../../actions/invites.actions';


type Time = { name: string, date: any, value: number };

const times: Time[] = [
  { name: "Now", date: new Date().setHours(new Date().getHours() + 0), value: null },
  { name: "5 minutes", date: new Date().setMinutes(new Date().getMinutes() + 5), value: 0.083 },
  { name: "1 hour", date: new Date().setHours(new Date().getHours() + 1), value: 1 },
  { name: "2 hours", date: new Date().setHours(new Date().getHours() + 2), value: 2 },
  { name: "4 hours", date: new Date().setHours(new Date().getHours() + 4), value: 4 },
  { name: "8 hours", date: new Date().setHours(new Date().getHours() + 8), value: 8 },
  { name: "12 hours", date: new Date().setHours(new Date().getHours() + 12), value: 12 },
  { name: "24 hours", date: new Date().setHours(new Date().getHours() + 24), value: 24 },
  { name: "2 days", date: new Date().setHours(new Date().getHours() + 48), value: 48 },
  { name: "5 days", date: new Date().setHours(new Date().getHours() + 120), value: 120 }
]

@Component({
  selector: 'create-quize',
  templateUrl: './create-quize.component.html',
  styleUrls: ['./create-quize.component.sass']
})
export class CreateQuizeComponent implements OnInit, OnDestroy {

  submitted: boolean = false;
  questionForm: FormGroup;

  faTimesCircle = faTimesCircle;
  faPlus = faPlus;
  faTimes = faTimes;
  faCalendarAlt = faCalendarAlt;
  faFacebook = faFacebookSquare;
  faInstagram = faInstagram;
  faTwitter = faTwitter;
  answesQuality: number = 2;
  users: User[] = [];
  allUsers: User[] = [];
  startTimeValue: string = "Now";
  exactStartTime = false;
  endTimeValue: string = "5 minutes";
  exactEndTime = false;
  times = times;
  inviteValidators: User[] = [];
  inviteParcipiant: User[] = [];
  host: User[] = [];
  generatedLink: number = undefined;
  startCaledarMeasure = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  listHashtags = [];
  myHashtags = [];
  spinner: boolean = false;
  UserSubscribe;
  quizData: Question


  constructor(
    private store: Store<AppState>,
    private router: Router,
    private formBuilder: FormBuilder,
    private getSevice: GetService,
    private PostService: PostService,

  ) {
    // check if user registerd
    // if no -> regirect to home page
    this.UserSubscribe = this.store.select("user").subscribe((x) => {
      if (x.length === 0) {
        this.router.navigate(['~ki339203/home'])
      } else {
        this.host = x;
        this.getAllUsers(false);
        this.getHashtags();
      }
    });
  }

  // get all users form server

  getAllUsers(update) {
    this.getSevice.get("user/all")
      .subscribe(
        (data: User[]) => {
          this.allUsers = data;
          this.users = data;
          if (update === true) {
            let currentUser = data.find((x) => x.wallet === this.host[0].wallet);
            console.log("update user")
            console.log(currentUser)
            this.store.dispatch(new UserActions.UpdateUser({
              email: currentUser.email,
              nickName: currentUser.nickName,
              wallet: currentUser.wallet,
              listHostEvents: currentUser.listHostEvents,
              listParticipantEvents: currentUser.listParticipantEvents,
              listValidatorEvents: currentUser.listValidatorEvents,
              historyTransaction: currentUser.historyTransaction
            }))
          }


        },
        (err) => {
          console.log("get Users error: " + err)
        })
  }

  getHashtags() {
    this.getSevice.get('hashtags/get_all').subscribe(
      (data) => {
        this.listHashtags = data[0].hashtags;
      },
      (err) => {
        console.log("get Hashtags error: " + err)
      })
  }

  // formatter for Validator and Parcipiant search box
  formatter = (state: User) => state.nickName;

  // search in Validator and Parcipiant data Object
  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.users.filter(state => new RegExp(term, 'mi').test(state.nickName)).slice(0, 10))
  )

  searchHashtags = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.listHashtags.filter(state => new RegExp(term, 'mi').test(state)).slice(0, 10))
  )

  async ngOnInit() {
    // init validators
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      answers: new FormArray([]),
      multyChoise: 'one',
      startDate: [new Date().setHours(new Date().getHours() + 0), Validators.required],
      calendarStartDate: [{ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }, Validators.required],
      startTime: [{ hour: 0, minute: 0, second: 0 }, Validators.required],
      endDate: [0.083, Validators.required],
      calendarEndDate: ['', Validators.required],
      endTime: [{ hour: 0, minute: 0, second: 0 }, Validators.required],
      showDistribution: true,
      privateOrPublic: "public",
      amountOfValidators: [3, [Validators.min(1), Validators.required]],
      amount: [0.1, [Validators.min(0.01), Validators.required]]
    });

    // init validations for answers

    for (let i = this.t.length; i < this.answesQuality; i++) {
      this.t.push(this.formBuilder.group({
        name: [i === 0 ? 'Yes' : "No", Validators.required],
      }));
    }

  }

  // validators for form
  get f() { return this.questionForm.controls; }
  get t() { return this.f.answers as FormArray; }

  // add one more answer to the form
  oneMoreAnswer() {
    this.t.push(this.formBuilder.group({
      name: ["", Validators.required],
    }));
    this.answesQuality = this.answesQuality + 1;
  }

  // delete one answer from the form
  deleteAnswer(index) {
    this.t.removeAt(index);
    this.answesQuality = this.answesQuality - 1;
  }

  switchTimeMethods(type) {
    this[type] = !this[type];
  }

  choseStartTime(value: Time) {
    this.startTimeValue = value.name;
    this.questionForm.controls.startDate.setValue(value.date)
  }

  choseEndTime(value: Time) {
    this.endTimeValue = value.name;
    this.questionForm.controls.endDate.setValue(value.value);
  }

  selectedHasgtags(value) {
    this.myHashtags.push(value.item);
    let input = <HTMLInputElement>document.getElementById("hashtags")
    setTimeout(() => {
      input.value = null;
    }, 100)
  }

  selectedValidators(item) {
    this.inviteValidators.push(item.item)
    this.users = this.users.filter((x) => x.nickName !== item.item.nickName);
    let input = <HTMLInputElement>document.getElementById("invite_validators")
    setTimeout(() => {
      input.value = null;
    }, 100)
  }

  selectedParcipiant(item) {
    this.inviteParcipiant.push(item.item)
    this.users = this.users.filter((x) => x.nickName !== item.item.nickName);
    let input = <HTMLInputElement>document.getElementById("invite_participants")
    setTimeout(() => {
      input.value = null;
    }, 100)
  }

  deleteValidatorOrParcipiant(nickName, path) {
    this[path] = this[path].filter(obj => obj.nickName !== nickName);
    let user = this.allUsers.find((x) => x.nickName === nickName)
    this.users.push(user);
  }

  deleteHash(hash) {
    this.myHashtags = this.myHashtags.filter(name => name !== hash);
  }

  addNewHash() {
    let input = <HTMLInputElement>document.getElementById("hashtags")
    let search = this.myHashtags.find(e => e === input.value);
    if (search === undefined) {
      this.myHashtags.push(input.value)
      setTimeout(() => {
        input.value = null;
      }, 100)
    }
  }

  generateID() {
    return Math.floor((Math.random() * 1000000000000000) + 1)
  }


  getTimeStamp(strDate) {
    return Number((new Date(strDate).getTime() / 1000).toFixed(0));
  }

  getStartTime() {
    if (this.exactStartTime === false) {
      return Number((this.questionForm.value.startDate / 1000).toFixed(0));
    } else {
      let day = this.questionForm.value.calendarStartDate.day;
      let month = this.questionForm.value.calendarStartDate.month;
      let year = this.questionForm.value.calendarStartDate.year;
      let hour = this.questionForm.value.startTime.hour;
      let minute = this.questionForm.value.startTime.minute;
      let second = this.questionForm.value.startTime.second;
      return this.getTimeStamp(`${month}/${day}/${year} ${hour}:${minute}:${second}`)
    }
  }

  getEndTime() {
    if (this.exactEndTime === false) {
      if (this.questionForm.value.endDate < 1) {
        return Number(((new Date(this.getStartTime() * 1000).setMinutes(new Date(this.getStartTime() * 1000).getMinutes() + 5)) / 1000).toFixed(0));
      } else {
        return Number(((new Date(this.getStartTime() * 1000).setHours(new Date(this.getStartTime() * 1000).getHours() + this.questionForm.value.endDate)) / 1000).toFixed(0));
      }
    } else {
      let day = this.questionForm.value.calendarEndDate.day;
      let month = this.questionForm.value.calendarEndDate.month;
      let year = this.questionForm.value.calendarEndDate.year;
      let hour = this.questionForm.value.endTime.hour;
      let minute = this.questionForm.value.endTime.minute;
      let second = this.questionForm.value.endTime.second;
      return this.getTimeStamp(`${month}/${day}/${year} ${hour}:${minute}:${second}`)
    }
  }




  onSubmit() {

    let promise = new Promise((resolve) => {
      if (this.exactEndTime === false) {
        this.questionForm.controls.calendarEndDate.setValue({ year: 2019, month: 12, day: 18 });
        this.questionForm.controls.endTime.setValue({ hour: 1, minute: 1, second: 1 });

      } else {
        this.questionForm.controls.endDate.setValue(1);
      }
      resolve("done")
    })
    promise.then(() => {
      this.submitted = true;
      if (this.questionForm.invalid) {
        return;
      }
      let id = this.generateID()
      this.sendToContract(id);
    })
  }

  async sendToContract(id) {
    this.spinner = true;
    let contract = new Contract()
    let contr = await contract.initContract()
    let startTime = this.getStartTime();
    let endTime = this.getEndTime();
    let percentHost = 0;
    let percentValidator = 0;
    let questionQuantity = this.answesQuality;
    let validatorsAmount = this.questionForm.value.amountOfValidators;

    console.log(endTime)

    try {
      let sendToContract = await contr.methods.startQestion(
        id,
        startTime,
        endTime,
        percentHost,
        percentValidator,
        questionQuantity,
        validatorsAmount
      ).send();
      if (sendToContract.transactionHash !== undefined) {
        this.setToDb(id, sendToContract.transactionHash);
      }
    } catch (error) {
      console.log(error);
      this.spinner = false;
    }
  }

  getEndValidation(data) {
    let date = new Date(data.endTime * 1000);
    let x = date.setDate(date.getDate() + 7);
    return Number((new Date(x).getTime() / 1000).toFixed(0));
  }


  setToDb(id, transactionHash) {
    // think about status

    this.quizData = {
      id: id,
      status: "deployed",
      hostWallet: this.host[0].wallet,
      question: this.questionForm.value.question,
      hashtags: this.myHashtags,
      answers: this.questionForm.value.answers.map((x) => {
        return x.name
      }),
      multiChose: this.questionForm.value.multyChoise === "one" ? false : true,
      startTime: this.getStartTime(),
      endTime: this.getEndTime(),
      private: this.questionForm.value.privateOrPublic === "private" ? true : false,
      parcipiant: this.inviteParcipiant.map((x) => {
        return x.wallet
      }),
      validators: this.inviteValidators.map((x) => {
        return x.wallet
      }),
      answerQuantity: 0,
      validatorsQuantity: 0,
      validatorsAmount: this.questionForm.value.amountOfValidators,
      money: this.questionForm.value.amount,
      finalAnswers: null,
      transactionHash: transactionHash,
      showDistribution: this.questionForm.value.showDistribution
    }

    this.PostService.post("question/set", this.quizData)
      .subscribe(
        () => {
          this.getAllUsers(true);
          this.generatedLink = id;
          this.spinner = false;
          this.updateInvites(this.host[0].wallet);
          console.log("set to db DONE")
        },
        (err) => {
          console.log("set qestion error");
          console.log(err);
        })
  }

  updateInvites(wallet){
    let data = {
      wallet: wallet
    }
    this.PostService.post("my_activites/invites", data)
    .subscribe(async (x: any) => {
      let amount = x.length
      this.store.dispatch(new InvitesAction.UpdateInvites({amount: amount}));
    })
  }

  ngOnDestroy() {
    this.UserSubscribe.unsubscribe();
  }

}
