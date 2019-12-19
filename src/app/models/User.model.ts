export interface User {
    nickName: string;
    email: string;
    wallet: string;
    listHostEvents: Object;
    listParticipantEvents: Object;
    listValidatorEvents: Object;
}

interface Invires {
    event: number,
    transactionHash: string,
    date: number
}