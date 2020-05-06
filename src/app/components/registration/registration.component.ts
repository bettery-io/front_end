import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/fontawesome-free-brands'
import { Store } from '@ngrx/store';
import { User } from '../../models/User.model';
import { AppState } from '../../app.state';
import * as UserActions from '../../actions/user.actions';
import { PostService } from '../../services/post.service';
import Web3 from 'web3';
import { Router } from "@angular/router";
import { FacebookLoginProvider, GoogleLoginProvider, AuthService, SocialUser } from "angularx-social-login";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})
export class RegistrationComponent implements OnInit, OnDestroy{

  registerForm: FormGroup;
  submitted: boolean = false;
  faTimes = faTimes;
  registerError: string = undefined;
  web3: Web3 | undefined = null;
  metamaskError: string = undefined;
  userWallet: string = undefined;
  networkEror: boolean = false;
  validateSubscribe;
  loginWithMetamsk = false;
  faGoogle = faGoogle;
  faFacebook = faFacebook;
  spinner = true;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private http: PostService,
    private router: Router,
    private authService: AuthService,
    public activeModal: NgbActiveModal
  ) {
    // social login
    this.authService.authState.subscribe((user) => {
      if(user !== null){
        console.log(user);
        this.socialRegistration(user);
      }
    });
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nickName: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', Validators.email]
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  async loginMetamask() {
    this.loginWithMetamsk = true;
    // Check if MetaMask is installed
    if (!(window as any).ethereum) {
      this.spinner = false;
      this.metamaskError = "For registration you must have Metamask installed.";
    } else {

      if (!this.web3) {
        try {
          await (window as any).ethereum.enable();
          window.web3 = new Web3(window.web3.currentProvider);
          this.web3 = new Web3(window.web3.currentProvider);
        } catch (error) {
          this.spinner = false;
          this.closeModal()
          window.alert('You need to allow MetaMask.');
          return;
        }
      }

      const coinbase = await this.web3.eth.getCoinbase();
      if (!coinbase) {
        this.spinner = false;
        this.closeModal()
        window.alert('Please activate MetaMask first.');
        return;
      } else {
        this.detectWalletInDB(coinbase, this.web3)
      }
    }
  }

  async detectWalletInDB(wallet: string, web3) {
    let checkNetwork = await web3._provider.networkVersion
    if (checkNetwork !== '4') {
      this.spinner = false;
      this.networkEror = true;
    } else {
      let data = {
        wallet: wallet
      }
      this.validateSubscribe = this.http.post("user/validate", data)
        .subscribe(
          (x: User) => {
            this.spinner = false;
            console.log(x);
            if (x.wallet === undefined) {
              this.userWallet = wallet;
            } else {
              this.addUser(
                x.email,
                x.nickName,
                x.wallet,
                x.listHostEvents,
                x.listParticipantEvents,
                x.listValidatorEvents,
                x.historyTransaction,
                x.avatar,
                x._id,
                false,
                x.fakeCoins,
                x.socialRegistration);
            }
          },
          (err) => {
            console.log("validate user error")
            console.log(err);
          })
    }
  }

  closeModal() {
    this.activeModal.dismiss('Cross click')
  }

  get f() { return this.registerForm.controls; }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  socialRegistration(user) {
    let color = this.getRandomColor()

    let data: User = {
      _id: null,
      nickName: user.name,
      email: user.email,
      wallet: "null",
      listHostEvents: [],
      listParticipantEvents: [],
      listValidatorEvents: [],
      historyTransaction: [],
      avatar: color,
      onlyRegistered: true,
      socialRegistration: true,
      fakeCoins: 100
    }

    this.http.post("user/socialRegistration", data)
      .subscribe(
        (x: User) => {
          this.addUser(
            x.email,
            x.nickName,
            x.wallet,
            x.listHostEvents,
            x.listParticipantEvents,
            x.listValidatorEvents,
            x.historyTransaction,
            x.avatar,
            x._id,
            true,
            x.fakeCoins,
            true
          );
          let getLocation = document.location.href
          let gurd = getLocation.search("question")
          if (gurd === -1) {
            this.router.navigate(['~ki339203/eventFeed'])
          }
        },
        (err) => {
          this.registerError = err.error;
        })
  }


  onSubmit() {
    this.submitted = true;
    let color = this.getRandomColor()

    if (this.registerForm.invalid) {
      return;
    }

    let data: User = {
      _id: null,
      nickName: this.registerForm.value.nickName,
      email: this.registerForm.value.email,
      wallet: this.userWallet,
      listHostEvents: [],
      listParticipantEvents: [],
      listValidatorEvents: [],
      historyTransaction: [],
      avatar: color,
      onlyRegistered: true,
      socialRegistration: false,
      fakeCoins: 100
    }


    this.http.post("user/regist", data)
      .subscribe(
        (x: any) => {
          this.addUser(
            this.registerForm.value.email,
            this.registerForm.value.nickName,
            this.userWallet,
            [],
            [],
            [],
            [],
            color,
            x._id,
            true,
            100,
            false
          );
          let getLocation = document.location.href
          let gurd = getLocation.search("question")
          if (gurd === -1) {
            this.router.navigate(['~ki339203/eventFeed'])
          }
        },
        (err) => {
          this.registerError = err.error;
        })
  }

  addUser(
    email: string,
    nickName: string,
    wallet: string,
    listHostEvents: Object,
    listParticipantEvents: Object,
    listValidatorEvents: Object,
    historyTransaction: Object,
    color: string,
    _id: number,
    onlyRegistered: boolean,
    fakeCoins: number,
    socialRegistration: boolean
  ) {

    this.store.dispatch(new UserActions.AddUser({
      _id: _id,
      email: email,
      nickName: nickName,
      wallet: wallet,
      listHostEvents: listHostEvents,
      listParticipantEvents: listParticipantEvents,
      listValidatorEvents: listValidatorEvents,
      historyTransaction: historyTransaction,
      avatar: color,
      onlyRegistered: onlyRegistered,
      fakeCoins: fakeCoins,
      socialRegistration: socialRegistration
    }))
    this.onReset();
  }


  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.closeModal();
  }

  ngOnDestroy() {
 //   this.validateSubscribe.unsubscribe();
  }

}
