
import networkConfigs from '../../network-configs.json'
import LoomEthCoin from './LoomEthCoin';
import ERC20 from './ERC20';
import QuizeJSON from '../../../build/contracts/Quize.json';
import Web3 from 'web3';

export default class Contract {

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

    quizeAddress(){
        return QuizeJSON.networks[networkConfigs.networks.extdev.networkId].address
    }


    getUserAccount() {
        let contract = new LoomEthCoin();
        return contract.getWeb3Loom().userAccount;
    }
} 
