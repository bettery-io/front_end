import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent {
  faTimes = faTimes;
  regisModal = false


  registrationModal(){
    this.regisModal = !this.regisModal;
  }

}
