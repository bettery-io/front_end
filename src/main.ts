import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const consoleLogDisable = () => {
  const env = environment.production;
  if (env === false) {
    if (window) {
      window.console.log = () => {
      };
    }
  }
};

if (environment.production) {
  consoleLogDisable();
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
