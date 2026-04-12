import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

/**
 * Generic SVG sprite icon renderer.
 *
 * Renders a `<use href="#name">` reference pointing to an SVG symbol pre-registered
 * in the DOM by the consuming application (e.g. via `IconRegistryService`).
 *
 * Accessibility:
 * - When used decoratively (default), the SVG carries `aria-hidden="true"` automatically.
 * - When used as a standalone meaningful icon, supply an `ariaLabel` — the SVG will
 *   receive `role="img"` and `aria-label` accordingly.
 *
 * ```html
 * <!-- Decorative — hidden from screen readers -->
 * <keepui-icon name="check-icon" [size]="20" aria-hidden="true" />
 *
 * <!-- Meaningful standalone icon -->
 * <keepui-icon name="close-icon" ariaLabel="Cerrar" />
 * ```
 */
@Component({
  selector: 'keepui-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-center justify-center',
  },
  template: `
    <svg
      class="block"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.viewBox]="viewBox()"
      [attr.aria-hidden]="ariaLabel() ? null : true"
      [attr.aria-label]="ariaLabel() || null"
      [attr.role]="ariaLabel() ? 'img' : null"
    >
      <use [attr.href]="href()" />
    </svg>
  `,
})
export class IconComponent {
  /** ID of the SVG symbol to render (without the `#` prefix). */
  readonly name = input.required<string>();

  /** Width and height of the icon in pixels. @default 24 */
  readonly size = input<number>(24);

  /** `viewBox` attribute forwarded to the `<svg>` element. @default '0 0 24 24' */
  readonly viewBox = input<string>('0 0 24 24');

  /**
   * Accessible label for standalone icons.
   * When provided, sets `role="img"` and `aria-label` on the SVG.
   * When omitted, the SVG is marked `aria-hidden="true"` (decorative).
   * @default ''
   */
  readonly ariaLabel = input<string>('');

  protected readonly href = computed(() => `#${this.name()}`);
}

