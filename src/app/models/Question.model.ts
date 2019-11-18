export interface Question {
    id: string;
    question: string;
    hashtags: Object[];
    answers: Object[];
    multiChose: boolean;
    startTime: number;
    endTime: number;
    private: boolean;
    validators: string;
    money: number
}
