const HoldMoney = artifacts.require("HoldMoney.sol");

module.exports = function(deployer, network) {

  if (network !== 'extdev') {
    return
  }
  
  deployer.deploy(HoldMoney);
};