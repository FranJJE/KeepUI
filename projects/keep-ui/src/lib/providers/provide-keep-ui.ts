import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FILE_PORT } from '../tokens/file.token';
import { WebFileService } from '../services/web-file.service';

/**
 * Registers KeepUI core providers for a **web** Angular application.
 *
 * Registers `WebFileService` as the implementation of `FILE_PORT`, enabling
 * all KeepUI components to use the browser's native file picker.
 *
 * Add to `app.config.ts`:
 * ```ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideKeepUi()],
 * };
 * ```
 */
export function provideKeepUi(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FILE_PORT, useClass: WebFileService },
  ]);
}
