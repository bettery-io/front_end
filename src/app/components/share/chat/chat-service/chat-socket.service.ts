import {Injectable} from '@angular/core';

import * as socketIo from 'socket.io-client';
import {observable, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {
  url = 'http://13.229.200.135';

  private socket;

  constructor() {
  }

  initSocket(): void {
    this.socket = socketIo(this.url);
  }

  send(eventId: number, userId: number, comment: string) {
    this.socket.emit('create comment', {eventId, userId, comment});
  }

  newComment() {
    return new Observable<any>(observer => {
      this.socket.on('receive comments', comment => {
        if (typeof comment === 'string') {
          console.error(comment);
        } else {
          observer.next(comment);
        }
      });
    });
  }

  gettingComments(eventID: number) {
    this.socket.emit('get comments', Number(eventID));
  }

  sendSelectedIcon(type: string, eventId: number, userId: number, commentId: number) {
    this.socket.emit('activities', {type, eventId, userId, commentId});
  }
}

