const FundManager = artifacts.require("FundManager");

module.exports = function(deployer) {
  // Replace 'YOUR_GOVERNMENT_AGENCY_ADDRESS' with the actual address of the government agency
  const governmentAgencyAddress = '0xbA23C6f9CC52A0e63Fa28Ad8C4820d1608A37366';

  deployer.deploy(FundManager, governmentAgencyAddress);
};
