
import networkConfigs from '../../network-configs.json'
import LoomEthCoin from './LoomEthCoin';
import QuizeJSON from '../../../build/contracts/Quize.json'


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



    getUserAccount() {
        let contract = new LoomEthCoin();
        return contract.getWeb3Loom().userAccount;
    }


} 
