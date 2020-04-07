pragma solidity ^0.5.2;


contract HoldMoney {
    //minimum wei for hold one event
    uint256 amountGuardETH = 10000000000000000000;
    address public owner;
    uint256 public priceEth;
    uint256 public priceToken;

    struct quizeHolder {
        address payable hostWallet;
        uint256 money;
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

    function _setMoneyRetention(bool _pathHoldMoney)
        public
        payable
        returns(uint256)
    {
        if (_pathHoldMoney) {
            return setEth(_pathHoldMoney);
        } else {
            return setToken(_pathHoldMoney);
        }
    }

    function setEth(bool _path) private returns(uint256) {
        require(msg.value == moneyRetentionCalculate(_path), "Do not enought money");

        uint256 index = qAmount[msg.sender].amount + 1;
        qAmount[msg.sender].holder[index].hostWallet = msg.sender;
        qAmount[msg.sender].holder[index].money = msg.value;
        qAmount[msg.sender].holder[index].token = _path;
        qAmount[msg.sender].amount ++;
        return 0;
    }

    function setToken(bool _path) private returns(uint256) {
        uint256 amount = moneyRetentionCalculate(_path);
        uint256 index = qAmount[msg.sender].amount + 1;
        qAmount[msg.sender].holder[index].hostWallet = msg.sender;
        qAmount[msg.sender].holder[index].money = amount;
        qAmount[msg.sender].holder[index].token = _path;
        qAmount[msg.sender].amount ++;
        return amount;
    }

    function _getMoneyRetention(address payable _host) public payable returns(uint256, address, bool) {
        require(msg.sender == owner, "Only owner can execute this function");
        require(qAmount[_host].amount > 0, "Do not have coins on account");

        uint256 index = qAmount[_host].amount;
        address payable host = qAmount[_host].holder[index].hostWallet;

        require(host == _host, "Addresses not equal");
        uint256 money = qAmount[_host].holder[index].money;
        qAmount[host].amount--;
        bool path = qAmount[_host].holder[index].token;
        delete qAmount[_host].holder[index];
        if (path) {
            host.transfer(money);
            return (money, host, path);
        } else {
            return (money, host, path);
        }
    }

    function moneyRetentionCalculate(bool _path) public view returns (uint256) {
        return moneyCalc(qAmount[msg.sender].amount + 1, _path);
    }

    function onHold() public view returns (uint256) {
        if (qAmount[msg.sender].amount >= 1) {
            uint256 value = 0;
            for (uint8 i = 1; i <= qAmount[msg.sender].amount; i++) {
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

    function _amountGuard(bool _path, uint256 balanceToken) public view returns (int8) {
        uint256 balance;
        if (_path) {
            balance = address(msg.sender).balance;
        } else {
            balance = balanceToken;
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

    function setEthPrice(uint256 _priceEth, uint256 _priceToken) public {
        require(msg.sender == owner, "only owner can change price");
        priceEth = _priceEth / 1000000000000000000;
        priceToken = _priceToken / 1000000000000000000;
    }

    function getHoldMoneyById() public view returns(uint256) {
        uint256 index = qAmount[msg.sender].amount - 1;
        return qAmount[msg.sender].holder[index].money;
    }
}
