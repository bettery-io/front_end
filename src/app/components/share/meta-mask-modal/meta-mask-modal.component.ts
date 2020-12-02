import {Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-meta-mask-modal',
  templateUrl: './meta-mask-modal.component.html',
  styleUrls: ['./meta-mask-modal.component.sass']
})
export class MetaMaskModalComponent implements OnInit {
  @Input() modal;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
