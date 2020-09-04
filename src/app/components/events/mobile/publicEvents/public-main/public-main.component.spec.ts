import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicMainComponent } from './public-main.component';

describe('PublicMainComponent', () => {
  let component: PublicMainComponent;
  let fixture: ComponentFixture<PublicMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
