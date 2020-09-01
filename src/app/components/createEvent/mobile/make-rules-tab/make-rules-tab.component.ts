import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';


type Time = { name: string, date: any, value: number };

const times: Time[] = [
  { name: "5 minutes", date: new Date().setMinutes(new Date().getMinutes() + 5), value: 0.083 },
  { name: "15 minutes", date: new Date().setMinutes(new Date().getMinutes() + 15), value: 0.25 },
  { name: "30 minutes", date: new Date().setMinutes(new Date().getMinutes() + 30), value: 0.5 },
  { name: "45 minutes", date: new Date().setMinutes(new Date().getMinutes() + 45), value: 0.75 },
  { name: "1 hour", date: new Date().setHours(new Date().getHours() + 1), value: 1 },
  { name: "2 hours", date: new Date().setHours(new Date().getHours() + 2), value: 2 },
  { name: "3 hours", date: new Date().setHours(new Date().getHours() + 3), value: 3 },
  { name: "4 hours", date: new Date().setHours(new Date().getHours() + 4), value: 4 },
  { name: "6 hours", date: new Date().setHours(new Date().getHours() + 4), value: 6 },
  { name: "8 hours", date: new Date().setHours(new Date().getHours() + 8), value: 8 },
  { name: "12 hours", date: new Date().setHours(new Date().getHours() + 12), value: 12 },
  { name: "18 hours", date: new Date().setHours(new Date().getHours() + 18), value: 18 },
  { name: "24 hours", date: new Date().setHours(new Date().getHours() + 24), value: 24 },
  { name: "36 hours", date: new Date().setHours(new Date().getHours() + 36), value: 36 },
  { name: "48 hours", date: new Date().setHours(new Date().getHours() + 48), value: 48 }
]

@Component({
  selector: 'make-rules-tab',
  templateUrl: './make-rules-tab.component.html',
  styleUrls: ['./make-rules-tab.component.sass'],
  providers: [NgbTimepickerConfig]
})
export class MakeRulesTabComponent implements OnInit {
  @Input() formData
  @Output() goBack = new EventEmitter<Object[]>();
  @Output() goPublicEvent = new EventEmitter<Object[]>();
  @Output() goPrivateEvent = new EventEmitter<Object[]>();

  submitted = false;
  publicForm: FormGroup;
  privateForm: FormGroup;
  exactTime: FormGroup;
  times = times;
  endPrivateTime;
  endPublicTime;
  timeData: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  exactTimeBool: boolean

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    config: NgbTimepickerConfig
  ) {
    config.seconds = false;
    config.spinners = false;
  }

  ngOnInit(): void {
    if (this.formData.privateEndTime !== '') {
      let findTime = _.find(this.times, (x) => { return x.value === this.formData.privateEndTime.value })
      let name = findTime.name.replace(/minutes|hours|hour/gi, "")
      this.endPrivateTime = name;
    }
    if (this.formData.exactTimeBool) {
      this.endPublicTime = `Until ${this.formData.exactDay} ${this.formData.exactMonth} ${this.formData.exactYear}, ${this.formData.exactHour} : ${this.formData.exactMinutes}`;
    } else if (this.formData.publicEndTime !== "") {
      let findTime = _.find(this.times, (x) => { return x.value === this.formData.publicEndTime.value })
      this.endPublicTime = findTime.name;
    }
    this.publicForm = this.formBuilder.group({
      tokenType: [this.formData.tokenType],
      publicEndTime: [this.formData.publicEndTime, Validators.required],
      expertsCountType: [this.formData.expertsCountType],
      expertsCount: [this.formData.expertsCount, this.formData.expertsCountType == "custom" ? Validators.required : '']
    })
    this.privateForm = this.formBuilder.group({
      winner: [this.formData.winner, Validators.required],
      losers: [this.formData.losers, Validators.required],
      privateEndTime: [this.formData.privateEndTime, Validators.required]
    })
    var monthtext = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    console.log(this.formData.exactMonth)

    this.exactTime = this.formBuilder.group({
      day: [this.formData.exactDay],
      month: [typeof this.formData.exactMonth === 'string' ? this.formData.exactMonth : monthtext[this.formData.exactMonth]],
      year: [this.formData.exactYear]
    })

    this.timeData.hour = this.formData.exactHour
    this.timeData.minute = this.formData.exactMinutes
    this.exactTimeBool = this.formData.exactTimeBool;

  }

  get pub() { return this.publicForm.controls; }
  get priv() { return this.privateForm.controls; }

  openCalendar(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    this.populatedropdown("daydropdown", "monthdropdown", "yeardropdown")
  }

  chosePrivateEndTime(value) {
    let name = value.name.replace(/minutes|hours|hour/gi, "")
    this.endPrivateTime = name;
    this.privateForm.controls.privateEndTime.setValue(value)
  }

  chosePublicEndTime(value) {
    this.endPublicTime = value.name;
    this.publicForm.controls.publicEndTime.setValue(value)
    this.exactTimeBool = false;
  }

  createPublicEvent() {
    this.submitted = true;
    if (this.publicForm.invalid) {
      return
    }
    let data = {
      ...this.publicForm.value,
      ...this.exactTime.value,
      ...this.timeData,
      "exactTimeBool": this.exactTimeBool
    }
    this.goPublicEvent.next(data)
  }

  createPrivateEvent() {
    this.submitted = true;
    if (this.privateForm.invalid) {
      return
    }
    this.goPrivateEvent.next(this.privateForm.value)
  }

  saveExactTime() {
    this.endPublicTime = `Until ${this.exactTime.value.day} ${this.exactTime.value.month} ${this.exactTime.value.year}, ${this.timeData.hour} : ${this.timeData.minute}`
    this.exactTimeBool = true;
    this.publicForm.controls.publicEndTime.setValue({ hour: 0, minute: 0, second: 0 })
    this.modalService.dismissAll()
  }

  cancel() {
    let data = {
      ...this.publicForm.value,
      ...this.privateForm.value,
      ...this.exactTime.value,
      ...this.timeData,
      "exactTimeBool": this.exactTimeBool
    };
    this.goBack.next(data)
  }


  populatedropdown(dayfield, monthfield, yearfield) {

    var monthtext = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    var today: any = new Date()
    var dayfield: any = document.getElementById(dayfield)
    var monthfield: any = document.getElementById(monthfield)
    var yearfield: any = document.getElementById(yearfield)
    for (var i = 0; i < 31; i++) {
      dayfield.options[i] = new Option(String(i), String(i + 1))
      dayfield.options[today.getDate()] = new Option(today.getDate(), today.getDate(), true, true) //select today's day
    }
    for (var m = 0; m < 12; m++) {
      monthfield.options[m] = new Option(monthtext[m], monthtext[m])
      monthfield.options[today.getMonth()] = new Option(monthtext[today.getMonth()], monthtext[today.getMonth()], true, true) //select today's month
    }
    var thisyear = today.getFullYear()
    for (var y = 0; y < 20; y++) {
      yearfield.options[y] = new Option(thisyear, thisyear)
      thisyear += 1
    }
    yearfield.options[0] = new Option(today.getFullYear(), today.getFullYear(), true, true) //select today's year
  }

}
