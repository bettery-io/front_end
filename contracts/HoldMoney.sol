pragma solidity ^0.5.2;


contract HoldMoney {
    //minimum wei for hold one event
    uint256 amountGuardETH = 10000000000000000000;
    address public owner;
    uint256 public priceEth;

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

    function _setMoneyRetention(
        uint256 _endTime,
        bool _pathHoldMoney
    ) public payable {
        if (_pathHoldMoney) {
            setEth(_endTime);
        } else {
            setToken(_endTime);
        }
    }

    function setEth(uint256 _endTime) private {
        require(msg.value == moneyRetentionCalculate(), "Do not enought money");

        uint256 index = qAmount[msg.sender].amount++;
        qAmount[msg.sender].holder[index].hostWallet = msg.sender;
        qAmount[msg.sender].holder[index].money = msg.value;
        qAmount[msg.sender].holder[index].endTime = _endTime;
        qAmount[msg.sender].holder[index].token = false;
    }

    function setToken(uint256 _endTime) private {
        uint256 index = qAmount[msg.sender].amount++;
        qAmount[msg.sender].holder[index].hostWallet = msg.sender;
        qAmount[msg.sender].holder[index].endTime = _endTime;
        qAmount[msg.sender].holder[index].token = true;

    }

    function getMoneyRetention(address payable _host) public payable {
        require(msg.sender == owner, "Only owner can execute this function");
        require(qAmount[_host].amount > 0, "Do not have coins on account");

        uint256 index = qAmount[_host].amount - 1;
        address payable host = qAmount[_host].holder[index].hostWallet;

        require(host == _host, "Addresses not equal");

        uint256 money = qAmount[msg.sender].holder[index].money;
        qAmount[host].amount--;
        host.transfer(money);
        delete qAmount[msg.sender].holder[index];
    }

    function moneyRetentionCalculate() public view returns (uint256) {
        return moneyCalc(qAmount[msg.sender].amount + 1);
    }

    function onHold() public view returns (uint256) {
        if (qAmount[msg.sender].amount >= 1) {
            uint256 value = 0;
            for (uint8 i = 0; i <= qAmount[msg.sender].amount; i++) {
                value = value + moneyCalc(i);
            }
            return value;
        } else {
            return 0;
        }
    }

    function moneyCalc(uint256 number) private view returns (uint256) {
        uint256 value = amountGuardETH;
        if (number == 1) {
            return (value / priceEth) * 100;
        } else if (number >= 2) {
            for (uint8 i = 1; i < number; i++) {
                value = value + value;
            }
            return (value / priceEth) * 100;
        }
    }

    function amountGuard() public view returns (int8) {
        if (address(msg.sender).balance >= moneyRetentionCalculate()) {
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

    function setEthPrice(uint256 _priceEth) public {
        require(msg.sender == owner, "only owner can change price");
        priceEth = _priceEth / 1000000000000000000;
    }
}
