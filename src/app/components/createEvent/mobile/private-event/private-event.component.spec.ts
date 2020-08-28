import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateEventComponent } from './private-event.component';

describe('PrivateEventComponent', () => {
  let component: PrivateEventComponent;
  let fixture: ComponentFixture<PrivateEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
