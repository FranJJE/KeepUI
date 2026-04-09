import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FILE_PORT } from '@keepui/ui';
import { CapacitorFileService } from '../services/capacitor-file.service';

/**
 * Registers KeepUI providers for an **Angular + Capacitor** application.
 *
 * Registers `CapacitorFileService` as the implementation of `FILE_PORT`,
 * enabling `ImagePreviewComponent` to use the device's native image picker.
 *
 * Add to `app.config.ts` **instead of** `provideKeepUi()`:
 * ```ts
 * import { provideKeepUiCapacitor } from '@keepui/ui/capacitor';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideKeepUiCapacitor()],
 * };
 * ```
 *
 * Prerequisites:
 * - `@capacitor/camera` plugin installed and synced (`npx cap sync`)
 * - Camera permissions declared in `AndroidManifest.xml` / `Info.plist`
 */
export function provideKeepUiCapacitor(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FILE_PORT, useClass: CapacitorFileService },
  ]);
}
