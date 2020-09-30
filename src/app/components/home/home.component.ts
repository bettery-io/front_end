import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../environments/environment';
import {Subscription} from 'rxjs';
import {NgxTypedJsComponent} from 'ngx-typed-js';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Store} from '@ngrx/store';
import {createEventAction} from '../../actions/newEvent.actions';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit, OnDestroy {
  selectedLanguage: string;
  languages: { id: string, title: string }[] = [];
  translateSub: Subscription;
  active: boolean;
  createEventForm: FormGroup;
  createEvent2 = '';
  topQuestions = ['Which team will win El Clásico at 3am tonight?', 'What will be the weather tomorrow in Saigon?'];
  a: boolean;
  @ViewChild(NgxTypedJsComponent, {static: true}) typed: NgxTypedJsComponent;

  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService,
    private formBuilder: FormBuilder, private store: Store<any>) {
  }

  ngOnInit() {
    this.translateService.use(environment.defaultLocale);
    this.selectedLanguage = environment.defaultLocale;
    this.translate();

    this.formInitialize();
  }

  changeLocale() {
    this.translateService.use(this.selectedLanguage);
  }

  translate(): void {
    this.translateSub = this.translateService.get(environment.locales.map(x => `LANGUAGES.${x.toUpperCase()}`))
      .subscribe(translations => {
        this.languages = environment.locales.map(x => {
          return {
            id: x,
            title: translations[`LANGUAGES.${x.toUpperCase()}`],
          };
        });
      });
  }

  open(content) {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

  formInitialize(): void {
    this.createEventForm = this.formBuilder.group({
      newEvent: ['', Validators.required]
    });
  }


  clickMain($event) {
    if (this.createEvent2.trim().length <= 0) {
      this.active = $event.target.className === 'typing' || $event.target.id === 'newEvent';
      this.a = true;
    }
    if (!this.active) {
      this.a = false;
    }
  }

  sendEvent(createEventForm) {
    const data = createEventForm.value.newEvent;
    this.store.dispatch(createEventAction({data}));
  }

  ngOnDestroy() {
    if (this.translateSub) {
      this.translateSub.unsubscribe();
    }
  }

}
