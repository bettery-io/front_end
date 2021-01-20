import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommentSocketService } from './comment-service/comment-socket.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import web3Obj from '../../../helpers/torus';
import * as UserActions from '../../../actions/user.actions';
import { PostService } from '../../../services/post.service';
import { Store } from '@ngrx/store';

import { CommentModel } from './model/сomment.model';
import { User } from '../../../models/User.model';

import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PageScrollService } from 'ngx-page-scroll-core';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.sass'],
})

export class CommentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() theme: string;
  @Input('id') id: any;
  @Input() userData: User;
  @Input() mobile: boolean;
  @Input() showAuthButton = false;
  newCommentSub: Subscription;
  getTypingSub: Subscription;
  postSub: Subscription;
  eventCommentSub: Subscription;
  newComment = '';
  sortComment = 'newest';
  allComments: CommentModel[];
  someoneTyping = 'Someone is typing';
  typingSpynner: boolean;
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
  showLength: number;
  showOnScreen: CommentModel[];

  comingSoon: boolean;
  spinnerLoading: boolean;
  @ViewChild('container')
  private container: ElementRef;

  constructor(
    private socketService: CommentSocketService,
    private postService: PostService,
    private store: Store<any>,
    private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.showLength = this.allComments?.length < 10 ? this.allComments?.length : 10;
  }

  ngOnInit(): void {
    this.initializeSocket(this.id);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.id && changes.id.previousValue !== undefined) {
      const id = changes['id'];
      if (id.currentValue !== id.previousValue) {
        this.initializeSocket(id.currentValue);
      }
    }
  }

  initializeSocket(id): void {
    if (id) {
      this.socketService.gettingComments(id);
    } else {
      console.error('data error');
    }

    this.getTypingSub = this.socketService.getTyping().subscribe(el => {
      if (el) {
        if (this.timeOutTyping) {
          clearTimeout(this.timeOutTyping);
        }
        this.typingSpynner = true;
      }
      this.timeOutTyping = setTimeout(() => {
        this.typingSpynner = false;
      }, 3000);
    });

    this.newCommentSub = this.socketService.newComment().subscribe((comments: CommentModel[]) => {
      this.allComments = comments;
      this.letsSort();
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

  async sendComment() {
    if (this.userData?._id === undefined) {
      await this.loginWithTorus();
    } else {
      if (this.isReply.user && !this.newComment.includes('@' + this.isReply.user[1])) {
        this.isReply.isReply = false;
      }

      if (!this.isReply.isReply) {
        if (this.id && this.userData?._id && this.newComment && this.newComment.trim().length >= 1) {
          this.socketService.send(this.id, this.userData._id, this.newComment);
          console.log('comment send');
        }
        this.newComment = '';
      }

      if (this.isReply.isReply && this.id && this.userData?._id && this.newComment &&
        this.newComment.includes('@' + this.isReply.user[1])) {

        const regex = new RegExp('@' + this.isReply.user[1]);
        const comments = this.newComment.replace(regex, '');

        if (comments.trim().length >= 1) {
          this.socketService.newReply(this.id, this.userData._id, this.isReply.commentId, comments);
          this.newComment = '';
          console.log('reply send');
        }
      }
      const el = document.getElementById('textarea');
      el.style.cssText = 'height: 45px;';
    }
  }

  sendIcon(text: string, commentId: number) {
    if (this.userData && text && commentId) {
      this.socketService.sendSelectedIcon(text, this.id, this.userData._id, commentId);
    }
  }

  clickSortComment(sort): void {
    this.comingSoon = false;
    this.sortComment = sort;

    this.letsSort();
  }

  letsSort(): void {
    if (this.sortComment === 'hottest') {
      this.allComments = _.sortBy(this.allComments, (item) => {
        return item.activites;
      }).reverse();
      this.showOnScreen = this.allComments.slice(0, this.showLength);
    }
    if (this.sortComment === 'newest') {
      this.comingSoon = false;
      this.allComments = _.sortBy(this.allComments, (item) => {
        return item.date;
      }).reverse();
      this.showOnScreen = this.allComments.slice(0, this.showLength);
    }

    if (this.sortComment === 'friends') {
      this.comingSoon = true;
      return;
    }
  }

  forSortHead(sort: string) {
    if (this.sortComment === sort && this.checkTheme()) {
      return 'activeWhite';
    }
    if (this.sortComment === sort && !this.checkTheme()) {
      return 'activeDark';
    }
  }

  typingEffect() {
    setTimeout(() => {
      if (this.id) {
        this.socketService.doTyping(this.id, 'Someone is typing');
      }
    }, 300);

    this.resizeSendComment();

    setInterval(() => {
      this.forAnimationType();
    }, 700);
  }

  findUserActivites(arr) {
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

    if (this.newComment.length === 0) {
      el.style.height = '45px';
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

  scrollTo(target) {
    const event = new EventEmitter<boolean>();
    this.eventCommentSub = event.subscribe((targetReached) => this.finishScrollAnimation(targetReached, target));
    if (!this.mobile) {
      this.pageScrollService.scroll({
        document: this.document,
        scrollTarget: "#" + target,
        scrollViews: [this.container.nativeElement],
        scrollFinishListener: event,
        scrollOffset: 110
      });
    } else {
      this.pageScrollService.scroll({
        document: this.document,
        scrollTarget: "#" + target,
        scrollFinishListener: event,
      });
    }
  }

  finishScrollAnimation(event: boolean, id) {
    const el = document.getElementById(id);
    const styleStart = 'background-color: rgba(68, 68, 68, 0.7); border-radius: 8px; transition: all 200ms;';
    const styleFinish = 'background-color: none ; transition: all 200ms; ';

    if (event) {
      el.style.cssText = styleStart;
    }

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

  async loginWithTorus() {
    if (!this.userData) {
      try {
        this.spinnerLoading = true;
        await web3Obj.initialize();
        await this.setTorusInfoToDB();
        return true;
      } catch (error) {
        this.spinnerLoading = false;
        await web3Obj.torus.cleanUp();
        console.error(error);
        return false;
      }
    } else {
      return true;
    }
  }

  async setTorusInfoToDB() {
    const userInfo = await web3Obj.torus.getUserInfo('');
    const userWallet = (await web3Obj.web3.eth.getAccounts())[0];
    const data: object = {
      _id: null,
      wallet: userWallet,
      nickName: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.profileImage,
      verifier: userInfo.verifier,
      verifierId: userInfo.verifierId,
    };
    this.postSub = this.postService.post('user/torus_regist', data)
      .subscribe(
        (x: any) => {
          this.spinnerLoading = false;
          this.addUser(
            x.email,
            x.nickName,
            x.wallet,
            x.listHostEvents,
            x.listParticipantEvents,
            x.listValidatorEvents,
            x.historyTransaction,
            x.invitationList,
            x.avatar,
            x._id,
            x.verifier
          );
        }, (err) => {
          console.log(err);
        });
  }

  addUser(
    email: string,
    nickName: string,
    wallet: string,
    listHostEvents: object,
    listParticipantEvents: object,
    listValidatorEvents: object,
    historyTransaction: object,
    invitationList: object,
    color: string,
    _id: number,
    verifier: string
  ) {

    this.store.dispatch(new UserActions.AddUser({
      _id: _id,
      email: email,
      nickName: nickName,
      wallet: wallet,
      listHostEvents: listHostEvents,
      listParticipantEvents: listParticipantEvents,
      listValidatorEvents: listValidatorEvents,
      historyTransaction: historyTransaction,
      invitationList: invitationList,
      avatar: color,
      verifier: verifier
    }));
  }

  ngOnDestroy() {
    if (this.newCommentSub) {
      this.newCommentSub.unsubscribe();
    }
    if (this.getTypingSub) {
      this.getTypingSub.unsubscribe();
    }
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
    if (this.eventCommentSub) {
      this.eventCommentSub.unsubscribe();
    }
  }
}
