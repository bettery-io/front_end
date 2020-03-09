const DappToken = artifacts.require("DappToken");
const DappTokenSale = artifacts.require("DappTokenSale");

module.exports = function (deployer, network) {

  if (network === 'rinkeby' || network === "development") {

    // add initial supply to the constructor
    deployer.deploy(DappToken, 1000000).then(() => {
      // token price is 0.001 Ether
      var tokenPrice = 1000000000000000;
      return deployer.deploy(DappTokenSale, DappToken.address, tokenPrice);
    });
  } else {
    return
  }
};