const QuizeMigrations = artifacts.require("Quize.sol");

module.exports = function(deployer, network) {

  if (network !== 'extdev') {
    return
  }
  
  deployer.deploy(QuizeMigrations);
};
