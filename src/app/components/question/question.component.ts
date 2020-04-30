import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import Contract from '../../contract/contract';
import { Answer } from '../../models/Answer.model';
import { User } from '../../models/User.model';
import { Question } from '../../models/Question.model';
import _ from 'lodash';
import Web3 from 'web3';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.sass']
})
export class QuestionComponent implements OnInit, OnDestroy {
  private spinner: boolean = true;
  private empty: boolean = false;
  private registError: boolean = false;
  private question: any;
  myAnswers: Answer;
  userId: any = undefined;
  infoData: any = undefined;
  coinInfo: any;
  userData: any = [];
  CoinsSubscribe;
  RouterSubscribe;
  UserSubscribe;
  historyAction: any = []
  fromComponent = "question";
  questionId: number;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private store: Store<AppState>,
  ) {
    this.CoinsSubscribe = this.store.select("coins").subscribe((x) => {
      if (x.length !== 0) {
        this.coinInfo = x[0];
      }
    })
  }

  ngOnInit() {
    this.RouterSubscribe = this.route.params
      .subscribe((question) => {
        let data = {
          id: Number(question.id)
        }
        this.questionId = Number(question.id);

        this.UserSubscribe = this.store.select("user").subscribe((x: User[]) => {
          if (x.length !== 0) {
            this.userId = x[0]._id
            this.userData = x[0]
            this.getDatafromDb(data);
            this.getHistoryById(data)
          } else {
            this.getDatafromDb(data);
            this.getHistoryById(data);
          }
        });
      });
  }

  getQuizeId() {

    let data = {
      id: Number(this.questionId)
    }
    this.getDatafromDb(data);
    this.getHistoryById(data)
  }


  getDatafromDb(data) {
    this.postService.post("question/get_by_id", data)
      .subscribe((x: Question) => {
        console.log(x)
        if (x.id === undefined) {
          this.empty = true
          this.spinner = false
        } else {
          this.question = x
          let z = {
            event_id: this.question.id,
            answer: this.findAnswer(this.question),
            from: this.question.from,
            multy: this.question.multiChoise,
            answered: this.findAnswered(this.question),
            multyAnswer: this.findMultyAnswer(this.question)
          }
          this.myAnswers = z;
          this.spinner = false;
          if(this.question.currencyType !== "demo"){
            setTimeout(() => {
              this.info(this.question.id)
            }, 3000)
          }
        }
      })
  }

  getHistoryById(id) {
    this.postService.post("history_quize/get_by_id", id)
      .subscribe((x: any) => {
        this.historyAction = x
      }, (err) => {
        console.log(err)
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


  async info(id) {
    let contract = new Contract();
    let contr = await contract.initContract()
    this.infoData = await contr.methods.getQuestion(id).call();
    this.spinner = false
  }

  weiConvert(data) {
    let web3 = new Web3();
    let number = web3.utils.fromWei(String(data), 'ether')
    return Number(number).toFixed(4);
  }

  ngOnDestroy() {
    this.CoinsSubscribe.unsubscribe();
    this.RouterSubscribe.unsubscribe();
    this.UserSubscribe.unsubscribe();
  }

}
