import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { PublicEventFormComponent } from './public-event-form/public-event-form.component';
import { PrivateEventFormComponent } from './private-event-form/private-event-form.component';
import { EventGroupComponent } from './event-group/event-group.component';
import {AppModule} from '../../../app.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {path: 'event-group', component: EventGroupComponent},
      {path: 'create-public-event', component: PublicEventFormComponent},
      {path: 'create-private-event', component: PrivateEventFormComponent},
    ]),
  ],
    declarations: [
        PublicEventFormComponent,
        PrivateEventFormComponent,
        EventGroupComponent,
    ]
})
export class CreateEventDesktopModule { }
