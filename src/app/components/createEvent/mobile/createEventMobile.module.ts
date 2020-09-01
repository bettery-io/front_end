import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventsTemplatesComponent } from './events-templates/events-templates.component';
import { SetQuestionTabComponent } from './set-question-tab/set-question-tab.component';
import { CreateRoomTabComponent } from './create-room-tab/create-room-tab.component';
import { MakeRulesTabComponent } from './make-rules-tab/make-rules-tab.component';
import { PrivateEventComponent } from './private-event/private-event.component';
import { PublicEventComponent } from './public-event/public-event.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FontAwesomeModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: "~ki339203/create-event", component: EventsTemplatesComponent }
        ])
    ],
    declarations: [
        EventsTemplatesComponent,
        SetQuestionTabComponent,
        CreateRoomTabComponent,
        MakeRulesTabComponent,
        PrivateEventComponent,
        PublicEventComponent
    ]
})
export class CreateEventMobileModule { }