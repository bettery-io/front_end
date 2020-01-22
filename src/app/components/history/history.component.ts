import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router";
import { PostService } from '../../services/post.service';
import { User } from '../../models/User.model';
import _ from "lodash";
import { faReply, faShare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass']
})
export class HistoryComponent implements OnInit {
  historyData: any = [];
  faReply = faReply
  faShare = faShare


  constructor(
    private store: Store<AppState>,
    private router: Router,
    private http: PostService
  ) {
    this.store.select("user").subscribe((x) => {
      if (x.length === 0) {
        this.router.navigate(['~ki339203/home'])
      } else {
        this.getUserData(x[0].wallet)
      }
    });
  }

  getUserData(wallet) {
    let data = {
      wallet: wallet
    }
    this.http.post("user/validate", data)
      .subscribe(
        (x: User) => {
          if (x.wallet !== undefined) {
            this.historyData = _.orderBy(x.historyTransaction, ['date'], ['desc']);
            console.log(this.historyData)
          } 
        },
        (err) => {
          console.log("validate user error")
          console.log(err);
        })
  }

  ngOnInit() {
  }

}
