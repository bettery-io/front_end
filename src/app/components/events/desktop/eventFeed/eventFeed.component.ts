import {Component, HostListener, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import {Answer} from '../../../../models/Answer.model';
import {User} from '../../../../models/User.model';
import _ from 'lodash';
import {PostService} from '../../../../services/post.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'eventFeed',
  templateUrl: './eventFeed.component.html',
  styleUrls: ['./eventFeed.component.sass']
})
export class EventFeedComponent implements OnDestroy {
  public spinner: boolean = true;
  spinnerForComment: boolean;
  myAnswers: Answer[] = [];
  userId: number = null;
  coinInfo = null;
  userData: any;
  storeUserSubscribe: Subscription;
  storeCoinsSubscrive: Subscription;
  postSubsctibe: Subscription;
  parcipiantFilter = true;
  validateFilter = true;
  historyFilter = false;
  fromComponent = 'eventFeed';
  commentList;
  newCommentList;

  pureData: any = [];
  scrollDistanceFrom = 0;
  scrollDistanceTo = 5;
  newQuestions = [];

  currentComment = 0;
  scrollTop = 0;
  searchWord = '';
  commentResetFlag: boolean;

  constructor(
    private store: Store<AppState>,
    private postService: PostService,
  ) {
    this.storeUserSubscribe = this.store.select('user').subscribe((x: User[]) => {
      if (x.length === 0) {
        this.userId = null;
        this.getData(this.scrollDistanceFrom, this.scrollDistanceTo, this.searchWord);
      } else {
        this.userId = x[0]._id;
        this.userData = x[0];
        this.getData(this.scrollDistanceFrom, this.scrollDistanceTo, this.searchWord);
      }
    });
    this.storeCoinsSubscrive = this.store.select('coins').subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
      }
    });
  }

  getData(from, to, search) {
    let param;
    if (search.length >= 3) {
      param = search;
    } else {
      param = '';
    }

    this.postSubsctibe = this.postService.post('publicEvents/get_all', {from, to, search: param}).subscribe((x: any) => {
      if (this.pureData.length == 0) {
        this.commentList = x.events[this.currentComment];
      }
      this.pureData = x;

      if (from == 0) {
        this.newQuestions = this.pureData.events;
        this.myAnswers = this.getAnswers(this.newQuestions);
      } else {
        this.pureData.events.forEach(el => this.newQuestions.push(el));
        this.myAnswers = this.getAnswers(this.newQuestions);
      }
      if (this.commentResetFlag && this.newQuestions.length > 0) {
        this.commentById(this.newQuestions[0].id);
        this.commentResetFlag = false;
      }
      this.spinner = false;
    }, (err) => {
      console.log(err);
    });
  }

  getAnswers(x) {
    return x.map((data) => {
      return {
        event_id: data.id,
        answer: this.findAnswer(data).answer,
        from: this.findAnswer(data).from,
        answered: this.findAnswer(data).answer != undefined ? true : false,
        amount: 0,
        betAmount: this.findAnswer(data).amount
      };
    });
  }

  findAnswer(data) {
    let findParticipiant = _.findIndex(data.parcipiantAnswers, {'userId': this.userId});
    if (findParticipiant === -1) {
      let findValidators = _.findIndex(data.validatorsAnswers, {'userId': this.userId});
      return {
        answer: findValidators != -1 ? data.validatorsAnswers[findValidators].answer : undefined,
        from: 'validator',
        amount: 0
      };
    } else {
      return {
        answer: data.parcipiantAnswers[findParticipiant].answer,
        from: 'participant',
        amount: data.parcipiantAnswers[findParticipiant].amount
      };
    }
  }

  commentById($event) {
    if ($event) {
      const list = _.find(this.newQuestions, (o) => {
        return o.id == $event;
      });
      this.commentList = list;
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

  commentTopPosition() {
    if (document.documentElement.scrollTop < 300) {
      return {'top': (300 - this.scrollTop) + 'px'};
    } else {
      return {'top': 0};
    }
  }

  @HostListener('window:scroll', ['$event'])
  listenScroll() {
    this.scrollTop = document.documentElement.scrollTop;
  }

  onScrollQuizTemplate() {
    if (this.scrollDistanceTo < this.pureData?.amount) {
      this.scrollDistanceFrom = this.scrollDistanceFrom + 5;
      this.scrollDistanceTo = this.scrollDistanceTo + 5;

      this.getData(this.scrollDistanceFrom, this.scrollDistanceTo, this.searchWord);
    } else if (this.pureData?.amount / 5 !== 0 && (this.scrollDistanceTo + this.pureData?.amount % 5 <= this.pureData?.amount)) {
      this.scrollDistanceFrom = this.scrollDistanceTo + this.pureData?.amount % 5;
      this.scrollDistanceTo = this.scrollDistanceTo + this.pureData?.amount % 5;

      this.getData(this.scrollDistanceFrom, this.scrollDistanceTo + this.pureData?.amount % 5, this.searchWord);
    } else {
    }
  }

  ngOnDestroy() {
    if (this.storeUserSubscribe) {
      this.storeUserSubscribe.unsubscribe();
    }
    if (this.storeCoinsSubscrive) {
      this.storeCoinsSubscrive.unsubscribe();
    }
    if (this.postSubsctibe) {
      this.postSubsctibe.unsubscribe();
    }
  }

  letsFindNewQuestion($event: string) {
    this.searchWord = $event;
    if (this.searchWord.length >= 3) {
      this.getData(0, 5, this.searchWord);
      this.commentResetFlag = true;

    } else {
      this.getData(0, 5, '');
      this.commentResetFlag = true;
    }
  }

  commentsSpinner($event: boolean) {
    this.spinnerForComment = $event;
  }
}
