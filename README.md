# KeepUI

> Component library for Angular with multi-platform support (web and Angular + Capacitor).
> Built on **Tailwind CSS v4** with full **light/dark** theming and **i18n** via `@jsverse/transloco`.
>
> **Auto-generated** from JSDoc in the source files.
> Do **not** edit manually — run `npm run docs:generate` to update.

---
## 1. Package identity

| Field | Value |
|---|---|
| Package name | `@keepui/ui` |
| Angular compat | `>= 19` |
| Style engine | Tailwind CSS v4 |
| i18n engine | `@jsverse/transloco` |

---
## 2. Installation

### Option A — local build (development)

```bash
npm run build         # outputs to dist/keep-ui
npm install /absolute/path/to/dist/keep-ui
```

### Option B — npm registry

```bash
npm install @keepui/ui
```

### Required peer dependencies

```bash
npm install @angular/common @angular/core @jsverse/transloco
```

---
## 3. Global styles (required)

Add once to the host application's global stylesheet (e.g. `src/styles.css`):

```css
@import "@keepui/ui/styles";
```

Provides:
- Light theme CSS custom properties (default)
- Dark theme via `[data-theme="dark"]`
- Auto dark via `@media (prefers-color-scheme: dark)`
- Tailwind v4 `@theme inline` mappings for all `bg-ku-*`, `text-ku-*`, `border-ku-*` utilities

#### Theme switching at runtime

```ts
document.documentElement.setAttribute('data-theme', 'dark');   // force dark
document.documentElement.setAttribute('data-theme', 'light');  // force light
document.documentElement.removeAttribute('data-theme');         // follow OS
```

---
## 4. Provider setup (`app.config.ts`)

### Web application

```ts
import { provideKeepUi, provideKeepUiI18n } from '@keepui/ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideKeepUi(),              // registers WebFileService for FILE_PORT
    provideKeepUiI18n(),          // default language: 'en'
    // provideKeepUiI18n({ defaultLang: 'es' }),
  ],
};
```

### Angular + Capacitor application

```ts
import { provideKeepUiCapacitor } from '@keepui/ui/capacitor';
import { provideKeepUiI18n } from '@keepui/ui';

export const appConfig: ApplicationConfig = {
  providers: [provideKeepUiCapacitor(), provideKeepUiI18n()],
};
```

> **Rule:** Never register both `provideKeepUi()` and `provideKeepUiCapacitor()` at the same time.

### Available provider functions

#### `provideKeepUiI18n(options?: KeepUiI18nOptions = {}): EnvironmentProviders`

Registers all providers required for KeepUI internationalisation.

- Configures a self-contained Transloco instance scoped to `'keepui'`.
- Bundles all translations **inline** — no HTTP assets required.
- Provides {@link KeepUiLanguageService} so the host app can switch locale.

### Usage in `app.config.ts`
```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideKeepUi(),
    provideKeepUiI18n(),                // default language: 'en'
    provideKeepUiI18n({ defaultLang: 'es' }), // or start in Spanish
  ],
};
```

### Changing language at runtime
```ts
const lang = inject(KeepUiLanguageService);
lang.setLanguage('de');
```

> **Note:** If your application already calls `provideTransloco()`, do NOT
> call `provideKeepUiI18n()` — instead configure your Transloco loader to
> handle the `'keepui/{lang}'` scope paths, and provide `KeepUiLanguageService`
> manually.

#### `provideKeepUi(): EnvironmentProviders`

Registers KeepUI core providers for a **web** Angular application.

Registers `WebFileService` as the implementation of `FILE_PORT`, enabling
all KeepUI components to use the browser's native file picker.

Add to `app.config.ts`:
```ts
export const appConfig: ApplicationConfig = {
  providers: [provideKeepUi()],
};
```

---

## 5. Component API reference

All components are **standalone**. Import directly from `@keepui/ui`.

### 5.1 `ButtonComponent`

**Selector:** `keepui-button`
**Import:** `import { ButtonComponent } from '@keepui/ui';`

Accessible, themed action button with support for variants, shapes, sizes,
loading state, full-width layout, and named icon slots.

Works identically on **web** and **Angular + Capacitor** (no native API usage).

