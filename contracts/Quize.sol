pragma solidity >=0.4.22 <0.6.0;

contract Quize {
     int8 private percentQuiz = 3;

     event NewQuestionAdded(
           uint256 endTime,
           int8 questionQuantity,
           uint256 startTime,
           int8 percentHost,
           int8 percentValidator);

     struct Participant{
         address payable[] participants;
     }

    struct Validator{
         address payable[] validators;
     }

     struct Qestion {
         int question_id;
         uint256 startTime;
         uint256 endTime;
         int8 questionQuantity;
         uint256 money;
         int8 percentHost;
         int8 percentValidator;
         Participant[] participant;
         Validator[] validator;
         address[] allParticipants;
         address[] allValidator;
     }

     struct Host {
         int[] qestions_id;
     }

        mapping (int => Qestion) qestions;
        mapping (address => Host) host_id_wallet;

    function startQestion(
           address host_wallet,
           int _question_id,
           uint256 _startTime,
           uint256 _endTime,
           int8 _percentHost,
           int8 _percentValidator,
           int8 _questionQuantity
        ) public payable {
           host_id_wallet[host_wallet].qestions_id.push(_question_id);

           qestions[_question_id].question_id = _question_id;
           qestions[_question_id].endTime = _endTime;
           qestions[_question_id].questionQuantity = _questionQuantity;
           qestions[_question_id].startTime = _startTime;

        if(_percentHost == -1){
            qestions[_question_id].percentHost = 3;
        }else{
           qestions[_question_id].percentHost = _percentHost;
        }

        if(_percentValidator == -1){
            qestions[_question_id].percentValidator = 5;
        }else{
           qestions[_question_id].percentValidator = _percentValidator;
        }

        emit NewQuestionAdded(
            _endTime,
            _questionQuantity,
           _startTime,
           _percentHost,
           _percentValidator
        );
    }

   function setAnswer(int _question_id, address payable _answer, uint8 _whichAnswer, uint256 money) public payable{
       if((qestions[_question_id].endTime - block.timestamp) > 0){
           qestions[_question_id].participant[_whichAnswer].participants.push(_answer);
           qestions[_question_id].money += money;
       }
    }

    function setValidator(int _question_id, address payable _answer, uint8 _whichAnswer) public payable{
       if((qestions[_question_id].endTime - block.timestamp) > 0){
           qestions[_question_id].validator[_whichAnswer].validators.push(_answer);
       }
    }

    function getTimer(int _question_id) public view returns(uint256) {
        return qestions[_question_id].endTime - block.timestamp;
    }

    function getHostQestionsIndex(address host_wallet) public view returns(uint256){
        return host_id_wallet[host_wallet].qestions_id.length;
    }

     function getHostQestionsId(address host_wallet, uint256 index) public view returns(int256){
        return host_id_wallet[host_wallet].qestions_id[index];
    }

    function payQestion(int _question_id) public payable {
        if((qestions[_question_id].endTime - qestions[_question_id].startTime) > 0){
            // pay fee for company
            int256 persentFee = getPersent(percentQuiz, int(qestions[_question_id].money));
            qestions[_question_id].money = qestions[_question_id].money - uint(persentFee);
            address(msg.sender).transfer(uint(persentFee));

            int256 questionQuantity = qestions[_question_id].questionQuantity;
            uint[] memory validator;

            //Get length of validators
            for(uint8 i = 0; i > questionQuantity; i++){
               validator[i] = qestions[_question_id].validator[i].validators.length;
            }
            // Find corect answer
            uint8 correctValidator = getIndexOfLargest(validator);

            if(qestions[_question_id].percentValidator != 0){
                int256 persentForValidators = getPersent(qestions[_question_id].percentValidator, int(qestions[_question_id].money));
                int256 persentForEachValidators = persentForValidators / int(qestions[_question_id].validator[correctValidator].validators.length);

                // Pay for validators
                for(uint8 i = 0; i > qestions[_question_id].validator[correctValidator].validators.length; i++){
                  address payable _validator = qestions[_question_id].validator[correctValidator].validators[i];
                  qestions[_question_id].money = qestions[_question_id].money - uint(persentForValidators);
                  address(_validator).transfer(uint(persentForEachValidators));
                }
            }


            // Pay for participant
            uint256 monayForParticipant = qestions[_question_id].money / qestions[_question_id].participant[correctValidator].participants.length;
            for(uint8 i = 0; i > qestions[_question_id].participant[correctValidator].participants.length; i++){
                address payable _participant = qestions[_question_id].participant[correctValidator].participants[i];
                address(_participant).transfer(monayForParticipant);
            }
            delete qestions[_question_id];

        }
    }

    function getPersent(int _percent, int _from) private pure returns(int256){
       return (_percent / 100) * _from;
    }

    function getIndexOfLargest( uint[] memory array ) private pure returns(uint8){
        uint8 largest = 0;
        for ( uint8 i = 1; i < array.length; i++ ){
           if ( array[i] > array[largest] ) largest = i;
        }
        return largest;
    }

    function getQuestion(int _question_id) public view returns(
           uint256 endTime,
           int8 questionQuantity,
           uint256 startTime,
           int8 percentHost,
           int8 percentValidator
           ){
       return(qestions[_question_id].endTime,
              qestions[_question_id].questionQuantity,
              qestions[_question_id].startTime,
              qestions[_question_id].percentHost,
              qestions[_question_id].percentValidator);
    }

    function getTime(int _question_id) public view returns(uint256){
        return qestions[_question_id].endTime;
    }

}