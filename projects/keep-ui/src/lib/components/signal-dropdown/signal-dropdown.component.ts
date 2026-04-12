import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  computed,
  viewChild,
  ElementRef,
  effect,
  signal,
  DestroyRef,
  inject,
  output,
} from '@angular/core';
import { SignalDropdownOption, SignalDropdownWidth } from './signal-dropdown.types';
import { IconComponent } from '../icon/icon.component';

const DROPDOWN_ITEM_HEIGHT = 40;
const DROPDOWN_PADDING = 8;
const DROPDOWN_GAP = 8;

/**
 * Signal-based accessible dropdown / select component.
 *
 * Fully platform-agnostic — no native API usage. The panel opens in `fixed`
 * position so it is never clipped by overflow-hidden ancestors. It repositions
 * itself automatically on scroll and resize.
 *
 * The `value` and `touched` properties are `model()` signals so the component
 * integrates seamlessly with Angular signal-based forms.
 *
 * ```html
 * <keepui-signal-dropdown
 *   label="País"
 *   placeholder="Selecciona un país"
 *   [options]="countries"
 *   [(value)]="selectedCountry"
 * />
 * ```
 *
 * @typeParam T – type of each option's `value` property. Defaults to `string`.
 */
@Component({
  selector: 'keepui-signal-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: {
    class: 'block',
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'close()',
  },
  template: `
    <div class="flex flex-col gap-1" [class]="widthClass()">

      @if (label()) {
        <label [for]="selectId()" class="text-sm text-ku-gray-text">
          {{ label() }}
          @if (required()) {
            <span class="text-ku-error-primary" aria-hidden="true"> *</span>
          }
        </label>
      }

      <div class="relative" #dropdownContainer>

        <button
          #dropdownButton
          [id]="selectId()"
          type="button"
          [disabled]="disabled()"
          [attr.aria-disabled]="disabled() ? true : null"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-haspopup]="'listbox'"
          [attr.aria-required]="required() ? true : null"
          [attr.aria-invalid]="showError() ? true : null"
          [attr.aria-describedby]="showError() ? errorId() : null"
          (click)="toggleDropdown()"
          (blur)="onBlur()"
          (keydown)="onButtonKeydown($event)"
          class="w-full inline-flex items-center gap-2 bg-ku-primary border rounded-xl
                 px-4 py-2.5 text-sm transition-all cursor-pointer min-h-[2.75rem]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ku-action-primary
                 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          [class]="showError() ? 'border-ku-error-primary' : 'border-ku-secondary-border'"
        >
          <span
            class="flex-1 text-left flex items-center justify-between gap-2 min-w-0"
            [class]="value() === null ? 'text-ku-gray-text opacity-70' : 'text-ku-primary-text'"
          >
            <span class="truncate">{{ selectedLabel() }}</span>

            @if (selectedBadges().length) {
              <span class="flex flex-wrap items-center gap-1.5 shrink-0">
                @for (badge of selectedBadges(); track badge) {
                  <span class="inline-flex items-center rounded-full bg-ku-action-background
                               px-2 py-0.5 text-[11px] font-medium text-ku-action-primary">
                    {{ badge }}
                  </span>
                }
              </span>
            }
          </span>

          <keepui-icon
            name="chevron-down-icon"
            [size]="18"
            aria-hidden="true"
            class="text-ku-gray-text transition-transform duration-200 shrink-0"
            [class.rotate-180]="isOpen()"
          />
        </button>

        @if (isOpen()) {
          <div
            role="listbox"
            [attr.aria-label]="label() || null"
            class="fixed rounded-xl shadow-lg bg-ku-primary border border-ku-secondary-border
                   z-[1000] overflow-y-auto max-h-64"
            [style]="panelStyle()"
          >
            @for (option of options(); track option.value; let i = $index) {
              <button
                type="button"
                role="option"
                [attr.aria-selected]="isSelected(option.value)"
                (click)="selectOption(option)"
                (keydown)="onOptionKeydown($event, option, i)"
                class="w-full text-left cursor-pointer px-4 py-2 text-sm text-ku-primary-text
                       flex items-center gap-3 transition-colors min-h-[2.75rem]
                       hover:bg-ku-primary-hover focus-visible:outline-none
                       focus-visible:bg-ku-primary-hover"
                [class]="isSelected(option.value) ? 'bg-ku-primary-hover' : ''"
              >
                <span class="flex-1 flex items-center justify-between gap-2 min-w-0">
                  <span class="truncate">{{ option.label }}</span>

                  @if (option.badges?.length) {
                    <span class="flex flex-wrap items-center gap-1.5 shrink-0">
                      @for (badge of option.badges ?? []; track badge) {
                        <span class="inline-flex items-center rounded-full bg-ku-action-background
                                     px-2 py-0.5 text-[11px] font-medium text-ku-action-primary">
                          {{ badge }}
                        </span>
                      }
                    </span>
                  }
                </span>

                @if (isSelected(option.value)) {
                  <keepui-icon
                    name="check-icon"
                    [size]="16"
                    aria-hidden="true"
                    class="text-ku-action-primary shrink-0"
                  />
                }
              </button>
            }
          </div>
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
export class SignalDropdownComponent<T = string> {

  private readonly destroyRef = inject(DestroyRef);

  protected readonly isOpen = signal(false);
  protected readonly openUpwards = signal(false);
  protected readonly panelTopPx = signal(0);
  protected readonly panelLeftPx = signal(0);
  protected readonly panelWidthPx = signal(0);

  protected readonly dropdownButton =
    viewChild<ElementRef<HTMLButtonElement>>('dropdownButton');
  protected readonly dropdownContainer =
    viewChild<ElementRef<HTMLElement>>('dropdownContainer');

  /** Optional label text rendered above the dropdown. */
  readonly label = input<string>('');

  /** Placeholder shown when no value is selected. */
  readonly placeholder = input<string>('');

  /** Array of options to display in the panel. */
  readonly options = input.required<SignalDropdownOption<T>[]>();

  /** Layout width of the wrapper. @default 'full' */
  readonly width = input<SignalDropdownWidth>('full');

  /** Marks the field as required. Adds `aria-required` and a visual asterisk. @default false */
  readonly required = input<boolean>(false);

  /** Human-readable error message shown below the dropdown. Takes precedence over `errors[0]`. */
  readonly errorMessage = input<string>('');

  /**
   * Array of error strings. The first item is displayed when `errorMessage` is empty.
   * Set together with `invalid=true` to trigger the error state.
   */
  readonly errors = input<readonly string[]>([]);

  /**
   * Stable `id` used to link the `<label>` with the trigger `<button>`.
   * A random suffix is generated by default.
   */
  readonly selectId = input<string>(
    `ku-dropdown-${Math.random().toString(36).slice(2, 8)}`,
  );

  /** Disables the dropdown. @default false */
  readonly disabled = input<boolean>(false);

  /**
   * Forces the error visual state regardless of the `touched` model.
   * Useful for external form validation. @default false
   */
  readonly invalid = input<boolean>(false);

  /** Currently selected value. Use `[(value)]` for two-way binding. */
  readonly value = model<T | null>(null);

  /** Whether the control has been interacted with. Use `[(touched)]` for two-way binding. */
  readonly touched = model<boolean>(false);

  /** Emitted when the selected value changes. */
  readonly valueChange = output<T | null>();

  protected readonly errorId = computed(
    () => `${this.selectId()}-error`,
  );

  protected readonly panelStyle = computed<string>(
    () =>
      `top:${this.panelTopPx()}px;left:${this.panelLeftPx()}px;width:${this.panelWidthPx()}px`,
  );

  protected readonly widthClass = computed<string>(() => {
    const map: Record<SignalDropdownWidth, string> = {
      full: 'w-full',
      half: 'w-1/2',
      auto: 'w-auto',
    };
    return map[this.width()];
  });

  protected readonly selectedLabel = computed<string>(() => {
    const current = this.value();
    if (current === null) return this.placeholder();
    return this.options().find(o => o.value === current)?.label ?? this.placeholder();
  });

  protected readonly selectedBadges = computed<string[]>(() => {
    const current = this.value();
    if (current === null) return [];
    return this.options().find(o => o.value === current)?.badges ?? [];
  });

  protected readonly showError = computed(
    () => this.touched() && (this.invalid() || this.errorMessage().length > 0 || this.errors().length > 0),
  );

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.calculateDropdownPosition();
        this.addViewportListeners();
      } else {
        this.removeViewportListeners();
      }
    });

    this.destroyRef.onDestroy(() => this.removeViewportListeners());
  }

  protected onDocumentClick(event: MouseEvent): void {
    const container = this.dropdownContainer()?.nativeElement;
    if (container && !container.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  protected toggleDropdown(): void {
    if (this.disabled()) return;
    this.isOpen.update(open => !open);
  }

  protected close(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.dropdownButton()?.nativeElement.focus();
    }
  }

  protected selectOption(option: SignalDropdownOption<T>): void {
    this.value.set(option.value);
    this.isOpen.set(false);
    this.dropdownButton()?.nativeElement.focus();
    this.valueChange.emit(option.value);
  }

  protected onBlur(): void {
    this.touched.set(true);
  }

  protected isSelected(optionValue: T): boolean {
    return this.value() === optionValue;
  }

  protected onButtonKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.isOpen()) {
        this.isOpen.set(true);
      }
    }
  }

  protected onOptionKeydown(
    event: KeyboardEvent,
    option: SignalDropdownOption<T>,
    index: number,
  ): void {
    const panel = this.dropdownContainer()?.nativeElement;
    const optionButtons = panel?.querySelectorAll<HTMLButtonElement>('[role="option"]');
    if (!optionButtons) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      optionButtons[Math.min(index + 1, optionButtons.length - 1)]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index === 0) {
        this.dropdownButton()?.nativeElement.focus();
      } else {
        optionButtons[index - 1]?.focus();
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectOption(option);
    }
  }

  private calculateDropdownPosition(): void {
    const button = this.dropdownButton()?.nativeElement;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const estimatedHeight = Math.min(
      this.options().length * DROPDOWN_ITEM_HEIGHT + DROPDOWN_PADDING,
      256,
    );
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldOpenUpwards =
      spaceBelow < estimatedHeight + DROPDOWN_GAP &&
      spaceAbove > estimatedHeight + DROPDOWN_GAP;

    this.openUpwards.set(shouldOpenUpwards);
    this.panelWidthPx.set(rect.width);
    this.panelLeftPx.set(rect.left);
    this.panelTopPx.set(
      shouldOpenUpwards
        ? rect.top - estimatedHeight - DROPDOWN_GAP
        : rect.bottom + DROPDOWN_GAP,
    );
  }

  private readonly recalculatePosition = (): void => {
    if (this.isOpen()) this.calculateDropdownPosition();
  };

  private addViewportListeners(): void {
    this.removeViewportListeners();
    window.addEventListener('scroll', this.recalculatePosition, true);
    window.addEventListener('resize', this.recalculatePosition);
  }

  private removeViewportListeners(): void {
    window.removeEventListener('scroll', this.recalculatePosition, true);
    window.removeEventListener('resize', this.recalculatePosition);
  }
}

