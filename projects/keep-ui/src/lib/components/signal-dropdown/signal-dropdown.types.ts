/** Layout width of the dropdown wrapper. */
export type SignalDropdownWidth = 'full' | 'half' | 'auto';

/** A single option rendered in the dropdown list. */
export interface SignalDropdownOption<T = string> {
  /** Human-readable label shown in the button and the panel. */
  label: string;
  /** Value associated with this option. */
  value: T;
  /** Optional badge strings rendered as pills next to the label. */
  badges?: string[];
}

