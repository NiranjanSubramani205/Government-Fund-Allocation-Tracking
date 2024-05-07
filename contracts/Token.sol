pragma solidity ^0.5.0;

contract Token {
    uint256 constant TOTAL_TOKEN = 10;
    address public owner = msg.sender;

    struct TokenInfo {
        uint256 tokenId;
        address owner;
        uint256 price;
    }

    TokenInfo[TOTAL_TOKEN] public tokens;

    constructor() public {
        for (uint256 i = 0; i < TOTAL_TOKEN; i++) {
            tokens[i].tokenId = i;
            tokens[i].owner = address(0x0);
            tokens[i].price = 1e17; // 0.1 ether
        }
    }

    function buyToken(uint256 _id) external payable {
        require(_id < TOTAL_TOKEN && _id >= 0, "Invalid token id");
        require(msg.value >= tokens[_id].price, "Invalid price");
        require(tokens[_id].owner == address(0x0), "Token already owned");
        tokens[_id].owner = msg.sender;
    }
}
