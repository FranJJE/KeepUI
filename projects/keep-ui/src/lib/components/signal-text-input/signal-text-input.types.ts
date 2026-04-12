/** Layout width of the text input wrapper. */
export type SignalTextInputWidth = 'full' | 'half' | 'auto';

/**
 * HTML `type` attribute for the underlying `<input>` element.
 * Use `'password'` to enable the built-in show/hide toggle.
 */
export type SignalTextInputType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'password'
  | 'search'
  | 'url'
  | 'date';

