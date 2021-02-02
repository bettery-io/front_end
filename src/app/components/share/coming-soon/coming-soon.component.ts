import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.sass']
})
export class ComingSoonComponent implements OnInit {

  currentPath: string;

  constructor() {
    this.currentPath = window.location.pathname;
  }

  ngOnInit(): void {
  }
}