```html
<!-- Basic usage -->
<keepui-button (clicked)="save()">Save</keepui-button>

<!-- Primary, pill-shaped, fixed width -->
<keepui-button variant="primary" shape="pill">Confirm</keepui-button>

<!-- With leading icon (any inline element) -->
<keepui-button variant="outline" size="auto">
  <svg slot="leading" width="16" height="16" aria-hidden="true">…</svg>
  Upload
</keepui-button>

<!-- Loading state -->
<keepui-button [loading]="isSaving()">Saving…</keepui-button>

<!-- Full-width, danger -->
<keepui-button variant="danger" [fullWidth]="true">Delete account</keepui-button>

<!-- Icon-only (requires ariaLabel for accessibility) -->
<keepui-button variant="ghost" size="auto" ariaLabel="Close dialog">
  <svg slot="leading" …>…</svg>
</keepui-button>
```

#### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `ButtonVariant` | `'primary'` | Visual style of the button. |
| `size` | `ButtonSize` | `'md'` | Size mode.
 - `md` → fixed 160 px wide, 40 px tall.
 - `auto` → padding-driven width, 40 px tall. |
| `shape` | `ButtonShape` | `'pill'` | Border-radius style. |
| `type` | `ButtonType` | `'button'` | HTML `type` attribute of the inner `<button>`. |
| `disabled` | `boolean` | `false` | Disables the button when `true`. |
| `loading` | `boolean` | `false` | Replaces the content with an animated spinner and sets `aria-busy`.
 Also disables the button until the operation completes. |
| `fullWidth` | `boolean` | `false` | Expands the button to fill its container width. |
| `ariaLabel` | `string` | `''` | Accessible label for icon-only buttons.
 When provided, sets the `aria-label` attribute on the inner `<button>`. |

#### Outputs

| Output | Emitter type | Description |
|---|---|---|
| `clicked` | `OutputEmitterRef<void>` | Emitted when the button is clicked and is not disabled or loading. |

#### Content slots (`ng-content`)

| Slot | Description |
|---|---|
| *(default)* | Main projected content |
| `[slot='leading']` | Leading icon/element. Hidden while `loading`. |
| `[slot='trailing']` | Trailing icon/element. Hidden while `loading`. |

---
### 5.2 `CardComponent`

**Selector:** `keepui-card`
**Import:** `import { CardComponent } from '@keepui/ui';`

Versatile card container with support for variant, padding, surface colour,
clickable state, selected state, scrollable mode and full-height layout.
Accepts any content via `<ng-content>` and adapts to the active theme automatically.

#### The `screen` padding — automatic bottom spacer

`padding="screen"` applies horizontal and top padding but intentionally omits
the bottom padding so that content appears to continue beyond the visible area,
inviting the user to scroll. A hidden spacer element is automatically appended
after all projected content: when the user reaches the bottom of the scroll the
correct visual gap is shown **without any manual `padding-bottom` on the
projected content**.

```html
<!-- Basic usage -->
<keepui-card>
  <h2>Title</h2>
  <p>Some content</p>
</keepui-card>

<!-- Flat card, large padding, clickable -->
<keepui-card variant="flat" padding="lg" [clickable]="true" (clicked)="onSelect()">
  Clickable flat card
</keepui-card>

<!-- Selected state (brand-colour border) -->
<keepui-card [clickable]="true" [selected]="isSelected" (clicked)="isSelected = true">
  Select me
</keepui-card>

<!-- Scrollable panel — bottom padding handled automatically -->
<div class="h-screen overflow-hidden">
  <keepui-card padding="screen" [scrollable]="true" [fullHeight]="true">
    <!-- Long content list — no padding-bottom needed -->
    @for (item of items; track item) {
      <div class="py-3 border-b border-ku-secondary-border">{{ item }}</div>
    }
  </keepui-card>
</div>

<!-- Secondary surface colour -->
<keepui-card colors="secondary">Secondary surface</keepui-card>
```

#### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `CardVariant` | `'outlined'` | `outlined` shows a subtle border; `flat` has no border. |
| `padding` | `CardPadding` | `'md'` | Internal spacing. `screen` applies horizontal + top padding and auto-inserts a bottom spacer. |
| `colors` | `CardColors` | `'primary'` | Background surface colour token. |
| `clickable` | `boolean` | `false` | Enables hover, focus ring and button semantics (`role="button"`, `tabindex="0"`). |
| `selected` | `boolean` | `false` | Renders a brand-colour border to indicate the selected state. |
| `scrollable` | `boolean` | `false` | Activates `overflow-y-auto`. Pair with `fullHeight` for a constrained scroll area. |
| `fullHeight` | `boolean` | `false` | Applies `h-full` to both the host element and the inner container. |

#### Outputs

