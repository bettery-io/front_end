import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { User } from '../../models/User.model';
import { AppState } from '../../app.state';
import * as UserActions from '../../actions/user.actions';
import { PostService } from '../../services/post.service';
import Web3 from 'web3';
import { Router } from "@angular/router";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import web3Obj from '../../helpers/torus'
import { Subscription } from 'rxjs';



@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  submitted: boolean = false;
  faTimes = faTimes;
  registerError: any = undefined;
  web3: Web3 | undefined = null;
  metamaskError: string = undefined;
  userWallet: string = undefined;
  validateSubscribe: Subscription;
  torusRegistSub: Subscription;
  registSub: Subscription;
  loginWithMetamsk = false;
  spinner: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private http: PostService,
    private router: Router,
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nickName: ['', Validators.minLength(6)],
      email: ['', [Validators.email, Validators.required]]
    });
    // this.loginWithTorus();
  }

  async loginWithTorus() {
    this.spinner = true;
    // this.activeModal.dismiss('Cross click')
    try {
      await web3Obj.initialize()
      this.setTorusInfoToDB()
    } catch (error) {
      this.spinner = false
      console.error(error)
    }
  }

  async setTorusInfoToDB() {
    let userInfo = await web3Obj.torus.getUserInfo("")
    let userWallet = (await web3Obj.web3.eth.getAccounts())[0]

    let data: Object = {
      _id: null,
      wallet: userWallet,
      nickName: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.profileImage,
      verifier: userInfo.verifier,
      verifierId: userInfo.verifierId,
    }
    this.torusRegistSub = this.http.post("user/torus_regist", data)
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
            x.verifier
          );
          this.spinner = false;
        }, (err) => {
          console.log(err);
        });
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
          this.metamaskError = "You need to allow MetaMask.";
        }
      }

      const coinbase = await this.web3.eth.getCoinbase();
      if (!coinbase) {
        this.spinner = false;
        this.metamaskError = "Please activate MetaMask first.";
        return;
      } else {
        this.detectWalletInDB(coinbase, this.web3)
      }
    }
  }

  async detectWalletInDB(wallet: string, web3) {
    let checkNetwork = await web3._provider.networkVersion
    if (checkNetwork !== '5') {
      this.spinner = false;
      this.metamaskError = "Plaese switch your network in MetaMask to the Goerli network."
    } else {
      let data = {
        wallet: wallet
      }
      this.validateSubscribe = this.http.post("user/validate", data)
        .subscribe(
          (x: User) => {
            console.log(x);
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
                x.verifier);
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


  onSubmit() {
    this.submitted = true;
    let color = this.getRandomColor()

    if (this.registerForm.invalid) {
      return;
    }

    let data: Object = {
      _id: null,
      nickName: this.registerForm.value.nickName,
      email: this.registerForm.value.email,
      wallet: this.userWallet,
      avatar: color,
    }


    this.registSub = this.http.post("user/regist", data)
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
            x.verifier
          );
          let getLocation = document.location.href
          let gurd = getLocation.search("question")
          if (gurd === -1) {
            this.router.navigate(['eventFeed'])
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
    verifier: string
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
      verifier: verifier
    }))
    this.onReset();
  }


  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.closeModal();
  }

  ngOnDestroy() {
    if (this.validateSubscribe) {
      this.validateSubscribe.unsubscribe()
    }
    if (this.torusRegistSub) {
      this.torusRegistSub.unsubscribe()
    }
    if (this.registSub) {
      this.registSub.unsubscribe();
    }
  }

}
