import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';

import { userReducer } from './reducers/user.reducer';
import { coinsReducer } from './reducers/coins.reducer';
import { invitesReducer } from './reducers/invites.reducer';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { RegistrationComponent } from './components/registration/registration.component';

import { PostService } from './services/post.service';
import { GetService } from './services/get.service';
import { HomeComponent } from './components/home/home.component';
import { EventFeedComponent } from './components/eventFeed/eventFeed.component';
import { MyActivitesComponent } from './components/my-activites/my-activites.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionComponent } from './components/question/question.component';
import { TimeComponent } from './components/time/time.component';
import { InvitationComponent } from './components/invitation/invitation.component';
import { HistoryComponent } from './components/history/history.component';
import { ErcCoinSaleComponent } from './components/erc-coin-sale/erc-coin-sale.component';
import {NumericDirective} from './helpers/numeric';
import { QuizTemplateComponent } from './components/quiz-template/quiz-template.component';
import {CreateEventModule } from './components/createEvent/createEvent.module';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegistrationComponent,
    HomeComponent,
    EventFeedComponent,
    MyActivitesComponent,
    QuestionComponent,
    TimeComponent,
    InvitationComponent,
    HistoryComponent,
    ErcCoinSaleComponent,
    NumericDirective,
    QuizTemplateComponent,
  ],
  imports: [
    CreateEventModule,
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      user: userReducer,
      coins: coinsReducer,
      invites: invitesReducer
    }),
    NgbModule,
    FormsModule,
    RouterModule.forRoot([
      { path: "~ki339203/home", component: HomeComponent },
      { path: "~ki339203", redirectTo: "~ki339203/home", pathMatch: "full" },
      { path: "~ki339203/eventFeed", component: EventFeedComponent },
      { path: "~ki339203/my-activites", component: MyActivitesComponent },
      { path: '~ki339203/question/:id', component: QuestionComponent },
      { path: '~ki339203/invitation', component: InvitationComponent },
      { path: '~ki339203/history', component: HistoryComponent },
      { path: '~ki339203/erc20', component: ErcCoinSaleComponent }
    ])   
  ],
  providers: [
    PostService,
    GetService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
