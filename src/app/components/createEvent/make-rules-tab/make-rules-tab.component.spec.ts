import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeRulesTabComponent } from './make-rules-tab.component';

describe('MakeRulesTabComponent', () => {
  let component: MakeRulesTabComponent;
  let fixture: ComponentFixture<MakeRulesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeRulesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeRulesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
