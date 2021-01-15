import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { Answer } from '../../../../models/Answer.model';
import { User } from '../../../../models/User.model';
import _ from 'lodash';
import { PostService } from '../../../../services/post.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'eventFeed',
  templateUrl: './eventFeed.component.html',
  styleUrls: ['./eventFeed.component.sass']
})
export class EventFeedComponent implements OnDestroy {
  public spinner: boolean = true;
  public questions: any;
  myAnswers: Answer[] = [];
  userId: number = null;
  coinInfo = null;
  userData: any = [];
  storeUserSubscribe: Subscription;
  storeCoinsSubscrive: Subscription;
  allData = [];
  parcipiantFilter = true;
  validateFilter = true;
  historyFilter = false;
  fromComponent = 'eventFeed';
  commentList;
  newCommentList;
  test = false;
  pureData: any;
  scrollDistanceFrom = 0;
  scrollDistanceTo = 5;
  newQuestions = [];

  currentComment = 0

  constructor(
    private store: Store<AppState>,
    private postService: PostService,
  ) {
    this.storeUserSubscribe = this.store.select('user').subscribe((x: User[]) => {
      if (x.length === 0) {
        this.userId = null;
        this.getData(this.scrollDistanceFrom, this.scrollDistanceTo);
      } else {
        this.userId = x[0]._id;
        this.userData = x[0];
        this.getData(this.scrollDistanceFrom, this.scrollDistanceTo);
        console.log(this.userData, 'ecent feed');
      }
    });
    this.storeCoinsSubscrive = this.store.select('coins').subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
      }
    });
  }

  getMultyIcon(answers, i) {
    let index = answers.indexOf(i);
    return index !== -1 ? true : false;
  }

  getData(from, to) {
    this.postService.post('publicEvents/get_all', {from, to}).subscribe((x) => {
      this.myAnswers = [];
      this.pureData = x;
      let data = _.orderBy(this.pureData.events, ['endTime'], ['asc']);
      this.allData = data;
      console.log(this.allData, 'this all data');
      console.log(this.commentList);

      // this.questions = _.filter(data, (o) => {
      //   return o.finalAnswer === null && !o.reverted;
      // });
      this.questions = data;
      // this.myAnswers = this.questions.map((data) => {
      //   return {
      //     event_id: data.id,
      //     answer: this.findAnswer(data),
      //     from: data.from,
      //     multy: data.multiChoise,
      //     answered: this.findAnswered(data),
      //     multyAnswer: this.findMultyAnswer(data)
      //   };
      // });
      console.log(this.myAnswers);
      console.log(this.allData);
      this.spinner = false;

      if (this.newQuestions.length === 0) {
        this.newQuestions = this.questions;
        this.commentList = this.newQuestions[this.currentComment];
      } else {
        this.questions.forEach(el => this.newQuestions.push(el));
        this.commentList = this.newQuestions[this.currentComment];
      }
      console.log(this.newQuestions);
    });
  }

  findMultyAnswer(data) {
    let z = [];
    let part = _.filter(data.parcipiantAnswers, {'userId': this.userId});
    part.forEach((x) => {
      z.push(x.answer);
    });
    if (z.length === 0) {
      let part = _.filter(data.validatorsAnswers, {'userId': this.userId});
      part.forEach((x) => {
        z.push(x.answer);
      });
      return z;
    } else {
      return z;
    }
  }

  findAnswer(data) {
    let findParticipiant = _.findIndex(data.parcipiantAnswers, {'userId': this.userId});
    if (findParticipiant === -1) {
      let findValidators = _.findIndex(data.validatorsAnswers, {'userId': this.userId});
      return findValidators !== -1 ? data.validatorsAnswers[findValidators].answer : undefined;
    } else {
      return data.parcipiantAnswers[findParticipiant].answer;
    }
  }

  findAnswered(data) {
    if (data.multiChoise) {
      return this.findMultyAnswer(data).length !== 0 ? true : false;
    } else {
      return this.findAnswer(data) !== undefined ? true : false;
    }
  }


  getActiveQuantity(from) {
    let timeNow = Number((new Date().getTime() / 1000).toFixed(0));
    if (from === 'participant') {
      return _.filter(this.allData, (o) => {
        return o.endTime >= timeNow;
      }).length;
    } else if (from === 'validator') {
      let z = this.allData.filter((data) => {
        if (this.userId !== null) {
          return data.endTime <= timeNow && data.host !== this.userId;
        } else {
          return data.endTime <= timeNow;
        }
      });
      return z.filter((data) => {
        return data.finalAnswer === null;
      }).length;
    } else if (from === 'history') {
      return _.filter(this.allData, (o) => {
        return o.finalAnswer !== null || o.reverted;
      }).length;
    }
  }


  ngOnDestroy() {
    if (this.storeUserSubscribe) {
      this.storeUserSubscribe.unsubscribe();
    }
    if (this.storeCoinsSubscrive) {
      this.storeCoinsSubscrive.unsubscribe();
    }
  }


  commentById($event) {
    console.log($event);
    if ($event) {
      this.newCommentList = _.find(this.allData, (o) => {
        return o.id = $event;
      });
      if (this.newCommentList) {
        this.commentList = this.newCommentList;
      }
    }
  }

  onScrollQuizTemplate() {
    if (this.scrollDistanceTo < this.pureData?.amount) {
      this.scrollDistanceFrom = this.scrollDistanceFrom + 5;
      this.scrollDistanceTo = this.scrollDistanceTo + 5;

      this.getData(this.scrollDistanceFrom, this.scrollDistanceTo);
    } else if (this.pureData?.amount / 5 !== 0 && (this.scrollDistanceTo + this.pureData?.amount % 5 <= this.pureData?.amount)) {
      this.scrollDistanceFrom = this.scrollDistanceTo + this.pureData?.amount % 5;
      this.scrollDistanceTo = this.scrollDistanceTo + this.pureData?.amount % 5;

      this.getData(this.scrollDistanceFrom, this.scrollDistanceTo + this.pureData?.amount % 5);
      return;
    } else {
      return;
    }
  }

  colorForRoom(color) {
    if (this.newQuestions) {
      return {
        'background': color
      };
    } else {
      return;
    }
  }
}
