const LoomERC20Coin = artifacts.require('LoomERC20Coin.sol')
const QuizeMigration = artifacts.require("Quize.sol");

let gatewayAddress = '0xE754d9518bF4a9C63476891eF9Aa7D91c8236a5d'.toLowerCase();

module.exports = async function (deployer, network, accounts) {

  if (network === 'extdev' || network === "development") {
    await deployer.deploy(LoomERC20Coin, gatewayAddress);
    let token = await LoomERC20Coin.deployed()

    console.log('\n*************************************************************************\n')
    console.log(`MyLoomCoin Contract Address: ${token.address}`)
    console.log('\n*************************************************************************\n')

    await deployer.deploy(QuizeMigration, token.address);

  }else{
    return;
  }


}