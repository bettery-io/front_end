import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SpinnerLoadingComponent} from "./spinner-loading/spinner-loading.component";
import { InfoModalComponent } from './info-modal/info-modal.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { CommentComponent } from './comment/comment.component';
import {FormsModule} from '@angular/forms';
import { TimeAgoPipe } from './comment/pipe/time-ago.pipe';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import { MetaMaskModalComponent } from './meta-mask-modal/meta-mask-modal.component';
import { ErrorLimitModalComponent } from './error-limit-modal/error-limit-modal.component';



@NgModule({
  declarations: [
    SpinnerLoadingComponent,
    InfoModalComponent,
    WelcomePageComponent,
    CommentComponent,
    TimeAgoPipe,
    MetaMaskModalComponent,
    ErrorLimitModalComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        NgxPageScrollModule,
    ],
  exports: [
    SpinnerLoadingComponent,
    CommentComponent
  ]
})

export class ShareModule { }
