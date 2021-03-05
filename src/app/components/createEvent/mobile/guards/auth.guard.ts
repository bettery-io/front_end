import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from "@ngrx/store";
import {AppState} from "../../../../app.state";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  can: boolean;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.store.select('user').subscribe(x => {
      if (x && x?.length != 0) {
        this.can = true;
      } else {
        this.can = false;
      }
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.can) {
      return true;
    } else {
     return this.router.navigateByUrl('/create-event');
    }
  }
}
