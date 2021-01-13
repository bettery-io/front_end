import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsComponent } from './rooms/rooms.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { ShareModule} from '../share/share.module'



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
        RoomsComponent,
        ShareModule
    ]
})

export class RoomModule { }
