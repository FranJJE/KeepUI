import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideKeepUi } from '@keepui/ui';
import { provideKeepUiCapacitor } from '@keepui/ui/capacitor';
import { Capacitor } from '@capacitor/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    Capacitor.isNativePlatform() ? provideKeepUiCapacitor() : provideKeepUi(),
  ],
};

