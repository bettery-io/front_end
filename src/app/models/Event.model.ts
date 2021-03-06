export interface EventModel {
  allAmountEvents: number;
  amount: number;
  events: Event[];
}

export interface Event {
  answerAmount: number;
  answers: object[];
  commentsAmount: number;
  currencyType: string;
  endTime: number;
  eventEnd: number;
  finalAnswer: any;
  host: {
    avatat: string;
    id: number;
    nickName: string;
    wallet: string;
  };
  id: number;
  lastComment: string;
  parcipiantAnswers: ParcipiantAnswers[];
  question: string;
  room: {
    color: string;
    eventAmount: number;
    id: number;
    name: string;
    owner: number;
  };
  startTime: number;
  status: string;
  transactionHash: string;
  validated: number;
  validatorsAmount: number;
  validatorsAnswers: ValidatorsAnswers[];
}
interface ValidatorsAnswers {
  answer: number;
  avatar: string;
  date: number;
  transactionHash: string;
  userId: number
}
interface ParcipiantAnswers {
  amount: number;
  answer: number;
  avatar: string;
  date: number;
  transactionHash: string;
  userId: number;
}

