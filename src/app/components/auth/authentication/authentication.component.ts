import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { Store } from '@ngrx/store';
import { User } from '../../../models/User.model';
import { AppState } from '../../../app.state';
import * as UserActions from '../../../actions/user.actions';

import { faTimes } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.sass']
})
export class AuthenticationComponent implements OnInit {

  authForm: FormGroup;
  submitted: boolean = false;
  faTimes = faTimes;
  authError: string = undefined; 

  @Output() authModalEvent = new EventEmitter<boolean>();


  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private http: PostService
  ) { }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  closeOutSide(event){
    if(event.target.id === "close"){
      this.authModal();
    };
  }

  get f() { return this.authForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    }

    let data = {
      email: this.authForm.value.email,
      password: this.authForm.value.password,
    }

    this.http.post("user/auth", data)
      .subscribe(
        (x: User) => {
         this.addUser(x.email, x.password, x.wallet);
        },
        (err) => {
          this.authError = err.error;
        })
  }

  addUser(email: string, password: string, wallet: string) {
    this.store.dispatch(new UserActions.AddUser({ email: email, password: password, wallet: wallet }))
    this.onReset();
  }


  onReset() {
    this.submitted = false;
    this.authForm.reset();
    this.authModal();
  }

  authModal() {
    this.authModalEvent.emit(false);
  }

}
