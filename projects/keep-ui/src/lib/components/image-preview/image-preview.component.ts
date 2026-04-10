import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { TranslocoPipe, TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { FILE_PORT } from '../../tokens/file.token';
import { KEEPUI_TRANSLATION_KEYS as T } from '../../i18n/translation-keys';
import { ButtonComponent } from '../button/button.component';

/**
 * Standalone component that allows the user to pick and preview an image.
 *
 * This component is fully platform-agnostic. It delegates file picking to
 * whatever `FilePort` implementation is provided via `FILE_PORT`.
 *
 * UI strings are fully internationalised via Transloco (scope `'keepui'`).
 * Call `provideKeepUiI18n()` in your `app.config.ts` and use
 * `KeepUiLanguageService.setLanguage(lang)` to change locale at runtime.
 *
 * Usage:
 * ```html
 * <keepui-image-preview />
 * ```
 *
 * Prerequisites — register providers in `app.config.ts`:
 * - Web:      `provideKeepUi()` + `provideKeepUiI18n()`
 * - Capacitor: `provideKeepUiCapacitor()` + `provideKeepUiI18n()`
 */
@Component({
  selector: 'keepui-image-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, ButtonComponent],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'keepui' }],
  host: { class: 'block' },
  template: `
    <div class="flex flex-col gap-4">

      <keepui-button
        type="button"
        variant="secondary"
        size="auto"
        shape="rounded"
        [loading]="loading()"
        (clicked)="pickImage()"
      >
        {{ (loading() ? keys.LOADING : keys.SELECT_IMAGE) | transloco }}
      </keepui-button>

      <span role="status" class="sr-only">
        @if (imageUrl()) {
          {{ keys.PREVIEW_ALT | transloco }}
        }
      </span>

      @if (imageUrl()) {
        <div class="max-w-full">
          <img
            class="max-w-full h-auto rounded border border-keepui-border"
            [src]="imageUrl()"
            [attr.alt]="keys.PREVIEW_ALT | transloco"
          />
        </div>
      }

      @if (error()) {
        <p class="text-keepui-error text-sm m-0" role="alert">{{ error() }}</p>
      }

    </div>
  `,
})
export class ImagePreviewComponent {
  private readonly filePort = inject(FILE_PORT);

  /** Translation key references (typed via KEEPUI_TRANSLATION_KEYS). */
  protected readonly keys = T.IMAGE_PREVIEW;

  /** URL of the selected image, ready to bind to `[src]`. */
  readonly imageUrl = signal<string | null>(null);
  /** Error message if the last pick operation failed. */
  readonly error = signal<string | null>(null);
  /** True while the pick operation is in progress. */
  readonly loading = signal(false);

  async pickImage(): Promise<void> {
    this.error.set(null);
    this.loading.set(true);

    try {
      const result = await this.filePort.pickImage();
      this.imageUrl.set(result.dataUrl);
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : T.IMAGE_PREVIEW.ERROR_UNEXPECTED,
      );
    } finally {
      this.loading.set(false);
    }
  }
}
