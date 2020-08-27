import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoomTabComponent } from './create-room-tab.component';

describe('CreateRoomTabComponent', () => {
  let component: CreateRoomTabComponent;
  let fixture: ComponentFixture<CreateRoomTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRoomTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
