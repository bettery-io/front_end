import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-referals',
  templateUrl: './referals.component.html',
  styleUrls: ['./referals.component.sass']
})
export class ReferalsComponent implements OnDestroy {
  routeSub: Subscription
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.routeSub = this.activeRoute.params
      .subscribe((x) => {
        sessionStorage.setItem("bettery_ref", x.id)
        this.router.navigate(['join']);
      })
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
