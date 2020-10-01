import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {NgxTypedJsComponent} from 'ngx-typed-js';
import {Store} from '@ngrx/store';

import {createEventAction} from '../../actions/newEvent.actions';
import {environment} from '../../../environments/environment';
import * as EN from '../../../assets/locale/en.json';
import * as VN from '../../../assets/locale/vn.json';


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
  newCreateEvent = '';
  switchLang = 'en';
  topQuestions: any;

  @ViewChild(NgxTypedJsComponent, {static: true}) typed: NgxTypedJsComponent;

  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService,
    private store: Store<any>) {

  }

  ngOnInit() {
    this.translateService.use(environment.defaultLocale);
    this.selectedLanguage = environment.defaultLocale;
    this.translate();
  }

  changeLocale() {
    this.translateService.use(this.selectedLanguage);

    if (this.selectedLanguage === 'vn') {
      this.switchLang = 'vn';
      this.topQuestions = VN.HEADER.TOP_QUESTIONS;
    }
    if (this.selectedLanguage === 'en') {
      this.switchLang = 'en';
      this.topQuestions = EN.HEADER.TOP_QUESTIONS;
    }
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

  clickMain($event) {
    if (this.newCreateEvent.trim().length <= 0) {
      this.active = $event.target.className === 'typing' || $event.target.id === 'newEvent';
    }
  }

  sendEvent() {
    const data = this.newCreateEvent;
    this.store.dispatch(createEventAction({data}));
  }

  ngOnDestroy() {
    if (this.translateSub) {
      this.translateSub.unsubscribe();
    }
  }

}
