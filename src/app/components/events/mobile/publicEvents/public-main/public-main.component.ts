import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../../../services/post.service';

@Component({
  selector: 'app-public-main',
  templateUrl: './public-main.component.html',
  styleUrls: ['./public-main.component.sass']
})
export class PublicMainComponent implements OnInit {
  eventId: number;
  eventData;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe((question) => {
        let data = {
          id: Number(question.id)
        }
        this.eventId = Number(question.id);
        this.getDataFromServer(data);
      })
  }

  getDataFromServer(data) {
    this.postService.post("publicEvents/get_by_id", data)
      .subscribe((x: any) => {
        console.log(x);
        this.eventData = x;
      }, (err) => {
        console.log(err)
      })
  }

}
