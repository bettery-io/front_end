import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivateMainComponent } from './privateEvents/private-main/private-main.component';
import { PublicMainComponent } from './publicEvents/public-main/public-main.component';



@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FontAwesomeModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: "private_event/:id", component: PrivateMainComponent },
            { path: 'public_event/:id', component: PublicMainComponent },
        ])
    ],
    declarations: [
    PrivateMainComponent,
    PublicMainComponent
]
})
export class MobileEventsModule { }