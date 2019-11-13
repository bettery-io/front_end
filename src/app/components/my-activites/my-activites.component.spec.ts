import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyActivitesComponent } from './my-activites.component';

describe('MyActivitesComponent', () => {
  let component: MyActivitesComponent;
  let fixture: ComponentFixture<MyActivitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyActivitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyActivitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
