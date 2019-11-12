import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {StoreModule } from '@ngrx/store';
import { userReducer } from './reducers/user.reducer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { RegistrationComponent } from './components/auth/registration/registration.component';
import { AuthenticationComponent } from './components/auth/authentication/authentication.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegistrationComponent,
    AuthenticationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      user: userReducer
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
