import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { faTimesCircle, faPlus, faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { GetService } from '../../services/get.service';
import { PostService } from '../../services/post.service';
import { User } from '../../models/User.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from '../registration/registration.component';
import maticInit from '../../contract/maticInit.js';
import Contract from '../../contract/contract';

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
  selector: 'private-event-form',
  templateUrl: './private-event-form.component.html',
  styleUrls: ['./private-event-form.component.sass']
})
export class PrivateEventFormComponent implements OnInit {
  questionForm: FormGroup;
  answesQuantity: number = 2;
  submitted: boolean = false;
  faTimesCircle = faTimesCircle;
  faPlus = faPlus;
  faTimes = faTimes;
  times = times;
  faCalendarAlt = faCalendarAlt;
  startTimeValue: string = "Now";
  exactStartTime = false;
  endTimeValue: string = "5 minutes";
  exactEndTime = false;
  startCaledarMeasure = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  host: User[] = [];
  spinner: boolean = false;



  constructor(
    private formBuilder: FormBuilder,
    private getSevice: GetService,
    private postService: PostService,
    private store: Store<AppState>,
    private modalService: NgbModal
  ) {
    this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.host = x;
      }
    });
   }

  ngOnInit(): void {
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      answers: new FormArray([]),
      startDate: [new Date().setHours(new Date().getHours() + 0), Validators.required],
      calendarStartDate: [{ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }, Validators.required],
      startTime: [{ hour: 0, minute: 0, second: 0 }, Validators.required],
      endDate: [0.083, Validators.required],
      calendarEndDate: ['', Validators.required],
      endTime: [{ hour: 0, minute: 0, second: 0 }, Validators.required],
      winner: ['', Validators.required],
      loser: ['', Validators.required]
    })

    // init validations for answers

    for (let i = this.t.length; i < this.answesQuantity; i++) {
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
    this.answesQuantity = this.answesQuantity + 1;
  }

  // delete one answer from the form
  deleteAnswer(index) {
    this.t.removeAt(index);
    this.answesQuantity = this.answesQuantity - 1;
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

  generateID() {
    return this.getSevice.get("privateEvents/createId")
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

  registrationModal() {
    this.modalService.open(RegistrationComponent);
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
      // check registration
      if (this.host.length == 0) {
        this.registrationModal()
      } else {
        let id = this.generateID()
        id.subscribe((x: any) => {
          this.sendToContract(x._id);
        }, (err) => {
          console.log(err)
          console.log("error from generate id")
        })
      }
    })
  }

  async sendToContract(id) {
    this.spinner = true;
    let matic = new maticInit(this.host[0].verifier);
    let userWallet = await matic.getUserAccount()
    let startTime = this.getStartTime();
    let endTime = this.getEndTime();
    let winner = this.questionForm.value.winner;
    let loser = this.questionForm.value.loser;
    let questionQuantity = this.answesQuantity;
    // TO DO
    let correctAnswerSetter = userWallet

    try{
      let contract = new Contract()
      let sendToContract = await contract.createPrivateEvent(id, startTime, endTime, winner, loser, questionQuantity, correctAnswerSetter, userWallet, this.host[0].verifier);
      if (sendToContract.transactionHash !== undefined) {
        this.setToDb(id, sendToContract.transactionHash);
      }

    }catch(err){
      console.log(err);
      this.deleteEvent(id);
    }
  }

  deleteEvent(id) {
    let data = {
      id: id
    }
    this.postService.post("delete_event_id", data)
      .subscribe(() => {
        this.spinner = false;
      },
        (err) => {
          console.log("from delete wallet")
          console.log(err)
        })
  }

  setToDb(id, transactionHash) {

    let eventData = {
      _id: id,
      host: this.host[0]._id,
      status: "deployed",
      answers: this.questionForm.value.answers.map((x) => {
        return x.name
      }),
      question: this.questionForm.value.question,
      startTime: this.getStartTime(),
      endTime: this.getEndTime(),
      transactionHash: transactionHash,
      winner: this.questionForm.value.winner,
      loser: this.questionForm.value.loser
    }

    this.postService.post("privateEvents/createEvent", eventData)
      .subscribe(
        () => {
          this.spinner = false;
        },
        (err) => {
          console.log("set qestion error");
          console.log(err);
        })
  }

}
