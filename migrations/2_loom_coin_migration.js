const LoomERC20Coin = artifacts.require('LoomERC20Coin.sol')
const QuizeMigration = artifacts.require("Quize.sol");

let gatewayAddress = '0xE754d9518bF4a9C63476891eF9Aa7D91c8236a5d'.toLowerCase()

module.exports = function (deployer, network, accounts) {

  if (network === 'extdev' || network === "development") {
    deployer.deploy(LoomERC20Coin, gatewayAddress).then(() => {

      return deployer.deploy(QuizeMigration, LoomERC20Coin.address);
    })
  }


}