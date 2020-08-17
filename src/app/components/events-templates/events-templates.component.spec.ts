import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsTemplatesComponent } from './events-templates.component';

describe('EventsTemplatesComponent', () => {
  let component: EventsTemplatesComponent;
  let fixture: ComponentFixture<EventsTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
