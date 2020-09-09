import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-private-expert',
  templateUrl: './private-expert.component.html',
  styleUrls: ['./private-expert.component.sass']
})
export class PrivateExpertComponent implements OnInit {
  answerForm: FormGroup;
  @Input()
  allTime: any;
  @Input()
  data: any;
  @Output() changed = new EventEmitter<boolean>();
  join: boolean;
  confirm: boolean;
  ifTimeValid: boolean;
  formValid: boolean;

  constructor(private formBuilder: FormBuilder) {
    this.answerForm = formBuilder.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }


  isConfirm() {
    this.join = true;
    console.log(this.confirm);
  //  need use date
  }

  isConfirm2(answerForm: any) {
    if (answerForm.status === 'INVALID') {
      this.formValid = true;
      return;
    }
    this.confirm = true;
    console.log(answerForm.value.answer);
  }

  change(increased: any) {
    this.changed.emit(increased);
  }
}
