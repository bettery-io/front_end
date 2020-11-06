import {Component, Input, OnInit} from '@angular/core';
import {ChatSocketService} from './chat-service/chat-socket.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit {
  @Input() theme: any;
  @Input() data: any;
  @Input() userData: any;
  newComment = '';
  sortComment = 'newest';
  allComments: any;
  constructor(private socketService: ChatSocketService) {
  }

  ngOnInit(): void {
    this.initializeSocket();
  }

  initializeSocket(): void {
    this.socketService.initSocket();

    if (this.data.id) {
      this.socketService.gettingComments(this.data.id);
    }
    this.socketService.newComment().subscribe(comments => {
      if (comments) {
        const sort = _.sortBy(comments, (item) => {
          return item.date;
        });
        this.allComments = sort.reverse();
        console.log(this.allComments);
      }
    });
  }

  checkTheme() {
    if (this.theme === 'white') {
      return true;
    }
    if (this.theme === 'dark') {
      return false;
    }
  }

  sendComment() {
    if (this.data.id && this.userData?._id && this.newComment && this.newComment.length > 1) {
      this.socketService.send(this.data.id, this.userData._id, this.newComment);
    }
    this.newComment = '';
  }

  sendIcon(text: string, commentId: number) {
    if (text && commentId) {
      this.socketService.sendSelectedIcon(text, this.data.id, this.userData._id, commentId);
    }
  }

  letsSortComment(sort): void {
    this.sortComment = sort;
  }
}
