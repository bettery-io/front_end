pragma solidity >=0.4.22 < 0.6.0;

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

    mapping( int => quizeHolder ) holder;

    mapping( address => quizeAmount ) qAmount;

    function setMoneyRetention(
        uint256 _amountHost,
        int _question_id,
        uint256 _money,
        uint256 _endTime) public{
       if(qAmount[msg.sender].amount > 0){
           if(_amountHost >= (qAmount[msg.sender].amount * amountGuardWei)){
                holder[_question_id].hostWallet = msg.sender;
                holder[_question_id].money = _money;
                holder[_question_id].endTime = _endTime;
                qAmount[msg.sender].amount = qAmount[msg.sender].amount + 1;
           }
       } else {
           if(_amountHost >= amountGuardWei) {
                holder[_question_id].hostWallet = msg.sender;
                holder[_question_id].money = _money;
                holder[_question_id].endTime = _endTime;
                qAmount[msg.sender].amount = qAmount[msg.sender].amount + 1;
           }
       }
    }

    function getMoneyRetention(int _question_id) public payable{
        if(int(now - holder[_question_id].endTime) >= 0){
            address(holder[_question_id].hostWallet).transfer(holder[_question_id].money);
        }
    }


    function moneyRetentionCalculate() public view returns(uint){
        if(qAmount[msg.sender].amount > 0){
          return (qAmount[msg.sender].amount + 1) * amountGuardWei;
        }else{
          return amountGuardWei;
        }
    }

    function onHold() public view returns(uint){
        return qAmount[msg.sender].amount * amountGuardWei;
    }


    function amountGuard(uint256 _amountHost) public view returns(int8){
        if(qAmount[msg.sender].amount > 0){
            if(_amountHost >= (qAmount[msg.sender].amount * amountGuardWei)){
              // don't have any errors
              return 0;
            }else{
              // host does not have enough money
              return 1;
            }
        }else{
            if(_amountHost >= amountGuardWei){
              // don't have any errors
              return 0;
            }else{
              // host does not have enough money
              return 1;
            }
        }
    }
}