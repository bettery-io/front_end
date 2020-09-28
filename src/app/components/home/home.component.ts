import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../../environments/environment";


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  selectedLanguage: string;
  languages: { id: string, title: string }[] = [];

  constructor(private modalService: NgbModal, private translateService: TranslateService) {
  }

  ngOnInit() {
    this.translateService.use(environment.defaultLocale);
    this.selectedLanguage = environment.defaultLocale;

    this.translateService.get(environment.locales.map(x => `LANGUAGES.${x.toUpperCase()}`))
      .subscribe(translations => {

        this.languages = environment.locales.map(x => {
          return {
            id: x,
            title: translations[`LANGUAGES.${x.toUpperCase()}`],
          };
        });
      });
  }

  changeLocale() {
    this.translateService.use(this.selectedLanguage);
  }

  open(content) {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }
}
