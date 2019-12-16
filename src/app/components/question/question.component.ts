import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Question } from '../../models/Question.model';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router"
import Contract from '../../services/contract';


@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.sass']
})
export class QuestionComponent implements OnInit {
  private spinner: boolean = true;
  private empty: boolean = false;
  private registError: boolean = false;
  private question: Question;
  private startTime: string;
  private endTime: string;
  private access: string;
  private singleAnswer: number;


  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((question) => {
        let data = {
          id: Number(question.id)
        }
        this.postService.post("question/get_by_id", data)
          .subscribe((x: Question) => {
            if (x.id === undefined) {
              this.empty = true
              this.spinner = false
            } else {
              console.log(x);
              this.question = x
              this.startTime = moment(x.startTime).format("MM/DD/YYYY HH:mm:ss");
              this.endTime = moment(x.endTime).format("MM/DD/YYYY HH:mm:ss");
              this.access = x.private ? "Private" : "Public";
              this.spinner = false;
            //  this.info(question.id)
            }
          })

      });
  }

  sendAnswer() {
    this.store.select("user").subscribe((x) => {
      if (x.length === 0) {
        this.registError = true;
      } else {
        this.registError = false;
      }
    });
  }

  async info(id) {
    let contract = new Contract();
    let contr = await contract.initContract()
    let infoData = await contr.methods.getQuestion(id).call();
    this.spinner = false
    console.log(infoData);
  }

}
