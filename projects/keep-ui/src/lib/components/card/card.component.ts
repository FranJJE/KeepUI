import { Component, input } from '@angular/core';

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
  template: `
    <div class="keepui-card" [class]="'keepui-card--elevation-' + elevation()">
      <ng-content />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .keepui-card {
        border-radius: 8px;
        padding: 1rem;
        background: #fff;
        border: 1px solid #e0e0e0;
      }

      .keepui-card--elevation-0 {
        box-shadow: none;
      }

      .keepui-card--elevation-1 {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      }

      .keepui-card--elevation-2 {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
      }

      .keepui-card--elevation-3 {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.18);
      }
    `,
  ],
})
export class CardComponent {
  /** Shadow elevation level (0–3). */
  readonly elevation = input<0 | 1 | 2 | 3>(1);
}
