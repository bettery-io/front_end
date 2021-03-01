import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateRoomTabComponent} from './create-room-tab.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PostService} from "../../../../services/post.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Store, StoreModule} from "@ngrx/store";
import {of} from "rxjs";
import {RoomModel} from "../../../../models/Room.model";
import {By} from "@angular/platform-browser";
import {NgbModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../../../share/info-modal/info-modal.component";

export class MockNgbModalRef {
  componentInstance = {
    name: undefined,
    name1: undefined,
    boldName: undefined,
    link: undefined,
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe('CreateRoomTabComponent', () => {
  let component: CreateRoomTabComponent;
  let fixture: ComponentFixture<CreateRoomTabComponent>;
  let postService: PostService;
  let spy: jasmine.Spy;
  let mockAllRooms: RoomModel[];
  let ngbModal: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRoomTabComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        NgbModule
      ],
      providers: [
        {provide: PostService},
        {provide: Store}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomTabComponent);
    component = fixture.componentInstance;
    postService = fixture.debugElement.injector.get(PostService);
    spy = spyOn(postService, 'post').and.returnValue(of(mockAllRooms));
    ngbModal = TestBed.get(NgbModal);
    component.formData = {
      answers: [{name: 'dfvdfv'}, {name: 'dfvdcddfv'}],
      eventType: 'public',
      exactDay: 23,
      exactHour: 16,
      exactMinutes: 45,
      exactMonth: 1,
      exactTimeBool: false,
      exactYear: 2021,
      expertsCount: '',
      expertsCountType: 'company',
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
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call postService', () => {
    component.getUserRooms(component.userId);
    expect(spy.calls.any()).toBeTruthy(mockAllRooms);
  });

  describe('forms in CreateRoomTabComponent', () => {
    it('should create "createRoomForm" form', () => {
      expect(component.createRoomForm.contains('createNewRoom')).toBeTruthy();
    });
    it('should create "roomForm" with 3 controls', () => {
      expect(component.roomForm.contains('roomName')).toBeTruthy();
      expect(component.roomForm.contains('roomColor')).toBeTruthy();
      expect(component.roomForm.contains('eventType')).toBeTruthy();
    });
    it('should create "existRoom" form', () => {
      expect(component.existRoom.contains('roomId')).toBeTruthy();
    });

    it('should mark roomForm fields as invalid if empty value', () => {
      const roomNameControl = component.roomForm.get('roomName');
      const roomColorControl = component.roomForm.get('roomColor');

      roomNameControl.setValue('');
      roomColorControl.setValue('');

      expect(roomNameControl.valid).toBeFalsy();
      expect(roomColorControl.valid).toBeFalsy();
    });

    it('should mark "existRoom" forms field as invalid if empty value', () => {
      const control = component.existRoom.get('roomId');
      control.setValue('');

      expect(control.valid).toBeFalsy();
    });
  });

  it('Cancel() should  be launched when you click on the "Back" button(ngIf=`exist`)', () => {
    let result = null;
    const control = component.createRoomForm.get('createNewRoom');
    control.setValue('exist');
    fixture.detectChanges();
    component.goBack.subscribe(v => result = v);
    const btn = fixture.debugElement.query(By.css('.cancel'));
    btn.triggerEventHandler('click', null);

    let data = {
      ...component.roomForm.value,
      ...component.createRoomForm.value,
      ...component.existRoom.value
    };
    expect(result).toEqual(data);
  });

  it('Cancel() should  be launched when you click on the "Back" button(ngIf=`new`)', () => {
    let result = null;
    component.goBack.subscribe(value => result = value);
    const btn = fixture.debugElement.query(By.css('.cancel'));
    btn.triggerEventHandler('click', null);

    let data = {
      ...component.roomForm.value,
      ...component.createRoomForm.value,
      ...component.existRoom.value
    };
    expect(result).toEqual(data);
  });

  it('createRoom() should send correct value by event emitter when you click on the "Next" button', () => {
    let result = null;
    component.goNext.subscribe(v => result = v);
    const control = component.roomForm.get('roomName');
    const control2 = component.roomForm.get('roomColor');
    control.setValue(1);
    control2.setValue(1);

    const data = {
      ...component.roomForm.value,
      ...component.createRoomForm.value,
      ...component.existRoom.value
    };
    const btnNext = fixture.debugElement.query(By.css('.next'));
    btnNext.triggerEventHandler('click', null);
    expect(result).toEqual(data);

  });

  it('chooseRoom() should send correct value by event emitter when you click on the "Next" button', () => {
    let result = null;
    component.goNext.subscribe(v => result = v);

    const existRoomControl = component.existRoom.get('roomId')
    existRoomControl.setValue(1);

    const createRoomFormControl = component.createRoomForm.get('createNewRoom')
    createRoomFormControl.setValue('exist');


    component.allRooms = [
      {
        color: 1,
        id: 1,
        joinedUsers: 1,
        name: '',
        privateEventsId: [],
        publicEventsId: [{_id: 1}],
        user: {},
      }
    ];

    const data = {
      ...component.roomForm.value,
      ...component.createRoomForm.value,
      ...component.existRoom.value
    };
    fixture.detectChanges();

    const btnNext = fixture.debugElement.query(By.css('.next'));
    btnNext.triggerEventHandler('click', null);

    expect(result).toEqual(data);
  });

  it('InfoModalComponent should be called with all componentInstance fields', () => {
    spyOn(ngbModal, 'open').and.returnValue(mockModalRef as any);

    const learnMoreBtn = fixture.debugElement.query(By.css('.learMore'));
    learnMoreBtn.triggerEventHandler('click', null);

    expect(ngbModal.open).toHaveBeenCalledWith(InfoModalComponent, {centered: true});
    expect(mockModalRef.componentInstance.name).toBeTruthy();
    expect(mockModalRef.componentInstance.name1).toBeTruthy();
    expect(mockModalRef.componentInstance.boldName).toBeTruthy();
    expect(mockModalRef.componentInstance.link).toBeTruthy();
  });
});
