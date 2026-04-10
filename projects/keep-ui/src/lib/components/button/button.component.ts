import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';
import { ButtonVariant, ButtonSize, ButtonShape, ButtonType } from './button.types';

/**
 * Accessible, themed action button with support for variants, shapes, sizes,
 * loading state, full-width layout, and named icon slots.
 *
 * Works identically on **web** and **Angular + Capacitor** (no native API usage).
 *
 * ```html
 * <!-- Basic usage -->
 * <keepui-button (clicked)="save()">Save</keepui-button>
 *
 * <!-- Primary, pill-shaped, fixed width -->
 * <keepui-button variant="primary" shape="pill">Confirm</keepui-button>
 *
 * <!-- With leading icon (any inline element) -->
 * <keepui-button variant="outline" size="auto">
 *   <svg slot="leading" width="16" height="16" aria-hidden="true">…</svg>
 *   Upload
 * </keepui-button>
 *
 * <!-- Loading state -->
 * <keepui-button [loading]="isSaving()">Saving…</keepui-button>
 *
 * <!-- Full-width, danger -->
 * <keepui-button variant="danger" [fullWidth]="true">Delete account</keepui-button>
 *
 * <!-- Icon-only (requires ariaLabel for accessibility) -->
 * <keepui-button variant="ghost" size="auto" ariaLabel="Close dialog">
 *   <svg slot="leading" …>…</svg>
 * </keepui-button>
 * ```
 */
@Component({
  selector: 'keepui-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': 'fullWidth() ? "block" : "inline-block"',
    '[style.width]': 'fullWidth() ? "100%" : null',
  },
  template: `
    <button
      [attr.type]="type()"
      [disabled]="isDisabled()"
      [attr.aria-disabled]="isDisabled() ? true : null"
      [attr.aria-busy]="loading() ? true : null"
      [attr.aria-label]="ariaLabel() || null"
      (click)="handleClick()"
      [class]="buttonClass()"
    >
      @if (loading()) {
        <span class="keepui-btn-spinner" aria-hidden="true"></span>
      } @else {
        <ng-content select="[slot='leading']" />
      }

      <ng-content />

      @if (!loading()) {
        <ng-content select="[slot='trailing']" />
      }
    </button>
  `,
  styles: [`
    .keepui-btn-spinner {
      display: inline-block;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: keepui-spin 0.65s linear infinite;
      flex-shrink: 0;
    }

    @keyframes keepui-spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class ButtonComponent {
  /** Visual style of the button. @default 'primary' */
  readonly variant = input<ButtonVariant>('primary');

  /**
   * Size mode.
   * - `md` → fixed 160 px wide, 40 px tall.
   * - `auto` → padding-driven width, 40 px tall.
   * @default 'md'
   */
  readonly size = input<ButtonSize>('md');

  /** Border-radius style. @default 'pill' */
  readonly shape = input<ButtonShape>('pill');

  /** HTML `type` attribute of the inner `<button>`. @default 'button' */
  readonly type = input<ButtonType>('button');

  /** Disables the button when `true`. @default false */
  readonly disabled = input(false);

  /**
   * Replaces the content with an animated spinner and sets `aria-busy`.
   * Also disables the button until the operation completes.
   * @default false
   */
  readonly loading = input(false);

  /** Expands the button to fill its container width. @default false */
  readonly fullWidth = input(false);

  /**
   * Accessible label for icon-only buttons.
   * When provided, sets the `aria-label` attribute on the inner `<button>`.
   * @default ''
   */
  readonly ariaLabel = input('');

  /** Emitted when the button is clicked and is not disabled or loading. */
  readonly clicked = output<void>();

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected readonly buttonClass = computed(() => {
    const base = [
      'inline-flex items-center justify-center gap-2',
      'min-h-[2.75rem] text-sm font-medium cursor-pointer select-none',
      'transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-keepui-primary focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ].join(' ');

    const sizeClass = this.fullWidth()
      ? 'w-full h-10 px-4'
      : this.size() === 'md'
        ? 'w-40 h-10'
        : 'px-6 h-10';

    const shapeMap: Record<ButtonShape, string> = {
      pill: 'rounded-full',
      rounded: 'rounded-2xl',
    };

    const variantMap: Record<ButtonVariant, string> = {
      primary: [
        'bg-keepui-primary text-keepui-primary-fg border border-keepui-primary',
        'enabled:hover:bg-keepui-primary-hover enabled:hover:border-keepui-primary-hover',
        'enabled:active:bg-keepui-primary-active enabled:active:border-keepui-primary-active',
      ].join(' '),
      secondary: [
        'bg-keepui-surface text-keepui-text border border-keepui-border',
        'enabled:hover:bg-keepui-surface-hover enabled:hover:border-keepui-border-strong',
        'disabled:text-keepui-text-disabled',
      ].join(' '),
      outline: [
        'bg-transparent border border-keepui-border text-keepui-text',
        'enabled:hover:border-keepui-primary enabled:hover:text-keepui-primary',
      ].join(' '),
      ghost: [
        'bg-transparent border border-keepui-primary text-keepui-primary',
        'enabled:hover:bg-keepui-primary/10',
      ].join(' '),
      danger: [
        'bg-keepui-error text-keepui-error-fg border border-keepui-error',
        'enabled:hover:opacity-90',
        'enabled:active:opacity-80',
      ].join(' '),
    };

    return [base, sizeClass, shapeMap[this.shape()], variantMap[this.variant()]].join(' ');
  });

  protected handleClick(): void {
    if (!this.isDisabled()) {
      this.clicked.emit();
    }
  }
}
