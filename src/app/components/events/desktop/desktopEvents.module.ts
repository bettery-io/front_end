import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QuestionComponent} from './question/question.component';
import {TimeComponent} from './time/time.component';
import {EventFeedComponent} from './eventFeed/eventFeed.component';
import {MyActivitesComponent} from './my-activites/my-activites.component';
import {InvitationComponent} from './invitation/invitation.component';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {ShareModule} from '../../share/share.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    RouterModule.forChild([
      {path: 'join', component: EventFeedComponent},
      {path: 'question/:id', component: QuestionComponent},
      {path: 'my-activites', component: MyActivitesComponent},
      {path: 'invitation', component: InvitationComponent},
    ]),
    ShareModule
  ],
  exports: [
  ],
  declarations: [
    EventFeedComponent,
    QuestionComponent,
    MyActivitesComponent,
    InvitationComponent,
    SearchBarComponent
  ]
})
export class DesktopEventsModule {
}
