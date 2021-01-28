import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeRulesDesktopComponent } from './make-rules-desktop.component';

describe('MakeRulesDesktopComponent', () => {
  let component: MakeRulesDesktopComponent;
  let fixture: ComponentFixture<MakeRulesDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeRulesDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeRulesDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
