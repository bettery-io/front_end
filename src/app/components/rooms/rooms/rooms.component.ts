import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { GetService } from '../../../services/get.service';
import { Subscription } from 'rxjs';
import { PostService } from '../../../services/post.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { createEventAction } from '../../../actions/newEvent.actions';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from '../../registration/registration.component';

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
  joinedRoomSub: Subscription;

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
  testAnimation: number;
  btnMiddleActive = 'showAllRoom';
  showInputFlag: boolean;
  spinner: boolean;

  constructor(
    private getService: GetService,
    private postService: PostService,
    private store: Store<AppState>,
    private modalService: NgbModal,
  ) {
    this.findCurrentUser();
  }

  ngOnInit(): void {
    this.getAllRoomsFromServer();
  }

  @HostListener('click', ['$event'])
  a($event) {
    if (!$event.target.classList.contains('search-img') && !$event.target.classList.contains('search-input')) {
      this.showInputFlag = false;
    }
  }

  getAllRoomsFromServer() {
    const path = 'room/get_all';
    this.roomsSub = this.getService.get(path).subscribe(rooms => {
      console.log(rooms);
      this.allRooms = rooms;
      this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);
      this.spinner = true;
    });
  }

  getUsersRoomById(id: number) {
    const path = 'room/get_by_user_id';
    const data = { id };

    this.roomById = this.postService.post(path, data).subscribe(list => {
      this.usersRoom = list;
      this.roomsSort = this.usersRoom.slice(this.startLength, this.showLength);
    });
  }

  getEventById(path, id) {
    this.eventById = this.postService.post(path, { id }).subscribe(ev => {
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

    if (this.btnMiddleActive === 'showUsersRoom') {
      this.roomsSort = this.usersRoom.slice(this.startLength, this.showLength);
    } else {
      this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);
    }
    this.activeRoom = null;
  }

  nextRooms() {
    if (this.pageRoom > Math.round(this.usersRoom?.length / 8) ||
      this.pageRoom > Math.round(this.allRooms?.length / 8) ||
      this.pageRoom > Math.round(this.roomsSort?.length / 8) && this.btnMiddleActive === 'searchInput'
    ) {
      return;
    }

    this.startLength = this.startLength + 8;
    this.showLength = this.showLength + 8;
    this.pageRoom = this.pageRoom + 1;

    if (this.btnMiddleActive === 'showUsersRoom') {
      this.roomsSort = this.usersRoom.slice(this.startLength, this.showLength);

    } else {
      this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);
    }
    this.activeRoom = null;
  }

  forLetsFindRoomsLength(currentList) {
    if (isNaN(Math.ceil(currentList / 8))) {
      return 1;
    } else {
      return Math.ceil(currentList / 8);
    }
  }

  letsFindRoomsLength() {
    if (this.btnMiddleActive === 'showUsersRoom') {
      return this.forLetsFindRoomsLength(this.usersRoom?.length);
    }

    if (this.btnMiddleActive === 'searchInput' && this.searchWord?.length <= 3) {
      return this.forLetsFindRoomsLength(this.allRooms?.length);
    }

    if (this.btnMiddleActive === 'searchInput' && this.searchWord?.length > 3) {
      return this.forLetsFindRoomsLength(this.roomsSort?.length);
    }

    if (!this.usersRoom) {
      return this.forLetsFindRoomsLength(this.allRooms?.length);
    } else if (this.roomsSort?.length > 0) {
      return Math.ceil(this.roomsSort?.length / 8);
    } else {
      return Math.ceil(this.usersRoom?.length / 8);
    }
  }

  activeCard(index) {
    console.log(this.roomsSort);
    if (this.activeRoom === index) {
      this.activeRoom = null;
      return;
    }

    if ((index === 4 || index === 5 || index === 6 || index === 7) && window.screen.width > 1199) {
      this.testAnimation = index;
    } else {
      this.testAnimation = null;
    }

    // animation test adapting , to do =================
    if ((index === 6 || index === 7 || index === this.roomsSort.length - 1) && window.screen.width < 1199 && window.screen.width > 991) {
      this.testAnimation = index;
    }
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
        if (this.btnMiddleActive === 'showUsersRoom') {
          this.getUsersRoomById(this.userData._id);
        }
        if (this.btnMiddleActive === "joinedRoom") {
          this.getJoinedUsersRoomById(this.userData._id);
        }
      }
    });
  }

  showUsersRoom() {
    this.pageRoom = 1;
    this.startLength = 0;
    this.showLength = 8;
    if (this.userData) {
      this.getUsersRoomById(this.userData._id);
      this.btnMiddleActive = 'showUsersRoom';
    } else {
      this.btnMiddleActive = 'showUsersRoom';
      this.modalService.open(RegistrationComponent, { centered: true });
      return;
    }
  }

  showAllRooms() {
    this.btnMiddleActive = 'showAllRoom';
    this.usersRoom = null;
    this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);
  }

  sendNewEvent() {
    const data = this.newCreateEvent;
    if (data) {
      this.store.dispatch(createEventAction({ data }));
    }
    this.newCreateEvent = '';
  }

  showJoinedRoom() {
    this.pageRoom = 1;
    this.startLength = 0;
    this.showLength = 8;
    if (this.userData) {
      this.getJoinedUsersRoomById(this.userData._id);
      this.btnMiddleActive = 'joinedRoom';
    } else {
      this.btnMiddleActive = 'joinedRoom';
      this.modalService.open(RegistrationComponent, { centered: true });
      return;
    }
  }

  getJoinedUsersRoomById(id) {
    const path = "room/joined";
    const data = { id };

    this.joinedRoomSub = this.postService.post(path, data).subscribe(list => {
      this.usersRoom = list;
      this.roomsSort = this.usersRoom.slice(this.startLength, this.showLength);
    });
  }

  showSearchInput() {
    if (this.btnMiddleActive !== 'showAllRoom') {
      this.showAllRooms();
    }
    this.showInputFlag = !this.showInputFlag;
    this.btnMiddleActive = 'searchInput';
  }

  letsFindRooms(e) {
    let arr = [];
    this.pageRoom = 1;
    this.startLength = 0;
    this.showLength = 8;

    this.forLetsFindRoom(arr);

    if (e.code === 'Backspace') {
      this.roomsSort = this.allRooms.slice(this.startLength, this.showLength);

      this.forLetsFindRoom(arr);
      if (this.searchWord && this.searchWord?.length <= 3 && arr.length > 0) {
        this.letsFindRoomsLength();
        console.log(this.btnMiddleActive);
      }
    }
  }

  forLetsFindRoom(arr) {
    if (this.searchWord && this.searchWord.length >= 3) {
      arr = _.filter(this.allRooms, o => {
        return o.name.toLowerCase().includes(this.searchWord.toLowerCase());
      });
      if (arr.length > 0) {
        this.roomsSort = arr.slice(this.startLength, this.showLength);
      }
    }
  }

  forFilterBySubject() {

    if (this.roomsSort?.length > 0 && this.searchWord?.length >= 3) {
      return this.roomsSort?.length;
    } else if (this.btnMiddleActive === 'showUsersRoom' || this.btnMiddleActive === "joinedRoom") {
      return this.usersRoom?.length;
    } else {
      return this.allRooms?.length;
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

    if (this.joinedRoomSub) {
      this.joinedRoomSub.unsubscribe();
    }
  }
}
