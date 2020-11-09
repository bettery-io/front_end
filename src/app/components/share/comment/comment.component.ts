import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CommentSocketService} from './comment-service/comment-socket.service';
import * as _ from 'lodash';
import {NgxTypedJsComponent} from 'ngx-typed-js';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.sass']
})
export class CommentComponent implements OnInit {
  @Input() theme: any;
  @Input() data: any;
  @Input() userData: any;
  @Input() withoutSend: boolean;
  newComment = '';
  sortComment = 'newest';
  allComments: any;
  someoneTyping = 'Someone is typing';
  flag: boolean;

  @ViewChild(NgxTypedJsComponent, {static: true}) typed: NgxTypedJsComponent;

  constructor(
    private socketService: CommentSocketService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.initializeSocket();
  }

  initializeSocket(): void {
    this.socketService.initSocket();

    if (this.data.id) {
      this.socketService.gettingComments(this.data.id);
    }

    // this.socketService.getTyping().subscribe(el => {
    //   if (el) {
    //     this.flag = true;
    //   }
    //   setTimeout(() => {
    //     this.flag = false;
    //   }, 3000);
    // });

    setTimeout(() => {
      console.log(this.data);
      console.log(this.userData);
    }, 3000);


    this.socketService.newComment().subscribe(comments => {
      if (this.sortComment === 'newest') {
        this.allComments = _.sortBy(comments, (item) => {
          return item.date;
        }).reverse();
        console.log(this.allComments);
      }

      if (this.sortComment === 'hottest') {
        this.allComments = _.sortBy(comments, (item) => {
          return item.activites;
        }).reverse();
        console.log(this.allComments);
      }

      if (this.sortComment === 'friends') {
        return;
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

  letsSortComment(sort, soon): void {
    this.sortComment = sort;
    if (sort === 'hottest') {
      this.allComments = _.sortBy(this.allComments, (item) => {
        return item.activites;
      }).reverse();
    }
    if (sort === 'newest') {
      this.allComments = _.sortBy(this.allComments, (item) => {
        return item.date;
      }).reverse();
    }

    if (sort === 'friends') {
      this.modalService.open(soon, {ariaLabelledBy: 'modal-basic-title', centered: true});
    }
  }

  typingEffect() {
  //   let timeout;
  //   clearTimeout(timeout);
  //   timeout = setTimeout(() => {
  //     if (this.data.id) {
  //       this.socketService.doTyping(this.data.id, 'Someone is typing');
  //       console.log('id', this.data.id);
  //     }
  //   }, 500);
  }
}
