import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router"
import { PostService } from '../../services/post.service';
import * as moment from 'moment';


@Component({
  selector: 'my-activites',
  templateUrl: './my-activites.component.html',
  styleUrls: ['./my-activites.component.sass']
})
export class MyActivitesComponent implements OnInit {
  userWallet: string = undefined;
  allData: any = [];
  myActivites: any = [];
  spinner: boolean = true;
  hostFilet: boolean = true;
  parcipiantFilter: boolean = true;
  validateFilter: boolean = true; 

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
      let data = {
        wallet: this.userWallet
      }
      this.postService.post("my_activites", data)
        .subscribe((x) => {
          console.log(x);
          this.myActivites = x;
          this.allData = x;
          this.spinner = false;
        }, (err) => {
          console.log(err);
        })
    }
  }

  getParticipationTime(data){
    let date = new Date(data.startTime)
    return moment(date, "YYYYMMDD").fromNow();
  }

  getValidationTime(data){
    let date = new Date(data.endTime)
    return moment(date, "YYYYMMDD").fromNow();
  }

  getEndValidation(data){
    let date = new Date(data.endTime)
    date.setDate(date.getDate() + 7);
    return moment(date, "YYYYMMDD").fromNow();
  }

  filter(){
    setTimeout(()=>{
      let data = this.allData
      if(!this.hostFilet){
        data = data.filter((x)=> x.from !== "Host");
      }
      if(!this.parcipiantFilter){
        data = data.filter((x)=> x.from !== "Participant");
      }
      if(!this.validateFilter){
        data = data.filter((x)=> x.from !== "Validator");
      }
      this.myActivites = data
    },100)
  }

  getActiveQuantity(from){
    let data = this.allData.filter((x)=> x.from === from);
    return data.length
  }

}
