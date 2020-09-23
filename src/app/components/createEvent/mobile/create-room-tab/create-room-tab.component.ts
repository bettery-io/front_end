import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import GradientJSON from '../../../../../assets/gradients.json';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../../../share/info-modal/info-modal.component'

@Component({
  selector: 'create-room-tab',
  templateUrl: './create-room-tab.component.html',
  styleUrls: ['./create-room-tab.component.sass']
})
export class CreateRoomTabComponent implements OnInit {
  @Input() formData;
  @Output() goBack = new EventEmitter<Object[]>();
  @Output() goNext = new EventEmitter<Object[]>();

  submitted: boolean = false;
  roomForm: FormGroup;
  createRoomForm: FormGroup;
  gradietnNumber: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.createRoomForm = this.formBuilder.group({
      createNewRoom: this.formData.whichRoom
    })
    this.roomForm = this.formBuilder.group({
      roomName: [this.formData.roomName, Validators.required],
      roomColor: [this.formData.roomColor, Validators.required],
      eventType: this.formData.eventType
    })
  }

  get r() { return this.createRoomForm.controls; }
  get f() { return this.roomForm.controls; }


  generateGradient() {
    this.gradietnNumber == Number(Object.keys(GradientJSON).length) - 1 ? this.gradietnNumber = 0 : this.gradietnNumber++;
    this.roomForm.controls.roomColor.setValue(GradientJSON[this.gradietnNumber]);
  }

  // TO DO
  modalAboutExpert() {
    const modalRef = this.modalService.open(InfoModalComponent, { centered: true });
    modalRef.componentInstance.name = "Room is where this and your future events happen. With friends, it's more private fun for better friendship - bet with a pizza or any promise, and let just one friend or yourself to confirm outcome. Ready to invite the whole world? Go with public and anti-thieft social media event when all bets are collected and secured while outcome is voted by many. You can create many rooms.";
    modalRef.componentInstance.boldName = 'Room for Friends or Social Media? ';
    modalRef.componentInstance.link = 'Learn more about roles on Bettery';
  }

  chooseRoom() {
    console.log("TEST 2")
  }

  createRoom() {
    this.submitted = true;
    if (this.roomForm.invalid) {
      return;
    }
    let data = {
      ...this.roomForm.value,
      ...this.createRoomForm.value
    };
    this.goNext.next(data);
  }

  cancel() {
    let data = {
      ...this.roomForm.value,
      ...this.createRoomForm.value
    };
    this.goBack.next(data)
  }

}
