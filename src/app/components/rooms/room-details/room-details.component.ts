import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from '../../../services/post.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Answer } from '../../../models/Answer.model';
import { User } from '../../../models/User.model';
import _ from 'lodash';
import { RegistrationComponent } from '../../registration/registration.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



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
  joinRoomSub: Subscription;
  leaveRoomSub: Subscription;
  notificationRoomSub: Subscription;
  roomDetails: any;
  roomEvents: any = [];
  coinInfo = null;
  myAnswers: Answer[] = [];
  userId: number = null;
  userData: any;
  fromComponent: string = 'room';
  commentList;
  scrollDistanceFrom = 0;
  scrollDistanceTo = 5;
  bottom = false;
  allData: any = [];
  spinner = true;
  scrollTop = 0;
  searchWord = '';
  timeout;
  spinnerForComment: boolean;
  commentResetFlag: boolean;
  pureData;
  roomData: any;
  disabledButton: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private store: Store<AppState>,
    private modalService: NgbModal
  ) {
    this.storeUserSubscribe = this.store.select('user').subscribe((x: User[]) => {
      if (x.length === 0) {
        this.userId = null;
      } else {
        this.userId = x[0]._id;
        this.userData = x[0];
        this.allData = [];
        let data = {
          roomId: Number(this.roomData.roomId),
          userId: this.userId
        }
        this.getRoomInfo(data);
        this.getRoomEvent(this.scrollDistanceFrom, this.scrollDistanceTo, this.searchWord);
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
      this.roomData = {
        roomId: Number(params.id),
        userId: this.userId,
      };
      this.getRoomInfo(this.roomData)
      this.getRoomEvent(this.scrollDistanceFrom, this.scrollDistanceTo, this.searchWord);
    });
  }

  getRoomInfo(data) {
    this.infoSub = this.postService.post('room/info', data).subscribe((value: any) => {
      this.roomDetails = value;
      this.disabledButton = false;
      console.log(value);
    }, (err) => {
      console.log(err);
    });
  }

  getRoomEvent(from, to, search) {
    let param;
    if (search.length >= 3) {
      param = search;
    } else {
      param = '';
    }
    let data = {
      id: Number(this.roomData?.roomId),
      from: from,
      to: to,
      search: param
    };

    this.eventSub = this.postService.post('room/get_event_by_room_id', data).subscribe((value: any) => {
      this.pureData = value;
      if (this.roomEvents.length == 0) {
        this.commentList = value.events[0];
      }
      if (from == 0) {
        this.roomEvents = value.events;
        this.myAnswers = this.getAnswers(value.events);
      } else {
        value.events.forEach(el => this.roomEvents.push(el));
        this.myAnswers = this.getAnswers(this.roomEvents);
      }
      this.allData = this.roomEvents;
      if (this.commentResetFlag && this.roomEvents.length > 0) {
        this.commentById(this.roomEvents[0].id);
        this.commentResetFlag = false;
      }
      this.spinner = false;
    }, (err) => {
      console.log(err);
    });
  }

  getAnswers(x) {
    return x.map((data) => {
      return {
        event_id: data.id,
        answer: this.findAnswer(data).answer,
        from: this.findAnswer(data).from,
        answered: this.findAnswer(data).answer != undefined ? true : false,
        amount: 0,
        betAmount: this.findAnswer(data).amount
      };
    });
  }

  findAnswer(data) {
    let findParticipiant = _.findIndex(data.parcipiantAnswers, { 'userId': this.userId });
    if (findParticipiant === -1) {
      let findValidators = _.findIndex(data.validatorsAnswers, { 'userId': this.userId });
      return {
        answer: findValidators !== -1 ? data.validatorsAnswers[findValidators].answer : undefined,
        from: 'validator',
        amount: 0
      };
    } else {
      return {
        answer: data.parcipiantAnswers[findParticipiant].answer,
        from: 'participant',
        amount: data.parcipiantAnswers[findParticipiant].amount
      };
    }
  }


  infoRoomColor(value) {
    return { 'background': value };
  }

  commentById($event) {
    if ($event) {
      let newCommentList = _.find(this.roomEvents, (o) => {
        return o.id == $event;
      });
      this.commentList = newCommentList;
    }
  }

  getCommentRoomColor(color) {
    return { 'background': color };
  }

  onScrollQuizTemplate() {
    if (this.pureData?.amount > this.scrollDistanceTo) {
      this.scrollDistanceFrom = this.scrollDistanceFrom + 5;
      this.scrollDistanceTo = this.scrollDistanceTo + 5;
      if (this.scrollDistanceTo >= this.pureData?.amount) {
        this.scrollDistanceTo = this.pureData?.amount;
        if (!this.bottom) {
          this.bottom = true;
          this.getRoomEvent(this.scrollDistanceFrom, this.scrollDistanceTo, this.searchWord);
        }
      } else {
        this.getRoomEvent(this.scrollDistanceFrom, this.scrollDistanceTo, this.searchWord);
      }
    }
  }

  joinToRoom() {
    if (!this.userId) {
      this.modalService.open(RegistrationComponent, { centered: true });
    } else {
      this.disabledButton = true;
      let data = {
        userId: this.userId,
        roomId: Number(this.roomData?.roomId)
      }
      this.joinRoomSub = this.postService.post('room/join', data).subscribe((x) => {
        this.getRoomInfo(data)
      }, (err) => {
        console.log(err)
      })
    }
  }

  leaveRoom() {
    this.disabledButton = true;
    let data = {
      joinedId: this.roomDetails.joinedId,
    }
    this.leaveRoomSub = this.postService.post('room/leave', data).subscribe(() => {
      let dataRoomInfo = {
        userId: this.userId,
        roomId: Number(this.roomData?.roomId)
      }
      this.getRoomInfo(dataRoomInfo)
    }, (err) => {
      console.log(err)
    })
  }

  notification(x) {
    this.disabledButton = true;
    let data = {
      joinedId: this.roomDetails.joinedId,
      subscribe: x
    }
    this.notificationRoomSub = this.postService.post('room/notification', data).subscribe(() => {
      let dataRoomInfo = {
        userId: this.userId,
        roomId: Number(this.roomData?.roomId)
      }
      this.getRoomInfo(dataRoomInfo)
    }, (err) => {
      console.log(err)
    })
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
    if (this.joinRoomSub) {
      this.joinRoomSub.unsubscribe();
    }
    if (this.leaveRoomSub) {
      this.leaveRoomSub.unsubscribe();
    }
    if (this.notificationRoomSub) {
      this.notificationRoomSub.unsubscribe();
    }
  }

  @HostListener('window:scroll', ['$event'])
  listenScroll() {
    this.scrollTop = document.documentElement.scrollTop;
  }

  commentTopPosition() {
    if (document.documentElement.scrollTop < 428) {
      return { 'top': (428 - this.scrollTop) + 'px' };
    } else {
      return { 'top': 0 };
    }
  }

  letsFindEvent() {
    if (this.timeout !== undefined) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {

      if (this.searchWord.length >= 3) {
        this.getRoomEvent(0, 5, this.searchWord);
        this.commentResetFlag = true;
      } else {
        this.getRoomEvent(0, 5, '');
        this.commentResetFlag = true;
      }
    }, 300);
  }

  commentsSpinner($event: boolean) {
    this.spinnerForComment = $event;
  }
}
