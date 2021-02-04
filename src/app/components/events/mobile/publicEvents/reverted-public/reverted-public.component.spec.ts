import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertedPublicComponent } from './reverted-public.component';

describe('RevertedPublicComponent', () => {
  let component: RevertedPublicComponent;
  let fixture: ComponentFixture<RevertedPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevertedPublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevertedPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
