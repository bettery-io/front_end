const {
  Client, NonceTxMiddleware, SignedTxMiddleware, Address, LocalAddress, CryptoUtils, LoomProvider,
  Contracts, soliditySha3
} = require('loom-js')
const fs = require('fs')
const Web3 = require('web3')
const path = require('path')
const RinkebyStandardCoinJSON = require('../build/contracts/EthERC20Coin.json');
const ExtdevStandardCoinJSON = require('../build/contracts/LoomERC20Coin.json');
const extdevChainId = 'extdev-plasma-us1'
const { OfflineWeb3Signer } = require('loom-js/dist/solidity-helpers')
const TransferGateway = Contracts.TransferGateway

class ContractsMapper {
  _loadExtdevAccount() {
    const privateKeyStr = fs.readFileSync(path.join(__dirname, '../private_key'), 'utf-8')
    const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr)
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const client = new Client(
      extdevChainId,
      'wss://extdev-plasma-us1.dappchains.com/websocket',
      'wss://extdev-plasma-us1.dappchains.com/queryws'
    )
    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]
    client.on('error', msg => {
      console.error('PlasmaChain connection error', msg)
    })

    return {
      account: LocalAddress.fromPublicKey(publicKey).toString(),
      web3js: new Web3(new LoomProvider(client, privateKey)),
      client
    }
  }

  _loadRinkebyAccount() {
    const privateKey = fs.readFileSync(path.join(__dirname, '../rinkeby_private_key'), 'utf-8')
    const web3js = new Web3("https://rinkeby.infura.io/v3/2b5ec85db4a74c8d8ed304ff2398690d")
    const ownerAccount = web3js.eth.accounts.privateKeyToAccount('0x' + privateKey)
    web3js.eth.accounts.wallet.add(ownerAccount)
    return { account: ownerAccount, web3js }
  }

  async _addContractMapping({
    client,
    signer,
    contractRinkebyAddress,
    contractExtdevAddress,
    ownerExtdevAddress,
    contractRinkebyTxHash
  }) {
    console.log('tokenRinkebyAddress: ' + contractRinkebyAddress)
    console.log('tokenExtdevAddress: ' + contractExtdevAddress)
    console.log('ownerExtdevAddress: ' + ownerExtdevAddress)
    const ownerExtdevAddr = Address.fromString(`${client.chainId}:${ownerExtdevAddress}`)
    const gatewayContract = await TransferGateway.createAsync(client, ownerExtdevAddr)
    const foreignContract = Address.fromString(`eth:${contractRinkebyAddress}`)
    const localContract = Address.fromString(`${client.chainId}:${contractExtdevAddress}`)

    const hash = soliditySha3(
      { type: 'address', value: contractRinkebyAddress.slice(2) },
      { type: 'address', value: contractExtdevAddress.slice(2) }
    )

    const foreignContractCreatorSig = await signer.signAsync(hash)
    const foreignContractCreatorTxHash = Buffer.from(contractRinkebyTxHash.slice(2), 'hex')
    try {
      await gatewayContract.addContractMappingAsync({
        localContract,
        foreignContract,
        foreignContractCreatorSig,
        foreignContractCreatorTxHash
      })
    } catch (error) {
      console.log(error)
    }
  }
}

class StandardContractsMapper extends ContractsMapper {
  async addMapping() {
    const rinkeby = this._loadRinkebyAccount()
    const extdev = this._loadExtdevAccount()
    const client = extdev.client
    const rinkebyNetworkId = await rinkeby.web3js.eth.net.getId()
    const extdevNetworkId = await extdev.web3js.eth.net.getId()
    const coinRinkebyAddress = RinkebyStandardCoinJSON.networks[rinkebyNetworkId].address
    const coinRinkebyTxHash = RinkebyStandardCoinJSON.networks[rinkebyNetworkId].transactionHash
    const coinExtdevAddress = ExtdevStandardCoinJSON.networks[extdevNetworkId].address
    const signer = new OfflineWeb3Signer(rinkeby.web3js, rinkeby.account)
    await this._addContractMapping({
      client,
      signer,
      contractRinkebyAddress: coinRinkebyAddress,
      contractExtdevAddress: coinExtdevAddress,
      ownerExtdevAddress: extdev.account,
      contractRinkebyTxHash: coinRinkebyTxHash
    })
    client.disconnect()
  }
}

const accountMapper = () => {
  let mapper = new StandardContractsMapper()
  console.log('Mapping standard contracts.')

  mapper.addMapping()
}

accountMapper();