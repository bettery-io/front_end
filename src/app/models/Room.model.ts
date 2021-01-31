export interface RoomModel {
  color: number;
  id: number;
  joinedUsers: number;
  name: string;
  privateEventsId: object[];
  publicEventsId: object[];
  user: object;
}
