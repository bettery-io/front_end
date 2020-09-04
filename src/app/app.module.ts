import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';
import { AvatarModule } from 'ngx-avatar';

import { userReducer } from './reducers/user.reducer';
import { coinsReducer } from './reducers/coins.reducer';
import { invitesReducer } from './reducers/invites.reducer';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { RegistrationComponent } from './components/registration/registration.component';

import { PostService } from './services/post.service';
import { GetService } from './services/get.service';
import { HomeComponent } from './components/home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoryComponent } from './components/history/history.component';
import { ErcCoinSaleComponent } from './components/erc-coin-sale/erc-coin-sale.component';
import { NumericDirective } from './helpers/numeric';

import { CreateEventModule } from './components/createEvent/createEvent.module';
import { EventsModule } from './components/events/events.module'


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegistrationComponent,
    HomeComponent,
    HistoryComponent,
    ErcCoinSaleComponent,
    NumericDirective,
  ],
  imports: [
    AvatarModule,
    ClipboardModule,
    CreateEventModule,
    EventsModule,
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
      { path: "home", component: HomeComponent },
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: 'history', component: HistoryComponent },
      { path: 'erc20', component: ErcCoinSaleComponent }
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
