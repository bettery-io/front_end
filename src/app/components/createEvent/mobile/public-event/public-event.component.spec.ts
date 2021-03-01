import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicEventComponent } from './public-event.component';
import {Store, StoreModule} from "@ngrx/store";
import {GetService} from "../../../../services/get.service";
import {PostService} from "../../../../services/post.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {By} from "@angular/platform-browser";
import {EMPTY, of} from "rxjs";
import {NgbModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../../../share/info-modal/info-modal.component";

export class MockNgbModalRef {
  componentInstance = {
    name: undefined,
    boldName: undefined,
    link: undefined,
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe('PublicEventComponent', () => {
  let component: PublicEventComponent;
  let fixture: ComponentFixture<PublicEventComponent>;
  let service: PostService;
  let ngbModal: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicEventComponent ],
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule,
        NgbModule
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
    ngbModal = TestBed.get(NgbModal);
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

  it('should InfoModalComponent be called with all componentInstance fields', () => {
    component.created = true;
    spyOn(ngbModal, 'open').and.returnValue(mockModalRef as any);
    fixture.detectChanges();
    const btnModalOpen = fixture.debugElement.query(By.css('.linkYellow'));
    btnModalOpen.triggerEventHandler('click', null);

    expect(ngbModal.open).toHaveBeenCalledWith(InfoModalComponent, {centered: true});
    expect(mockModalRef.componentInstance.name).toBeTruthy();
    expect(mockModalRef.componentInstance.boldName).toBeTruthy();
    expect(mockModalRef.componentInstance.link).toBeTruthy();
  });


});
