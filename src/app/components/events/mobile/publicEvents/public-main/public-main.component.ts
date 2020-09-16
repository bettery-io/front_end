import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../../../services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-public-main',
  templateUrl: './public-main.component.html',
  styleUrls: ['./public-main.component.sass']
})
export class PublicMainComponent implements OnInit, OnDestroy {
  eventId: number;
  eventData;
  errorPage: boolean = false;
  routeSub: Subscription
  postSub: Subscription
  // TODO
  eventFinish: boolean = false;

  spinnerLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params
      .subscribe((question) => {
        let data = {
          id: Number(question.id)
        }
        this.eventId = Number(question.id);
        this.getDataFromServer(data);
      })
  }

  getDataFromServer(data) {
    this.spinnerLoading = true;
    this.postSub = this.postService.post("publicEvents/get_by_id", data)
      .subscribe((x: any) => {
        console.log(x);
        this.eventData = x;
        this.errorPage = false;
        this.spinnerLoading = false;
      }, (err) => {
        console.log(err)
        this.errorPage = true;
        this.spinnerLoading = false;
      })
  }

  interacDone(data) {
    let x = {
      id: Number(data)
    }
    this.getDataFromServer(x);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.postSub.unsubscribe();
  }

}