| Output | Emitter type | Description |
|---|---|---|
| `clicked` | `OutputEmitterRef<void>` | Emitted on click or `Enter` / `Space` keydown when `clickable` is `true`. |

#### Content slots (`ng-content`)

| Slot | Description |
|---|---|
| *(default)* | Any projected content. |

---
### 5.3 `ImagePreviewComponent`

**Selector:** `keepui-image-preview`
**Import:** `import { ImagePreviewComponent } from '@keepui/ui';`

Standalone component that allows the user to pick and preview an image.

This component is fully platform-agnostic. It delegates file picking to
whatever `FilePort` implementation is provided via `FILE_PORT`.

UI strings are fully internationalised via Transloco (scope `'keepui'`).
Call `provideKeepUiI18n()` in your `app.config.ts` and use
`KeepUiLanguageService.setLanguage(lang)` to change locale at runtime.

Usage:
```html
<keepui-image-preview />
```

Prerequisites — register providers in `app.config.ts`:
- Web:      `provideKeepUi()` + `provideKeepUiI18n()`
- Capacitor: `provideKeepUiCapacitor()` + `provideKeepUiI18n()`

#### Public signals (readable from outside)

| Signal | Type | Description |
|---|---|---|
| `imageUrl` | `Signal<string | null>` | URL of the selected image, ready to bind to `[src]`. |
| `error` | `Signal<string | null>` | Error message if the last pick operation failed. |
| `loading` | `Signal<boolean>` | True while the pick operation is in progress. |

---

## 6. Type definitions

### Button types

> Visual style variant of the button.

```ts
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
```

> Size mode of the button.
- `md`: fixed width (160 px) and height (40 px).
- `auto`: height fixed (40 px), width grows with padding to fit content.

```ts
type ButtonSize = 'md' | 'auto';
```

> Border-radius style of the button.
- `pill`: fully rounded (`rounded-full`).
- `rounded`: moderately rounded (`rounded-2xl`).

```ts
type ButtonShape = 'pill' | 'rounded';
```

> HTML `type` attribute for the underlying `<button>` element.

```ts
type ButtonType = 'button' | 'submit' | 'reset';
```

### Card types

> Visual border style of the card.
- `outlined`: subtle border using the secondary border token.
- `flat`: no border.

```ts
type CardVariant = 'flat' | 'outlined';
```

> Internal padding preset.
- `none`: no padding.
- `sm`: 12 px all sides.
- `md`: 16 px all sides (default).
- `lg`: 24 px all sides.
- `screen`: 16 px horizontal + 16 px top, no bottom. A spacer element is
  automatically appended so the bottom gap appears when the user scrolls
  to the end — no manual `padding-bottom` required on the projected content.

```ts
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'screen';
```

> Background surface colour.
- `primary`: maps to `--ku-primary`.
- `secondary`: maps to `--ku-secondary`.

```ts
type CardColors = 'primary' | 'secondary';
```

---

## 7. Interfaces & models

### `FileResult`

Represents the result of a file/image selection operation.
This model is platform-agnostic and used across all adapters.

```ts
interface FileResult {
  /** A data URL (e.g. `data:image/jpeg;base64,...`) or an HTTP/file URL ready to display. */
  dataUrl: string;
  /** MIME type of the selected file, e.g. `image/jpeg`. */
  mimeType: string;
}
```

### `FilePort`

Platform-agnostic port (interface) for file/image selection.

Provide a concrete implementation via the `FILE_PORT` injection token.
- Web: `WebFileService`
- Capacitor: `CapacitorFileService` (from `@keepui/ui/capacitor`)

```ts
interface FilePort {
  /** Opens a platform-native image picker and returns the selected image.
Resolves with a `FileResult` containing a displayable URL and MIME type.
Rejects if the user cancels or an error occurs. */
  pickImage(): Promise<FileResult>;
}
```

---

## 8. Services

### `KeepUiLanguageService`

Service that exposes a public API for changing the active language of all
KeepUI components at runtime.

### Usage
```ts
// Inject anywhere in the host application
const lang = inject(KeepUiLanguageService);

// Switch to Spanish
lang.setLanguage('es');

// Read the active language
console.log(lang.activeLanguage()); // 'es'
```

Register via `provideKeepUiI18n()` in `app.config.ts`.

**Public properties:**

| Property | Type | Description |
|---|---|---|
| `activeLanguage` | — | Signal that reflects the currently active KeepUI locale. |
| `availableLanguages` | `readonly KeepUiLanguage[]` | Ordered list of all supported locales. |

