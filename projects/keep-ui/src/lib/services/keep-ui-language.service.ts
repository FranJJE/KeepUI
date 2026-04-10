import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { KeepUiLanguage, KEEPUI_AVAILABLE_LANGUAGES } from '../i18n/translation-keys';

/**
 * Service that exposes a public API for changing the active language of all
 * KeepUI components at runtime.
 *
 * ### Usage
 * ```ts
 * // Inject anywhere in the host application
 * const lang = inject(KeepUiLanguageService);
 *
 * // Switch to Spanish
 * lang.setLanguage('es');
 *
 * // Read the active language
 * console.log(lang.activeLanguage()); // 'es'
 * ```
 *
 * Register via `provideKeepUiI18n()` in `app.config.ts`.
 */
@Injectable()
export class KeepUiLanguageService {
  private readonly transloco = inject(TranslocoService);

  /** Signal that reflects the currently active KeepUI locale. */
  readonly activeLanguage = signal<KeepUiLanguage>(
    this.transloco.getActiveLang() as KeepUiLanguage,
  );

  /** Ordered list of all supported locales. */
  readonly availableLanguages: readonly KeepUiLanguage[] = KEEPUI_AVAILABLE_LANGUAGES;

  /**
   * Changes the active language for all KeepUI components.
   *
   * @param lang - One of `'en'`, `'es'` or `'de'`.
   */
  setLanguage(lang: KeepUiLanguage): void {
    this.transloco.setActiveLang(lang);
    this.activeLanguage.set(lang);
  }
}

