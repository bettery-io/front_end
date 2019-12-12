export interface Question {
    id: number;
    status: string;
    hostWallet: string;
    question: string;
    hashtags: Object[];
    answers: Object[];
    multiChose: boolean;
    startTime: number;
    endTime: number;
    private: boolean;
    parcipiant: Object[];
    validators: Object[];
    validatorsAmount: number;
    money: number;
    finalAnswers: number;
    transactionHash: number;
    answerQuantity: number;
    validatorsQuantity: number;
}
