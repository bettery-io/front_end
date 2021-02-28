import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrivateEventComponent} from './private-event.component';
import {GetService} from "../../../../services/get.service";
import {PostService} from "../../../../services/post.service";
import {Store, StoreModule} from "@ngrx/store";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {By} from "@angular/platform-browser";

fdescribe('PrivateEventComponent', () => {
  let component: PrivateEventComponent;
  let fixture: ComponentFixture<PrivateEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrivateEventComponent],
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        RouterTestingModule
      ],
      providers: [
        {provide: GetService},
        {provide: PostService},
        {provide: Store},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cancel() emitter should be triggered after click the BACK button', () => {
    let result = null;
    component.goBack.subscribe(value => result = value);

    const btnCancel = fixture.debugElement.query(By.css('.cancel'));
    btnCancel.triggerEventHandler('click', null);
    expect(result).toBe(undefined);
  });
});
