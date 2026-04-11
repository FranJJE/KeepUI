import { Component, computed, input } from '@angular/core';

/**
 * A versatile card container component.
 *
 * ```html
 * <keepui-card>
 *   <h2>Title</h2>
 *   <p>Some content</p>
 * </keepui-card>
 *
 * <keepui-card [elevation]="2">
 *   Elevated card
 * </keepui-card>
 * ```
 */
@Component({
  selector: 'keepui-card',
  standalone: true,
  host: { class: 'block' },
  template: `
    <div [class]="cardClass()">
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  /** Shadow elevation level (0–3). */
  readonly elevation = input<0 | 1 | 2 | 3>(1);

  protected readonly cardClass = computed(() => {
    const base = [
      'rounded-lg p-4',
      'bg-ku-secondary border border-ku-secondary-border text-ku-secondary-text',
      'transition-all duration-200',
    ].join(' ');

    const shadowMap: Record<0 | 1 | 2 | 3, string> = {
      0: '',
      1: 'shadow-sm',
      2: 'shadow',
      3: 'shadow-lg',
    };

    const shadow = shadowMap[this.elevation()];
    return shadow ? `${base} ${shadow}` : base;
  });
}
