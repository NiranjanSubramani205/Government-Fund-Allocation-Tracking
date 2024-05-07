// const Authority = artifacts.require("Authority");
const Token = artifacts.require("Token");
 

module.exports = function(deployer) {
  deployer.deploy(Token);
};
