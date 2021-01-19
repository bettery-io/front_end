import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsComponent } from './rooms/rooms.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { ShareModule} from '../share/share.module'
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {NgxPageScrollModule} from 'ngx-page-scroll';


@NgModule({
    declarations: [
        RoomsComponent,
        RoomDetailsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        InfiniteScrollModule,
        NgxPageScrollModule,
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
