pragma solidity ^0.5.2;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

/**
 * @title ERC20 example for token contracts to be deployed to Ethereum.
 */
contract EthERC20Coin is ERC20Mintable {
    string public name = "Maximus Token";
    string public symbol = "MAXIM";
    string public standard = "Maxim Token v1.0";
    uint8 public decimals = 18;

    constructor(uint256 _initialSupplyCoins) public {
        _mint(msg.sender, _initialSupplyCoins * (10**uint256(decimals)));
    }
}
