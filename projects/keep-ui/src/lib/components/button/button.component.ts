import { Component, input, output } from '@angular/core';

/**
 * A simple, accessible button component.
 *
 * ```html
 * <keepui-button (clicked)="doSomething()">Click me</keepui-button>
 * <keepui-button [disabled]="true" type="submit">Submit</keepui-button>
 * ```
 */
@Component({
  selector: 'keepui-button',
  standalone: true,
  template: `
    <button
      [disabled]="disabled()"
      [attr.type]="type()"
      (click)="clicked.emit()"
      class="keepui-button"
    >
      <ng-content />
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      .keepui-button {
        padding: 0.5rem 1.25rem;
        font-size: 1rem;
        font-family: inherit;
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #fff;
        transition: background 0.2s ease;
      }

      .keepui-button:hover:not(:disabled) {
        background: #f0f0f0;
      }

      .keepui-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class ButtonComponent {
  /** Whether the button is disabled. */
  readonly disabled = input(false);
  /** HTML button type attribute. */
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /** Emitted when the button is clicked (and not disabled). */
  readonly clicked = output<void>();
}
