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

  fakeAnswer: any = '';

  @Output() onChanged = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) {
    this.answerForm = formBuilder.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  sendAnswer(answerForm: any) {
    console.log(answerForm.value);
    this.fakeAnswer = answerForm.value.answer;
    this.count = true;
  }

  change(increased: any) {
    this.onChanged.emit(increased);
  }
}
