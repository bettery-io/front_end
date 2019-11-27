import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuizeComponent } from './create-quize.component';

describe('CreateQuizeComponent', () => {
  let component: CreateQuizeComponent;
  let fixture: ComponentFixture<CreateQuizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
  //  expect(component).toBeTruthy();
  });
});
