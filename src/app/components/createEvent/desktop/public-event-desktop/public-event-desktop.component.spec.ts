import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicEventDesktopComponent } from './public-event-desktop.component';

describe('PublicEventDesktopComponent', () => {
  let component: PublicEventDesktopComponent;
  let fixture: ComponentFixture<PublicEventDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicEventDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicEventDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
