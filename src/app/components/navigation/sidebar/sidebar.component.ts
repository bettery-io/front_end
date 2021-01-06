import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
  display: boolean;

  constructor() { }

  ngOnInit(): void {
    this.detectPath();
  }

  detectPath(): void {
    const path = window.location.pathname;
    this.display = !(path === '/' || path === 'tokensale' || path === '' || path.includes('create-event') || path.includes('private_event')
      || path.includes('public_event'));
  }
}
