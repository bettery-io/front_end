import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MakeRulesTabComponent} from './make-rules-tab.component';
import {FormBuilder} from "@angular/forms";
import {By} from '@angular/platform-browser';
import {NgbModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";


export class MockNgbModalRef {
  componentInstance = {
    prompt: undefined,
    title: undefined
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

fdescribe('MakeRulesTabComponent', () => {
  let component: MakeRulesTabComponent;
  let fixture: ComponentFixture<MakeRulesTabComponent>;
  let spy: jasmine.Spy;
  let ngbModal: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MakeRulesTabComponent],
      imports: [NgbModule],
      providers: [{provide: FormBuilder}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeRulesTabComponent);
    component = fixture.componentInstance;
    ngbModal = TestBed.get(NgbModal);
    spy = spyOn(ngbModal, 'open');


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
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form in MakeRulesTabComponent', () => {
    it('should create "privateForm" with 3 controls', () => {
      expect(component.privateForm.contains('winner')).toBeTruthy();
      expect(component.privateForm.contains('losers')).toBeTruthy();
      expect(component.privateForm.contains('privateEndTime')).toBeTruthy();
    });

    it('should create "publicForm" with 4 controls', () => {
      expect(component.publicForm.contains('tokenType')).toBeTruthy();
      expect(component.publicForm.contains('publicEndTime')).toBeTruthy();
      expect(component.publicForm.contains('expertsCountType')).toBeTruthy();
      expect(component.publicForm.contains('expertsCount')).toBeTruthy();
    });

    it('should create "exactTime" form with 3 controls', () => {
      expect(component.exactTime.contains('day')).toBeTruthy();
      expect(component.exactTime.contains('month')).toBeTruthy();
      expect(component.exactTime.contains('year')).toBeTruthy();
    });

    it('should mark privateForm fields as invalid if empty value', () => {
      const winnerControl = component.privateForm.get('winner');
      const loserControl = component.privateForm.get('losers');
      const privateEndTimeControl = component.privateForm.get('privateEndTime');

      winnerControl.setValue('');
      loserControl.setValue('');
      privateEndTimeControl.setValue('');

      expect(winnerControl.valid).toBeFalsy();
      expect(loserControl.valid).toBeFalsy();
      expect(privateEndTimeControl.valid).toBeFalsy();
    });

    it('should mark publicForm fields as invalid if empty value', () => {
      const publicEndTimeControl = component.publicForm.get('publicEndTime');
      const expertsCountControl = component.publicForm.get('expertsCount');

      publicEndTimeControl.setValue('');
      expertsCountControl.setValue('');

      expect(publicEndTimeControl.valid).toBeFalsy();

      expect(expertsCountControl.valid).toBeFalsy();
    });
  });

  describe('Button Back in MakeRulesTabComponent', () => {
    let result;
    let data;
    beforeEach(() => {
      data = {
        ...component.publicForm.value,
        ...component.privateForm.value,
        ...component.exactTime.value,
        ...component.timeData,
        'exactTimeBool': component.exactTimeBool
      };
      result = null;
      component.goBack.subscribe(value => result = value);
    });


    it('should send data to the top through the eventEmitter, when eventType === "private"', () => {
      const btnCancel = fixture.debugElement.query(By.css('.cancel'));
      btnCancel.triggerEventHandler('click', null);
      expect(result).toEqual(data);
    });

    it('should send data to the top through the eventEmitter, when eventType === "public"', () => {
      component.formData.eventType = 'public';
      fixture.detectChanges();

      const btnCancel = fixture.debugElement.query(By.css('.cancel'));
      btnCancel.triggerEventHandler('click', null);
      expect(result).toEqual(data);
    });
  });

  describe('Button Next in MakeRulesTabComponent', () => {
    it('should send data to the top through the eventEmitter, when eventType === "private"', () => {
      let result = null;
      component.goPrivateEvent.subscribe(value => result = value);

      const winnerControl = component.privateForm.get('winner');
      const loserControl = component.privateForm.get('losers');
      const endTimeControl = component.privateForm.get('privateEndTime');

      winnerControl.setValue('winner');
      loserControl.setValue('loser');
      endTimeControl.setValue(10000);

      const btnNext = fixture.debugElement.query(By.css('.next'));
      btnNext.triggerEventHandler('click', null);

      expect(result).toEqual(component.privateForm.value)
    });

    it('should send data to the top through the eventEmitter, when eventType === "public"', () => {
      let result = null;

      component.formData.eventType = 'public';
      component.goPublicEvent.subscribe(value => result = value);

      const tokenTypeControl = component.publicForm.get('tokenType');
      const publicEndTimeControl = component.publicForm.get('publicEndTime');
      const expertsCountTypeControl = component.publicForm.get('expertsCountType');
      const expertsCountControl = component.publicForm.get('expertsCount');

      component.formData.publicEndTime = 11;

      publicEndTimeControl.setValue(11);
      expertsCountControl.setValue(2);
      tokenTypeControl.setValue('token');
      expertsCountTypeControl.setValue('custom');

      fixture.detectChanges();

      const btnNext = fixture.debugElement.query(By.css('.next'));
      btnNext.triggerEventHandler('click', null);

      const data = {
        ...component.publicForm.value,
        ...component.exactTime.value,
        ...component.timeData,
        'exactTimeBool': component.exactTimeBool
      };

      expect(result).toEqual(data);
    });
  });
  //
  // it('testing modal windows bootstrap TO DO', () => {
  //   component.formData.eventType = 'public';
  //   fixture.detectChanges();
  //
  //   const div = fixture.debugElement.query(By.css('.howWorkModal-forTest'))
  //   div.triggerEventHandler('click', null);
  //   expect(ngbModal.open).toHaveBeenCalled();
  //   expect(component.modalTrigger).toBeFalsy();
  // });


});
