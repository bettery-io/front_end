import { Component} from '@angular/core';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent{

  regisModal: boolean = false
  authModal: boolean = false

  registrationModal() {
    this.regisModal = !this.regisModal;
  }

  authenticationModal(){
     this.authModal = !this.authModal;
  }

  receiveRegistState($event) {
    this.regisModal = $event;
  }

  receiveAuthState($event) {
    this.authModal = $event;
  }


}
