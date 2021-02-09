import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})

export class SessionStorageService {
  constructor() {
  }
  eventIdValue = new BehaviorSubject(this.eventId);

  set eventId(value) {
    this.eventIdValue.next(value);
    sessionStorage.setItem('eventId', value);
  }

  get eventId() {
    return sessionStorage.getItem('eventId');
  }
}
