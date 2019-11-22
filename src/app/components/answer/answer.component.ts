import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router";
import { GetService} from '../../services/get.service';

@Component({
  selector: 'answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.sass']
})
export class AnswerComponent {
  private spinner: boolean = true;
  private questionas: any;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private getService: GetService
  ) {
    this.store.select("user").subscribe((x) => {
      if (x.length === 0) {
        this.router.navigate(['~ki339203/home'])
      }else{
        this.getData();
      }
    });
  }

  getData(){
     this.getService.get("question/get_all_private").subscribe((x)=>{
       this.spinner = false;
       this.questionas = x;
     })
  }

}
