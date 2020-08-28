import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetQuestionTabComponent } from './set-question-tab.component';

describe('SetQuestionTabComponent', () => {
  let component: SetQuestionTabComponent;
  let fixture: ComponentFixture<SetQuestionTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetQuestionTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetQuestionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
