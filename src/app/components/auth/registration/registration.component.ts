import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../../helpers/must-much.validator';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { User } from '../../../models/User.model';
import { AppState } from '../../../app.state';
import * as UserActions from '../../../actions/user.actions';

import Web3 from 'web3';


@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  faTimes = faTimes;

  @Output() regisModalEvent = new EventEmitter<boolean>();


  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>) { }

  registrationModal(){
    this.regisModalEvent.emit(false);
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

  get f() { return this.registerForm.controls; }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    console.log(this.registerForm.value.password)

    this.addUser(this.registerForm.value.email, this.registerForm.value.password, "test");
    this.onReset();

    // continue

    // var web3 = new Web3('ws://localhost:7545');
    // console.log(web3);
    // web3.eth.getAccounts().then((x)=>{
    //   console.log(x)
    // })
  }

  addUser(email: string, password: string, wallet: string){
    this.store.dispatch( new UserActions.AddUser({email: email, password: password, wallet: wallet}))
  }


  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.registrationModal();
  }

}
