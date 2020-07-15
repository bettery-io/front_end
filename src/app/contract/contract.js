import web3Obj from '../helpers/torus';
import Web3 from 'web3';
import TokenSaleJSON from '../../../build/contracts/QuizeTokenSale.json';
import TokenJSON from '../../../build/contracts/EthERC20Coin.json';
import networkConfiguration from '../config/network.json'
import configFile from '../config/config.json';
import MaticWETH from '../config/abi/MaticWETH.json'
import ERC20 from '../config/abi/childERC20.json'
import biconomyInit from "./biconomy";
import QuizeJSON from '../../../build/contracts/Quize.json';


export default class Contract {

    async tokenSaleMainETH(from) {
        let web3 = new Web3(from === "metamask" ? window.web3.currentProvider : web3Obj.web3.currentProvider)
        let abiTokenSale = TokenSaleJSON.abi
        return new web3.eth.Contract(abiTokenSale,
            TokenSaleJSON.networks[networkConfiguration.goerli].address)
    }

    async tokenContractMainETH(from) {
        let web3 = new Web3(from === "metamask" ? window.web3.currentProvider : web3Obj.web3.currentProvider)
        let abiTokenSale = TokenJSON.abi
        return new web3.eth.Contract(abiTokenSale,
            TokenJSON.networks[networkConfiguration.goerli].address)
    }

    tokenContractAddressMainETH() {
        return TokenSaleJSON.networks[networkConfiguration.goerli].address
    }

    async getWETHContract() {
        let biconomy = await biconomyInit();
        let web3 = new Web3(biconomy);
        return new web3.eth.Contract(MaticWETH.abi, configFile.child.MaticWETH);
    }

    async getERC20ContractOnMaticChain() {
        let biconomy = await biconomyInit();
        let web3 = new Web3(biconomy);
        return new web3.eth.Contract(ERC20.abi, configFile.child.BetteryToken);
    }

    async quizContract() {
        let biconomy = await biconomyInit();
        let web3 = new Web3(biconomy)
        let abiQuiz = QuizeJSON.abi
        return new web3.eth.Contract(abiQuiz,
            QuizeJSON.networks[networkConfiguration.maticMumbai].address)
    }

    quizeAddress() {
        return QuizeJSON.networks[networkConfiguration.maticMumbai].address
    }


    async approve(address, amount) {
        // TO DO
        // let web3 = new Web3(window.web3.currentProvider);
        // let ERC20Token = new ERC20();
        // await ERC20Token.load(web3);
        // return ERC20Token.approveToken(address, amount)
    }

} 
