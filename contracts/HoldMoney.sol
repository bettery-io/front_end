pragma solidity >=0.4.22 <0.6.0;

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

    function _setMoneyRetention(
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

    function _getMoneyRetention(int _question_id) public payable{
        if(int(now - holder[_question_id].endTime) >= 0){
            address(holder[_question_id].hostWallet).transfer(holder[_question_id].money);
        }
    }


    function _moneyRetentionCalculate() public view returns(uint){
       return moneyCalc(qAmount[msg.sender].amount + 1);
    }

    function _onHold() public view returns(uint){
      if(qAmount[msg.sender].amount >= 1){
        uint value = 0;
        for(uint8 i = 0; i <= qAmount[msg.sender].amount; i++){
          value = value + moneyCalc(i);
        }
        return value;
      }else{
        return 0;
      }
    }

    function moneyCalc(uint number) private view returns(uint){
      uint value = amountGuardWei;
      if(number == 1){
        return value;
      }else if(number >= 2){
         for(uint8 i = 1; i < number; i++){
            value = value + value;
         }
         return value;
      }
    }


    function _amountGuard(uint256 _amountHost) public view returns(int8){
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