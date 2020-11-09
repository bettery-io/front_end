import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SpinnerLoadingComponent} from "./spinner-loading/spinner-loading.component";
import { InfoModalComponent } from './info-modal/info-modal.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { CommentComponent } from './comment/comment.component';
import {FormsModule} from '@angular/forms';
import { TimeAgoPipe } from './comment/pipe/time-ago.pipe';



@NgModule({
  declarations: [
    SpinnerLoadingComponent,
    InfoModalComponent,
    WelcomePageComponent,
    CommentComponent,
    TimeAgoPipe,
  ],
    imports: [
        CommonModule,
        FormsModule,
    ],
  exports: [
    SpinnerLoadingComponent,
    CommentComponent
  ]
})

export class ShareModule { }
