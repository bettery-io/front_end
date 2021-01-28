import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetQuestionDesktopComponent } from './set-question-desktop.component';

describe('SetQuestionDesktopComponent', () => {
  let component: SetQuestionDesktopComponent;
  let fixture: ComponentFixture<SetQuestionDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetQuestionDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetQuestionDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
