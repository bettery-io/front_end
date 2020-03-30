pragma solidity ^0.5.2;

contract HoldMoney {
    //minimum wei for hold one event
    uint256 amountGuardWei = 1000000000000000000;
    address public owner;

    struct quizeHolder {
        address payable hostWallet;
        uint256 money;
        uint256 endTime;
    }

    struct quizeAmount {
        uint256 amount;
    }

    mapping(int256 => quizeHolder) holder;

    mapping(address => quizeAmount) qAmount;

    constructor() public {
        owner = msg.sender;
    }

    function _setMoneyRetention(
        int256 _question_id,
        uint256 _endTime,
        bool _pathHoldMoney
    ) public payable {
        if (_pathHoldMoney) {
            setEth(
               _question_id,
               _endTime
             );
        } else {
            setToken(
                _question_id,
               _endTime
            );
        }
    }

    function setEth(int256 _question_id, uint256 _endTime) private {
        require(msg.value == moneyRetentionCalculate(), "Do not enought money");
        holder[_question_id].hostWallet = msg.sender;
        holder[_question_id].money = msg.value;
        holder[_question_id].endTime = _endTime;
        qAmount[msg.sender].amount++;
    }

    function setToken(int256 _question_id, uint256 _endTime) private{
        holder[_question_id].hostWallet = msg.sender;
        holder[_question_id].endTime = _endTime;
    }

    function getMoneyRetention(int256 _question_id) public payable {
        require(msg.sender == owner, "Only owner can execute this function");
        address payable host = holder[_question_id].hostWallet;
        uint256 money = holder[_question_id].money;
        qAmount[host].amount--;
        host.transfer(money);
        delete holder[_question_id];
    }

    function getHoldMoneyById(int256 _question_id)
        public
        view
        returns (uint256)
    {
        return holder[_question_id].money;
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
        uint256 value = amountGuardWei;
        if (number == 1) {
            return value;
        } else if (number >= 2) {
            for (uint8 i = 1; i < number; i++) {
                value = value + value;
            }
            return value;
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
}
