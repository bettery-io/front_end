export interface User {
    _id: number;
    nickName: string;
    email: string;
    wallet: string;
    listHostEvents: Object;
    listParticipantEvents: Object;
    listValidatorEvents: Object;
    historyTransaction: Object;
    avatar: string;
    verifier: string;
}
