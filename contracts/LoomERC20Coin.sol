pragma solidity ^0.5.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LoomERC20Coin is ERC20 {
    // Transfer Gateway contract address
    address public gateway;

    string public name = "MyNewTokenTest";
    string public symbol = "MNTT";
    uint8 public decimals = 18;

// For Testing 
//    uint256 public constant INITIAL_SUPPLY = 1000000000;
    constructor(address _gateway) public {
        gateway = _gateway;
//        _mint(msg.sender, INITIAL_SUPPLY * (10**uint256(decimals)));
    }

    // Used by the DAppChain Gateway to mint tokens that have been deposited to the Ethereum Gateway
    function mintToGateway(uint256 _amount) public {
        require(msg.sender == gateway, "only the gateway is allowed to mint");
        _mint(gateway, _amount);
    }
}