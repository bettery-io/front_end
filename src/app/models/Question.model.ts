export interface Question {
    id: number;
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
    money: number
}
