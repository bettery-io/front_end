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

import { RegistrationComponent } from './components/auth/registration/registration.component';
import { AuthenticationComponent } from './components/auth/authentication/authentication.component';

import {PostService} from './services/post.service';
import { CreateQuizeComponent } from './components/create-quize/create-quize.component';
import { HomeComponent } from './components/home/home.component';
import { AnswerComponent } from './components/answer/answer.component';
import { ValidateComponent } from './components/validate/validate.component';
import { MyActivitesComponent } from './components/my-activites/my-activites.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegistrationComponent,
    AuthenticationComponent,
    CreateQuizeComponent,
    HomeComponent,
    AnswerComponent,
    ValidateComponent,
    MyActivitesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      user: userReducer
    })
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
