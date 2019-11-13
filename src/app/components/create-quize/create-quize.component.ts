import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import {Router} from "@angular/router"


@Component({
  selector: 'create-quize',
  templateUrl: './create-quize.component.html',
  styleUrls: ['./create-quize.component.sass']
})
export class CreateQuizeComponent implements OnInit {


  constructor(
    private store: Store<AppState>,
    private router: Router
    ) {
    this.store.select("user").subscribe((x) => {
      if (x.length === 0) {
        this.router.navigate(['/home'])
      }
    });
  }

  ngOnInit() {
  }

}
