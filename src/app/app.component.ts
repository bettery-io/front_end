import { Component } from '@angular/core';

declare global {
  interface Window { web3: any; }
}

window.web3 = window.web3 || {};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Quiz';

}
