import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-form',
  templateUrl: './landing-form.component.html',
  styleUrls: ['./landing-form.component.sass']
})
export class LandingFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  formValid: boolean;
  recaptcaSub: Subscription

  constructor(
    private formBuilder: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
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
    this.recaptcaSub = this.recaptchaV3Service.execute('importantAction')
      .subscribe(() => {
        if (form.status === 'INVALID') {
          this.formValid = true;
          return;
        }
        console.log(form);
      });
  }

  ngOnDestroy() {
    if (this.recaptcaSub) {
      this.recaptcaSub.unsubscribe();
    }
  }
}
