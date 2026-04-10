import { Component, computed, input, output } from '@angular/core';

/**
 * A simple, accessible button component with theme support.
 *
 * ```html
 * <keepui-button (clicked)="doSomething()">Click me</keepui-button>
 * <keepui-button variant="primary" (clicked)="save()">Save</keepui-button>
 * <keepui-button [disabled]="true" type="submit">Submit</keepui-button>
 * ```
 */
@Component({
  selector: 'keepui-button',
  standalone: true,
  host: { class: 'inline-block' },
  template: `
    <button
      [disabled]="disabled()"
      [attr.type]="type()"
      (click)="clicked.emit()"
      [class]="buttonClass()"
    >
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  /** Whether the button is disabled. */
  readonly disabled = input(false);
  /** HTML button type attribute. */
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /** Visual variant: `'default'` or `'primary'`. */
  readonly variant = input<'default' | 'primary'>('default');
  /** Emitted when the button is clicked (and not disabled). */
  readonly clicked = output<void>();

  protected readonly buttonClass = computed(() => {
    const base = [
      'px-5 py-2 text-base rounded border cursor-pointer',
      'transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keepui-primary focus-visible:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ].join(' ');

    const variantMap: Record<'default' | 'primary', string> = {
      default: [
        'bg-keepui-surface text-keepui-text border-keepui-border',
        'enabled:hover:bg-keepui-surface-hover enabled:hover:border-keepui-border-strong',
        'disabled:text-keepui-text-disabled',
      ].join(' '),
      primary: [
        'bg-keepui-primary text-keepui-primary-fg border-keepui-primary',
        'enabled:hover:bg-keepui-primary-hover enabled:hover:border-keepui-primary-hover',
        'enabled:active:bg-keepui-primary-active enabled:active:border-keepui-primary-active',
      ].join(' '),
    };

    return `${base} ${variantMap[this.variant()]}`;
  });
}
