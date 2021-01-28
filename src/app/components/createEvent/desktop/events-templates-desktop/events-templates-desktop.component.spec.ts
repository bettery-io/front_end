import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsTemplatesDesktopComponent } from './events-templates-desktop.component';

describe('EventsTemplatesDesktopComponent', () => {
  let component: EventsTemplatesDesktopComponent;
  let fixture: ComponentFixture<EventsTemplatesDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsTemplatesDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsTemplatesDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
