pragma solidity ^0.5.2;

import "./HoldMoney.sol";
import "./LoomERC20Coin.sol";


contract Quize is HoldMoney {
    uint8 private percentQuiz = 2;
    uint256 public fullAmount;
    uint256 private sevenDaysTimeStamp = 604800;
    address payable companyAddress = 0x02810c3bc07De2ddAef89827b0dD6b223C7759d5;
    LoomERC20Coin public tokenContract;

    event eventIsFinish(int256 question_id, bool payEther);
    event payEvent(string path, uint256 money, bool payEther, address wallet, string from, int256 question_id);

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
        uint256 moneyForParticipant;
        uint256 correctAnswer;
        address[] allParticipant;
        uint256 quizePrice;
        bool payEther;
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
        bool _pathHoldMoney,
        bool _payEther
    ) public payable {
        questions[_question_id].question_id = _question_id;
        questions[_question_id].endTime = _endTime;
        questions[_question_id].questionQuantity = _questionQuantity;
        questions[_question_id].startTime = _startTime;
        questions[_question_id].validatorsAmount = _validatorsAmount;
        questions[_question_id].hostWallet = msg.sender;
        questions[_question_id].quizePrice = _quizePrice;
        questions[_question_id].payEther = _payEther;

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

        uint256 amount = _setMoneyRetention(_pathHoldMoney, _question_id);
        if(!_pathHoldMoney){
           require(tokenContract.allowance(msg.sender, address(this)) >= amount, "Do not enought ethers");
           require(tokenContract.transferFrom(msg.sender, address(this), amount), "Transfer error");
        }
        emit payEvent("send", amount, _pathHoldMoney, msg.sender, "hold money", _question_id);
    }

    function setAnswer(int256 _question_id, uint8 _whichAnswer) public payable {
        bool payEther = questions[_question_id].payEther;
        require(setTimeAnswer(_question_id) == 0, "Time is not valid");

        if(payEther){require(msg.value == questions[_question_id].quizePrice, "Do not enought ethers");}
        else{require(tokenContract.allowance(msg.sender, address(this)) >= questions[_question_id].quizePrice, "Do not enought tokens");}

        uint256 i = questions[_question_id].participant[_whichAnswer].index;
        questions[_question_id].participant[_whichAnswer].participants[i].parts = msg.sender;
        questions[_question_id].participant[_whichAnswer].index = i + 1;
        questions[_question_id].allParticipant.push(msg.sender);

        if(payEther){
            questions[_question_id].money += msg.value;
            fullAmount += msg.value;
        }else{
            uint256 price = questions[_question_id].quizePrice;
            questions[_question_id].money += price;
            fullAmount += price;
            require(tokenContract.transferFrom(msg.sender, address(this), price), "Transfer error");
        }

        emit payEvent("send", questions[_question_id].quizePrice, payEther, msg.sender, "participant", _question_id);

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
        bool payEther = questions[_question_id].payEther;
        if (questions[_question_id].money > 0) {
            // pay fee for company
            uint256 persentFee = getPersent(
                questions[_question_id].money,
                percentQuiz
            );
            questions[_question_id].money = questions[_question_id].money - persentFee;
            fullAmount = fullAmount - persentFee;
            if(payEther){companyAddress.transfer(persentFee);}
            else{require(tokenContract.transfer(companyAddress, persentFee), "Transfer ERC20 to host is error");}
            questions[_question_id].persentFeeCompany = persentFee;

            letsPayHostFee(correctAnswer, _question_id, payEther);
        }
    }

    function letsPayHostFee(uint256 correctAnswer, int256 _question_id, bool payEther) private {
        // pay fee for host
        uint256 persHostFee = getPersent(
            questions[_question_id].money,
            questions[_question_id].percentHost
        );
        questions[_question_id].money = questions[_question_id].money - persHostFee;
        fullAmount = fullAmount - persHostFee;
        address payable hostWallet = questions[_question_id].hostWallet;
        if(payEther){hostWallet.transfer(persHostFee);}
        else{require(tokenContract.transfer(hostWallet, persHostFee), "Transfer ERC20 to host is error");}
        questions[_question_id].persentFeeHost = persHostFee;

        letsPayValidatorFee(correctAnswer, _question_id, payEther);
    }

    function letsPayValidatorFee(uint256 correctAnswer, int256 _question_id, bool payEther) private {
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

            if(payEther){_validator.transfer(persentForEachValidators);}
            else{require(tokenContract.transfer(_validator, persentForEachValidators), "Transfer ERC20 to host is error");}

        }

        letsPayParticipantFee(correctAnswer, _question_id, payEther);
    }

    function letsPayParticipantFee(uint256 correctAnswer, int256 _question_id, bool payEther) private{
         // Pay for participant
        uint256 moneyForParticipant = questions[_question_id].money / questions[_question_id].participant[correctAnswer].index;
        for ( uint8 i = 0; i < questions[_question_id].participant[correctAnswer].index; i++) {
            address payable _participant = questions[_question_id].participant[correctAnswer].participants[i].parts;
            questions[_question_id].money = questions[_question_id].money - moneyForParticipant;

            if(payEther){_participant.transfer(moneyForParticipant);}
            else{require(tokenContract.transfer(_participant, moneyForParticipant), "Transfer ERC20 to host is error");}

        }

        questions[_question_id].moneyForParticipant = moneyForParticipant;

        emit eventIsFinish(_question_id, payEther);
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
            uint256 moneyForParticipant,
            uint8 questionQuantity,
            uint256 correctAnswer,
            uint256 persentFeeHost
        )
    {
        return (
            questions[_question_id].persentFeeCompany,
            questions[_question_id].persentForEachValidators,
            questions[_question_id].money,
            questions[_question_id].moneyForParticipant,
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

    function getContractTokenBalance() public view returns (uint256) {
        return tokenContract.balanceOf(address(this));
    }

    function getMoneyRetention(address payable _host) public payable {
        (uint256 amount, address host, bool path, int256 _question_id) = _getMoneyRetention(_host);
        if(!path){
           require(tokenContract.transfer(host, amount), "Transfer ERC20 to host is error");
        }

        emit payEvent("receive", amount, path, host, "hold money", _question_id);
    }

 function amountGuard(bool _path) public view returns (int8) {
     uint256 balanceToken;
     if(!_path){
         balanceToken = tokenContract.balanceOf(address(msg.sender));
     }

     return _amountGuard(_path, balanceToken);
 }


}
