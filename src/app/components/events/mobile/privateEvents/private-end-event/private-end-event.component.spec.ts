import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateEndEventComponent } from './private-end-event.component';

describe('PrivateEndEventComponent', () => {
  let component: PrivateEndEventComponent;
  let fixture: ComponentFixture<PrivateEndEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateEndEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateEndEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
