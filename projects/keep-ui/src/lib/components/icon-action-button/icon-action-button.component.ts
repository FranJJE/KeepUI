import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconActionButtonVariant, IconActionButtonType } from './icon-action-button.types';

/**
 * Circular icon-only action button with `default` and `danger` variants,
 * loading state, and full accessibility support.
 *
 * Because this button renders no visible text, `ariaLabel` is **required** to
 * satisfy WCAG 2.1 SC 4.1.2 (Name, Role, Value).
 *
 * The icon color is inherited automatically via `currentColor` from the button's
 * text color, so SVG symbols defined with `stroke="currentColor"` will adapt to
 * both variants and themes without extra classes.
 *
 * ```html
 * <keepui-icon-action-button icon="edit-icon" ariaLabel="Editar" />
 *
 * <keepui-icon-action-button
 *   icon="trash-icon"
 *   variant="danger"
 *   ariaLabel="Eliminar elemento"
 *   [loading]="isDeleting()"
 * />
 * ```
 */
@Component({
  selector: 'keepui-icon-action-button',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .keepui-iab-spinner {
      display: inline-block;
      width: 1.25em;
      height: 1.25em;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: keepui-iab-spin 0.65s linear infinite;
      flex-shrink: 0;
    }

    @keyframes keepui-iab-spin {
      to { transform: rotate(360deg); }
    }
  `],
  template: `
    <button
      [attr.type]="type()"
      [disabled]="isDisabled()"
      [attr.aria-disabled]="isDisabled() ? true : null"
      [attr.aria-busy]="loading() ? true : null"
      [attr.aria-label]="ariaLabel()"
      [class]="buttonClass()"
    >
      @if (loading()) {
        <span class="keepui-iab-spinner" aria-hidden="true"></span>
      } @else {
        <keepui-icon [name]="icon()" [size]="iconSize()" />
      }
    </button>
  `,
})
export class IconActionButtonComponent {
  /** ID of the SVG symbol to render (without the `#` prefix). */
  readonly icon = input.required<string>();

  /**
   * Accessible label for the button. Always required — icon-only buttons must
   * have a programmatic name for screen readers (WCAG 2.1 SC 4.1.2).
   */
  readonly ariaLabel = input.required<string>();

  /** Visual style variant. @default 'default' */
  readonly variant = input<IconActionButtonVariant>('default');

  /** Size of the inner icon in pixels. @default 20 */
  readonly iconSize = input<number>(20);

  /** HTML `type` attribute of the inner `<button>`. @default 'button' */
  readonly type = input<IconActionButtonType>('button');

  /** Disables the button when `true`. @default false */
  readonly disabled = input<boolean>(false);

  /**
   * Shows an animated spinner and disables the button.
   * Also sets `aria-busy="true"` on the element.
   * @default false
   */
  readonly loading = input<boolean>(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected readonly buttonClass = computed<string>(() => {
    const base = [
      'inline-flex items-center justify-center shrink-0 cursor-pointer',
      'size-11 rounded-full border transition-colors',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ku-primary-border focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ].join(' ');

    const variantMap: Record<IconActionButtonVariant, string> = {
      default: [
        'border-ku-secondary-border bg-ku-primary text-ku-gray-text',
        'enabled:hover:bg-ku-action-background enabled:hover:border-ku-action-primary',
        'enabled:hover:text-ku-action-primary',
      ].join(' '),
      danger: [
        'border-ku-secondary-border bg-ku-primary text-ku-gray-text',
        'enabled:hover:bg-ku-error-background  enabled:hover:border-ku-error-primary enabled:hover:text-ku-error-primary',
        'enabled:hover:opacity-90',
      ].join(' '),
    };

    return `${base} ${variantMap[this.variant()]}`;
  });
}

