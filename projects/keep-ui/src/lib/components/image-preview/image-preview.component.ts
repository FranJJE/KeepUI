import { Component, inject, signal } from '@angular/core';
import { FILE_PORT } from '../../tokens/file.token';

/**
 * Standalone component that allows the user to pick and preview an image.
 *
 * This component is fully platform-agnostic. It delegates file picking to
 * whatever `FilePort` implementation is provided via `FILE_PORT`.
 *
 * Usage:
 * ```html
 * <keepui-image-preview />
 * ```
 *
 * Prerequisites — register a provider in `app.config.ts`:
 * - Web:      `provideKeepUi()`
 * - Capacitor: `provideKeepUiCapacitor()`
 */
@Component({
  selector: 'keepui-image-preview',
  standalone: true,
  template: `
    <div class="keepui-image-preview">
      <button
        class="keepui-image-preview__btn"
        type="button"
        [disabled]="loading()"
        (click)="pickImage()"
      >
        {{ loading() ? 'Loading…' : 'Select Image' }}
      </button>

      @if (imageUrl()) {
        <div class="keepui-image-preview__container">
          <img
            class="keepui-image-preview__img"
            [src]="imageUrl()"
            alt="Selected image preview"
          />
        </div>
      }

      @if (error()) {
        <p class="keepui-image-preview__error" role="alert">{{ error() }}</p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .keepui-image-preview {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .keepui-image-preview__btn {
        align-self: flex-start;
        padding: 0.5rem 1.25rem;
        font-size: 1rem;
        font-family: inherit;
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #fff;
        transition: background 0.2s ease;
      }

      .keepui-image-preview__btn:hover:not(:disabled) {
        background: #f0f0f0;
      }

      .keepui-image-preview__btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .keepui-image-preview__container {
        max-width: 100%;
      }

      .keepui-image-preview__img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
      }

      .keepui-image-preview__error {
        color: #d32f2f;
        font-size: 0.875rem;
        margin: 0;
      }
    `,
  ],
})
export class ImagePreviewComponent {
  private readonly filePort = inject(FILE_PORT);

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
      this.error.set(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      this.loading.set(false);
    }
  }
}
