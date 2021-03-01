import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SetQuestionTabComponent} from './set-question-tab.component';
import {Store, StoreModule} from "@ngrx/store";
import {PostService} from "../../../../services/post.service";
import {FormBuilder} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {By} from "@angular/platform-browser";
import {NgbModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {RegistrationComponent} from "../../../registration/registration.component";

export class MockNgbModalRef {
  componentInstance = {
    openSpinner: undefined,
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe('SetQuestionTabComponent', () => {
  let component: SetQuestionTabComponent;
  let fixture: ComponentFixture<SetQuestionTabComponent>;
  let spy: jasmine.Spy;
  let ngbModal: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SetQuestionTabComponent],
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule,
        NgbModule,
      ],
      providers: [
        {provide: Store},
        {provide: PostService},
        {provide: FormBuilder},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetQuestionTabComponent);
    component = fixture.componentInstance;
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
    ngbModal = TestBed.get(NgbModal);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Forms in Set-question-tab', () => {
    it('should create "createRoomForm" form', () => {
      expect(component.questionForm.contains('question')).toBeTruthy();
      expect(component.questionForm.contains('answers')).toBeTruthy();
      expect(component.questionForm.contains('details')).toBeTruthy();
    });
    it('should mark questionsForm fields as invalid if empty value', () => {
      const questionsControl = component.questionForm.get('question');
      questionsControl.setValue('');

      expect(questionsControl.valid).toBeFalsy();
    });
  });

  it('answesQuantity should  increase +1', () => {
    component.answesQuantity = 2;
    const btnAdd = fixture.debugElement.query(By.css('.add'));
    btnAdd.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.answesQuantity).toBe(3);

  });

  it('answesQuantity should decrease -1', () => {
    component.answesQuantity = 3;
    component.formData.answers = [{name: 'dfvdfv'}, {name: 'dfvdcddfv'}, {name: 'dfvdcddfv'}];
    component.ngOnInit();
    const control = component.questionForm.get('answers');
    fixture.detectChanges();

    const btnDelete = fixture.debugElement.query(By.css('.deleteButton'));
    btnDelete.triggerEventHandler('click', null);
    expect(control.value.length).toBe(2);
    expect(component.answesQuantity).toBe(2);
  });

  describe('Test onSubmit() after clicked NEXT button', () => {
    it('should send correct data to the top, trigger the emitter. if the user is registered', () => {
      let result = null;
      component.getData.subscribe(value => result = value);

      component.registered = true;
      fixture.detectChanges();

      const btnNext = fixture.debugElement.query(By.css('.next'));
      btnNext.triggerEventHandler('click', null);
      expect(result).toEqual(component.questionForm.value);
    });

    it('if registered == false, should open modal registrationComponent', () => {
      component.registered = false;
      spyOn(ngbModal, 'open').and.returnValue(mockModalRef as any);
      fixture.detectChanges();

      const btnNext = fixture.debugElement.query(By.css('.next'));
      btnNext.triggerEventHandler('click', null);
      expect(ngbModal.open).toHaveBeenCalledWith(RegistrationComponent, {centered: true});
      expect(mockModalRef.componentInstance.openSpinner).toBe(true);
    });
  });


});
