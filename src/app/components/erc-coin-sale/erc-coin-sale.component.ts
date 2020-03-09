import { Component } from '@angular/core';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import Web3 from 'web3';

@Component({
  selector: 'erc-coin-sale',
  templateUrl: './erc-coin-sale.component.html',
  styleUrls: ['./erc-coin-sale.component.sass']
})
export class ErcCoinSaleComponent {

  tokenPrice: number = 0;
  tokenOwner: number = 0;
  progressToken: number = 50
  tokenSold: number = 0;
  tokenSupply: number = 0;
  metamaskError: string = undefined
  web3: Web3 | undefined = null;

  constructor(config: NgbProgressbarConfig) {
    config.max = 100;
    config.striped = true;
    config.animated = true;
  }

  async initMetamask() {
    if (!(window as any).ethereum) {
      this.metamaskError = "For buy coins you must have Metamask installed.";
    } else {
      if (!this.web3) {
        try {
          await (window as any).ethereum.enable();
          window.web3 = new Web3(window.web3.currentProvider);
          this.web3 = new Web3(window.web3.currentProvider);
        } catch (error) {
          this.metamaskError = 'You need to allow MetaMask.';
          return;
        }
      }
      const coinbase = await this.web3.eth.getCoinbase();
      if (!coinbase) {
        this.metamaskError = 'Please activate MetaMask first.';
        return;
      } else {
        this.buyToken()

      }
    }
  }

  buyToken() {
    console.log("work")
  }

}
