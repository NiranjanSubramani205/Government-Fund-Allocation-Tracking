pragma solidity ^0.5.0;

import "./Token.sol";

contract FundManager {
    Token public tokenContract;
    address public governmentAgency;
    uint256 public totalFundMoney;

    event FundCreated(uint256 totalTokens, uint256 pricePerToken, uint256 totalFundMoney);
    event TokenBought(uint256 tokenId, address buyer, uint256 amountPaid);

    modifier onlyGovernmentAgency() {
        require(msg.sender == governmentAgency, "Only government agency can call this function");
        _;
    }

    constructor(address _tokenContractAddress) public {
        tokenContract = Token(_tokenContractAddress);
        governmentAgency = msg.sender;
    }

    function createFund(uint256 _totalTokens, uint256 _pricePerToken) public onlyGovernmentAgency {
        require(_totalTokens > 0, "Total tokens must be greater than zero");
        require(_pricePerToken > 0, "Price per token must be greater than zero");

        totalFundMoney = _totalTokens * _pricePerToken;

        emit FundCreated(_totalTokens, _pricePerToken, totalFundMoney);
    }

    function buyToken(uint256 _tokenId) external payable {
    require(_tokenId < TOTAL_TOKEN && _tokenId >= 0, "Invalid token id");
    uint256 price = tokenContract.tokens(_tokenId).price;
    require(msg.value >= price, "Invalid price");
    require(tokenContract.tokens(_tokenId).owner == address(0x0), "Token already owned");
    tokenContract.tokens(_tokenId).owner = msg.sender;
}


    function withdraw() public onlyGovernmentAgency {
        require(address(this).balance > 0, "No balance to withdraw");

        governmentAgency.transfer(address(this).balance);
    }
}
