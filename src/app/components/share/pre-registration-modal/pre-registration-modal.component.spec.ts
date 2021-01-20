import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRegistrationModalComponent } from './pre-registration-modal.component';

describe('PreRegistrationModalComponent', () => {
  let component: PreRegistrationModalComponent;
  let fixture: ComponentFixture<PreRegistrationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreRegistrationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRegistrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
