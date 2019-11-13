import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizeBoardComponent } from './quize-board.component';

describe('QuizeBoardComponent', () => {
  let component: QuizeBoardComponent;
  let fixture: ComponentFixture<QuizeBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizeBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizeBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
