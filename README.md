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
- Tailwind v4 `@theme inline` mappings for all `bg-keepui-*`, `text-keepui-*`, `border-keepui-*`, `shadow-keepui-*` utilities

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
| `size` | `ButtonSize` | `'md'` | Size mode. - `md` → fixed 160 px wide, 40 px tall. - `auto` → padding-driven width, 40 px tall. |
| `shape` | `ButtonShape` | `'pill'` | Border-radius style. |
| `type` | `ButtonType` | `'button'` | HTML `type` attribute of the inner `<button>`. |
| `disabled` | `boolean` | `false` | Disables the button when `true`. |
| `loading` | `boolean` | `false` | Replaces the content with an animated spinner and sets `aria-busy`. Also disables the button until the operation completes. |
| `fullWidth` | `boolean` | `false` | Expands the button to fill its container width. |
| `ariaLabel` | `string` | `''` | Accessible label for icon-only buttons. When provided, sets the `aria-label` attribute on the inner `<button>`. |

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

A versatile card container component.

```html
<keepui-card>
  <h2>Title</h2>
  <p>Some content</p>
</keepui-card>

<keepui-card [elevation]="2">
  Elevated card
</keepui-card>
```

#### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `elevation` | `0 | 1 | 2 | 3` | `1` | Shadow elevation level (0–3). |

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

Override any variable in your CSS to customise the theme:

```css
:root {
  --keepui-primary:            #3b82f6;
  --keepui-primary-hover:      #2563eb;
  --keepui-primary-active:     #1d4ed8;
  --keepui-primary-foreground: #ffffff;
  --keepui-background:         #f5f5f5;
  --keepui-surface:            #ffffff;
  --keepui-surface-hover:      #f0f0f0;
  --keepui-border:             #e0e0e0;
  --keepui-border-strong:      #cccccc;
  --keepui-text:               #1f2937;
  --keepui-text-muted:         #6b7280;
  --keepui-text-disabled:      #9ca3af;
  --keepui-error:              #dc2626;
  --keepui-error-foreground:   #ffffff;
  --keepui-success:            #16a34a;
  --keepui-warning:            #f59e0b;
  --keepui-shadow-sm:          0 1px 3px rgba(0,0,0,.12);
  --keepui-shadow-md:          0 3px 6px rgba(0,0,0,.15);
  --keepui-shadow-lg:          0 6px 12px rgba(0,0,0,.18);
}

[data-theme="dark"] {
  --keepui-primary:            #60a5fa;
  --keepui-primary-foreground: #0f172a;
  --keepui-background:         #0f172a;
  --keepui-surface:            #1e293b;
  --keepui-surface-hover:      #334155;
  --keepui-border:             #334155;
  --keepui-border-strong:      #475569;
  --keepui-text:               #f1f5f9;
  --keepui-text-muted:         #94a3b8;
  --keepui-text-disabled:      #64748b;
  --keepui-error:              #f87171;
  --keepui-error-foreground:   #0f172a;
  --keepui-success:            #4ade80;
  --keepui-warning:            #fbbf24;
}
```

---

## 11. Tailwind utility classes

Generated automatically after `@import "@keepui/ui/styles"` with Tailwind v4:

```
bg-keepui-background      bg-keepui-surface        bg-keepui-surface-hover
bg-keepui-primary         bg-keepui-primary-hover  bg-keepui-primary-active
bg-keepui-error           bg-keepui-success        bg-keepui-warning

text-keepui-text          text-keepui-text-muted   text-keepui-text-disabled
text-keepui-primary       text-keepui-primary-fg   text-keepui-error

border-keepui-border      border-keepui-border-strong  border-keepui-primary

shadow-keepui-sm          shadow-keepui-md         shadow-keepui-lg

focus-visible:ring-keepui-primary
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
