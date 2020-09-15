import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateExpertComponent } from './private-expert.component';

describe('PrivateExpertComponent', () => {
  let component: PrivateExpertComponent;
  let fixture: ComponentFixture<PrivateExpertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateExpertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
