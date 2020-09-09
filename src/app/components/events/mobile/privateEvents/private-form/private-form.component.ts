import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-private-form',
  templateUrl: './private-form.component.html',
  styleUrls: ['./private-form.component.sass']
})
export class PrivateFormComponent implements OnInit {
  answerForm: FormGroup;
  @Input()
  data: any;
  count: boolean;
  formValid: boolean;
  @Output() changed = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) {
    this.answerForm = formBuilder.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  sendAnswer(answerForm: any) {
    if (answerForm.status === 'INVALID') {
      this.formValid = true;
      return;
    }
    this.count = true;
    console.log(answerForm.value.answer);
  }

  change(increased: any) {
    this.changed.emit(increased);
  }
}
