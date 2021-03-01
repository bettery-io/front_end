import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicEventComponent } from './public-event.component';
import {Store, StoreModule} from "@ngrx/store";
import {GetService} from "../../../../services/get.service";
import {PostService} from "../../../../services/post.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {By} from "@angular/platform-browser";
import {EMPTY, of} from "rxjs";

fdescribe('PublicEventComponent', () => {
  let component: PublicEventComponent;
  let fixture: ComponentFixture<PublicEventComponent>;
  let service: PostService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicEventComponent ],
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule,
      ],
      providers: [
        {provide: Store},
        {provide: GetService},
        {provide: PostService},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicEventComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(PostService);
    component.host = [
      {
        _id: 1,
        nickName: 'string',
        email: 'string',
        wallet: 'string',
        listHostEvents: {},
        listParticipantEvents: {},
        listValidatorEvents: {},
        historyTransaction: {},
        avatar: 'string',
        verifier: 'string',
      }
    ];
    component.formData = {
      answers: [{name: 'dfvdfv'}, {name: 'dfvdcddfv'}],
      eventType: 'private',
      exactDay: '',
      exactHour: '',
      exactMinuts: '',
      exactMonth: '',
      exactTimeBool: false,
      exactYear: '',
      expertsCount: 2,
      expertsCountType: 'custom',
      losers: '',
      privateEndTime: '',
      publicEndTime: '',
      question: 'vfdvddfv',
      resolutionDetalis: '',
      roomColor: 'linear-gradient(228.16deg, #54DD96 -1.47%, #6360F7 97.79%)',
      roomId: '',
      roomName: '',
      tokenType: 'token',
      whichRoom: 'new',
      winner: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cancel() emitter should be triggered after click the BACK button', () => {
    let result = null;
    component.goBack.subscribe(value => result = value);

    const btnCancel = fixture.debugElement.query(By.css('.cancel'));
    btnCancel.triggerEventHandler('click', null);
    expect(result).toBe(undefined);
  });

  it('createEvent() the PostService should be called', () => {
    fixture.detectChanges();

    const spy = spyOn(service, 'post').and.callFake(() => {
      return EMPTY;
    });

    const btn = fixture.debugElement.query(By.css('.next'));
    btn.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalled();
  });

  it('setToDb() data should be sent to the database', () => {
    const spy = spyOn(service, 'post').and.returnValue(of(EMPTY));
    component.setToDb(1, 1);
    expect(spy).toHaveBeenCalled();
    expect(component.created).toBeTruthy();
  });


});
