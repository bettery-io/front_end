import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import {User} from 'src/app/models/User.model';
import {formDataAction} from '../../../../actions/newEvent.actions';
import {Router} from '@angular/router';

@Component({
  selector: 'app-events-templates',
  templateUrl: './events-templates.component.html',
  styleUrls: ['./events-templates.component.sass']
})
export class EventsTemplatesComponent implements OnInit, OnDestroy {
  whichEvent = 'setQuestion';
  eventFromLandingSubscr: Subscription;
  userSub: Subscription;
  formData;


  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.userSub = this.store.select('user').subscribe((x: User[]) => {
      if (x?.length == 0) {
        this.store.select('createEvent').subscribe(value => {
          if (value.formData) {
            this.formData = value.formData;
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.store.select('createEvent').subscribe(value => {
      if (value.formData) {
        this.formData = value.formData;
      }
    });

    this.eventFromLandingSubscr = this.store.select('createEvent').subscribe(a => {
      if (a?.newEvent.trim().length > 0) {
        this.formData.question = a.newEvent.trim();
      }
    });
  }

  swithToSetQuestion(data) {
    this.formData.whichRoom = data.createNewRoom;
    this.formData.roomName = data.roomName;
    this.formData.roomColor = data.roomColor;
    this.formData.eventType = data.eventType;

    this.store.dispatch(formDataAction({formData: this.formData}));
    this.router.navigateByUrl('/create-event');
  }

  swithToCreateRoom(data) {
    this.formData.question = data.question;
    this.formData.answers = data.answers;
    this.formData.resolutionDetalis = data.details;

    this.store.dispatch(formDataAction({formData: this.formData}));

    this.router.navigateByUrl('/create-room');
  }

  switchToPublicEvent(data) {
    this.formData.tokenType = data.tokenType;
    this.formData.publicEndTime = data.publicEndTime;
    this.formData.expertsCountType = data.expertsCountType;
    this.formData.expertsCount = data.expertsCount;
    this.formData.exactDay = data.day;
    this.formData.exactTimeBool = data.exactTimeBool;
    this.formData.exactHour = data.hour;
    this.formData.exactMinutes = data.minute;
    this.formData.exactMonth = data.month;
    this.formData.exactYear = data.year;
  }

  ngOnDestroy() {
    if (this.eventFromLandingSubscr) {
      this.eventFromLandingSubscr.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

}
