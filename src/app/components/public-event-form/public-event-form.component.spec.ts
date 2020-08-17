import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicEventFormComponent } from './public-event-form.component';

describe('PublicEventFormComponent', () => {
  let component: PublicEventFormComponent;
  let fixture: ComponentFixture<PublicEventFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicEventFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
  //  expect(component).toBeTruthy();
  });
});
