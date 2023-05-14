import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
} else {
  // Disable zone-related error stack frames in development mode
  Error['stackTraceLimit'] = 0;
  require('zone.js/plugins/zone-error');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
