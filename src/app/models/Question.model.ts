export interface Question {
    id: string;
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
    money: number
}
