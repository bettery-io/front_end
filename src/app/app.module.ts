import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './reducers/user.reducer';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { RegistrationComponent } from './components/registration/registration.component';

import { PostService } from './services/post.service';
import { GetService } from './services/get.service';
import { CreateQuizeComponent } from './components/create-quize/create-quize.component';
import { HomeComponent } from './components/home/home.component';
import { AnswerComponent } from './components/answer/answer.component';
import { ValidateComponent } from './components/validate/validate.component';
import { MyActivitesComponent } from './components/my-activites/my-activites.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { QuestionComponent } from './components/question/question.component';
import { coinsReducer } from './reducers/coins.reducer';
import { TimeComponent } from './components/time/time.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegistrationComponent,
    CreateQuizeComponent,
    HomeComponent,
    AnswerComponent,
    ValidateComponent,
    MyActivitesComponent,
    QuestionComponent,
    TimeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      user: userReducer,
      coins: coinsReducer
    }),
    NgbModule,
    FormsModule
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
