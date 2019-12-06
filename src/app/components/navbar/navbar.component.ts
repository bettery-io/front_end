import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import LoomEthCoin from '../../services/LoomEthCoin';
import Web3 from 'web3';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {

  nickName: string = undefined;
  regisModal: boolean = false
  loomEthCoinData = null;
  web3: Web3 | undefined = null;
  coinInfo = null;
  depositAmount: number = 0;
  depositError: string = undefined;
  amountSpinner: boolean = true;
  depositSpinner: boolean = false;


  constructor(private store: Store<AppState>, private modalService: NgbModal) {
    this.store.select("user").subscribe((x) => {
      if (x.length !== 0) {
        this.nickName = x[0].nickName;
        this.connectToLoom()
      }
    });
  }

  connectToLoom() {
    this.web3 = new Web3(window.web3.currentProvider);
    this.loomEthCoinData = new LoomEthCoin()
    this.loomEthCoinData.load(this.web3)
    setTimeout(() => {
     this.updateBalance()
    }, 2500)
  }

  async updateBalance() {
    this.coinInfo = await this.loomEthCoinData._updateBalances()
    this.amountSpinner = false;
    console.log(this.coinInfo);
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


  changeInput(value){
    this.depositError = undefined;
  }

  async deposit(){
    if(this.depositAmount > 0){
      this.depositSpinner = true;
      var value = this.depositAmount * 1000000000000000000;
      let response = await this.loomEthCoinData.depositEth(value);
      if(response === undefined){
       this.modalService.dismissAll()
       this.depositSpinner = false;
      }else{
        this.depositSpinner = false;
        this.depositError = response.message
      }
    }else{
     this.depositError = "Must be more than zero"
    }

  }


}
