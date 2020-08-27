import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'set-question-tab',
  templateUrl: './set-question-tab.component.html',
  styleUrls: ['./set-question-tab.component.sass']
})
export class SetQuestionTabComponent implements OnInit {
  @Input() formData;
  @Output() getData = new EventEmitter<Object[]>();

  questionForm: FormGroup;
  answesQuantity: number;
  faPlus = faPlus;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
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

  get f() { return this.questionForm.controls; }
  get t() { return this.f.answers as FormArray; }

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
    this.submitted = true;
    if (this.questionForm.invalid) {
      return;
    }
    this.getData.next(this.questionForm.value)
  }

}
