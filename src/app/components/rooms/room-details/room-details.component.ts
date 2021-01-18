import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {PostService} from '../../../services/post.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app.state';
import {Answer} from '../../../models/Answer.model';
import {User} from '../../../models/User.model';
import _ from 'lodash';
import set = Reflect.set;


@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.sass']
})
export class RoomDetailsComponent implements OnInit, OnDestroy {
  routeSub: Subscription;
  infoSub: Subscription;
  eventSub: Subscription;
  storeCoinsSubscrive: Subscription;
  storeUserSubscribe: Subscription;
  roomDetails: any;
  roomEvents: any = [];
  coinInfo = null;
  id: any;
  myAnswers: Answer[] = [];
  userId: number = null;
  userData: any;
  fromComponent: string = 'room';
  commentList;
  scrollDistanceFrom = 0;
  scrollDistanceTo = 5;
  bottom = false;
  allData;
  spinner = true;
  scrollTop: number;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private store: Store<AppState>,
  ) {
    this.storeUserSubscribe = this.store.select('user').subscribe((x: User[]) => {
      if (x.length === 0) {
        this.userId = null;
      } else {
        this.userId = x[0]._id;
        this.userData = x[0];
      }
    });
    this.storeCoinsSubscrive = this.store.select('coins').subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
      }
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = {
        id: Number(params.id)
      };
      this.infoSub = this.postService.post('room/info', this.id).subscribe((value: any) => {
        this.roomDetails = value;
        console.log(value);
      }, (err) => {
        console.log(err);
      });
      this.getRoomEvent(this.scrollDistanceFrom, this.scrollDistanceTo);
    });
  }

  getRoomEvent(from, to) {
    this.myAnswers = [];
    let data = {
      id: Number(this.id.id),
      from: from,
      to: to
    };

    this.eventSub = this.postService.post('room/get_event_by_room_id', data).subscribe((value: any) => {
      this.allData = value;

      if (value.events.length === 0) {
        this.roomEvents = value.events;
      } else {
        value.events.forEach(el => this.roomEvents.push(el));
      }
      this.commentList = this.roomEvents[0];

      this.myAnswers = this.roomEvents.map((data) => {
        return {
          event_id: data.id,
          answer: this.findAnswer(data),
          from: data.from,
          multy: data.multiChoise,
          answered: this.findAnswered(data),
          multyAnswer: this.findMultyAnswer(data)
        };
      });
      this.spinner = false;
    }, (err) => {
      console.log(err);
    });
  }

  findAnswer(data) {
    let findParticipiant = _.findIndex(data.parcipiantAnswers, {'userId': this.userId});
    if (findParticipiant === -1) {
      let findValidators = _.findIndex(data.validatorsAnswers, {'userId': this.userId});
      return findValidators !== -1 ? data.validatorsAnswers[findValidators].answer : undefined;
    } else {
      return data.parcipiantAnswers[findParticipiant].answer;
    }
  }

  findAnswered(data) {
    if (data.multiChoise) {
      return this.findMultyAnswer(data).length !== 0 ? true : false;
    } else {
      return this.findAnswer(data) !== undefined ? true : false;
    }
  }

  findMultyAnswer(data) {
    let z = [];
    let part = _.filter(data.parcipiantAnswers, {'userId': this.userId});
    part.forEach((x) => {
      z.push(x.answer);
    });
    if (z.length === 0) {
      let part = _.filter(data.validatorsAnswers, {'userId': this.userId});
      part.forEach((x) => {
        z.push(x.answer);
      });
      return z;
    } else {
      return z;
    }
  }

  infoRoomColor(value) {
    return {'background': value};
  }

  commentById($event) {
    if ($event) {
      let newCommentList = _.find(this.roomEvents, (o) => {
        return o.id == $event;
      });
      this.commentList = newCommentList;
      console.log(this.commentList);
    }
  }

  getCommentRoomColor(color) {
    return {'background': color};
  }

  onScrollQuizTemplate() {
    if (this.allData?.amount > this.scrollDistanceTo) {
      this.scrollDistanceFrom = this.scrollDistanceFrom + 5;
      this.scrollDistanceTo = this.scrollDistanceTo + 5;
      if (this.scrollDistanceTo >= this.allData?.amount) {
        this.scrollDistanceTo = this.allData?.amount;
        if (!this.bottom) {
          this.bottom = true;
          this.getRoomEvent(this.scrollDistanceFrom, this.scrollDistanceTo);
        }
      } else {
        this.getRoomEvent(this.scrollDistanceFrom, this.scrollDistanceTo);
      }
    }

  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.infoSub) {
      this.infoSub.unsubscribe();
    }
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
    if (this.storeCoinsSubscrive) {
      this.storeCoinsSubscrive.unsubscribe();
    }
    if (this.storeUserSubscribe) {
      this.storeUserSubscribe.unsubscribe();
    }
  }

  @HostListener('window:scroll', ['$event'])
  listenScroll() {
    this.scrollTop = document.documentElement.scrollTop;
  }

  commentTopPosition() {
    if (document.documentElement.scrollTop < 350) {
      return {'top': (350 - this.scrollTop) + 'px'};
    } else {
      return {'top': 0};
    }
  }

}
