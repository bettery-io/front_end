import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.sass']
})
export class SearchBarComponent implements OnInit {
  active = 'trending';
  searchWord = '';
  timeout;
  @Output() searchWordEmit = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  changesActiveBtn(str): void {
    this.active = str;
  }

  letsFindEvent() {
    if (this.timeout !== undefined) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.searchWordEmit.emit(this.searchWord);
    }, 300);
  }
}