**Public methods:**

- `setLanguage(lang: KeepUiLanguage): void` — Changes the active language for all KeepUI components.

### `WebFileService`

Web implementation of `FilePort`.

Uses a hidden `<input type="file">` and the `FileReader` API to let the user
pick an image from the file system in a browser environment.

This implementation has no dependency on Capacitor or any native plugin.

**Public methods:**

- `pickImage(): Promise<FileResult>` — 

---

## 9. Internationalisation (i18n)

Use typed constants instead of raw strings:

```ts
import { KEEPUI_TRANSLATION_KEYS as T } from '@keepui/ui';

// Example
translocoService.translate(T.IMAGE_PREVIEW.SELECT_IMAGE);
```

**Supported languages:** `en` (English), `es` (Spanish), `de` (German)

**Translation keys:**

| Constant path | Translation key |
|---|---|
| `IMAGE_PREVIEW.SELECT_IMAGE` | `imagePreview.selectImage` |
| `IMAGE_PREVIEW.LOADING` | `imagePreview.loading` |
| `IMAGE_PREVIEW.PREVIEW_ALT` | `imagePreview.previewAlt` |
| `IMAGE_PREVIEW.ERROR_UNEXPECTED` | `imagePreview.errorUnexpected` |

**Changing language at runtime:**

```ts
import { KeepUiLanguageService } from '@keepui/ui';

const lang = inject(KeepUiLanguageService);
lang.setLanguage('es');  // 'en' | 'es' | 'de'
```

---

## 10. CSS design tokens

All tokens follow the `--ku-*` naming convention and are defined in
`@keepui/ui/styles`. Override any variable in your CSS to customise the theme.

### Surface tokens

```css
:root {
  /* Primary surface (app background) */
  --ku-primary:        #F9F9F9;
  --ku-primary-hover:  #E2E3E8;
  --ku-primary-text:   #171717;
  --ku-primary-border: #E2E3E8;

  /* Secondary surface (cards, panels) */
  --ku-secondary:        #FFFFFF;
  --ku-secondary-hover:  #F9F9F9;
  --ku-secondary-text:   #171717;
  --ku-secondary-border: #E2E3E8;
}

[data-theme="dark"] {
  --ku-primary:        #050505;
  --ku-primary-hover:  #2C2D31;
  --ku-primary-text:   #FFFFFF;
  --ku-primary-border: #2C2D31;

  --ku-secondary:        #15161A;
  --ku-secondary-hover:  #2C2D31;
  --ku-secondary-text:   #FFFFFF;
  --ku-secondary-border: #2C2D31;
}
```

### Semantic colour palette

Each semantic colour exposes three tokens: `*-bg`, `*-border`, `*-text`.

```css
:root {
  /* Gray */
  --ku-gray-bg: #F5F5F5;   --ku-gray-border: #D5D7DA;   --ku-gray-text: #6B7280;

  /* Brand (purple) */
  --ku-brand-bg: #F9F5FF;  --ku-brand-border: #D6BBFB;  --ku-brand-text: #6941C6;

  /* Indigo */
  --ku-indigo-bg: #EEF4FF; --ku-indigo-border: #C7D7FE; --ku-indigo-text: #3538CD;

  /* Blue */
  --ku-blue-bg: #EFF8FF;   --ku-blue-border: #B2DDFF;   --ku-blue-text: #175CD3;

  /* Pink */
  --ku-pink-bg: #FDF2FA;   --ku-pink-border: #FCCEEE;   --ku-pink-text: #C11574;

  /* Orange */
  --ku-orange-bg: #FFF6ED; --ku-orange-border: #F9DBAF; --ku-orange-text: #B93815;

  /* Yellow */
  --ku-yellow-bg: #FEFBE8; --ku-yellow-border: #FEDF89; --ku-yellow-text: #A15C07;

  /* Green */
  --ku-green-bg: #ECFDF3;  --ku-green-border: #ABEFC6;  --ku-green-text: #067647;

  /* Purple */
  --ku-purple-bg: #F4F3FF; --ku-purple-border: #D9D6FE; --ku-purple-text: #5925DC;

  /* Teal */
  --ku-teal-bg: #F0FDFA;   --ku-teal-border: #99F6E4;   --ku-teal-text: #0F766E;

  /* Red */
  --ku-red-bg: #FFF1F2;    --ku-red-border: #FECDD3;    --ku-red-text: #B91C1C;
}

[data-theme="dark"] {
  --ku-gray-bg: #1F2937;   --ku-gray-border: #4B5563;   --ku-gray-text: #9CA3AF;
  --ku-brand-bg: #2E1065;  --ku-brand-border: #7C3AED;  --ku-brand-text: #C4B5FD;
  --ku-indigo-bg: #1E1B4B; --ku-indigo-border: #4338CA; --ku-indigo-text: #A5B4FC;
  --ku-blue-bg: #0C1D3E;   --ku-blue-border: #2563EB;   --ku-blue-text: #93C5FD;
  --ku-pink-bg: #3D0B2F;   --ku-pink-border: #DB2777;   --ku-pink-text: #F9A8D4;
  --ku-orange-bg: #2C1204; --ku-orange-border: #EA580C; --ku-orange-text: #FDBA74;
  --ku-yellow-bg: #2C1F02; --ku-yellow-border: #CA8A04; --ku-yellow-text: #FDE047;
  --ku-green-bg: #052E16;  --ku-green-border: #16A34A;  --ku-green-text: #4ADE80;
  --ku-purple-bg: #1C1040; --ku-purple-border: #6D28D9; --ku-purple-text: #C4B5FD;
  --ku-teal-bg: #042A28;   --ku-teal-border: #0D9488;   --ku-teal-text: #2DD4BF;
  --ku-red-bg: #2D0B0B;    --ku-red-border: #DC2626;    --ku-red-text: #FCA5A5;
}
```

