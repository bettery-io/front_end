import { Component, OnInit, Input } from '@angular/core';
import { GetService } from '../../../../services/get.service';
import { PostService } from '../../../../services/post.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import maticInit from '../../../../contract/maticInit.js';
import Contract from '../../../../contract/contract';

@Component({
  selector: 'private-event-modile',
  templateUrl: './private-event.component.html',
  styleUrls: ['./private-event.component.sass']
})
export class PrivateEventComponent implements OnInit {
  @Input() formData;
  spinner: boolean = false;
  host;



  constructor(
    private getSevice: GetService,
    private postService: PostService,
    private store: Store<AppState>,
  ) {
    this.store.select("user").subscribe((x) => {
      if (x.length != 0) {
        this.host = x;
      }
    });
  }

  ngOnInit(): void {

  }


  generateID() {
    return this.getSevice.get("privateEvents/createId")
  }


  getTimeStamp(strDate) {
    return Number((new Date(strDate).getTime() / 1000).toFixed(0));
  }

  // onSubmit() {

  //   let id = this.generateID()
  //   id.subscribe((x: any) => {
  //     this.sendToContract(x._id);
  //   }, (err) => {
  //     console.log(err)
  //     console.log("error from generate id")
  //   })

  // }

  // async sendToContract(id) {
  //   this.spinner = true;
  //   let matic = new maticInit(this.host[0].verifier);
  //   let userWallet = await matic.getUserAccount()
  //   let startTime = this.getStartTime();
  //   let endTime = this.getEndTime();
  //   let winner = this.questionForm.value.winner;
  //   let loser = this.questionForm.value.loser;
  //   let questionQuantity = this.answesQuantity;
  //   // TO DO
  //   let correctAnswerSetter = userWallet

  //   try {
  //     let contract = new Contract()
  //     let sendToContract = await contract.createPrivateEvent(id, startTime, endTime, winner, loser, questionQuantity, correctAnswerSetter, userWallet, this.host[0].verifier);
  //     if (sendToContract.transactionHash !== undefined) {
  //       this.setToDb(id, sendToContract.transactionHash);
  //     }

  //   } catch (err) {
  //     console.log(err);
  //     this.deleteEvent(id);
  //   }
  // }

  // deleteEvent(id) {
  //   let data = {
  //     id: id
  //   }
  //   this.postService.post("delete_event_id", data)
  //     .subscribe(() => {
  //       this.spinner = false;
  //     },
  //       (err) => {
  //         console.log("from delete wallet")
  //         console.log(err)
  //       })
  // }

  // setToDb(id, transactionHash) {

  //   let eventData = {
  //     _id: id,
  //     host: this.host[0]._id,
  //     status: "deployed",
  //     answers: this.questionForm.value.answers.map((x) => {
  //       return x.name
  //     }),
  //     question: this.questionForm.value.question,
  //     startTime: this.getStartTime(),
  //     endTime: this.getEndTime(),
  //     transactionHash: transactionHash,
  //     winner: this.questionForm.value.winner,
  //     loser: this.questionForm.value.loser
  //   }

  //   this.postService.post("privateEvents/createEvent", eventData)
  //     .subscribe(
  //       () => {
  //         this.spinner = false;
  //       },
  //       (err) => {
  //         console.log("set qestion error");
  //         console.log(err);
  //       })
  // }

}
