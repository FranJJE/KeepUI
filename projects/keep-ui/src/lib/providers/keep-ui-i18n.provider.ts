import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';
import { KeepUiLanguage, KEEPUI_AVAILABLE_LANGUAGES } from '../i18n/translation-keys';
import { KeepUiTranslocoLoader } from '../services/keep-ui-transloco-loader.service';
import { KeepUiLanguageService } from '../services/keep-ui-language.service';

/**
 * Options for `provideKeepUiI18n()`.
 */
export interface KeepUiI18nOptions {
  /**
   * The default language to use when the app starts.
   * @default 'en'
   */
  defaultLang?: KeepUiLanguage;
}

/**
 * Registers all providers required for KeepUI internationalisation.
 *
 * - Configures a self-contained Transloco instance scoped to `'keepui'`.
 * - Bundles all translations **inline** — no HTTP assets required.
 * - Provides {@link KeepUiLanguageService} so the host app can switch locale.
 *
 * ### Usage in `app.config.ts`
 * ```ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideKeepUi(),
 *     provideKeepUiI18n(),                // default language: 'en'
 *     provideKeepUiI18n({ defaultLang: 'es' }), // or start in Spanish
 *   ],
 * };
 * ```
 *
 * ### Changing language at runtime
 * ```ts
 * const lang = inject(KeepUiLanguageService);
 * lang.setLanguage('de');
 * ```
 *
 * > **Note:** If your application already calls `provideTransloco()`, do NOT
 * > call `provideKeepUiI18n()` — instead configure your Transloco loader to
 * > handle the `'keepui/{lang}'` scope paths, and provide `KeepUiLanguageService`
 * > manually.
 */
export function provideKeepUiI18n(
  options: KeepUiI18nOptions = {},
): EnvironmentProviders {
  const defaultLang: KeepUiLanguage = options.defaultLang ?? 'en';

  return makeEnvironmentProviders([
    provideTransloco({
      config: {
        defaultLang,
        availableLangs: [...KEEPUI_AVAILABLE_LANGUAGES],
        reRenderOnLangChange: true,
        failedRetries: 0,
        missingHandler: { useFallbackTranslation: true },
        fallbackLang: 'en',
      },
      loader: KeepUiTranslocoLoader,
    }),

    KeepUiLanguageService,
  ]);
}

