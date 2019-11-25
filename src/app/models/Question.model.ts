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
    parcipiantAnaswers: Answers[];
    validators: Object[];
    validatorsAnaswers: Answers[];
    validatorsAmount: number;
    money: number;
    finalAnswers: number;
    transactionHash: number;
}

interface Answers {
    time: number;
    wallet: string;
    answer: number
}
