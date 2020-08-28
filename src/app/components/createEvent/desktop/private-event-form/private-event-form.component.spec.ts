import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateEventFormComponent } from './private-event-form.component';

describe('PrivateEventFormComponent', () => {
  let component: PrivateEventFormComponent;
  let fixture: ComponentFixture<PrivateEventFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateEventFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
