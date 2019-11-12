import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { User } from '../../models/User.model';
import { AppState } from '../../app.state';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {

  email: string = undefined;
  regisModal: boolean = false
  authModal: boolean = false

  constructor(private store: Store<AppState>) {
    store.select("user").subscribe((x) => {
      if (x.length !== 0) {
        this.email = x[0].email;
      }
    });
  }

  registrationModal() {
    this.regisModal = !this.regisModal;
  }

  authenticationModal() {
    this.authModal = !this.authModal;
  }

  receiveRegistState($event) {
    this.regisModal = $event;
  }

  receiveAuthState($event) {
    this.authModal = $event;
  }


}
