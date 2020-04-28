import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { GetService } from '../../services/get.service';
import { Answer } from '../../models/Answer.model';
import { User } from '../../models/User.model';
import _ from 'lodash';


@Component({
  selector: 'eventFeed',
  templateUrl: './eventFeed.component.html',
  styleUrls: ['./eventFeed.component.sass']
})
export class EventFeedComponent implements OnDestroy {
  private spinner: boolean = true;
  private questions: any;
  myAnswers: Answer[] = [];
  userId: number = null ;
  coinInfo = null;
  userData: any = [];
  storeUserSubscribe;
  storeCoinsSubscrive;
  allData = [];
  parcipiantFilter = true;
  validateFilter = true;
  historyFilter = false;
  fromComponent = "eventFeed"

  constructor(
    private store: Store<AppState>,
    private getService: GetService,
  ) {
    this.storeUserSubscribe = this.store.select("user").subscribe((x: User[]) => {
      if (x.length === 0) {
        this.getData();
      } else {
        this.userId = x[0]._id;
        this.userData = x[0];
        this.getData();
      }
    });
    this.storeCoinsSubscrive = this.store.select("coins").subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
      }
    })
  }

  getMultyIcon(answers, i) {
    let index = answers.indexOf(i);
    return index !== -1 ? true : false
  }

  getData() {
    this.getService.get("question/get_all_private").subscribe((x) => {
      this.myAnswers = [];
      let data = _.orderBy(x, ['endTime'], ['asc']);
      this.allData = data;

      this.questions = _.filter(data, (o) => { return o.finalAnswer === null && !o.reverted })
      this.myAnswers = this.questions.map((data) => {
        return {
          event_id: data.id,
          answer: this.findAnswer(data),
          from: data.from,
          multy: data.multiChoise,
          answered: this.findAnswered(data),
          multyAnswer: this.findMultyAnswer(data)
        }
      });
       console.log(this.myAnswers);
       console.log(this.allData)

      this.spinner = false;
    })
  }

  findMultyAnswer(data) {
    let z = []
    let part = _.filter(data.parcipiantAnswers, { 'userId': this.userId });
    part.forEach((x) => {
      z.push(x.answer)
    })
    if (z.length === 0) {
      let part = _.filter(data.validatorsAnswers, { 'userId': this.userId });
      part.forEach((x) => {
        z.push(x.answer)
      })
      return z;
    } else {
      return z;
    }
  }

  findAnswer(data) {
    let findParticipiant = _.findIndex(data.parcipiantAnswers, { "userId": this.userId })
    if (findParticipiant === -1) {
      let findValidators = _.findIndex(data.validatorsAnswers, { "userId": this.userId })
      return findValidators !== -1 ? data.validatorsAnswers[findValidators].answer : undefined;
    } else {
      return data.parcipiantAnswers[findParticipiant].answer
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
    let timeNow = Number((new Date().getTime() / 1000).toFixed(0))
    if (from === "participant") {
      return _.filter(this.allData, (o) => { return o.endTime >= timeNow }).length
    } else if (from === "validator") {
      let z = this.allData.filter((data) => {
        if(this.userId !== null){
          return data.endTime <= timeNow && data.host !== this.userId;
        }else{
          return data.endTime <= timeNow;
        }
      })
      return z.filter((data) => { return data.finalAnswer === null }).length
    } else if (from === "history") {
      return _.filter(this.allData, (o) => { 
        return o.finalAnswer !== null || o.reverted
      }).length
    }
  }

  filter() {
    setTimeout(() => {
      let timeNow = Number((new Date().getTime() / 1000).toFixed(0))
      let z

      if (this.parcipiantFilter && this.validateFilter && this.historyFilter) {
        z = this.allData;
      } else if (!this.parcipiantFilter && !this.validateFilter && !this.historyFilter) {
        z = []
      } else if (!this.parcipiantFilter && this.validateFilter && this.historyFilter) {
        let x = _.filter(this.allData, (o) => { return o.endTime <= timeNow })
        let y = _.filter(this.allData, (o) => { return o.finalAnswer !== null || o.reverted })
        y.forEach((e) => {
          x.push(e)
        })
        z = _.orderBy(x, ['endTime'], ['asc']);
      } else if (this.parcipiantFilter && !this.validateFilter && this.historyFilter) {
        let x = _.filter(this.allData, (o) => { return o.endTime >= timeNow })
        let y = _.filter(this.allData, (o) => { return o.finalAnswer !== null || o.reverted })

        y.forEach((e) => {
          x.push(e)
        })
        z = _.orderBy(x, ['endTime'], ['asc']);
      } else if (!this.parcipiantFilter && this.validateFilter && !this.historyFilter) {
        z = _.filter(this.allData, (o) => { return o.endTime <= timeNow })
      } else if (this.parcipiantFilter && !this.validateFilter && !this.historyFilter) {
        z = _.filter(this.allData, (o) => { return o.endTime >= timeNow })
      } else if (this.parcipiantFilter && this.validateFilter && !this.historyFilter) {
        z = _.filter(this.allData, (o) => { return o.finalAnswer === null && !o.reverted })
      } else if (!this.parcipiantFilter && !this.validateFilter && this.historyFilter) {
        z = _.filter(this.allData, (o) => { return o.finalAnswer !== null || o.reverted })
      }

      this.myAnswers = z.map((data, i) => {
        return {
          event_id: data.id,
          answer: this.findAnswer(data),
          from: data.from,
          multy: data.multiChoise,
          answered: this.findAnswered(data),
          multyAnswer: this.findMultyAnswer(data)
        }
      })

      this.questions = z;
    }, 100)
  }



  ngOnDestroy() {
    this.storeUserSubscribe.unsubscribe();
    this.storeCoinsSubscrive.unsubscribe();
  }


}
