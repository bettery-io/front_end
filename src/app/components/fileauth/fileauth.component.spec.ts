import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileauthComponent } from './fileauth.component';

describe('FileauthComponent', () => {
  let component: FileauthComponent;
  let fixture: ComponentFixture<FileauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
