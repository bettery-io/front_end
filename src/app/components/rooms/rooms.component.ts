import {Component, OnDestroy, OnInit} from '@angular/core';
import {GetService} from '../../services/get.service';
import {Subscription} from 'rxjs';
import {PostService} from '../../services/post.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {createEventAction} from '../../actions/newEvent.actions';
import * as _ from 'lodash';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.sass']
})
export class RoomsComponent implements OnInit, OnDestroy {
  roomsSub: Subscription;
  roomById: Subscription;
  eventById: Subscription;
  userSub: Subscription;

  allRooms: any;

  showLength = 8;
  startLength = 0;
  roomsSort: any;
  pageRoom = 1;

  activeRoom: number;

  userData;
  usersRoom;
  newCreateEvent = '';
  searchWord: string;

  forEventId;
  comSoon: boolean;
  testAnimation: number;
  btnMiddleActive = 1;

  constructor(
    private getService: GetService,
    private postService: PostService,
    private store: Store<AppState>
  ) {
    this.findCurrentUser();
  }

  ngOnInit(): void {
    this.getAllRoomsFromServer();
  }

  getAllRoomsFromServer() {
    const path = 'room/get_all';
    this.roomsSub = this.getService.get(path).subscribe(rooms => {
      this.allRooms = rooms;
      console.log(rooms, 'all rooms');
      this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);
    });
  }

  getUsersRoomById(id: number) {
    const path = 'room/get_by_user_id';
    const data = {id};

    this.roomById = this.postService.post(path, data).subscribe(list => {
      console.log(list);
      this.usersRoom = list;
      this.roomsSort = this.usersRoom.slice(this.startLength, this.showLength);
    });
  }

  getEventById(path, id) {
    this.eventById = this.postService.post(path, {id}).subscribe(ev => {
      console.log(ev);
      this.forEventId = ev;
    });
  }

  prevRooms() {
    if (this.pageRoom <= 1) {
      return;
    }
    this.pageRoom = this.pageRoom - 1;
    this.startLength = this.startLength - 8;
    this.showLength = this.showLength - 8;

    if (this.btnMiddleActive === 2) {
      this.roomsSort = this.usersRoom.slice(this.startLength, this.showLength);
    } else {
      this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);
    }
    this.activeRoom = null;
  }

  nextRooms() {

    if (this.pageRoom > Math.round(this.allRooms?.length / 8)) {
      return;
    }
    this.startLength = this.startLength + 8;
    this.showLength = this.showLength + 8;
    this.pageRoom = this.pageRoom + 1;

    if (this.btnMiddleActive === 2) {
      this.roomsSort = this.usersRoom.slice(this.startLength, this.showLength);
    } else {
      this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);
    }


    this.activeRoom = null;
  }

  letsFindRoomsLength() {
    if (!this.usersRoom) {
      return Math.ceil(this.allRooms?.length / 8);
    } else if (this.roomsSort?.length > 0) {
      return Math.ceil(this.roomsSort?.length / 8);
    } else {
      return Math.ceil(this.usersRoom?.length / 8);
    }

  }

  activeCard(index) {
    if (this.activeRoom === index) {
      this.activeRoom = null;
      return;
    }
    console.log(index);
    if ((index === 4 || index === 5 || index === 6 || index === 7) && window.screen.width > 1199) {
      this.testAnimation = index;
    } else {
      this.testAnimation = null;
    }

    // animation test adapting , to do =================
    // if ((index === 4 || index === 5 || index === 6 || index === 7 || index === this.roomsSort.length - 1) && window.screen.width > 1199) {
    //   this.testAnimation = index;
    // } else if ((index === 6 || index === 7 || index === this.roomsSort.length - 1) && window.screen.width < 1199 && window.screen.width > 991) {
    //   this.testAnimation = index;
    // } else if (index === 7 || index === this.roomsSort.length - 1 && window.screen.width < 992) {
    //   this.testAnimation = index;
    // } else {
    //   this.testAnimation = null;
    // }

    this.activeRoom = index;

    if (this.roomsSort[index].privateEventsId.length > 0) {
      this.getEventById('privateEvents/get_by_id', this.roomsSort[index].privateEventsId[0]._id);
    }

    if (this.roomsSort[this.activeRoom].publicEventsId.length > 0) {
      this.getEventById('publicEvents/get_by_id', this.roomsSort[index].publicEventsId[0]._id);
    }
  }

  findCurrentUser(): void {
    this.userSub = this.store.select('user').subscribe((x) => {
      if (x.length !== 0) {
        this.userData = x[0];
      }
    });
  }

  showUsersRoom() {
    if (this.userData) {
      this.getUsersRoomById(this.userData._id);
      this.btnMiddleActive = 2;
      this.comSoon = false;
    } else {
      return;
    }
  }

  showAllRooms() {
    this.btnMiddleActive = 1;
    this.comSoon = false;
    this.usersRoom = null;
    this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);
  }

  sendNewEvent() {
    console.log(this.newCreateEvent);

    const data = this.newCreateEvent;
    if (data) {
      this.store.dispatch(createEventAction({data}));
    }
    this.newCreateEvent = '';
  }

  comingSoon() {
    this.btnMiddleActive = 3;
    this.comSoon = true;
  }

  showSearchInput() {
    this.btnMiddleActive = 4;
  }

  letsFindRooms(e) {
    let arr;
    if (this.searchWord.length > 3) {
      arr = _.filter(this.allRooms, o => {
        return o.name.toLowerCase().includes(this.searchWord.toLowerCase());
      });
      console.log(arr);
      if (arr.length > 0) {
        this.roomsSort = arr.slice(this.startLength, this.showLength);
      }
    }

    if (e.code === 'Backspace') {
      this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);
    }
  }

  ngOnDestroy(): void {
    if (this.roomsSub) {
      this.roomsSub.unsubscribe();
    }

    if (this.roomById) {
      this.roomById.unsubscribe();
    }

    if (this.userSub) {
      this.userSub.unsubscribe();
    }

    if (this.eventById) {
      this.eventById.unsubscribe();
    }
  }
}
