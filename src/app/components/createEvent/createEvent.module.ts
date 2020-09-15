import {NgModule} from '@angular/core';
import {CreateEventMobileModule} from './mobile/createEventMobile.module';
import {CreateEventDesktopModule} from './desktop/createEventDesktop.module'




@NgModule({
  imports: [
    CreateEventMobileModule,
    CreateEventDesktopModule,
  ],
})
export class CreateEventModule {
}
