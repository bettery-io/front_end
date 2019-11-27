import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router"
import { PostService } from '../../services/post.service';
import * as moment from 'moment';
import { Answer } from '../../models/Answer.model';
import _ from 'lodash';
import { faCheck } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'my-activites',
  templateUrl: './my-activites.component.html',
  styleUrls: ['./my-activites.component.sass']
})
export class MyActivitesComponent implements OnInit {
  faCheck = faCheck;
  userWallet: string = undefined;
  allData: any = [];
  myActivites: any = [];
  spinner: boolean = true;
  hostFilet: boolean = true;
  parcipiantFilter: boolean = true;
  validateFilter: boolean = true;
  myAnswers: Answer[] = [];
  idError: number = 0;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private postService: PostService
  ) {
    this.store.select("user").subscribe((x) => {
      if (x.length === 0) {
        this.router.navigate(['~ki339203/home'])
      } else {
        this.userWallet = x[0].wallet
      }
    });
  }

  ngOnInit() {
    if (this.userWallet != undefined) {
      this.getDataFromDb();
    }

  }

  getDataFromDb() {
    let data = {
      wallet: this.userWallet
    }
    this.postService.post("my_activites", data)
      .subscribe((x) => {
        this.myActivites = x;
        this.allData = x;
        this.allData.forEach((data, i) => {
          let z = {
            event_id: data.id,
            answer: this.findAnswer(data),
            from: data.from,
            multy: data.multiChose,
            answered: this.findAnswered(data),
            multyAnswer: this.findMultyAnswer(data)
          }

          this.myAnswers.push(z);
        });
        this.spinner = false;
      }, (err) => {
        console.log(err);
      })
  }

  findMultyAnswer(data) {
    let z = []
    let search = _.filter(data.parcipiantAnswers, { 'wallet': this.userWallet });
    search.forEach((x) => {
      z.push(x.answer)
    })
    return z
  }

  findAnswer(data) {
    let findParticipiant = _.findIndex(data.parcipiantAnswers, { "wallet": this.userWallet })
    return findParticipiant !== -1 ? data.parcipiantAnswers[findParticipiant].answer : undefined;

  }

  findAnswered(data) {
    if (data.multiChose) {
      return this.findMultyAnswer(data).length !== 0 ? true : false;
    } else {
      return this.findAnswer(data) !== undefined ? true : false;
    }
  }

  getParticipationTime(data) {
    let date = new Date(data.startTime)
    return moment(date, "YYYYMMDD").fromNow();
  }

  getValidationTime(data) {
    let date = new Date(data.endTime)
    return moment(date, "YYYYMMDD").fromNow();
  }

  getEndValidation(data) {
    let date = new Date(data.endTime)
    date.setDate(date.getDate() + 7);
    return moment(date, "YYYYMMDD").fromNow();
  }

  filter() {
    setTimeout(() => {
      let data = this.allData
      if (!this.hostFilet) {
        data = data.filter((x) => x.from !== "Host");
      }
      if (!this.parcipiantFilter) {
        data = data.filter((x) => x.from !== "Participant");
      }
      if (!this.validateFilter) {
        data = data.filter((x) => x.from !== "Validator");
      }
      this.myActivites = data;
    }, 100)
  }

  getActiveQuantity(from) {
    let data = this.allData.filter((x) => x.from === from);
    return data.length
  }

  makeAnswer(data, i) {
    let index = _.findIndex(this.myAnswers, { 'event_id': data.id, 'from': data.from });
    this.myAnswers[index].answer = i;
    this.idError = undefined;
  }

  getParticipantsPercentage(answerIndex, questionIndex) {
    if (this.allData[questionIndex].parcipiantAnswers !== undefined) {
      let quantity = this.allData[questionIndex].parcipiantAnswers.filter((x) => x.answer === answerIndex);
      return quantity.length;
    } else {
      return 0
    }


  }

  makeMultyAnswer(data, i, event) {
    this.idError = undefined;
    if (event.path[0].checked) {
      let findAnswer = _.findIndex(this.myAnswers, { 'event_id': data.id, 'from': data.from });
      this.myAnswers[findAnswer].multyAnswer.push(i);
    } else {
      let findAnswer = _.findIndex(this.myAnswers, { 'event_id': data.id, 'from': data.from });
      let index = this.myAnswers[findAnswer].multyAnswer.indexOf(i);
      if (index !== -1) {
        this.myAnswers[findAnswer].multyAnswer.splice(index, 1);
      }
    }
  }

  getMultyIcon(answers, i) {
    let index = answers.indexOf(i);
    return index !== -1 ? true : false
  }

  setAnswer(dataAnswer) {
    let answer = _.find(this.myAnswers, { 'event_id': dataAnswer.id, 'from': dataAnswer.from });
    if (answer.multy) {
      if (answer.multyAnswer.length === 0) {
        this.idError = dataAnswer.id
      } else {
        this.setToDB(answer, dataAnswer)
      }
    } else {
      if (answer.answer === undefined) {
        this.idError = dataAnswer.id
      } else {
        this.setToDB(answer, dataAnswer)
      }
    }
  }


  setToDB(answer, dataAnswer) {
    let data = {
      multy: answer.multy,
      event_id: answer.event_id,
      date: new Date(),
      answer: answer.answer,
      multyAnswer: answer.multyAnswer,
      transactionHash: "test",
      wallet: this.userWallet,
      from: "participant",
      answerQuantity: dataAnswer.answerQuantity + 1
    }
    console.log(data);
    this.postService.post("answer", data).subscribe(() => {
      let index = _.findIndex(this.myAnswers, { 'event_id': dataAnswer.id, 'from': dataAnswer.from });
      this.myAnswers[index].answered = true;

      this.getDataFromDb();

    },
      (err) => {
        console.log(err)
      })
  }

}
