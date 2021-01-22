import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RegistrationComponent} from '../../registration/registration.component';

@Component({
  selector: 'app-pre-registration-modal',
  templateUrl: './pre-registration-modal.component.html',
  styleUrls: ['./pre-registration-modal.component.sass']
})
export class PreRegistrationModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
  }

  letsRegister() {
    this.modalService.open(RegistrationComponent);
    this.activeModal.dismiss('Cross click');
  }

}
