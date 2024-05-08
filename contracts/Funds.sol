pragma solidity ^0.5.0;

import "./Token.sol";

contract FundManager {
    address public owner = msg.sender;
    Token public tokenContract;

    struct Fund {
        uint money;
        string numberOfBeneficiaries; // Changed to string
        string tag;
        address creator;
    }

    Fund[] public funds;

    event FundCreated(uint fundIndex);

    constructor(Token _tokenContract) public {
        tokenContract = _tokenContract;
    }

    function createFund(uint _money, string memory _numberOfBeneficiaries, string memory _tag) public {
        require(_money > 0, "Money should be greater than 0");
        
        // Convert string numberOfBeneficiaries to uint
        uint numberOfBeneficiariesInt = parseInt(_numberOfBeneficiaries);

        // Create new fund
        Fund memory newFund = Fund({
            money: _money,
            numberOfBeneficiaries: _numberOfBeneficiaries,
            tag: _tag,
            creator: msg.sender
        });
        funds.push(newFund);
        emit FundCreated(funds.length - 1);

        // Automatically create tokens for the fund
        for (uint i = 0; i < numberOfBeneficiariesInt; i++) {
            uint tokenPrice = _money / numberOfBeneficiariesInt;
            tokenContract.createToken(msg.sender, tokenPrice);
        }
    }

    // Function to convert string to uint
    function parseInt(string memory _value) public pure returns (uint) {
        bytes memory _bytesValue = bytes(_value);
        uint _uintValue = 0;
        for (uint i = 0; i < _bytesValue.length; i++) {
            uint _digit = uint(uint8(_bytesValue[i])) - 48;
            if (_digit >= 10) {
                break;
            }
            _uintValue = _uintValue * 10 + _digit;
        }
        return _uintValue;
    }
}
