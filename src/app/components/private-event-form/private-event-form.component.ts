import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { faTimesCircle, faPlus, faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

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



  constructor(
    private formBuilder: FormBuilder
  ) { }

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
     console.log("WORK")
    })
  }

}
