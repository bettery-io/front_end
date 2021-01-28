import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.sass']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Input() userId: number;

  notifSub: Subscription;
  notifData: [];

  constructor(
    private postService: PostService
  ) { }

  ngOnInit(): void {
    let data = {
      userId: this.userId
    }
    this.notifSub = this.postService.post('notification/get_by_user_id', data).subscribe((x: any) => {
      console.log(x);
      this.notifData = x;
    }, (err) => {
      console.log(err);
    })
  }

  ngOnDestroy() {
    if (this.notifSub) {
      this.notifSub.unsubscribe();
    }
  }

}
