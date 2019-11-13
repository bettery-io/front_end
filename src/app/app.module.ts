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
import { QuizeBoardComponent } from './components/quize-board/quize-board.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegistrationComponent,
    AuthenticationComponent,
    CreateQuizeComponent,
    QuizeBoardComponent
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
