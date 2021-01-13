import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.sass']
})
export class RoomDetailsComponent implements OnInit, OnDestroy {
  routeSub: Subscription;
  infoSub: Subscription;
  eventSub: Subscription;
  roomDetails: any;
  roomEvents: any;
  id: any;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

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
      this.getRoomEvent();
    });
  }

  getRoomEvent() {
    let data = {
      id: Number(this.id),
      from: 0,
      to: 10
    }

    this.eventSub = this.postService.post('room/get_event_by_room_id', data).subscribe((value: any) => {
      this.roomEvents = value;
    }, (err) => {
      console.log(err);
    });
  }

  infoRoomColor(value) {
    return { "background": value }
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
  }

}
