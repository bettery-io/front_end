import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EventsTemplatesComponent} from './events-templates.component';
import {Store, StoreModule} from "@ngrx/store";

fdescribe('EventsTemplatesComponent', () => {
  let component: EventsTemplatesComponent;
  let fixture: ComponentFixture<EventsTemplatesComponent>;
  let mockFormData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsTemplatesComponent],
      imports: [
        StoreModule.forRoot({})
      ],
      providers: [
        {provide: Store}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsTemplatesComponent);
    component = fixture.componentInstance;
    mockFormData = component.formData
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('swithToSetQuestion(data) should change formData to match whit "data"(function argument)', () => {
    let data = {
      createNewRoom: '',
      roomName: '',
      roomColor: '',
      eventType: '',
    };
    component.swithToSetQuestion(data);

    expect(component.whichEvent).toBe('setQuestion');
    expect(mockFormData.whichRoom).toEqual(data.createNewRoom);
    expect(mockFormData.roomName).toEqual(data.roomName);
    expect(mockFormData.roomColor).toEqual(data.roomColor);
    expect(mockFormData.eventType).toEqual(data.eventType);
  });

  it('swithToCreateRoom(data) should change formData to match whit "data"(function argument)', () => {
    const data = {
      question: '',
      answers: [],
      details: '',
    };
    component.swithToCreateRoom(data);

    expect(component.whichEvent).toBe('createRoom');
    expect(mockFormData.question).toEqual(data.question);
    expect(mockFormData.answers).toEqual(data.answers);
    expect(mockFormData.resolutionDetalis).toEqual(data.details);
  });

  it('switchToMakeRules(data) should change formData to match whit "data"(function argument)', () => {
    const data = {
      createNewRoom: '',
      roomName: '',
      roomColor: '',
      eventType: '',
      roomId: '',
    };
    component.switchToMakeRules(data);

    expect(component.whichEvent).toBe('makeRules');
    expect(mockFormData.whichRoom).toEqual(data.createNewRoom);
    expect(mockFormData.roomName).toEqual(data.roomName);
    expect(mockFormData.roomColor).toEqual(data.roomColor);
    expect(mockFormData.eventType).toEqual(data.eventType);
    expect(mockFormData.roomId).toEqual(data.roomId);
  });

  it('swithToCreateRoomTab(data) should change formData to match whit "data"(function argument)', () => {
    const data = {
      day: '',
      exactTimeBool: '',
      expertsCount: '',
      expertsCountType: '',
      hour: '',
      minute: '',
      month: '',
      year: '',
      publicEndTime: '',
      tokenType: '',
      winner: '',
      losers: '',
      privateEndTime: '',
    };
    component.swithToCreateRoomTab(data);

    expect(component.whichEvent).toBe('createRoom');
    expect(mockFormData.exactDay).toEqual(data.day);
    expect(mockFormData.exactTimeBool).toEqual(data.exactTimeBool);
    expect(mockFormData.expertsCount).toEqual(data.expertsCount);
    expect(mockFormData.expertsCountType).toEqual(data.expertsCountType);
    expect(mockFormData.exactHour).toEqual(data.hour);
    expect(mockFormData.exactMinutes).toEqual(data.minute);
    expect(mockFormData.exactMonth).toEqual(data.month);
    expect(mockFormData.exactYear).toEqual(data.year);
    expect(mockFormData.publicEndTime).toEqual(data.publicEndTime);
    expect(mockFormData.tokenType).toEqual(data.tokenType);
    expect(mockFormData.winner).toEqual(data.winner);
    expect(mockFormData.losers).toEqual(data.losers);
    expect(mockFormData.privateEndTime).toEqual(data.privateEndTime);
  });

  it('switchToPrivateEvent(data) should change formData to match whit "data"(function argument)', () => {
    let data = {
      winner: '',
      losers: '',
      privateEndTime: '',
    };
    component.switchToPrivateEvent(data);

    expect(component.whichEvent).toBe('createPrivateEvent');
    expect(mockFormData.winner).toEqual(data.winner);
    expect(mockFormData.losers).toEqual(data.losers);
    expect(mockFormData.privateEndTime).toEqual(data.privateEndTime);
  });

  it('switchToPublicEvent(data) should change formData to match whit "data"(function argument)', () => {
    let data = {
      tokenType: '',
      publicEndTime: '',
      expertsCountType: '',
      expertsCount: '',
      day: '',
      exactTimeBool: '',
      hour: '',
      minute: '',
      month: '',
      year: '',
    };
    component.switchToPublicEvent(data);

    expect(component.whichEvent).toBe('createPublicEvent');
    expect(mockFormData.publicEndTime).toEqual(data.publicEndTime);
    expect(mockFormData.expertsCountType).toEqual(data.expertsCountType);
    expect(mockFormData.expertsCount).toEqual(data.expertsCount);
    expect(mockFormData.exactDay).toEqual(data.day);
    expect(mockFormData.exactTimeBool).toEqual(data.exactTimeBool);
    expect(mockFormData.exactHour).toEqual(data.hour);
    expect(mockFormData.exactMinutes).toEqual(data.minute);
    expect(mockFormData.exactMonth).toEqual(data.month);
    expect(mockFormData.exactYear).toEqual(data.year);
  });

  it('switchToMakeRuleTab() should "whichEvent" assign the string "makeRules"', () => {
    component.switchToMakeRuleTab();
    expect(component.whichEvent).toBe('makeRules');
  });
});
