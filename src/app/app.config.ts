import { provideRouter } from '@angular/router';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { routes } from './app.routes';

export const appConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)],
};
