export interface Question {
    id: number;
    status: string;
    host: number;
    question: string;
    hashtags: Object[];
    answers: Object[];
    startTime: number;
    endTime: number;
    parcipiant: Object[];
    validators: Object[];
    validatorsAmount: number;
    finalAnswer: number;
    transactionHash: number;
    validated: number;
    currencyType: string;
}
