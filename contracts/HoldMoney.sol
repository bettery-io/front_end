pragma solidity ^0.5.2;

import "./LoomERC20Coin.sol";


contract HoldMoney {
    //minimum wei for hold one event
    uint256 amountGuardETH = 10000000000000000000;
    address public owner;
    uint256 public priceEth;
    uint256 public priceToken;
    LoomERC20Coin public tokenContract;
    address holdMoneyContract;

    struct quizeHolder {
        address payable hostWallet;
        uint256 money;
        uint256 endTime;
        bool token;
    }

    struct quizeAmount {
        uint256 amount;
        mapping(uint256 => quizeHolder) holder;
    }

    mapping(address => quizeAmount) qAmount;

    constructor() public {
        owner = msg.sender;
    }

    function _setMoneyRetention(uint256 _endTime, bool _pathHoldMoney)
        public
        payable
    {
        if (_pathHoldMoney) {
            setEth(_endTime, _pathHoldMoney);
        } else {
            setToken(_endTime, _pathHoldMoney);
        }
    }

    function setEth(uint256 _endTime, bool _path) private {
        require(msg.value == moneyRetentionCalculate(_path), "Do not enought money");

        uint256 index = qAmount[msg.sender].amount++;
        qAmount[msg.sender].holder[index].hostWallet = msg.sender;
        qAmount[msg.sender].holder[index].money = msg.value;
        qAmount[msg.sender].holder[index].endTime = _endTime;
        qAmount[msg.sender].holder[index].token = _path;
    }

    function setToken(uint256 _endTime, bool _path) private {
        uint256 amount = moneyRetentionCalculate(_path);

        require(tokenContract.balanceOf(address(msg.sender)) >= amount, "Do not enought money");
        require(tokenContract.transferFrom(msg.sender, holdMoneyContract, amount), "Transfer error");

        uint256 index = qAmount[msg.sender].amount++;
        qAmount[msg.sender].holder[index].hostWallet = msg.sender;
        qAmount[msg.sender].holder[index].money = amount;
        qAmount[msg.sender].holder[index].endTime = _endTime;
        qAmount[msg.sender].holder[index].token = _path;
    }

    function getMoneyRetention(address payable _host) public payable {
        require(msg.sender == owner, "Only owner can execute this function");
        require(qAmount[_host].amount > 0, "Do not have coins on account");

        uint256 index = qAmount[_host].amount - 1;
        address payable host = qAmount[_host].holder[index].hostWallet;

        require(host == _host, "Addresses not equal");
        uint256 money = qAmount[msg.sender].holder[index].money;
        qAmount[host].amount--;
        bool path = qAmount[msg.sender].holder[index].token;
        if (path) {
            host.transfer(money);
        } else {
            tokenContract.transferFrom(holdMoneyContract, host, money);
        }

        delete qAmount[msg.sender].holder[index];
    }

    function moneyRetentionCalculate(bool _path) public view returns (uint256) {
        return moneyCalc(qAmount[msg.sender].amount + 1, _path);
    }

    function onHold() public view returns (uint256) {
        if (qAmount[msg.sender].amount >= 1) {
            uint256 value = 0;
            for (uint8 i = 0; i <= qAmount[msg.sender].amount; i++) {
                bool path = qAmount[msg.sender].holder[i].token;
                value = value + moneyCalc(i, path);
            }
            return value;
        } else {
            return 0;
        }
    }

    function moneyCalc(uint256 number, bool _path) private view returns (uint256) {
        uint256 value = amountGuardETH;
        if (number == 1) {
            if (_path) {
                return (value / priceEth) * 100;
            } else {
                return ((value / priceToken) * 100) / 2;
            }
        } else if (number >= 2) {
            for (uint8 i = 1; i < number; i++) {
                value = value + value;
            }
            if (_path) {
                return (value / priceEth) * 100;
            } else {
                return ((value / priceToken) * 100) / 2;
            }
        }
    }

    function amountGuard(bool _path) public view returns (int8) {
        uint256 balance;
        if (_path) {
            balance = address(msg.sender).balance;
        } else {
            balance = tokenContract.balanceOf(address(msg.sender));
        }
        if (balance >= moneyRetentionCalculate(_path)) {
            // don't have any errors
            return 0;
        } else {
            // host does not have enough money
            return 1;
        }
    }

    function holdBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setEthPrice(uint256 _priceEth, uint256 _priceToken, address _tokenAddress) public {
        require(msg.sender == owner, "only owner can change price");
        priceEth = _priceEth / 1000000000000000000;
        priceToken = _priceToken / 1000000000000000000;
        holdMoneyContract = _tokenAddress;
    }

    function setLoomERC20Coin(LoomERC20Coin _tokenContract) public {
        require(msg.sender == owner, "Only owner can execute this function");
        tokenContract = _tokenContract;
    }
}
