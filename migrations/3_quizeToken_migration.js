const EthERC20Coin = artifacts.require("EthERC20Coin");
const QuizeTokenSale = artifacts.require("QuizeTokenSale");
const Web3 = require("web3");

module.exports = function (deployer, network) {

  if (network === 'rinkeby' || network === "development") {

    // add initial supply to the constructor
    deployer.deploy(EthERC20Coin, 1000000000).then(() => {
      // token price is 1 Ether
      let web3 = new Web3();
      let tokenPrice = web3.utils.toWei("1", 'ether');
      return deployer.deploy(QuizeTokenSale, EthERC20Coin.address, tokenPrice);
    });
  } 
};