import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateEventDesktopComponent } from './private-event-desktop.component';

describe('PrivateEventDesktopComponent', () => {
  let component: PrivateEventDesktopComponent;
  let fixture: ComponentFixture<PrivateEventDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateEventDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateEventDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