> Auto dark mode is also supported via `@media (prefers-color-scheme: dark)` for
> apps that do not set `[data-theme]` explicitly.

---

## 11. Tailwind utility classes

Generated automatically after `@import "@keepui/ui/styles"` with Tailwind v4.
All utilities use the `ku-` prefix and map directly to the CSS custom properties.

```
/* Surface backgrounds */
bg-ku-primary          bg-ku-primary-hover
bg-ku-secondary        bg-ku-secondary-hover

/* Text */
text-ku-primary-text   text-ku-secondary-text
text-ku-gray-text      text-ku-brand-text

/* Borders */
border-ku-primary-border    border-ku-secondary-border
border-ku-gray-border       border-ku-brand-border

/* Semantic colours — bg / border / text per colour */
bg-ku-gray-bg    border-ku-gray-border    text-ku-gray-text
bg-ku-brand-bg   border-ku-brand-border   text-ku-brand-text
bg-ku-indigo-bg  border-ku-indigo-border  text-ku-indigo-text
bg-ku-blue-bg    border-ku-blue-border    text-ku-blue-text
bg-ku-pink-bg    border-ku-pink-border    text-ku-pink-text
bg-ku-orange-bg  border-ku-orange-border  text-ku-orange-text
bg-ku-yellow-bg  border-ku-yellow-border  text-ku-yellow-text
bg-ku-green-bg   border-ku-green-border   text-ku-green-text
bg-ku-purple-bg  border-ku-purple-border  text-ku-purple-text
bg-ku-teal-bg    border-ku-teal-border    text-ku-teal-text
bg-ku-red-bg     border-ku-red-border     text-ku-red-text

/* Focus rings */
focus-visible:ring-ku-primary-border
focus-visible:ring-ku-brand-border
```

---

## 12. Integration checklist

- [ ] `@keepui/ui` installed in `package.json`
- [ ] `@import "@keepui/ui/styles"` in global stylesheet
- [ ] Tailwind v4 configured (via `@tailwindcss/postcss` or `@tailwindcss/vite`)
- [ ] `provideKeepUi()` **or** `provideKeepUiCapacitor()` registered in `app.config.ts`
- [ ] `provideKeepUiI18n()` registered in `app.config.ts`
- [ ] Components imported individually in each standalone component or NgModule
- [ ] `[data-theme="dark"]` toggle wired if dark mode switching is needed
- [ ] `KeepUiLanguageService.setLanguage()` called if runtime i18n is needed

---

## 13. What NOT to do

- Do **not** import from `@keepui/ui/src/lib/...` — only from `@keepui/ui` or `@keepui/ui/capacitor`.
- Do **not** call both `provideKeepUi()` and `provideKeepUiCapacitor()`.
- Do **not** hardcode `FILE_PORT` implementations inside components — always use the token.
- Do **not** skip `@import "@keepui/ui/styles"` — without it, all theme utility classes are missing.
- Do **not** import `@capacitor/*` in code that also imports `@keepui/ui` core.
