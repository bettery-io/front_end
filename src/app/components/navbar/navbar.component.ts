import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Coins } from '../../models/Coins.model';
import * as CoinsActios from '../../actions/coins.actions';
import * as UserActions from '../../actions/user.actions';
import * as InvitesAction from '../../actions/invites.actions';

import LoomEthCoin from '../../services/LoomEthCoin';
import ERC20 from '../../services/ERC20';

import Web3 from 'web3';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../../services/post.service';
import { faReply, faShare } from '@fortawesome/free-solid-svg-icons';
import _ from "lodash";
import Contract from '../../services/contract';




@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit, OnDestroy {

  nickName: string = undefined;
  regisModal: boolean = false
  loomEthCoinData = null;
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
  UserSubscribe;
  CoinsSubscribe;
  connectToLoomGuard = true;
  invitationQuantity = null;
  userHistory: any = []
  faReply = faReply
  faShare = faShare
  loadMore = false
  avatar;
  holdBalance:any = 0;
  ERC20Connection: any = null;

  constructor(
    private store: Store<AppState>,
    private modalService: NgbModal,
    private postService: PostService
  ) {
    this.store.select("user").subscribe((x) => {
      if (x.length !== 0) {
        this.nickName = x[0].nickName;
        this.userWallet = x[0].wallet;
        this.avatar = x[0].avatar
        this.activeTab = "eventFeed"

        let historyData = _.orderBy(x[0].historyTransaction, ['date'], ['desc']);
        this.getHistoryUsers(historyData)
        this.getInvitation()
        if (this.connectToLoomGuard) {
          this.amountSpinner = true;
          this.connectToLoom()
        }
      }
    });
    this.store.select("coins").subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
        this.getMoneyHolder();
      }
    })
    this.store.select("invites").subscribe((x) => {
      if (x.length !== 0) {
        this.invitationQuantity = x[0].amount
      }
    })
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
      wallet: this.userWallet
    }
    this.postService.post("my_activites/invites", data)
      .subscribe(async (x: any) => {
        let amount = x.length
        this.store.dispatch(new InvitesAction.UpdateInvites({ amount: amount }));
      })
  }

  ngOnInit() {
    let interval = setInterval(async () => {
      if (this.userWallet !== undefined) {
        let checkSelectedAddress = await window.web3.currentProvider.selectedAddress
        if (checkSelectedAddress !== this.userWallet) {
          this.connectToLoomGuard = true;
          this.store.dispatch(new UserActions.RemoveUser(0));
          this.nickName = undefined;
          clearImmediate(interval);
        }
      }
    }, 500)

  }

  async connectToLoom() {
    this.connectToLoomGuard = false;
    this.web3 = new Web3(window.web3.currentProvider);
    this.loomEthCoinData = new LoomEthCoin()
    await this.loomEthCoinData.load(this.web3)
    this.ERC20Connection = new ERC20()
    await this.ERC20Connection.load(this.web3)
    this.updateBalance()
  }

  setActiveTab(data) {
    this.activeTab = data;
  }

  async updateBalance() {
    this.coinInfo = await this.loomEthCoinData._updateBalances();
    this.store.dispatch(new CoinsActios.UpdateCoins({ loomBalance: this.coinInfo.loomBalance, mainNetBalance: this.coinInfo.mainNetBalance }))
    let ERC20Info = await this.ERC20Connection._updateBalances();
    console.log(ERC20Info);
  }

  async getMoneyHolder() {
    let contract = new Contract()
    let contr = await contract.initContract();
    let holdBalance = await contr.methods.onHold().call();
    if (Number(holdBalance) > 0) {
      let web3 = new Web3();
      this.holdBalance = Number(web3.utils.fromWei(holdBalance, 'ether')).toFixed(4);
    } else {
      this.holdBalance = holdBalance;
    }
    console.log(this.holdBalance);
    this.amountSpinner = false;
  }


  registrationModal() {
    this.regisModal = !this.regisModal;
  }

  receiveRegistState($event) {
    this.regisModal = $event;
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.updateBalance()
  }


  changeInput() {
    this.depositError = undefined;
  }

  changeWithdrawal() {
    this.withdrawalError = undefined;
  }

  async deposit() {
    if (this.depositAmount > 0) {
      if (Number(this.depositAmount) > Number(this.coinInfo.mainNetBalance)) {
        this.depositError = "You don't have enough money"
      } else {
        this.depositSpinner = true;
        var value = this.web3.utils.toWei(this.depositAmount.toString(), 'ether')
        let response = await this.loomEthCoinData.depositEth(value);
        if (response === undefined) {
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
        var value = this.web3.utils.toWei(this.withdrawalAmount.toString(), 'ether')
        let response = await this.loomEthCoinData.withdrawEth(value)
        if (response === undefined) {
          this.modalService.dismissAll()
          this.withdrawalSpinner = false;
        } else {
          this.withdrawalSpinner = false;
          this.withdrawalError = response.message
        }
        console.log(response);
      }
    } else {
      this.withdrawalError = "Must be more than zero"
    }
  }

  ngOnDestroy() {
    this.UserSubscribe.unsubscribe();
    this.CoinsSubscribe.unsubscribe();
  }


}
