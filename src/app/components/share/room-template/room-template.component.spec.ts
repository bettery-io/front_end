import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTemplateComponent } from './room-template.component';

describe('RoomTemplateComponent', () => {
  let component: RoomTemplateComponent;
  let fixture: ComponentFixture<RoomTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
