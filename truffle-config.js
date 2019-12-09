const { readFileSync } = require('fs')
const path = require('path')
const { join } = require('path')
const LoomTruffleProvider = require('loom-truffle-provider')
const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    extdev: {
      provider: function () {
        const privateKey = readFileSync(path.join(__dirname, 'private_key'), 'utf-8')
        const chainId = 'extdev-plasma-us1'
        const writeUrl = 'wss://extdev-plasma-us1.dappchains.com/websocket'
        const readUrl = 'wss://extdev-plasma-us1.dappchains.com/queryws'
        return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
      },
      network_id: '9545242630824'
    },
    asia1: {
      provider: function () {
        const privateKey = readFileSync(path.join(__dirname, 'private_key'), 'utf-8')
        const chainId = 'asia1'
        const writeUrl = 'wss://test-z-asia1.dappchains.com/websocket'
        const readUrl = 'wss://test-z-asia1.dappchains.com/queryws'
        return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
      },
      network_id: '5101040124304'
    },
    rinkeby: {
      provider: function () {
        const mnemonic = readFileSync(path.join(__dirname, 'rinkeby_mnemonic'), 'utf-8')

        return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/2b5ec85db4a74c8d8ed304ff2398690d`, 0, 10)
      },
      network_id: 4,
      gasPrice: 15000000001,
      skipDryRun: true
    }
  }
}
