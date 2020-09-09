import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../../../../../services/post.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-private-main',
  templateUrl: './private-main.component.html',
  styleUrls: ['./private-main.component.sass']
})
export class PrivateMainComponent implements OnInit, OnDestroy {
  data: any;

  answerForm: FormGroup;
  badRequest: boolean;
  condition: boolean;
  counts: any = 1;
  expert: boolean;
  expertPage: boolean;
  hideBtn: boolean;
  ifTimeValid: boolean;

  routeSub: Subscription;
  id: any;
  allTime: any = {
    day: '',
    hour: '',
    minutes: '',
    seconds: '',
  };

  constructor(private postService: PostService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.answerForm = formBuilder.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = {
        id: Number(params.id)
      };
    });
    this.postService.post('privateEvents/get_by_id', this.id).subscribe((value: object) => {
      this.data = value;
    }, (err) => {
      console.log(err);
      if (err.status === 404) {
        this.badRequest = true;
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  changePage() {
    this.calculateDate();
    const timeNow = Number((Date.now() / 1000).toFixed(0));
    if (this.data.endTime - timeNow > 0) {
      this.expert = true;
      this.condition = true;
    } else {
      this.condition = true;
    }
  }

  prevPage() {
    this.counts = 1;
  }

  nextPage() {
    this.counts = 2;
  }

  onExpertPage() {
    this.expertPage = true;
  }

  onChanged(increased: boolean) {
    console.log(increased);
    if (increased) {
      this.prevPage();

    } else {
      this.hideBtn = true;
      this.expertPage = false;
      this.expert = false;
      this.prevPage();
    }
  }

  calculateDate() {
    const startDate = new Date();
    const endTime = new Date(this.data.endTime * 1000);
    var diffMs = (endTime.getTime() - startDate.getTime());
    this.allTime.day = Math.floor(Math.abs(diffMs / 86400000));
    const hour = Math.floor(Math.abs((diffMs % 86400000) / 3600000));
    const minutes = Math.floor(Math.abs(((diffMs % 86400000) % 3600000) / 60000));
    const second = Math.round(Math.abs((((diffMs % 86400000) % 3600000) % 60000) / 1000));

    this.allTime.hour = Number(hour) > 9 ? hour : '0' + hour;
    this.allTime.minutes = Number(minutes) > 9 ? minutes : '0' + minutes;
    if (second === 60) {
      this.allTime.seconds = '00';
    } else {
      this.allTime.seconds = second > 9 ? second : '0' + second;
    }
    setTimeout(() => {
      this.calculateDate();
    }, 1000);
  }

}
