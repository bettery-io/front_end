pragma solidity ^0.5.2;

import "./EthERC20Coin.sol";

contract DappTokenSale {
    address payable admin;
    EthERC20Coin public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(EthERC20Coin _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
       // require(msg.value == multiply(_numberOfTokens, tokenPrice), "do not enought money");
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, 'do not enought tokens');
        require(tokenContract.transfer(msg.sender, _numberOfTokens), 'transfer error');
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public{
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        selfdestruct(admin);
    }
}
