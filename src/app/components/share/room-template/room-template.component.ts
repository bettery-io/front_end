import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-room-template',
  templateUrl: './room-template.component.html',
  styleUrls: ['./room-template.component.sass']
})
export class RoomTemplateComponent implements OnInit {
  @Input() data: any;
  @Output() commentIdEmmit = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  colorForRoom(color) {
    if (this.data) {
      return {
        'background': color
      };
    } else {
      return;
    }
  }

  getCommentById(id: any) {
    this.commentIdEmmit.emit(id);
  }
}
