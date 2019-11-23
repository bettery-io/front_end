const QuizeMigrations = artifacts.require("Quize.sol");

module.exports = function(deployer) {
  deployer.deploy(QuizeMigrations);
};
