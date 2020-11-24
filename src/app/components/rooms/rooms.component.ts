import {Component, OnDestroy, OnInit} from '@angular/core';
import {GetService} from '../../services/get.service';
import {Subscription} from 'rxjs';
import {PostService} from '../../services/post.service';
import {writeErrorToLogFile} from '@angular/cli/utilities/log-file';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {createEventAction} from '../../actions/newEvent.actions';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.sass']
})
export class RoomsComponent implements OnInit, OnDestroy {
  roomsSub: Subscription;
  roomById: Subscription;
  userSub: Subscription;

  allRooms: any;

  showLength = 8;
  startLength = 0;
  roomsSort: any;
  pageRoom = 1;

  activeRoom = 0;

  userData;
  usersRoom;
  newCreateEvent = '';

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
      this.roomsSort = this.usersRoom.slice(0, this.showLength);
    });
  }

  prevRooms() {
    if (this.pageRoom <= 1) {
      return;
    }
    this.pageRoom = this.pageRoom - 1;
    this.startLength = this.startLength - 8;
    this.showLength = this.showLength - 8;

    this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);
    this.activeRoom = 0;
  }

  nextRooms() {
    if (this.pageRoom > Math.round(this.allRooms?.length / 8)) {
      return;
    }
    this.startLength = this.startLength + 8;
    this.showLength = this.showLength + 8;
    this.pageRoom = this.pageRoom + 1;

    this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);
    this.activeRoom = 0;
  }

  letsFindRoomsLength() {
    return Math.ceil(this.allRooms?.length / 8);
  }

  activeCard(index) {
    this.activeRoom = index;
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
    }
  }

  showAllRooms() {
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
  }
}
