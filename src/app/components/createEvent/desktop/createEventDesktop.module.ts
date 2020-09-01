import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { PublicEventFormComponent } from './public-event-form/public-event-form.component';
import { PrivateEventFormComponent } from './private-event-form/private-event-form.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FontAwesomeModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: "public-event", component: PublicEventFormComponent },
            { path: "private-event", component: PrivateEventFormComponent },
        ])
    ],
    declarations: [
        PublicEventFormComponent,
        PrivateEventFormComponent,
    ]
})
export class CreateEventDesktopModule { }