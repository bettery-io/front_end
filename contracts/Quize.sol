pragma solidity ^0.5.2;

import "./HoldMoney.sol";
import "./LoomERC20Coin.sol";


contract Quize is HoldMoney {
    uint8 private percentQuiz = 2;
    uint256 public fullAmount;
    uint256 private sevenDaysTimeStamp = 604800;
    address payable companyAddress = 0x02810c3bc07De2ddAef89827b0dD6b223C7759d5;
    LoomERC20Coin public tokenContract;

    event eventIsFinish(int256 question_id);

    struct Participant {
        mapping(uint256 => Part) participants;
        uint256 index;
    }

    struct Part {
        address payable parts;
    }

    struct Validator {
        mapping(uint256 => Valid) validators;
        uint256 index;
    }

    struct Valid {
        address payable valid;
    }

    struct Question {
        int256 question_id;
        uint256 startTime;
        uint256 endTime;
        uint8 questionQuantity;
        uint256 money;
        uint8 percentHost;
        uint8 percentValidator;
        mapping(uint256 => Participant) participant;
        mapping(uint256 => Validator) validator;
        int256 validatorsAmount;
        int256 activeValidators;
        address payable hostWallet;
        uint256 persentFeeCompany;
        uint256 persentFeeHost;
        uint256 persentForEachValidators;
        uint256 monayForParticipant;
        uint256 correctAnswer;
        address[] allParticipant;
        uint256 quizePrice;
    }

    mapping(int256 => Question) questions;

    constructor(LoomERC20Coin _tokenContract) public {
        tokenContract = _tokenContract;
    }

    function startQestion(
        int256 _question_id,
        uint256 _startTime,
        uint256 _endTime,
        uint8 _percentHost,
        uint8 _percentValidator,
        uint8 _questionQuantity,
        int256 _validatorsAmount,
        uint256 _quizePrice,
        bool _pathHoldMoney
    ) public payable {
        questions[_question_id].question_id = _question_id;
        questions[_question_id].endTime = _endTime;
        questions[_question_id].questionQuantity = _questionQuantity;
        questions[_question_id].startTime = _startTime;
        questions[_question_id].validatorsAmount = _validatorsAmount;
        questions[_question_id].hostWallet = msg.sender;
        questions[_question_id].quizePrice = _quizePrice;

        if (_percentHost == 0) {
            questions[_question_id].percentHost = 3;
        } else {
            questions[_question_id].percentHost = _percentHost;
        }

        if (_percentValidator == 0) {
            questions[_question_id].percentValidator = 5;
        } else {
            questions[_question_id].percentValidator = _percentValidator;
        }

        _setMoneyRetention(_question_id, _endTime, _pathHoldMoney);
    }

    function setAnswer(int256 _question_id, uint8 _whichAnswer) public payable {
        require(setTimeAnswer(_question_id) == 0, "Time is not valid");
        require(msg.value == questions[_question_id].quizePrice, "Money do not enough");

        questions[_question_id].money += msg.value;
        uint256 i = questions[_question_id].participant[_whichAnswer].index;
        questions[_question_id].participant[_whichAnswer].participants[i].parts = msg.sender;
        questions[_question_id].participant[_whichAnswer].index = i + 1;
        questions[_question_id].allParticipant.push(msg.sender);
        fullAmount += msg.value;
    }

    function setValidator(int256 _question_id, uint8 _whichAnswer) public payable {
        require(setTimeValidator(_question_id) == 0, "Time is not valid");
        uint256 i = questions[_question_id].validator[_whichAnswer].index;
        questions[_question_id].validator[_whichAnswer].validators[i].valid = msg.sender;
        questions[_question_id].validator[_whichAnswer].index = i + 1;
        int256 active = questions[_question_id].activeValidators + 1;
        if (active == questions[_question_id].validatorsAmount) {
            questions[_question_id].activeValidators = active;
            letsFindCorrectAnswer(_question_id);
        } else {
            questions[_question_id].activeValidators = active;
        }
    }

    function letsFindCorrectAnswer(int256 _question_id) private {
        uint256 biggestValue = 0;
        uint256 correctAnswer;
        int256 questionQuantity = questions[_question_id].questionQuantity;

        // find correct answer
        for (uint8 i = 0; i < questionQuantity; i++) {
            if (questions[_question_id].validator[i].index > biggestValue) {
                biggestValue = questions[_question_id].validator[i].index;
                correctAnswer = i;
            }
        }

        questions[_question_id].correctAnswer = correctAnswer;
        letsPayCompanyFee(correctAnswer, _question_id);
    }

    function letsPayCompanyFee(uint256 correctAnswer, int256 _question_id) private {
        if (questions[_question_id].money > 0) {
            // pay fee for company
            uint256 persentFee = getPersent(
                questions[_question_id].money,
                percentQuiz
            );
            questions[_question_id].money = questions[_question_id].money - persentFee;
            fullAmount = fullAmount - persentFee;
            companyAddress.transfer(persentFee);
            questions[_question_id].persentFeeCompany = persentFee;

            letsPayHostFee(correctAnswer, _question_id);
        }
    }

    function letsPayHostFee(uint256 correctAnswer, int256 _question_id) private {
        // pay fee for host
        uint256 persHostFee = getPersent(
            questions[_question_id].money,
            questions[_question_id].percentHost
        );
        questions[_question_id].money = questions[_question_id].money - persHostFee;
        fullAmount = fullAmount - persHostFee;
        questions[_question_id].hostWallet.transfer(persHostFee);
        questions[_question_id].persentFeeHost = persHostFee;

        letsPayValidatorFee(correctAnswer, _question_id);
    }

    function letsPayValidatorFee(uint256 correctAnswer, int256 _question_id) private {
        // calculate percent for validator
        uint256 persentForValidators = getPersent(
            questions[_question_id].money,
            questions[_question_id].percentValidator
        );
        uint256 persentForEachValidators = persentForValidators / questions[_question_id].validator[correctAnswer].index;
        fullAmount = fullAmount - persentForValidators;

        questions[_question_id].persentForEachValidators = persentForEachValidators;

        // pay for validatos
        for (uint8 i = 0; i < questions[_question_id].validator[correctAnswer].index; i++ ) {
            address payable _validator = questions[_question_id].validator[correctAnswer].validators[i].valid;
            questions[_question_id].money = questions[_question_id].money - persentForEachValidators;
            _validator.transfer(persentForEachValidators);
        }
        letsPayParticipantFee(correctAnswer, _question_id);
    }

    function letsPayParticipantFee(uint256 correctAnswer, int256 _question_id) private{
         // Pay for participant
        uint256 monayForParticipant = questions[_question_id].money / questions[_question_id].participant[correctAnswer].index;
        for ( uint8 i = 0; i < questions[_question_id].participant[correctAnswer].index; i++) {
            address payable _participant = questions[_question_id].participant[correctAnswer].participants[i].parts;
            questions[_question_id].money = questions[_question_id].money - monayForParticipant;
            _participant.transfer(monayForParticipant);
        }

        questions[_question_id].monayForParticipant = monayForParticipant;

        emit eventIsFinish(_question_id);
    }

    function getPersent(uint256 _percent, uint256 _from)
        private
        pure
        returns (uint256)
    {
        return (_from * _percent) / 100;
    }

    function getQuestion(int256 _question_id)
        public
        view
        returns (
            uint256 persentFeeCompany,
            uint256 persentForEachValidators,
            uint256 money,
            uint256 monayForParticipant,
            uint8 questionQuantity,
            uint256 correctAnswer,
            uint256 persentFeeHost
        )
    {
        return (
            questions[_question_id].persentFeeCompany,
            questions[_question_id].persentForEachValidators,
            questions[_question_id].money,
            questions[_question_id].monayForParticipant,
            questions[_question_id].questionQuantity,
            questions[_question_id].correctAnswer,
            questions[_question_id].persentFeeHost
        );
    }

    function setTimeValidator(int256 _question_id) public view returns (int8) {
        if (int256(now - questions[_question_id].endTime) >= 0){
            if (int256((questions[_question_id].endTime + sevenDaysTimeStamp) - now) >= 0){
                // if validator made activities like participants.
                for (uint8 i = 0; i < questions[_question_id].allParticipant.length; i++) {
                    if (questions[_question_id].allParticipant[i] == msg.sender) {
                        return 3;
                    }
                }
                // user can validate because time is valid.
                return 0;
            } else {
                // user can't validate because time is finish.
                return 2;
            }
        } else {
            // user can't validate because event is not started yet.
            return 1;
        }
    }

    function setTimeAnswer(int256 _question_id) public view returns (int8) {
        if (int256(now - questions[_question_id].startTime) >= 0) {
            if (int256(questions[_question_id].endTime - now) >= 0) {
                // user can make answer because time is valid.
                return 0;
            } else {
                // user can't make answer because event is finish.
                return 2;
            }
        } else {
            // user can't make answer because event is not started yet.
            return 1;
        }
    }

    function deleteEventValidator(int256 _question_id)
        public
        view
        returns (int8)
    {
        if (questions[_question_id].hostWallet == msg.sender) {
            if (questions[_question_id].money == 0) {
                // user can delete event
                return 0;
            } else {
                // user can't delete event because event has money on balance
                return 1;
            }
        } else {
            // only owner can delete event.
            return 2;
        }
    }

    function deleteEvent(int256 _question_id) public {
        require(
            deleteEventValidator(_question_id) == 0,
            "Delete event is false"
        );
        delete questions[_question_id];
    }

    function quizeBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
