pragma solidity >=0.4.22 <0.6.0;

contract Quize {
     uint8 private percentQuiz = 3;
     uint256 private fullAmount;
     uint256 private sevenDaysTimeStamp = 604800;
     address payable companyAddress = 0x02810c3bc07De2ddAef89827b0dD6b223C7759d5;

    event eventIsFinish(
        int question_id
        );

    struct Participant{
        mapping (uint256 => Part) participants;
        uint256 index;
    }

    struct Part {
        address payable parts;
    }

    struct Validator{
        mapping (uint256 => Valid) validators;
        uint256 index;
    }

    struct Valid {
        address payable valid;
    }

     struct Question {
         int question_id;
         uint256 startTime;
         uint256 endTime;
         uint8 questionQuantity;
         uint256 money;
         uint8 percentHost;
         uint8 percentValidator;
         mapping (uint256 => Participant) participant;
         mapping (uint256 => Validator) validator;
         int validatorsAmount;
         int activeValidators;
         bool pay;
         uint persentFee;
         uint persentForEachValidators;
         uint monayForParticipant;
         uint correctAnswer;
     }

     struct Host {
         int[] questions_id;
     }

        mapping (int => Question) questions;
        mapping (address => Host) host_id_wallet;

    function startQestion(
           int _question_id,
           uint256 _startTime,
           uint256 _endTime,
           uint8 _percentHost,
           uint8 _percentValidator,
           uint8 _questionQuantity,
           int _validatorsAmount
        ) public payable {
           host_id_wallet[msg.sender].questions_id.push(_question_id);

           questions[_question_id].question_id = _question_id;
           questions[_question_id].endTime = _endTime;
           questions[_question_id].questionQuantity = _questionQuantity;
           questions[_question_id].startTime = _startTime;
           questions[_question_id].validatorsAmount = _validatorsAmount;
           questions[_question_id].pay = false;

        if(_percentHost == 0){
            questions[_question_id].percentHost = 3;
        }else{
           questions[_question_id].percentHost = _percentHost;
        }

        if(_percentValidator == 0){
            questions[_question_id].percentValidator = 5;
        }else{
           questions[_question_id].percentValidator = _percentValidator;
        }
    }

   function setAnswer(int256 _question_id, uint8 _whichAnswer) public payable{
       if(int(now - questions[_question_id].startTime) >= 0){
           if(int(questions[_question_id].endTime - now) >= 0){
              questions[_question_id].money += msg.value;
              uint256 i = questions[_question_id].participant[_whichAnswer].index;
              questions[_question_id].participant[_whichAnswer].participants[i].parts = msg.sender;
              questions[_question_id].participant[_whichAnswer].index = i + 1;
              fullAmount += msg.value;
           }
       }
    }

    function getIndex(int256 _question_id, uint256 index, uint8 _whichAnswer) public view returns(address){
       return questions[_question_id].participant[_whichAnswer].participants[index].parts;
    }

    function getFullAmount() public view returns(uint256){
        return fullAmount;
    }

    function setValidator(int _question_id, uint8 _whichAnswer ) public payable{
        if(int(now - questions[_question_id].endTime) >= 0){
          if(int((questions[_question_id].endTime + sevenDaysTimeStamp) - now) >= 0){
            uint256 i = questions[_question_id].validator[_whichAnswer].index;
            questions[_question_id].validator[_whichAnswer].validators[i].valid = msg.sender;
            questions[_question_id].validator[_whichAnswer].index = i + 1;
            int active = questions[_question_id].activeValidators + 1;
           if(active == questions[_question_id].validatorsAmount){
             questions[_question_id].activeValidators = active;
             letsPayMoney(_question_id);
           }else{
               questions[_question_id].activeValidators = active;
           }
          }
        }
    }

    function letsPayMoney(int _question_id) private {
       uint biggestValue = 0;
       uint correctAnswer;
        questions[_question_id].pay = true;
        int256 questionQuantity = questions[_question_id].questionQuantity;

        // pay fee for company
        uint256 persentFee = getPersent(questions[_question_id].money, percentQuiz);
        questions[_question_id].money = questions[_question_id].money - persentFee;
        fullAmount = fullAmount - persentFee;
        address(companyAddress).transfer(persentFee);

        questions[_question_id].persentFee = persentFee;

        // find correct answer
        for(uint8 i = 0; i < questionQuantity; i++){
          if(questions[_question_id].validator[i].index > biggestValue){
              biggestValue = questions[_question_id].validator[i].index;
              correctAnswer = i;
          }
        }

        questions[_question_id].correctAnswer = correctAnswer;


         // calculate percent for validator
        uint256 persentForValidators = getPersent(questions[_question_id].money, questions[_question_id].percentValidator);
        uint256 persentForEachValidators = persentForValidators / questions[_question_id].validator[correctAnswer].index;
        fullAmount = fullAmount - persentForValidators;

        questions[_question_id].persentForEachValidators = persentForEachValidators;


        // pay for validatos
        for(uint8 i = 0; i < questions[_question_id].validator[correctAnswer].index; i++){
          address payable _validator = questions[_question_id].validator[correctAnswer].validators[i].valid;
          questions[_question_id].money = questions[_question_id].money - persentForEachValidators;
          address(_validator).transfer(persentForEachValidators);
        }

        // Pay for participant
        uint256 monayForParticipant = questions[_question_id].money / questions[_question_id].participant[correctAnswer].index;
            for(uint8 i = 0; i < questions[_question_id].participant[correctAnswer].index; i++){
                address payable _participant = questions[_question_id].participant[correctAnswer].participants[i].parts;
                questions[_question_id].money = questions[_question_id].money - monayForParticipant;
                address(_participant).transfer(monayForParticipant);
            }

        questions[_question_id].monayForParticipant = monayForParticipant;

        emit eventIsFinish(
            _question_id
        );

        // // Delete question from storage
        // delete questions[_question_id];
    }


    function getPersent(uint _percent, uint _from) private pure returns(uint){
       return _from * _percent / 100;
    }

    function getQuestion(int _question_id) public view returns(
           uint persentFee,
           uint persentForEachValidators,
           uint256 money,
           uint monayForParticipant,
           uint8 questionQuantity,
           uint correctAnswer
           ){
       return(
              questions[_question_id].persentFee,
              questions[_question_id].persentForEachValidators,
              questions[_question_id].money,
              questions[_question_id].monayForParticipant,
              questions[_question_id].questionQuantity,
              questions[_question_id].correctAnswer
              );
    }

    function setTimeValidator(int _question_id) public view returns(int8){
        if(int(now - questions[_question_id].endTime) >= 0){
          if(int((questions[_question_id].endTime + sevenDaysTimeStamp) - now) >= 0){
            return 0;
          }else{
            return 2;
          }
        }else{
            return 1;
        }
    }

    function setTimeAnswer(int256 _question_id) public view returns(int8){
         if(int(now - questions[_question_id].startTime) >= 0){
            if(int(questions[_question_id].endTime - now) >= 0){
              return 0;
            }else{
              return 2;
            }
         }else{
             return 1;
         }
      }

}