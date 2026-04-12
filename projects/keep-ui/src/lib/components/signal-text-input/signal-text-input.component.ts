import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  computed,
  signal,
  viewChild,
  ElementRef,
} from '@angular/core';
import { TranslocoPipe, TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { SignalTextInputType, SignalTextInputWidth } from './signal-text-input.types';
import { IconComponent } from '../icon/icon.component';
import { KEEPUI_TRANSLATION_KEYS as T } from '../../i18n/translation-keys';

/**
 * Signal-based accessible text input supporting all common HTML input types,
 * leading/trailing icons, a trailing content slot, and a built-in
 * password-visibility toggle (when `type="password"`).
 *
 * The `value` and `touched` properties are `model()` signals so the component
 * integrates seamlessly with Angular signal-based forms.
 *
 * Password toggle labels are translated via Transloco (scope `'keepui'`).
 * Call `provideKeepUiI18n()` in your `app.config.ts` to activate i18n.
 *
 * ```html
 * <keepui-signal-text-input
 *   label="Email"
 *   type="email"
 *   placeholder="usuario@ejemplo.com"
 *   leadingIcon="mail-icon"
 *   [(value)]="email"
 * />
 *
 * <!-- Password with toggle -->
 * <keepui-signal-text-input
 *   label="Contraseña"
 *   type="password"
 *   [(value)]="password"
 * />
 * ```
 */
@Component({
  selector: 'keepui-signal-text-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, TranslocoPipe],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'keepui' }],
  host: { class: 'block' },
  template: `
    <div class="flex flex-col gap-1" [class]="widthClass()">

      @if (label()) {
        <label [for]="inputId()" class="text-sm text-ku-gray-text">
          {{ label() }}
          @if (required() && showRequiredIndicator()) {
            <span class="text-ku-error-primary" aria-hidden="true"> *</span>
          }
        </label>
      }

      <div class="relative flex items-center">

        @if (hasLeading()) {
          <span
            class="absolute left-3 flex items-center pointer-events-none text-ku-gray-text"
            aria-hidden="true"
          >
            <keepui-icon [name]="leadingIcon()" [size]="18" />
          </span>
        }

        <input
          #inputRef
          [id]="inputId()"
          [type]="resolvedType()"
          [value]="value()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [attr.required]="required() ? true : null"
          [attr.aria-required]="required() ? true : null"
          [attr.aria-invalid]="showError() ? true : null"
          [attr.aria-describedby]="showError() ? errorId() : null"
          class="bg-ku-primary border rounded-xl py-2.5 text-sm text-ku-primary-text
                 placeholder:text-ku-gray-text outline-none transition-colors w-full
                 disabled:opacity-50 disabled:cursor-not-allowed min-h-[2.75rem]
                 dark:[color-scheme:dark]"
          [class]="inputClasses()"
          (click)="openDatePicker()"
          (input)="onInput($event)"
          (blur)="onBlur()"
        />

        @if (hasTrailingSlot()) {
          <div class="absolute right-1 flex items-center">
            <ng-content select="[trailingSlot]" />
          </div>
        } @else if (isPasswordType()) {
          <button
            type="button"
            (click)="togglePasswordVisibility()"
            class="absolute right-3 flex items-center justify-center text-ku-gray-text
                   hover:text-ku-primary-text transition-colors cursor-pointer
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-ku-action-primary rounded min-h-[2.75rem] min-w-[2.75rem]"
            [attr.aria-label]="(isPasswordVisible()
              ? keys.HIDE_PASSWORD
              : keys.SHOW_PASSWORD) | transloco"
          >
            <keepui-icon
              [name]="isPasswordVisible() ? 'eye-off-icon' : 'eye-icon'"
              [size]="18"
              aria-hidden="true"
            />
          </button>
        } @else if (hasTrailing()) {
          <span
            class="absolute right-3 flex items-center pointer-events-none text-ku-gray-text"
            aria-hidden="true"
          >
            <keepui-icon [name]="trailingIcon()" [size]="18" />
          </span>
        }

      </div>

      @if (showError()) {
        <span
          [id]="errorId()"
          class="text-sm text-ku-error-primary"
          role="alert"
        >
          @if (errorMessage()) {
            {{ errorMessage() }}
          } @else if (errors().length > 0) {
            {{ errors()[0] }}
          }
        </span>
      }

    </div>
  `,
})
export class SignalTextInputComponent {

  protected readonly isPasswordVisible = signal(false);

  protected readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  /** Translation key references (typed via KEEPUI_TRANSLATION_KEYS). */
  protected readonly keys = T.SIGNAL_TEXT_INPUT;

  /** Optional label text rendered above the input. */
  readonly label = input<string>('');

  /** Placeholder passed to the underlying `<input>`. */
  readonly placeholder = input<string>('');

  /** HTML `type` attribute. Use `'password'` to enable the visibility toggle. @default 'text' */
  readonly type = input<SignalTextInputType>('text');

  /** Layout width of the wrapper. @default 'full' */
  readonly width = input<SignalTextInputWidth>('full');

  /** Name of the leading icon (SVG symbol ID). Leave empty for no icon. */
  readonly leadingIcon = input<string>('');

  /** Name of the trailing icon (SVG symbol ID). Ignored when `type="password"`. */
  readonly trailingIcon = input<string>('');

  /**
   * When `true`, a slot for custom trailing content is enabled
   * (projects `[trailingSlot]` content). Overrides `trailingIcon`.
   * @default false
   */
  readonly hasTrailingSlot = input<boolean>(false);

  /** Marks the field as required. Adds `aria-required` and a visual asterisk. @default false */
  readonly required = input<boolean>(false);

  /** When `false`, hides the visual asterisk even if `required=true`. @default true */
  readonly showRequiredIndicator = input<boolean>(true);

  /** Human-readable error message. Takes precedence over `errors[0]`. */
  readonly errorMessage = input<string>('');

  /**
   * Array of error strings. The first item is displayed when `errorMessage` is empty.
   * Set together with `invalid=true` to trigger the error state.
   */
  readonly errors = input<readonly string[]>([]);

  /**
   * Stable `id` used to link the `<label>` with the `<input>`.
   * A random suffix is generated by default.
   */
  readonly inputId = input<string>(
    `ku-text-input-${Math.random().toString(36).slice(2, 8)}`,
  );

  /** Disables the input. @default false */
  readonly disabled = input<boolean>(false);

  /**
   * Forces the error visual state regardless of the `touched` model.
   * Useful for external form validation. @default false
   */
  readonly invalid = input<boolean>(false);

  /** Current text value. Use `[(value)]` for two-way binding. */
  readonly value = model<string>('');

  /** Whether the control has been interacted with. Use `[(touched)]` for two-way binding. */
  readonly touched = model<boolean>(false);

  protected readonly errorId = computed(
    () => `${this.inputId()}-error`,
  );

  protected readonly isPasswordType = computed(() => this.type() === 'password');

  protected readonly resolvedType = computed<string>(() => {
    if (this.isPasswordType()) {
      return this.isPasswordVisible() ? 'text' : 'password';
    }
    return this.type();
  });

  protected readonly widthClass = computed<string>(() => {
    const map: Record<SignalTextInputWidth, string> = {
      full: 'w-full',
      half: 'w-1/2',
      auto: 'w-auto',
    };
    return map[this.width()];
  });

  protected readonly hasLeading = computed(() => this.leadingIcon().length > 0);

  protected readonly hasTrailing = computed(
    () => this.trailingIcon().length > 0 && !this.isPasswordType(),
  );

  protected readonly showError = computed(
    () =>
      this.touched() &&
      (this.invalid() || this.errorMessage().length > 0 || this.errors().length > 0),
  );

  protected readonly isDateEmpty = computed(
    () => this.type() === 'date' && !this.value(),
  );

  protected readonly inputClasses = computed(() => {
    const textColor = this.isDateEmpty()
      ? 'text-ku-gray-text'
      : 'text-ku-primary-text';
    const paddingLeft = this.hasLeading() ? 'pl-9' : 'pl-4';
    const paddingRight = this.hasTrailingSlot()
      ? 'pr-24'
      : this.hasTrailing() || this.isPasswordType()
        ? 'pr-10'
        : 'pr-4';
    const borderColor = this.showError()
      ? 'border-ku-error-primary'
      : 'border-ku-secondary-border focus-visible:border-ku-action-primary';
    const cursor = this.type() === 'date' ? 'cursor-pointer' : '';

    return `${textColor} ${paddingLeft} ${paddingRight} ${borderColor} ${cursor}`;
  });

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  protected onBlur(): void {
    this.touched.set(true);
  }

  protected openDatePicker(): void {
    if (this.type() === 'date') {
      try {
        this.inputRef()?.nativeElement.showPicker();
      } catch { /* showPicker not supported in all browsers */ }
    }
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update(v => !v);
  }
}


