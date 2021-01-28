import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoomDesktopComponent } from './create-room-desktop.component';

describe('CreateRoomDesktopComponent', () => {
  let component: CreateRoomDesktopComponent;
  let fixture: ComponentFixture<CreateRoomDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRoomDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
