import { Component} from '@angular/core';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent{

  regisModal = false

  registrationModal() {
    this.regisModal = !this.regisModal;
  }

  receiveState($event) {
    this.regisModal = $event;
  }


}
