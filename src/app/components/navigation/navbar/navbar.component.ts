import { Component, OnInit, OnDestroy, HostListener, ViewChild, DoCheck } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Coins } from '../../../models/Coins.model';
import * as CoinsActios from '../../../actions/coins.actions';
import * as UserActions from '../../../actions/user.actions';
import * as InvitesAction from '../../../actions/invites.actions';
import { RegistrationComponent } from '../../registration/registration.component';
import maticInit from '../../../contract/maticInit.js'

import Web3 from 'web3';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../../../services/post.service';
import { GetService } from '../../../services/get.service';
import { faReply, faShare } from '@fortawesome/free-solid-svg-icons';
import _ from "lodash";
import Contract from '../../../contract/contract';
import web3Obj from '../../../helpers/torus'
import { Subscription } from 'rxjs';
import { WelcomePageComponent } from "../../share/welcome-page/welcome-page.component";


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit, OnDestroy, DoCheck {
  @ViewChild('insideElement', { static: false }) insideElement;

  nickName: string = undefined;
  web3: Web3 | undefined = null;
  coinInfo: Coins = null;
  depositAmount: number = 0;
  withdrawalAmount: number = 0;
  depositError: string = undefined;
  withdrawalError: string = undefined;
  amountSpinner: boolean = true;
  depositSpinner: boolean = false;
  withdrawalSpinner: boolean = false;
  activeTab: string = undefined;
  userWallet: string = undefined;
  userId: number;
  userSub: Subscription;
  coinsSub: Subscription;
  invitesSub: Subscription;
  postSub: Subscription;
  getSub: Subscription;
  invitationQuantity = null;
  userHistory: any = []
  faReply = faReply
  faShare = faShare
  loadMore = false
  avatar;
  holdBalance: any = 0;
  ERC20Coins: any = [];
  ERC20depositError: string = undefined;
  ERC20depositAmount: number = 0;
  ERC20withdrawalError: string = undefined;
  ERC20withdrawalAmount: number = 0;
  verifier: string = undefined;
  openNavBar = false;
  display: boolean = false;

  spinnerLoading: boolean;
  saveUserLocStorage = [];

  constructor(
    private store: Store<AppState>,
    private modalService: NgbModal,
    private postService: PostService,
    private getService: GetService,
  ) {

    this.detectPath()

    this.userSub = this.store.select("user").subscribe((x) => {
      if (x.length !== 0) {
        this.nickName = x[0].nickName;
        this.userWallet = x[0].wallet;
        this.verifier = x[0].verifier
        this.avatar = x[0].avatar;
        this.userId = x[0]._id;
        this.activeTab = "eventFeed"

        let historyData = _.orderBy(x[0].historyTransaction, ['date'], ['desc']);
        this.getHistoryUsers(historyData)
        this.getInvitation()
        this.updateBalance()
      }
    });

    this.coinsSub = this.store.select("coins").subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
        this.getMoneyHolder();
      }
    })

    this.invitesSub = this.store.select("invites").subscribe((x) => {
      if (x.length !== 0) {
        this.invitationQuantity = x[0].amount
      }
    })
  }

  ngDoCheck() {
    this.detectPath()
  }

  detectPath() {
    let href = window.location.pathname
    if (href == "/" || href == "/tokensale") {
      this.display = false;
    } else {
      this.display = true;
    }
  }

  getHistoryUsers(data) {
    if (data === undefined) {
      this.userHistory = []
      this.loadMore = false
    } else {
      let z = data.map((x) => {
        return {
          date: Number((new Date(x.date).getTime() * 1000).toFixed(0)),
          amount: x.amount.toFixed(4),
          currencyType: x.currencyType,
          paymentWay: x.paymentWay,
          eventId: x.eventId,
          role: x.role
        }
      })
      if (z.length > 5) {
        this.loadMore = true
        this.userHistory = z.slice(0, 5)
      } else {
        this.loadMore = true
        this.userHistory = z;
      }
    }
  }

  getInvitation() {
    let data = {
      id: this.userId
    }
    this.postSub = this.postService.post("my_activites/invites", data)
      .subscribe(async (x: any) => {
        let amount = x.length
        this.store.dispatch(new InvitesAction.UpdateInvites({ amount: amount }));
      })
  }

  ngOnInit() {
    let interval = setInterval(async () => {
      if (this.userWallet !== undefined && this.verifier === "metamask") {
        let checkSelectedAddress = await window.web3.currentProvider.selectedAddress
        if (checkSelectedAddress !== this.userWallet) {
          this.store.dispatch(new UserActions.RemoveUser(0));
          this.nickName = undefined;
          this.userWallet = undefined;
          clearImmediate(interval);
        }
      }
    }, 500)

    this.onDocumentClick = this.onDocumentClick.bind(this);
    document.addEventListener('click', this.onDocumentClick);

  }

  depositGuard() {
    if (!this.amountSpinner) {
      return true
    } else {
      return false
    }
  }

  setActiveTab(data) {
    this.activeTab = data;
  }

  async updateBalance() {
    let web3 = new Web3(this.verifier === "metamask" ? window.web3.currentProvider : web3Obj.torus.provider);
    let mainBalance = await web3.eth.getBalance(this.userWallet);

    let matic = new maticInit(this.verifier);
    let MTXToken = await matic.getMTXBalance();
    let TokenBalance = await matic.getERC20Balance();

    let contract = new Contract();
    let token = await contract.tokenContractMainETH(this.verifier)
    let avaliableTokens = await token.methods.balanceOf(this.userWallet).call();

    let maticTokenBalanceToEth = web3.utils.fromWei(MTXToken, "ether");
    let mainEther = web3.utils.fromWei(mainBalance, "ether")
    let tokBal = web3.utils.fromWei(TokenBalance, "ether")
    let avalTok = web3.utils.fromWei(avaliableTokens, "ether")

    this.ERC20Coins.mainNetBalance = avalTok;
    this.ERC20Coins.loomBalance = tokBal

    this.store.dispatch(new CoinsActios.UpdateCoins({
      loomBalance: maticTokenBalanceToEth,
      mainNetBalance: mainEther,
      tokenBalance: tokBal
    }))
    this.amountSpinner = false;
  }

  async getMoneyHolder() {
    let matic = new maticInit(this.verifier);
    let userWallet = await matic.getUserAccount()

    let contract = new Contract()
    let contr = await contract.publicEventContract();
    let holdBalance = Number(await contr.methods.onHold(userWallet).call());
    if (holdBalance > 0) {
      let web3 = new Web3();
      this.holdBalance = Number(web3.utils.fromWei(String(holdBalance), 'ether')).toFixed(4);
      this.getEthPrice(this.holdBalance);
    } else {
      this.holdBalance = holdBalance;
      this.amountSpinner = false;
    }
  }

  async getEthPrice(_holdBalance) {
    this.getSub = this.getService.get("eth_price").subscribe((price: any) => {
      let priceData = price.price;
      this.holdBalance = (_holdBalance * priceData).toFixed(4);
      this.amountSpinner = false;
    })
  }


  registrationModal() {
    this.modalService.open(RegistrationComponent);
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.updateBalance()
  }


  changeInput() {
    this.depositError = undefined;
    this.ERC20depositError = undefined;
  }

  changeWithdrawal() {
    this.withdrawalError = undefined;
    this.ERC20withdrawalError = undefined;
  }

  async deposit() {
    if (this.depositAmount > 0) {
      if (Number(this.depositAmount) > Number(this.coinInfo.mainNetBalance)) {
        this.depositError = "You don't have enough money"
      } else {
        this.depositSpinner = true;
        let web3 = new Web3()
        var value = web3.utils.toWei(this.depositAmount.toString(), 'ether')
        let matic = new maticInit(this.verifier);
        let response = await matic.depositEth(value);
        console.log(response);
        if (response.message === undefined) {
          this.modalService.dismissAll()
          this.depositSpinner = false;
        } else {
          this.depositSpinner = false;
          this.depositError = response.message
        }
      }
    } else {
      this.depositError = "Must be more than zero"
    }
  }

  async withdrawal() {
    if (this.withdrawalAmount > 0) {
      if (Number(this.withdrawalAmount) > Number(this.coinInfo.loomBalance)) {
        this.withdrawalError = "You don't have enough money in Loom network"
      } else {
        this.withdrawalSpinner = true;
        let web3 = new Web3()
        var value = web3.utils.toWei(this.withdrawalAmount.toString(), 'ether');
        let contract = new Contract()
        let { withdrawal, sign } = await contract.withdrawalWETHToken(this.userWallet, value, this.verifier)
        console.log(withdrawal);
        if (withdrawal.transactionHash !== undefined) {
          let data = {
            userId: this.userId,
            transactionHash: withdrawal.transactionHash,
            amount: value,
            coinType: "ether",
            sign: sign
          }
          this.postSub = this.postService.post("withdrawal/init", data)
            .subscribe(async (x: any) => {
              this.modalService.dismissAll()
              this.withdrawalSpinner = false;
            }, (err) => {
              console.log(err);
              this.withdrawalSpinner = false;
              this.withdrawalError = err
            })
        } else {
          this.withdrawalSpinner = false;
          this.withdrawalError = withdrawal.message
        }
      }
    } else {
      this.withdrawalError = "Must be more than zero"
    }
  }

  async depositERC20() {
    if (this.ERC20depositAmount > 0) {
      if (Number(this.ERC20depositAmount) > Number(this.ERC20Coins.mainNetBalance)) {
        this.ERC20depositError = "You don't have enough tokens in Ethereum network"
      } else {
        this.depositSpinner = true;
        let web3 = new Web3()
        var value = web3.utils.toWei(this.ERC20depositAmount.toString(), 'ether')
        let matic = new maticInit(this.verifier);
        let response = await matic.depositERC20Token(value)
        if (response.message === undefined) {
          this.modalService.dismissAll()
          this.depositSpinner = false;
        } else {
          this.depositSpinner = false;
          this.ERC20depositError = response.message
        }
      }
    } else {
      this.ERC20depositError = "Value must be more that 0"
    }
  }

  async withdrawalERC20() {
    if (this.ERC20withdrawalAmount > 0) {
      if (Number(this.ERC20withdrawalAmount) > Number(this.ERC20Coins.loomBalance)) {
        this.ERC20withdrawalError = "You don't have enough tokens in Ethereum network"
      } else {
        this.withdrawalSpinner = true;
        let web3 = new Web3()
        var value = web3.utils.toWei(this.ERC20withdrawalAmount.toString(), 'ether');
        let matic = new maticInit(this.verifier);
        let withdrawal = await matic.withdraw(value, false)
        if (withdrawal.transactionHash !== undefined) {
          let data = {
            userId: this.userId,
            transactionHash: withdrawal.transactionHash,
            amount: value,
            coinType: "token"
          }
          this.postSub = this.postService.post("withdrawal/init", data)
            .subscribe(async (x: any) => {
              this.modalService.dismissAll()
              this.withdrawalSpinner = false;
            }, (err) => {
              console.log(err);
              this.withdrawalSpinner = false;
              this.ERC20withdrawalError = err
            })
        } else {
          this.withdrawalSpinner = false;
          this.ERC20withdrawalError = withdrawal.message
        }
      }
    } else {
      this.ERC20withdrawalError = "Value must be more that 0"
    }
  }

  // @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
  //   this.logOut()
  // }

  async logOut() {
    if (this.userWallet !== undefined && this.verifier !== "metamask") {
      await web3Obj.torus.cleanUp()
    }
    this.store.dispatch(new UserActions.RemoveUser(0));
    this.nickName = undefined;
    this.openNavBar = false;
  }

  async loginWithTorus() {
    this.spinnerLoading = true;
    try {
      await web3Obj.initialize()
      this.setTorusInfoToDB()
      this.spinnerLoading = false;
    } catch (error) {
      await web3Obj.torus.cleanUp()
      this.spinnerLoading = false;
      console.error(error)
    }
  }

  async setTorusInfoToDB() {
    let userInfo = await web3Obj.torus.getUserInfo("")
    let userWallet = (await web3Obj.web3.eth.getAccounts())[0]

    this.localStoreUser(userInfo);

    let data: Object = {
      _id: null,
      wallet: userWallet,
      nickName: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.profileImage,
      verifier: userInfo.verifier,
      verifierId: userInfo.verifierId,
    }
    this.postSub = this.postService.post("user/torus_regist", data)
      .subscribe(
        (x: any) => {
          console.log(x);
          this.addUser(
            x.email,
            x.nickName,
            x.wallet,
            x.listHostEvents,
            x.listParticipantEvents,
            x.listValidatorEvents,
            x.historyTransaction,
            x.invitationList,
            x.avatar,
            x._id,
            x.verifier
          );
        }, (err) => {
          console.log(err)
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
    invitationList: Object,
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
      invitationList: invitationList,
      avatar: color,
      verifier: verifier
    }))
  }

  navBar() {
    this.openNavBar = !this.openNavBar
  }


  protected onDocumentClick(event: MouseEvent) {
    if (this.insideElement) {
      if (this.insideElement.nativeElement.contains(event.target)) {
        return;
      }
      this.openNavBar = false;
    }
  }

  openWallet() {
    web3Obj.torus.showWallet("home");
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.coinsSub) {
      this.coinsSub.unsubscribe();
    }
    if (this.invitesSub) {
      this.invitesSub.unsubscribe();
    }
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
    if (this.getSub) {
      this.getSub.unsubscribe();
    }
  }

  openModal(contentModal) {
    this.modalService.open(contentModal, { size: 'sm', centered: true });
    this.openNavBar = false;
  }

  localStoreUser(userInfo): void {
    if (localStorage.getItem('userBettery') === undefined || localStorage.getItem('userBettery') == null) {
      localStorage.setItem('userBettery', JSON.stringify(this.saveUserLocStorage));
    }
    const getItem = JSON.parse(localStorage.getItem('userBettery'));
    if (getItem.length === 0 || !getItem.includes(userInfo.email)) {
      const array = JSON.parse(localStorage.getItem('userBettery'));
      array.push(userInfo.email);
      localStorage.setItem('userBettery', JSON.stringify(array));
      this.modalService.open(WelcomePageComponent);
    }
  }
}
