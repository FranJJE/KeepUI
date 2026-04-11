import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

export type CardVariant = 'flat' | 'outlined';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'screen';
export type CardColors = 'primary' | 'secondary';

/**
 * Contenedor versátil con soporte de variante, padding, color, estado clickable,
 * seleccionado y scrollable.
 *
 * `padding="screen"` aplica padding lateral y superior pero omite el inferior
 * intencionadamente para que el contenido parezca continuar más allá del área visible,
 * invitando al usuario a hacer scroll. Un `div` espaciador se inserta automáticamente
 * al final del contenido proyectado: cuando el usuario llega al fondo, el espaciador
 * reproduce el padding inferior correcto sin que el consumidor deba declararlo.
 *
 * ```html
 * <keepui-card>Contenido</keepui-card>
 *
 * <keepui-card variant="flat" padding="lg" [clickable]="true" (clicked)="onSelect()">
 *   Card clicable
 * </keepui-card>
 *
 * <div class="h-screen overflow-hidden">
 *   <keepui-card padding="screen" [scrollable]="true" [fullHeight]="true">
 *     Contenido largo — el padding inferior se gestiona automáticamente
 *   </keepui-card>
 * </div>
 * ```
 */
@Component({
  selector: 'keepui-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
    '[class.h-full]': 'fullHeight()',
  },
  template: `
    <div
      [class]="cardClass()"
      (click)="onCardClick()"
      [attr.role]="clickable() ? 'button' : null"
      [attr.tabindex]="clickable() ? 0 : null"
      (keydown.enter)="onCardClick()"
      (keydown.space)="onCardClick()"
    >
      <ng-content />
      @if (padding() === 'screen') {
        <div class="h-4 shrink-0" aria-hidden="true"></div>
      }
    </div>
  `,
})
export class CardComponent {
  private readonly BASE_CLASS = 'rounded-xl transition-colors overflow-hidden';

  private readonly VARIANT_CLASS_MAP: Record<CardVariant, string> = {
    flat: '',
    outlined: 'border border-ku-secondary-border',
  };

  private readonly SELECTED_VARIANT_CLASS_MAP: Record<CardVariant, string> = {
    flat: 'border border-ku-brand-border',
    outlined: 'border border-ku-brand-border',
  };

  private readonly PADDING_CLASS_MAP: Record<CardPadding, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    screen: 'px-4 pt-4',
  };

  private readonly COLORS_CLASS_MAP: Record<CardColors, string> = {
    primary: 'bg-ku-primary',
    secondary: 'bg-ku-secondary',
  };

  readonly variant = input<CardVariant>('outlined');
  readonly padding = input<CardPadding>('md');
  readonly colors = input<CardColors>('primary');
  readonly clickable = input<boolean>(false);
  readonly selected = input<boolean>(false);
  readonly scrollable = input<boolean>(false);
  readonly fullHeight = input<boolean>(false);
  readonly clicked = output<void>();

  protected readonly cardClass = computed<string>(() => {
    const variantClass = this.selected()
      ? this.SELECTED_VARIANT_CLASS_MAP[this.variant()]
      : this.VARIANT_CLASS_MAP[this.variant()];

    const classes = [
      this.BASE_CLASS,
      this.COLORS_CLASS_MAP[this.colors()],
      variantClass,
      this.PADDING_CLASS_MAP[this.padding()],
    ];

    if (this.clickable()) {
      classes.push(
        'cursor-pointer hover:bg-ku-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ku-brand-border focus-visible:ring-offset-2'
      );
    }

    if (this.scrollable()) {
      classes.push('overflow-y-auto', 'overflow-x-auto');
    }

    if (this.fullHeight()) {
      classes.push('h-full');
    }

    return classes.filter(Boolean).join(' ');
  });

  protected onCardClick(): void {
    if (this.clickable()) {
      this.clicked.emit();
    }
  }
}
