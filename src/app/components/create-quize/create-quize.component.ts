import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Question } from '../../models/Question.model';
import { faTimesCircle, faPlus, faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { GetService } from '../../services/get.service';
import { PostService } from '../../services/post.service'
import { User } from '../../models/User.model';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

type Time = { name: string, date: any, value: number };

const times: Time[] = [
  { name: "Now", date: new Date().setHours(new Date().getHours() + 0), value: null },
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
export class CreateQuizeComponent implements OnInit {

  submitted: boolean = false;
  questionForm: FormGroup;
  faTimesCircle = faTimesCircle;
  faPlus = faPlus;
  faTimes = faTimes;
  faCalendarAlt = faCalendarAlt;
  answesQuality: number = 2;
  users: User[] = [];
  startTimeValue: string = "Now";
  exactStartTime = false;
  endTimeValue: string = "Chose end time";
  exactEndTime = false;
  times = times;
  inviteValidators: User[] = [];
  inviteParcipiant: User[] = [];
  host: User[] = [];
  generatedLink: string = undefined;
  startCaledarMeasure = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };


  constructor(
    private store: Store<AppState>,
    private router: Router,
    private formBuilder: FormBuilder,
    private getSevice: GetService,
    private PostService: PostService

  ) {
    this.store.select("user").subscribe((x) => {
      if (x.length === 0) {
        this.router.navigate(['/home'])
      } else {
        this.host = x;
        this.getAllUsers()
      }
    });
  }

  getAllUsers() {
    this.getSevice.get("user/all")
      .subscribe(
        (data: User[]) => {
          this.users = data;
        },
        (err) => {
          console.log("get Users error: " + err)
        })
  }

  formatter = (state: User) => state.nickName;

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.users.filter(state => new RegExp(term, 'mi').test(state.nickName)).slice(0, 10))
  )

  ngOnInit() {
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      hashtags: '',
      answers: new FormArray([]),
      multyChoise: 'one',
      startDate: [new Date().setHours(new Date().getHours() + 0), Validators.required],
      calendarStartDate: [{ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }, Validators.required],
      startTime: [{ hour: 0, minute: 0, second: 0 }, Validators.required],
      endDate: ['', Validators.required],
      calendarEndDate: ['', Validators.required],
      endTime: [{ hour: 0, minute: 0, second: 0 }, Validators.required],
      privateOrPublic: "private",
      amount: [0, [Validators.min(0.01), Validators.required]]
    });
    for (let i = this.t.length; i < this.answesQuality; i++) {
      this.t.push(this.formBuilder.group({
        name: [i === 0 ? 'yes' : "no", Validators.required],
      }));
    }

  }

  get f() { return this.questionForm.controls; }
  get t() { return this.f.answers as FormArray; }

  oneMoreAnswer() {
    this.t.push(this.formBuilder.group({
      name: ["", Validators.required],
    }));
    this.answesQuality = this.answesQuality + 1;
  }

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

  selectedValidators(item) {
    this.inviteValidators.push(item.item)
    let input = <HTMLInputElement>document.getElementById("invite_validators")
    setTimeout(() => {
      input.value = null;
    }, 100)
  }

  selectedParcipiant(item) {
    this.inviteParcipiant.push(item.item)
    let input = <HTMLInputElement>document.getElementById("invite_participants")
    setTimeout(() => {
      input.value = null;
    }, 100)
  }

  deleteValidatorOrParcipiant(nickName, path) {
    this[path] = this[path].filter(obj => obj.nickName !== nickName);
  }

  generateID() {
    return 'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


  getTimeStamp(strDate) {
    return new Date(strDate).getTime()
  }

  getStartTime() {
    if (this.exactStartTime === false) {
      return this.questionForm.value.startDate
    } else {
      let day = this.questionForm.value.calendarStartDate.day <= 9 ? "0" + this.questionForm.value.calendarStartDate.day : this.questionForm.value.calendarStartDate.day;
      let month = this.questionForm.value.calendarStartDate.month <= 9 ? "0" + this.questionForm.value.calendarStartDate.month : this.questionForm.value.calendarStartDate.month;
      let year = this.questionForm.value.calendarStartDate.year <= 9 ? "0" + this.questionForm.value.calendarStartDate.year : this.questionForm.value.calendarStartDate.year;
      let hour = this.questionForm.value.startTime.hour <= 9 ? "0" + this.questionForm.value.startTime.hour : this.questionForm.value.startTime.hour;
      let minute = this.questionForm.value.startTime.minute <= 9 ? "0" + this.questionForm.value.startTime.minute : this.questionForm.value.startTime.minute;
      let second = this.questionForm.value.startTime.second <= 9 ? "0" + this.questionForm.value.startTime.second : this.questionForm.value.startTime.second;
      return this.getTimeStamp(`${month}/${day}/${year} ${hour}:${minute}:${second}`)
    }
  }

  getEndTime() {
    if (this.exactEndTime === false) {
      console.log(this.questionForm.value.endDate)
      return new Date(this.getStartTime()).setHours(new Date(this.getStartTime()).getHours() + this.questionForm.value.endDate)
    } else {
      let day = this.questionForm.value.calendarEndDate.day <= 9 ? "0" + this.questionForm.value.calendarEndDate.day : this.questionForm.value.calendarEndDate.day;
      let month = this.questionForm.value.calendarEndDate.month <= 9 ? "0" + this.questionForm.value.calendarEndDate.month : this.questionForm.value.calendarEndDate.month;
      let year = this.questionForm.value.calendarEndDate.year <= 9 ? "0" + this.questionForm.value.calendarEndDate.year : this.questionForm.value.calendarEndDate.year;
      let hour = this.questionForm.value.endTime.hour <= 9 ? "0" + this.questionForm.value.endTime.hour : this.questionForm.value.endTime.hour;
      let minute = this.questionForm.value.endTime.minute <= 9 ? "0" + this.questionForm.value.endTime.minute : this.questionForm.value.endTime.minute;
      let second = this.questionForm.value.endTime.second <= 9 ? "0" + this.questionForm.value.endTime.second : this.questionForm.value.endTime.second;
      return this.getTimeStamp(`${month}/${day}/${year} ${hour}:${minute}:${second}`)
    }
  }


  onSubmit() {
    this.submitted = true;

    if (this.exactEndTime === false) {
      this.questionForm.controls.calendarEndDate.setValue('test');
      this.questionForm.controls.endTime.setValue("test");
    } else {
      this.questionForm.controls.endDate.setValue("test");
    }


    if (this.questionForm.invalid) {
      return;
    }

    let id = this.generateID()

    let data: Question = {
      id: id,
      hostWallet: this.host[0].wallet,
      question: this.questionForm.value.question,
      hashtags: this.questionForm.value.hashtags.split(",").map((x: string) => {
        return x.trim();
      }),
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
      money: this.questionForm.value.amount * 1000000000000000000
    }

    console.log(data);

    this.PostService.post("questions", data)
      .subscribe(
        () => {
          this.generatedLink = id;
        },
        (err) => {
          console.log("set qestion error");
          console.log(err);
        })
  }

}
