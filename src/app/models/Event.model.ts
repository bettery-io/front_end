export interface EventModel {
  allAmountEvents: number;
  amount: number;
  events: Event[];
}

interface Event {
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
  parcipiantAnswers: object[];
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
}
