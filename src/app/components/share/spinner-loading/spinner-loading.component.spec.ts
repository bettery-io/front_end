import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SppinerLoadingComponent } from './spinner-loading.component';

describe('SppinerLoadingComponent', () => {
  let component: SppinerLoadingComponent;
  let fixture: ComponentFixture<SppinerLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SppinerLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SppinerLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
