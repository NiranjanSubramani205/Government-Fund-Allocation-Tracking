// const Authority = artifacts.require("Authority");
const Token = artifacts.require("Token");
const Funds = artifacts.require("Funds")
 

module.exports = function(deployer) {
  deployer.deploy(Token);
  deployer.deploy(Funds);
};
