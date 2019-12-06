import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { User } from '../../models/User.model';
import { AppState } from '../../app.state';
import * as UserActions from '../../actions/user.actions';
import { PostService } from '../../services/post.service';
import Web3 from 'web3';


@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  submitted: boolean = false;
  faTimes = faTimes;
  registerError: string = undefined;
  web3: Web3 | undefined = null;
  metamaskError: string = undefined;
  userWallet: string = undefined;
  userWalletIsUndefinded: boolean = true


  @Output() regisModalEvent = new EventEmitter<boolean>();


  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private http: PostService
  ) {
    this.getUseWalletInMetamask();
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nickName: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', Validators.email]
    });
  }

  async getUseWalletInMetamask() {
    // Check if MetaMask is installed
    if (!(window as any).ethereum) {
      this.metamaskError = "For registration you must have Metamask installed.";
      this.userWalletIsUndefinded = false
    } else {

      if (!this.web3) {
        try {
          await (window as any).ethereum.enable();
          window.web3 = new Web3(window.web3.currentProvider);
          this.web3 = new Web3(window.web3.currentProvider);
          console.log(this.web3);
        } catch (error) {
          this.registrationModal()
          window.alert('You need to allow MetaMask.');
          return;
        }
      }

      const coinbase = await this.web3.eth.getCoinbase();
      if (!coinbase) {
        this.registrationModal()
        window.alert('Please activate MetaMask first.');
        return;
      } else {
        this.detectWalletInDB(coinbase)

      }
    }
  }

  detectWalletInDB(wallet: string) {
    let data = {
      wallet: wallet
    }
    this.http.post("user/validate", data)
      .subscribe(
        (x: User) => {
          if (x.wallet === undefined) {
            this.userWallet = wallet;
            this.userWalletIsUndefinded = false
          } else {
            this.addUser(x.email, x.nickName, x.wallet);
          }
        },
        (err) => {
          console.log("validate user error")
          console.log(err);
        })
  }

  registrationModal() {
    this.regisModalEvent.emit(false);
  }

  closeOutSide(event) {
    if (event.target.id === "close") {
      this.registrationModal();
    };
  }

  get f() { return this.registerForm.controls; }


  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    let data: User = {
      nickName: this.registerForm.value.nickName,
      email: this.registerForm.value.email,
      wallet: this.userWallet
    }


    this.http.post("user/regist", data)
      .subscribe(
        () => {
          this.addUser(this.registerForm.value.email, this.registerForm.value.nickName, this.userWallet);
        },
        (err) => {
          this.registerError = err.error;
        })
  }

  addUser(email: string, nickName: string, wallet: string) {

    this.store.dispatch(new UserActions.AddUser({ email: email, nickName: nickName, wallet: wallet }))
    this.onReset();
  }


  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.registrationModal();
  }

}
