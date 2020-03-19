const LoomERC20Coin = artifacts.require('LoomERC20Coin.sol')
const QuizeMigrations = artifacts.require("Quize.sol");

let gatewayAddress = '0xE754d9518bF4a9C63476891eF9Aa7D91c8236a5d'.toLowerCase()

module.exports = function (deployer, network, accounts) {
  if (network === 'extdev' || network === "development") {
    deployer.then(async () => {
      await deployer.deploy(QuizeMigrations);
      await deployer.deploy(LoomERC20Coin, gatewayAddress);
      const myLoomCoinInstance = await LoomERC20Coin.deployed();

      console.log('\n*************************************************************************\n')
      console.log(`MyLoomCoin Contract Address: ${myLoomCoinInstance.address}`)
      console.log('\n*************************************************************************\n')
    })
  } else {
    return
  }


}