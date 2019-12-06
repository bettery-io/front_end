import abi from '../contract/abi.json';
import {
    Client, LocalAddress, CryptoUtils, LoomProvider
} from 'loom-js'
import Web3 from 'web3'
import networkConfigs from '../../network-configs.json'

var web3 = null;
var from = null;

export default class Contract {

    initContract() {
        const privateKey = CryptoUtils.generatePrivateKey()
        const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

        console.log(networkConfigs.networks['extdev'].chainId)
        
        // Create the client
        const client = new Client(
            networkConfigs.networks['extdev'].chainId,
            networkConfigs.networks['extdev'].writeUrl,
            networkConfigs.networks['extdev'].readUrl,
        )
        
        // The address for the caller of the function
        from = LocalAddress.fromPublicKey(publicKey).toString()
        
        // Instantiate web3 client using LoomProvider
        web3 = new Web3(new LoomProvider(client, privateKey))
        
        const ABI = abi;
        
        const contractAddress = '0x21861Fa48F739E75609D461CaBcC93e0fcc793FC'
        
        console.log("test work");
        
        // Instantiate the contract and let it ready to be used
        return new web3.eth.Contract(ABI, contractAddress, { from })

    }

    getInfoAboutUser() {
        return {
            web3Loom: web3,
            from: from
        }
    }


} 
