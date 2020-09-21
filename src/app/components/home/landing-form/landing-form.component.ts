import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-landing-form',
  templateUrl: './landing-form.component.html',
  styleUrls: ['./landing-form.component.sass']
})
export class LandingFormComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      firm: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  sendForm(form: FormGroup) {
    if (form.status === 'INVALID') {
      return;
    }
    console.log(form);
  }
}
