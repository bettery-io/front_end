pragma solidity 0.6.1;

contract HoldMoney {
    //minimum wei for hold one event
    uint256 amountGuardWei = 1000000000000000000;

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

    function _setMoneyRetention(
        uint256 _amountHost,
        int256 _question_id,
        uint256 _money,
        uint256 _endTime
    ) public {
        // rewrite all to this function
        // uint balance = address(this).balance;
        if (_amountHost >= _moneyRetentionCalculate()) {
            holder[_question_id].hostWallet = msg.sender;
            holder[_question_id].money = _money;
            holder[_question_id].endTime = _endTime;
            qAmount[msg.sender].amount = qAmount[msg.sender].amount + 1;
        }
    }

    function _getMoneyRetention(int256 _question_id) public payable {
        address payable host = holder[_question_id].hostWallet;
        uint256 money = holder[_question_id].money;
        qAmount[host].amount = qAmount[host].amount - 1;
        host.transfer(money);
        delete holder[_question_id];
    }

    function _getHoldMoneyById(int256 _question_id) public view returns (uint256) {
        return holder[_question_id].money;
    }

    function _moneyRetentionCalculate() public view returns (uint256) {
        return moneyCalc(qAmount[msg.sender].amount + 1);
    }

    function _onHold() public view returns (uint256) {
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

    function _amountGuard(uint256 _amountHost) public view returns (int8) {
        if (_amountHost >= _moneyRetentionCalculate()) {
            // don't have any errors
            return 0;
        } else {
            // host does not have enough money
            return 1;
        }
    }
}
