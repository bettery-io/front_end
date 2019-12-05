 import {
    Client, LocalAddress, CryptoUtils, LoomProvider
} from 'loom-js'
import Web3 from 'web3'
import abi from './abi.json';


const privateKey = CryptoUtils.generatePrivateKey()
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

// Create the client
const client = new Client(
    'default',
    'ws://127.0.0.1:46658/websocket',
    'ws://127.0.0.1:46658/queryws',
)

// The address for the caller of the function
const from = LocalAddress.fromPublicKey(publicKey).toString()

// Instantiate web3 client using LoomProvider
const web3 = new Web3(new LoomProvider(client, privateKey))

const ABI = abi;

const contractAddress = '0x21861Fa48F739E75609D461CaBcC93e0fcc793FC'

console.log("test work");

// Instantiate the contract and let it ready to be used
const contract = new web3.eth.Contract(ABI, contractAddress, { from })

export {
    contract,
    web3
}