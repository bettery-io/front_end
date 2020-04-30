export interface Question {
    id: number;
    status: string;
    host: number;
    question: string;
    hashtags: Object[];
    answers: Object[];
    multiChoise: boolean;
    startTime: number;
    endTime: number;
    private: boolean;
    parcipiant: Object[];
    validators: Object[];
    validatorsAmount: number;
    money: number;
    finalAnswer: number;
    transactionHash: number;
    answerAmount: number;
    validated: number;
    showDistribution: boolean;
    currencyType: string;
}
