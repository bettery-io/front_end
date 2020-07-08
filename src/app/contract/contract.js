import web3Obj from '../helpers/torus';
import Web3 from 'web3';
import MaticConfig from '../config/matic.json';
import TokenSaleJSON from '../../../build/contracts/QuizeTokenSale.json';
import TokenJSON from '../../../build/contracts/EthERC20Coin.json';
import networkConfiguration from '../config/network.json'


// OLD CODE
import networkConfigs from '../../network-configs.json'
import LoomEthCoin from './LoomEthCoin';
import ERC20 from './ERC20';
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

   // need check web3 provider
    async quizContract(from) {
        let web3 = new Web3(from === "metamask" ? "https://rpc-mumbai.matic.today" : web3Obj.web3.currentProvider)
        let abiQuiz = QuizeJSON.abi
        return new web3.eth.Contract(abiQuiz,
            QuizeJSON.networks[80001].address)
    }


    // OLD CODE
    async initContract() {
        let contract = new LoomEthCoin();
        let web3Loom = contract.getWeb3Loom().web3LoomData
        let from = contract.getWeb3Loom().userAccount.ethereum.local.toString()
        return new web3Loom.eth.Contract(
            QuizeJSON.abi,
            QuizeJSON.networks[networkConfigs.networks.extdev.networkId].address,
            { from }
        )
    }

    async approve(address, amount) {
        let web3 = new Web3(window.web3.currentProvider);
        let ERC20Token = new ERC20();
        await ERC20Token.load(web3);
        return ERC20Token.approveToken(address, amount)
    }

    quizeAddress() {
        return QuizeJSON.networks[networkConfigs.networks.extdev.networkId].address
    }


    getUserAccount() {
        let contract = new LoomEthCoin();
        return contract.getWeb3Loom().userAccount;
    }
} 
