export interface RoomModel {
  color: number;
  id: number;
  joinedUsers: number;
  name: string;
  privateEventsId: EventId[];
  publicEventsId: EventId[];
  user: object;
}

interface EventId {
  _id: number;
}
