import { Component, OnInit, OnDestroy } from '@angular/core';
import Web3 from 'web3';
import { PostService } from '../../services/post.service';
import { Subscription } from 'rxjs';
import USDTToken from '../../../../build/contracts/IERC20.json';
import TokenSale from '../../../../build/contracts/QuizeTokenSale.json';

@Component({
  selector: 'erc-coin-sale',
  templateUrl: './erc-coin-sale.component.html',
  styleUrls: ['./erc-coin-sale.component.sass']
})
export class ErcCoinSaleComponent implements OnInit, OnDestroy {
  web3: Web3 | undefined = null;
  errorMessage: string = undefined
  postServiceSub: Subscription
  numberOfTokens = undefined;
  tokensaleInfo: any;
  spinner: boolean = false;


  constructor(public postService: PostService) { }

  async ngOnInit() {
    this.getDataFromDb();
  }

  getDataFromDb() {
    let data = {
      from: "dev"
    }
    this.postServiceSub = this.postService.post("tokensale/info", data).subscribe((x) => {
      this.tokensaleInfo = x;
      console.log(this.tokensaleInfo);
    }, (err) => {
      console.log(err)
    })
  }

  async connectToMetamask() {
    // Check if MetaMask is installed
    this.spinner = true;
    this.errorMessage = undefined;
    if (!(window as any).ethereum) {
      this.errorMessage = "For buying coins you must have Metamask installed.";
      this.spinner = false;
    } else {
      if (!this.web3) {
        try {
          await (window as any).ethereum.enable();
          window.web3 = new Web3(window.web3.currentProvider);
          this.web3 = new Web3(window.web3.currentProvider);
        } catch (error) {
          this.errorMessage = "You need to allow MetaMask.";
          this.spinner = false;
        }
      }
      const coinbase = await this.web3.eth.getCoinbase();
      if (!coinbase) {
        this.errorMessage = "Please activate MetaMask first.";
        this.spinner = false;
        return;
      } else {
        let checkNetwork = await window.web3._provider.networkVersion
        if (checkNetwork != '5') {
          this.errorMessage = "Plaese switch your network in MetaMask to the Main network."
          this.spinner = false;
        } else {
          this.buyToken(coinbase)
        }
      }
    }
  }


  async buyToken(wallet) {
    if (this.numberOfTokens <= 0) {
      this.errorMessage = "The value must be bigger than 0"
      this.spinner = false;
    } else {
      this.errorMessage = undefined;
      try {
        let networkId = 5;
        let tokenSaleAddress = TokenSale.networks[networkId].address;
        let tokenAddress = "0xFCf9F99D135D8a78ab60CC59CcCF3108E813bA35";

        let usdtContract = await this.connectToContract(wallet, USDTToken, tokenAddress);
        let approveAmount = this.web3.utils.toWei(String(Number(this.numberOfTokens) * Number(this.tokensaleInfo.price)), 'mwei');
        let approve = await usdtContract.methods.approve(tokenSaleAddress, approveAmount).send()
        console.log(approve);

        let tokenSaleContract = await this.connectToContract(wallet, TokenSale, tokenSaleAddress)
        let tokensAmount = this.web3.utils.toWei(String(this.numberOfTokens), 'ether');
        let buy = await tokenSaleContract.methods.buyTokens(tokensAmount).send();
        console.log(buy);
        this.numberOfTokens = 0;
        this.getDataFromDb();
        this.spinner = false;
      } catch (err) {
        this.errorMessage = err.message;
        this.spinner = false;
        console.log(err);
      }
    }
  }

  async connectToContract(account, contract, address) {
    let abi: any = contract.abi;
    return new this.web3.eth.Contract(abi, address, { from: account });
  }

  ngOnDestroy() {
    if (this.postServiceSub) {
      this.postServiceSub.unsubscribe();
    }
  }
}
