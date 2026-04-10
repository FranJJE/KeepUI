/**
 * Typed constants for every translation key used in @keepui/ui.
 *
 * Use these instead of raw strings so that renaming a key is caught by
 * the TypeScript compiler across all consumers.
 *
 * @example
 * ```ts
 * import { KEEPUI_TRANSLATION_KEYS as T } from '@keepui/ui';
 *
 * const label = translocoService.translate(T.IMAGE_PREVIEW.SELECT_IMAGE);
 * ```
 */
export const KEEPUI_TRANSLATION_KEYS = {
  IMAGE_PREVIEW: {
    SELECT_IMAGE: 'imagePreview.selectImage',
    LOADING: 'imagePreview.loading',
    PREVIEW_ALT: 'imagePreview.previewAlt',
    ERROR_UNEXPECTED: 'imagePreview.errorUnexpected',
  },
} as const;

/** Union of all supported KeepUI locales. */
export type KeepUiLanguage = 'en' | 'es' | 'de';

/** Ordered list of languages available in KeepUI. */
export const KEEPUI_AVAILABLE_LANGUAGES: readonly KeepUiLanguage[] = [
  'en',
  'es',
  'de',
] as const;

