import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CommentSocketService} from './comment-service/comment-socket.service';
import * as _ from 'lodash';


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
  activated = [
    'active1',
    'active2',
    'active3'
  ];
  timeOutTyping: any;
  isReply = {
    isReply: false,
    commentId: null,
    user: null
  };
  showLength = 10;
  showOnScreen: any;

  comingSoon: boolean;

  constructor(
    private socketService: CommentSocketService
  ) {
  }

  ngOnInit(): void {
    this.initializeSocket();
  }

  initializeSocket(): void {
    if (this.data.id) {
      this.socketService.gettingComments(this.data.id);
    }

    this.socketService.getTyping().subscribe(el => {
      if (el) {
        this.flag = true;
      }
      setTimeout(() => {
        this.flag = false;
      }, 5000);
    });

    this.socketService.newComment().subscribe(comments => {
      if (this.sortComment === 'newest') {
        this.allComments = _.sortBy(comments, (item) => {
          return item.date;
        }).reverse();
        this.showOnScreen = this.allComments.slice(0, this.showLength);
        console.log(this.allComments);
      }

      if (this.sortComment === 'hottest') {
        this.allComments = _.sortBy(comments, (item) => {
          return item.activites;
        }).reverse();
        this.showOnScreen = this.allComments.slice(0, this.showLength);
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
    if (this.isReply.user && !this.newComment.includes('@' + this.isReply.user[1])) {
      this.isReply.isReply = false;
    }

    if (!this.isReply.isReply) {
      if (this.data.id && this.userData?._id && this.newComment && this.newComment.trim().length >= 1) {
        this.socketService.send(this.data.id, this.userData._id, this.newComment);
        console.log('comment send');
      }
      this.newComment = '';
    }

    if (this.isReply.isReply && this.data.id && this.userData?._id && this.newComment &&
      this.newComment.includes('@' + this.isReply.user[1])) {

      const regex = new RegExp('@' + this.isReply.user[1]);
      const comments = this.newComment.replace(regex, '');

      if (comments.trim().length >= 1) {
        this.socketService.newReply(this.data.id, this.userData._id, this.isReply.commentId, comments);
        this.newComment = '';
        console.log('reply send');
      }
    }
    const el = document.getElementById('textarea');
    el.style.cssText = 'height: 45px;';
  }

  sendIcon(text: string, commentId: number) {
    if (this.userData && text && commentId) {
      this.socketService.sendSelectedIcon(text, this.data.id, this.userData._id, commentId);
    }
  }

  letsSortComment(sort): void {
    this.comingSoon = false;
    this.sortComment = sort;
    if (sort === 'hottest') {
      this.allComments = _.sortBy(this.allComments, (item) => {
        return item.activites;
      }).reverse();
      this.showOnScreen = this.allComments.slice(0, this.showLength);
    }
    if (sort === 'newest') {
      this.comingSoon = false;
      this.allComments = _.sortBy(this.allComments, (item) => {
        return item.date;
      }).reverse();
      this.showOnScreen = this.allComments.slice(0, this.showLength);
    }

    if (sort === 'friends') {
      this.comingSoon = true;
    }
  }

  typingEffect() {
    if (this.timeOutTyping) {
      clearTimeout(this.timeOutTyping);
    }
    this.timeOutTyping = setTimeout(() => {
      if (this.data.id) {
        this.socketService.doTyping(this.data.id, 'Someone is typing');
      }
    }, 500);

    this.resizeSendComment();

    setInterval(() => {
      this.forAnimationType();
    }, 700);
  }

  findCCurrentUserReview(arr) {
    if (this.userData) {
      const findUser = _.findIndex(arr, (el) => {
        return el.user.id === this.userData._id;
      });
      return findUser !== -1;
    }
  }

  resizeSendComment() {
    const el = document.getElementById('textarea');

    if (el.scrollTop > 0) {
      el.style.height = el.scrollHeight + 'px';
    }
  }

  animationType(num, el1, el2, el3): void {
    setTimeout(() => {
      this.activated[num] = el1;
    }, 100);
    setTimeout(() => {
      this.activated[num] = el2;
    }, 300);
    setTimeout(() => {
      this.activated[num] = el3;
    }, 500);
  }

  forAnimationType(): void {
    this.animationType(0, 'active1', 'active2', 'active3');
    this.animationType(1, 'active2', 'active3', 'active1');
    this.animationType(2, 'active3', 'active1', 'active2');
  }

  replySend(commentID, user) {
    const name = user.nickName.match(/([a-zа-яё]+)/i);
    this.isReply.commentId = commentID;
    this.isReply.user = name;
    this.newComment = '@' + name[1] + ' ';
    this.isReply.isReply = this.newComment.includes('@' + this.isReply.user[1]);
  }

  showMoreComments() {
    if (this.showLength > this.allComments.length) {
      return;
    }
    this.showLength = this.showLength + 10;
    this.showOnScreen = this.allComments.slice(0, this.showLength);
  }

  additionToAnchorLink(id) {
    const index = _.findIndex(this.allComments, (el) => {
      return el.id === id;
    });
    if (this.showLength < (index + 1)) {
      this.showLength = (index + 1);
      this.showOnScreen = this.allComments.slice(0, this.showLength);
    }
  }

  finishScrollAnimation($event: any, id) {
    const el = document.getElementById(id);
    const styleStart = 'background-color: rgba(68, 68, 68, 0.7); border-radius: 8px; transition: all 200ms;';
    const styleFinish = 'background-color: none ; transition: all 200ms; ';

    if ($event) {
      el.style.cssText = styleStart;
    }
    // if (el) {
    //   setTimeout(() => {
    //     el.style.cssText = styleFinish; // one blink
    //   }, 1000);
    // }

    if (el) {
      setTimeout(() => {
        el.style.cssText = styleFinish;
        setTimeout(() => {
          el.style.cssText = styleStart;   // two blink
          setTimeout(() => {
            el.style.cssText = styleFinish;
          }, 150);
        }, 150);
      }, 300);
    }
  }

}
