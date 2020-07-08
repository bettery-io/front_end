import Matic from "@maticnetwork/maticjs";
import maticJSON from "../config/matic.json";
import Web3 from "web3";
import web3Obj from '../helpers/torus'
import ERC20 from '../../../build/contracts/EthERC20Coin.json';
import networkConfiguration from '../config/network.json';

export default class maticInit {

    constructor(provider) {
        this.whichProvider = provider
    }

    async init() {
        const network = maticJSON["Mumbai"]

        this.Ropsten_WEthAddress = network.Main.Contracts.tokens.MaticWeth;
        this.Matic_WEthAddress = network.Matic.Contracts.tokens.MaticWeth;
        this.Ropsten_Erc20Address = ERC20.networks[networkConfiguration.goerli].address;
        this.Matic_Erc20Address = "0xC9E7549BC058610CFFEB0d52718af519d7cd81aD";

        const MainNetwork = network.Main;

        this.matic = new Matic({
            maticProvider: new Web3("https://rpc-mumbai.matic.today"),
            parentProvider: new Web3(this.whichProvider === "metamask" ? window.web3.currentProvider : web3Obj.torus.provider),
            rootChain: MainNetwork.Contracts.RootChain,
            withdrawManager: MainNetwork.Contracts.WithdrawManagerProxy,
            depositManager: MainNetwork.Contracts.DepositManagerProxy,
            registry: MainNetwork.Contracts.Registry
        });

        // init account
        let goerli = new Web3(this.whichProvider === "metamask" ? window.web3.currentProvider : web3Obj.torus.provider)
        let accounts = await goerli.eth.getAccounts();
        this.from = accounts[0];
        console.log(this.from)

        this.matic.initialize();
    }

    async getMTXBalance() {
        await this.init();
        return await this.matic.balanceOfERC20(this.from, this.Matic_WEthAddress, { parent: false })
    }

    async getERC20Balance() {
        await this.init();
        return await this.matic.balanceOfERC20(this.from, this.Matic_Erc20Address, { parent: false })
    }

    async depositEth(amount) {
        await this.init();
        try {
            return await this.matic
                .depositEther(amount, {
                    from: this.from
                })
        } catch (err) {
            return err
        }

    }

    async PromiseTimeout(delayms) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, delayms);
        });
    }

    async depositERC20Token(amount) {
        await this.init();
        console.log("*****Deposit ERC20*****");
        let token = this.Ropsten_Erc20Address;
        try {
            let logsForApprove = await this.matic
                .approveERC20TokensForDeposit(token, amount, {
                    from: this.from
                })
            console.log("Approve on Ropsten:" + logsForApprove.transactionHash);
            await this.PromiseTimeout(10000);
            let logsForDeposit = await this.matic
                .depositERC20ForUser(token, this.from, amount, {
                    from: this.from
                })
            console.log("Deposit on Ropsten:" + logsForDeposit.transactionHash);
            return null;
        } catch (err) {
            return err
        }
    }

    // async withdrawalERC20Token(amount) {
    //     await this.init();
    //     let from = this.from;
    //     let token = this.Matic_Erc20Address;

    //     console.log("*****Withdraw ERC20***");
    //     this.matic
    //         .startWithdraw(token, amount, {
    //             from
    //         })
    //         .then(async logs => {
    //             console.log(
    //                 "Start Withdraw on Matic:" + logs.transactionHash
    //             );
    //             console.log("Now waiting for 6 mins for the checkpoint");
    //             const hash = logs.transactionHash;
    //             console.log(hash)
    //             await this.PromiseTimeout(360000);
    //             //Wait for 6 mins till the checkpoint is submitted, then run the confirm withdraw
    //             this.matic
    //                 .withdraw(hash, {
    //                     from
    //                 })
    //                 .then(async logs => {
    //                     console.log("Withdraw on Ropsten" + logs.transactionHash);
    //                     // action on Transaction success
    //                     // Withdraw process is completed, funds will be transfer to your account after challege period is over.
    //                     await this.PromiseTimeout(10000);
    //                     token = this.Ropsten_Erc20Address;
    //                     this.matic
    //                         .processExits(token, {
    //                             from
    //                         })
    //                         .then(logs => {
    //                             console.log(
    //                                 "Process Exit on Ropsten:" + logs.transactionHash
    //                             )
    //                             return;
    //                         });
    //                 });
    //         });
    // }


    // async test() {
    //     let web3 = new Web3();
    //     await this.init();
    //     let token = this.Matic_WEthAddress;
    //     let from = this.from;
    //     const recipient = "0xBDC6bb454C62E64f13FA2876F78cdAfA20089204"; // to address
    //     await this.matic
    //         .transferERC20Tokens(token, recipient, "100000000000000000", {
    //             from: from,
    //             gasLimit: 350000,
    //             gasPrice: web3.utils.toHex(10e9)
    //         })
    //         .then(async logs => {
    //             console.log("Transfer on Matic:" + logs.transactionHash);
    //         });
    // }
}
