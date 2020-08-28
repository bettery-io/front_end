import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


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
  styleUrls: ['./make-rules-tab.component.sass']
})
export class MakeRulesTabComponent implements OnInit {
  @Input() formData
  @Output() goBack = new EventEmitter<Object[]>();
  @Output() goPublicEvent = new EventEmitter<Object[]>();
  @Output() goPrivateEvent = new EventEmitter<Object[]>();

  submitted = false;
  publicForm: FormGroup;
  privateForm: FormGroup;
  times = times;
  startTimeValue;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    if (this.formData.privateEndTime !== '') {
      console.log(this.formData.privateEndTime)
      let findTime = _.find(this.times, (x) => { return x.value === this.formData.privateEndTime.value })
      console.log(findTime);
      let name = findTime.name.replace(/minutes|hours|hour/gi, "")
      this.startTimeValue = name;
    }
    this.publicForm = this.formBuilder.group({
      tokenType: [this.formData.tokenType],
      startTime: [this.formData.startTime, Validators.required],
      endTime: [this.formData.endTime, Validators.required]
    })
    this.privateForm = this.formBuilder.group({
      winner: [this.formData.winner, Validators.required],
      losers: [this.formData.losers, Validators.required],
      privateEndTime: [this.formData.privateEndTime, Validators.required]
    })
  }

  get pub() { return this.publicForm.controls; }
  get priv() { return this.privateForm.controls; }

  openCalendar(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    this.populatedropdown("daydropdown", "monthdropdown", "yeardropdown")
  }

  chosePrivateEndTime(value) {
    let name = value.name.replace(/minutes|hours|hour/gi, "")
    this.startTimeValue = name;
    this.privateForm.controls.privateEndTime.setValue(value)

  }

  createPublicEvent() {
    this.submitted = true;
    if (this.publicForm.invalid) {
      return
    }
    console.log(this.publicForm.value)
  }

  createPrivateEvent() {
    this.submitted = true;
    if (this.privateForm.invalid) {
      return
    }
    this.goPrivateEvent.next(this.privateForm.value)
  }

  cancel() {
    let data = {
      ...this.publicForm.value,
      ...this.privateForm.value
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
