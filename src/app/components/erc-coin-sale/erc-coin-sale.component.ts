import { Component, OnInit, OnDestroy } from '@angular/core';
import Web3 from 'web3';
import { GetService } from '../../services/get.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'erc-coin-sale',
  templateUrl: './erc-coin-sale.component.html',
  styleUrls: ['./erc-coin-sale.component.sass']
})
export class ErcCoinSaleComponent implements OnInit, OnDestroy {
  private tokenPricePrivate: number = 0;
  tokenSale: any = null;

  // new variable 
  web3: Web3 | undefined = null;
  errorMessage: string = undefined
  getServiceSub: Subscription
  numberOfTokens = undefined;


  constructor(public getService: GetService) { }

  async ngOnInit() {
    this.getServiceSub = this.getService.get("tokensale/info").subscribe((x) => {
      console.log(x);
    }, (err) => {
      console.log(err)
    })
  }

  async connectToMetamask() {
    // Check if MetaMask is installed
    this.errorMessage = undefined;
    if (!(window as any).ethereum) {
      this.errorMessage = "For buying coins you must have Metamask installed.";
    } else {
      if (!this.web3) {
        try {
          await (window as any).ethereum.enable();
          window.web3 = new Web3(window.web3.currentProvider);
          this.web3 = new Web3(window.web3.currentProvider);
        } catch (error) {
          this.errorMessage = "You need to allow MetaMask.";
        }
      }
      const coinbase = await this.web3.eth.getCoinbase();
      if (!coinbase) {
        this.errorMessage = "Please activate MetaMask first.";
        return;
      } else {
        let checkNetwork = await window.web3._provider.networkVersion
        if (checkNetwork != '5') {
          this.errorMessage = "Plaese switch your network in MetaMask to the Main network."
        } else {
          this.buyToken(coinbase)
        }
      }
    }
  }


  async buyToken(wallet) {
    console.log(this.numberOfTokens);
    if (this.numberOfTokens <= 0) {
      console.log("work")
      this.errorMessage = "The value must be bigger than 0"
    } else {
      this.errorMessage = undefined;
      // try {
      //   let web3 = new Web3()
      //   let amount = web3.utils.toWei(String(this.numberOfTokens), 'ether');
      //   await this.tokenSale.methods.buyTokens(amount).send({
      //     from: wallet,
      //     value: this.numberOfTokens * this.tokenPricePrivate,
      //     gas: 500000
      //   })

      // } catch (err) {
      //   if (err.code !== 4001) {
      //     this.errorMessage = 'Something went wrong check console';
      //   }
      //   console.log(err);
      // }
    }
  }

  ngOnDestroy() {
    if (this.getServiceSub) {
      this.getServiceSub.unsubscribe();
    }
  }
}
