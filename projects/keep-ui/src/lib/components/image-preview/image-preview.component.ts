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
  host: { class: 'block' },
  template: `
    <div class="flex flex-col gap-4">
      <button
        type="button"
        [disabled]="loading()"
        (click)="pickImage()"
        class="self-start px-5 py-2 text-base rounded border cursor-pointer transition-colors duration-200
               bg-keepui-surface text-keepui-text border-keepui-border
               enabled:hover:bg-keepui-surface-hover enabled:hover:border-keepui-border-strong
               disabled:opacity-50 disabled:cursor-not-allowed disabled:text-keepui-text-disabled
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keepui-primary focus-visible:ring-offset-1"
      >
        {{ loading() ? 'Cargando…' : 'Seleccionar imagen' }}
      </button>

      @if (imageUrl()) {
        <div class="max-w-full">
          <img
            class="max-w-full h-auto rounded border border-keepui-border"
            [src]="imageUrl()"
            alt="Vista previa de imagen seleccionada"
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
