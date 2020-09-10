import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFinishComponent } from './event-finish.component';

describe('EventFinishComponent', () => {
  let component: EventFinishComponent;
  let fixture: ComponentFixture<EventFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
