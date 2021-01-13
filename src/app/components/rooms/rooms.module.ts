import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsComponent } from './rooms/rooms.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomDetailsComponent } from './room-details/room-details.component';



@NgModule({
    declarations: [
        RoomsComponent,
        RoomDetailsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            { path: 'rooms', component: RoomsComponent },
            { path: 'room/:id', component: RoomDetailsComponent }
        ]),
    ],
    exports: [
        RoomsComponent
    ]
})

export class RoomModule { }
