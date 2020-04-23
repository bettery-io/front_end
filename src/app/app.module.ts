import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';

import { userReducer } from './reducers/user.reducer';
import { coinsReducer } from './reducers/coins.reducer';
import { invitesReducer } from './reducers/invites.reducer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { RegistrationComponent } from './components/registration/registration.component';

import { PostService } from './services/post.service';
import { GetService } from './services/get.service';
import { CreateQuizeComponent } from './components/create-quize/create-quize.component';
import { HomeComponent } from './components/home/home.component';
import { EventFeedComponent } from './components/eventFeed/eventFeed.component';
import { MyActivitesComponent } from './components/my-activites/my-activites.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { QuestionComponent } from './components/question/question.component';
import { TimeComponent } from './components/time/time.component';
import { InvitationComponent } from './components/invitation/invitation.component';
import { HistoryComponent } from './components/history/history.component';
import { ErcCoinSaleComponent } from './components/erc-coin-sale/erc-coin-sale.component';
import {NumericDirective} from './helpers/numeric';
import { QuizTemplateComponent } from './components/quiz-template/quiz-template.component';

import { GoogleLoginProvider, FacebookLoginProvider, SocialLoginModule, AuthServiceConfig } from "angularx-social-login";


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("105180513890-6vnos5q8fbqtjigjddqbihv4oq83mhia.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("526106101628272")
  }
]);

export function provideConfig() {
  return config;
}



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegistrationComponent,
    CreateQuizeComponent,
    HomeComponent,
    EventFeedComponent,
    MyActivitesComponent,
    QuestionComponent,
    TimeComponent,
    InvitationComponent,
    HistoryComponent,
    ErcCoinSaleComponent,
    NumericDirective,
    QuizTemplateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    SocialLoginModule,
    StoreModule.forRoot({
      user: userReducer,
      coins: coinsReducer,
      invites: invitesReducer
    }),
    NgbModule,
    FormsModule
  ],
  providers: [
    PostService,
    GetService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
