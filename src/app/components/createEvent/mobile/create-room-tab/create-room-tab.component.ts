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
    modalRef.componentInstance.name = "Room is where events happen. Many events can happen at once in the same room.";
    modalRef.componentInstance.name1 = "Room for Friends is private and Players can bet with anything like pizza or promise of a favor - it doesn’t have to be money! The result only needs to be confirmed by one person, which can be the Host or another friend.";
    modalRef.componentInstance.name2 = "Room for Social Media is for betting with online friends and communities using money. With a much bigger participant pool, the result will be confirmed by several people.";
    modalRef.componentInstance.boldName = 'Friends vs Social Media';
    modalRef.componentInstance.link = 'Learn more about how Bettery works';
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
