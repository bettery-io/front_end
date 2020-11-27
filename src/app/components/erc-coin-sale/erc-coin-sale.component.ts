import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import Contract from '../../contract/contract.js'
import maticInit from '../../contract/maticInit'


@Component({
  selector: 'erc-coin-sale',
  templateUrl: './erc-coin-sale.component.html',
  styleUrls: ['./erc-coin-sale.component.sass']
})
export class ErcCoinSaleComponent implements OnInit {
  private tokenPricePrivate: number = 0;

  tokenPrice: number = 0.001;
  progressToken: number = 0
  tokenSold: number = 0;
  metamaskError: string = undefined
  token: any = null;
  tokensAvailable: number = 750000000;
  tokenSale: any = null;
  numberOfTokens = 1;
  numberError: boolean = false
  spinner: boolean = true;
  userWallet = null;
  buyTokensMessage: boolean = false;
  transferButton: boolean = false;
  verifier: string = undefined;

  constructor() { }

  async ngOnInit() { }

  async initToken() {
    this.userWallet = "TODO";
    this.verifier = "metamask";
    this.sellContract(this.userWallet);
    this.tokenContract();
    let matic = new maticInit(this.verifier);
    let account = await matic.getUserAccount();
    this.transferButton = account === "0xF02B362cBEFC2d5bD5f7C3dBdbD0DE84508525D5";
  }

  async sellContract(wallet) {
    let contract = new Contract();
    this.tokenSale = await contract.tokenSaleMainETH(this.verifier)
    let tokenSold = await this.tokenSale.methods.tokensSold().call();
    let web3 = new Web3();
    this.tokenSold = Number(web3.utils.fromWei(tokenSold, 'ether'));

    this.progressToken = (Math.ceil(this.tokenSold) / this.tokensAvailable) * 100;

    let price = await this.tokenSale.methods.tokenPrice().call();
    this.tokenPricePrivate = Number(price);
    this.tokenPrice = Number(web3.utils.fromWei(price, "ether"));

    // Detect Sell event
    this.tokenSale.events.Sell(async (err, event) => {
      if (err) {
        console.log(err)
      } else {
        this.sellContract(wallet);
        this.tokenContract();
      }
    })
  }

  async tokenContract() {
    let contract = new Contract();
    this.token = await contract.tokenContractMainETH(this.verifier)
    this.spinner = false;
    this.buyTokensMessage = false;
  }

  async buyToken() {
    if (this.numberOfTokens <= 0) {
      this.numberError = true
    } else {
      this.numberError = false
      try {
        this.buyTokensMessage = true;
        this.spinner = true;
        let web3 = new Web3()
        let amount = web3.utils.toWei(String(this.numberOfTokens), 'ether');
        await this.tokenSale.methods.buyTokens(amount).send({
          from: this.userWallet,
          value: this.numberOfTokens * this.tokenPricePrivate,
          gas: 500000
        })

      } catch (err) {
        this.spinner = false;
        this.buyTokensMessage = false;
        if (err.code !== 4001) {
          this.metamaskError = 'Something went wrong check console';
        }
        console.log(err);
      }
    }
  }

  // transfer tokens. Avaliable only for owners
  async transferToken() {
    let web3 = new Web3()
    let amount = web3.utils.toWei('750000000', 'ether');
    let contract = new Contract();
    let address = contract.tokenContractAddressMainETH()
    let test = await this.token.methods.transfer(address, amount).send({
      from: this.userWallet,
    })
    console.log(test);
  }

}
