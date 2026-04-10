import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';
import { KeepUiLanguage } from '../i18n/translation-keys';
import { KEEPUI_TRANSLATIONS } from '../i18n/keep-ui-translations';

/**
 * Transloco loader for KeepUI.
 *
 * Serves translations **inline** (bundled in the library JS) so that no HTTP
 * request is required. It handles both plain lang paths (`'en'`, `'es'`, …)
 * and scope-prefixed paths (`'keepui/en'`, `'keepui/es'`, …).
 *
 * @internal
 */
@Injectable()
export class KeepUiTranslocoLoader implements TranslocoLoader {
  getTranslation(langPath: string): Observable<Translation> {
    // Transloco calls this with 'keepui/en', 'keepui/es', etc.
    // when a component has TRANSLOCO_SCOPE = 'keepui'.
    const lang = langPath.includes('/') ? langPath.split('/')[1] : langPath;

    const isValid = (l: string): l is KeepUiLanguage =>
      l === 'en' || l === 'es' || l === 'de';

    const translations = isValid(lang)
      ? KEEPUI_TRANSLATIONS[lang]
      : KEEPUI_TRANSLATIONS['en'];

    return of(translations as unknown as Translation);
  }
}

