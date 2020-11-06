import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SpinnerLoadingComponent} from "./spinner-loading/spinner-loading.component";
import { InfoModalComponent } from './info-modal/info-modal.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { ChatComponent } from './chat/chat.component';
import {FormsModule} from '@angular/forms';
import { TimeAgoPipe } from './chat/pipe/time-ago.pipe';



@NgModule({
  declarations: [
    SpinnerLoadingComponent,
    InfoModalComponent,
    WelcomePageComponent,
    ChatComponent,
    TimeAgoPipe,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SpinnerLoadingComponent,
    ChatComponent
  ]
})

export class ShareModule { }
