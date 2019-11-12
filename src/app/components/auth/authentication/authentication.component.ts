import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { faTimes } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.sass']
})
export class AuthenticationComponent implements OnInit {

  authForm: FormGroup;
  submitted = false;
  faTimes = faTimes;

  @Output() authModalEvent = new EventEmitter<boolean>();


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() { return this.authForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    }

  }


  onReset() {
    this.submitted = false;
    this.authForm.reset();
    this.authModal();
  }

  authModal(){
    this.authModalEvent.emit(false);
  }

}
