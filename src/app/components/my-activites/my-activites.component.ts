import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router } from "@angular/router"

@Component({
  selector: 'my-activites',
  templateUrl: './my-activites.component.html',
  styleUrls: ['./my-activites.component.sass']
})
export class MyActivitesComponent implements OnInit {

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
