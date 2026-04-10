/** Visual style variant of the button. */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * Size mode of the button.
 * - `md`: fixed width (160 px) and height (40 px).
 * - `auto`: height fixed (40 px), width grows with padding to fit content.
 */
export type ButtonSize = 'md' | 'auto';

/**
 * Border-radius style of the button.
 * - `pill`: fully rounded (`rounded-full`).
 * - `rounded`: moderately rounded (`rounded-2xl`).
 */
export type ButtonShape = 'pill' | 'rounded';

/** HTML `type` attribute for the underlying `<button>` element. */
export type ButtonType = 'button' | 'submit' | 'reset';

