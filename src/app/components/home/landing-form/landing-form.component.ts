import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import emailjs, {EmailJSResponseStatus} from 'emailjs-com';

@Component({
  selector: 'app-landing-form',
  templateUrl: './landing-form.component.html',
  styleUrls: ['./landing-form.component.sass']
})
export class LandingFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  sendMessage: boolean;


  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      firm: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
  }

  public sendEmail(e: Event) {
    e.preventDefault();
    emailjs.sendForm('service_0rs3zi2', 'template_bbonnwn', e.target as HTMLFormElement, 'user_zbn8o6eDZLmq7pZjLA84D')
      .then((result: EmailJSResponseStatus) => {
        console.log(result.text);
        if (result.text === 'OK') {
          this.sendMessage = true;
        }
      }, (error) => {
        console.log(error.text);
      });
  }

  sendForm(form: FormGroup, $event) {
    this.submitted = true;
    if (form.status === 'INVALID') {
      return;
    }
    this.sendEmail($event);
    console.log(form);
  }


}
