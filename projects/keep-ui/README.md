# KeepUI

> Angular cross-platform UI component library with optional Capacitor support.

[![npm version](https://img.shields.io/npm/v/@keepui/ui.svg)](https://www.npmjs.com/package/@keepui/ui)
[![license](https://img.shields.io/npm/l/@keepui/ui.svg)](LICENSE)

---

## Table of Contents

- [Purpose](#purpose)
- [Package Structure](#package-structure)
- [Installation](#installation)
- [Setup](#setup)
  - [1. Import styles](#1-import-styles)
  - [2. Register providers](#2-register-providers)
- [Available Components](#available-components)
  - [`<keepui-button>`](#keepui-button)
  - [`<keepui-card>`](#keepui-card)
  - [`<keepui-icon>`](#keepui-icon)
  - [`<keepui-icon-action-button>`](#keepui-icon-action-button)
  - [`<keepui-image-preview>`](#keepui-image-preview)
- [i18n](#i18n)
- [Theming](#theming)
- [Architecture Notes](#architecture-notes)
- [Testing](#testing)
- [Building](#building)
- [Publishing to npm](#publishing-to-npm)

---

## Purpose

KeepUI is a reusable Angular component library designed to work seamlessly across:

- **Standard Angular web applications** (browser only)
- **Angular + Capacitor applications** (iOS, Android, PWA)

The library uses a **Port/Adapter pattern** to keep UI components fully decoupled from platform-specific APIs. Components never import `@capacitor/*` directly; they depend on injected interface implementations registered via functional providers.

---

## Package Structure

| Package | Description |
|---|---|
| `@keepui/ui` | Core components, ports, tokens, services, web adapter |
| `@keepui/ui/capacitor` | Capacitor adapter — use *instead of* the web provider |

---

## Installation

```bash
# Using ng add (recommended):
ng add @keepui/ui

# Or manually:
npm install @keepui/ui
```

For Capacitor support (optional):

```bash
npm install @capacitor/core @capacitor/camera
npx cap sync
```

---

## Setup

### 1. Import styles

KeepUI components use CSS custom properties for theming. Import the library styles in your global stylesheet **before** any component-level styles.

**If your project uses Tailwind CSS v4:**

```css
/* src/styles.css */
@import "tailwindcss";
@import "@keepui/ui/styles";
```

**If your project does NOT use Tailwind:**

```css
/* src/styles.css */
@import "@keepui/ui/styles/prebuilt.css";
```

### 2. Register providers

Register one platform provider plus the i18n provider in `app.config.ts`.

**Web:**

```ts
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideKeepUi, provideKeepUiI18n } from '@keepui/ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideKeepUi(),
    provideKeepUiI18n({ defaultLang: 'en' }),
  ],
};
```

**Angular + Capacitor:**

```ts
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideKeepUiI18n } from '@keepui/ui';
import { provideKeepUiCapacitor } from '@keepui/ui/capacitor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideKeepUiCapacitor(),          // instead of provideKeepUi()
    provideKeepUiI18n({ defaultLang: 'en' }),
  ],
};
```

> **Note:** Use `provideKeepUiCapacitor()` **instead of** `provideKeepUi()` — never both.

---

## Available Components

### `<keepui-button>`

Accessible, themed action button with variants, shapes, sizes, loading state, full-width layout, and named icon slots.

```html
<!-- Basic -->
<keepui-button (clicked)="save()">Save</keepui-button>

<!-- Variant + shape -->
<keepui-button variant="danger" shape="rounded" size="auto">Delete</keepui-button>

<!-- With leading icon -->
<keepui-button variant="primary" size="auto">
  <svg slot="leading" width="16" height="16" aria-hidden="true">…</svg>
  Upload
</keepui-button>

<!-- Loading state -->
<keepui-button [loading]="isSaving()">Saving…</keepui-button>

<!-- Full-width -->
<keepui-button [fullWidth]="true">Submit</keepui-button>

<!-- Icon-only (ariaLabel required) -->
<keepui-button variant="ghost" size="auto" ariaLabel="Close dialog">
  <svg slot="leading" …>…</svg>
</keepui-button>
```

**Inputs:**

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style. |
| `size` | `'md' \| 'auto'` | `'md'` | `md`: 160 px wide, 40 px tall. `auto`: padding-driven width. |
| `shape` | `'pill' \| 'rounded'` | `'pill'` | Border-radius style. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML `type` attribute. |
| `disabled` | `boolean` | `false` | Disables the button. |
| `loading` | `boolean` | `false` | Shows spinner, disables button, sets `aria-busy="true"`. |
| `fullWidth` | `boolean` | `false` | Expands the button to 100% container width. |
| `ariaLabel` | `string` | `''` | Accessible label. Required for icon-only buttons. |

**Outputs:**

| Output | Type | Description |
|---|---|---|
| `clicked` | `void` | Emitted on click (only when enabled and not loading). |

**Slots:**

| Slot | Description |
|---|---|
| `slot="leading"` | Element placed before the label (e.g. icon). Hidden during loading. |
| `slot="trailing"` | Element placed after the label (e.g. icon). Hidden during loading. |
| *(default)* | Button label / content. |

---

### `<keepui-card>`

Versatile container with variant, padding, color, clickable, selected, and scrollable states.

```html
<!-- Basic -->
<keepui-card>Content</keepui-card>

<!-- Outlined with large padding -->
<keepui-card variant="outlined" padding="lg">…</keepui-card>

<!-- Clickable + selectable -->
<keepui-card [clickable]="true" [selected]="isSelected()" (clicked)="select()">
  Option A
</keepui-card>

<!-- Full-height scrollable panel -->
<div class="h-screen overflow-hidden">
  <keepui-card padding="screen" [scrollable]="true" [fullHeight]="true">
    Long list content…
  </keepui-card>
</div>
```

> `padding="screen"` applies lateral and top padding but omits the bottom intentionally so content appears to continue beyond the visible area. A spacer `<div>` is inserted automatically at the end of the projected content — when the user scrolls to the bottom, the correct bottom gap appears without extra markup from the consumer.

**Inputs:**

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `'flat' \| 'outlined'` | `'outlined'` | With or without border. |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'screen'` | `'md'` | Internal padding. |
| `colors` | `'primary' \| 'secondary'` | `'primary'` | Background surface token. |
| `clickable` | `boolean` | `false` | Enables hover, focus ring, and button role. |
| `selected` | `boolean` | `false` | Applies brand border when active. |
| `scrollable` | `boolean` | `false` | Activates `overflow-y-auto`. Combine with `fullHeight`. |
| `fullHeight` | `boolean` | `false` | Applies `h-full` to host and inner container. |

**Outputs:**

| Output | Type | Description |
|---|---|---|
| `clicked` | `void` | Emitted on click or Enter / Space (requires `clickable`). |

---

### `<keepui-icon>`

Renders an SVG symbol via `<use href="#name">`. The consuming application is responsible for registering SVG symbols in the DOM (e.g. with an `IconRegistryService`).

The icon color is inherited from `currentColor` — apply any Tailwind text-color class directly to `keepui-icon`.

```html
<!-- Decorative — aria-hidden="true" applied automatically -->
<keepui-icon name="check-icon" [size]="20" />

<!-- Semantic standalone icon — role="img" + aria-label applied -->
<keepui-icon name="close-icon" ariaLabel="Close dialog" />

<!-- Inside a button slot -->
<keepui-button variant="primary" size="auto">
  <keepui-icon slot="leading" name="add-icon" [size]="16" />
  New item
</keepui-button>

<!-- Custom color -->
<keepui-icon name="star-icon" [size]="24" class="text-ku-action-primary" />
```

**Inputs:**

| Input | Type | Default | Description |
|---|---|---|---|
| `name` ★ | `string` | — | ID of the SVG symbol (without `#`). Required. |
| `size` | `number` | `24` | Width and height of the icon in pixels. |
| `viewBox` | `string` | `'0 0 24 24'` | `viewBox` attribute forwarded to the `<svg>` element. |
| `ariaLabel` | `string` | `''` | When provided: sets `role="img"` and `aria-label`. When omitted: `aria-hidden="true"` is applied automatically. |

> ★ Required input.

---

### `<keepui-icon-action-button>`

Circular icon-only action button with `default` and `danger` variants, loading state, and full accessibility support.

`ariaLabel` is **required** because the button contains no visible text (WCAG 2.1 SC 4.1.2). The icon color is inherited automatically via `currentColor` from the button's text color.

```html
<!-- Default variant -->
<keepui-icon-action-button icon="edit-icon" ariaLabel="Edit" />

<!-- Danger variant -->
<keepui-icon-action-button
  icon="trash-icon"
  variant="danger"
  ariaLabel="Delete item"
/>

<!-- Loading state -->
<keepui-icon-action-button
  icon="upload-icon"
  ariaLabel="Upload file"
  [loading]="isUploading()"
/>

<!-- Disabled -->
<keepui-icon-action-button icon="share-icon" ariaLabel="Share" [disabled]="true" />
```

**Inputs:**

| Input | Type | Default | Description |
|---|---|---|---|
| `icon` ★ | `string` | — | ID of the SVG symbol (without `#`). Required. |
| `ariaLabel` ★ | `string` | — | Accessible label. Required (no visible text). |
| `variant` | `'default' \| 'danger'` | `'default'` | Visual style. |
| `iconSize` | `number` | `20` | Size of the inner icon in pixels. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML `type` attribute. |
| `disabled` | `boolean` | `false` | Disables the button. |
| `loading` | `boolean` | `false` | Shows spinner, disables button, sets `aria-busy="true"`. |

> ★ Required input.

---

### `<keepui-image-preview>`

Standalone image picker and preview. Delegates file selection to the registered `FilePort` implementation — works identically on web and native (Capacitor) without any code change. UI strings are fully internationalised via Transloco.

```html
<keepui-image-preview />
```

No inputs or outputs. Exposes three readable signals for advanced use cases:

| Signal | Type | Description |
|---|---|---|
| `imageUrl` | `Signal<string \| null>` | Data URL of the selected image, ready to bind to `[src]`. |
| `error` | `Signal<string \| null>` | Error message if the last pick operation failed. |
| `loading` | `Signal<boolean>` | `true` while the pick operation is in progress. |

**Prerequisites** — register in `app.config.ts`:

```ts
// Web
provideKeepUi()
provideKeepUiI18n({ defaultLang: 'en' })

// Capacitor
provideKeepUiCapacitor()
provideKeepUiI18n({ defaultLang: 'en' })
```

---

## i18n

KeepUI uses [`@jsverse/transloco`](https://jsverse.github.io/transloco/) with the scope `'keepui'`.

**Supported languages:** `en` · `es` · `de`

**Change locale at runtime:**

```ts
import { KeepUiLanguageService, KeepUiLanguage } from '@keepui/ui';

@Component({ … })
export class MyComponent {
  private readonly langService = inject(KeepUiLanguageService);

  switch(lang: KeepUiLanguage) {
    this.langService.setLanguage(lang);
  }
}
```

---

## Theming

KeepUI uses CSS custom properties for all design tokens. The `data-theme` attribute on `<html>` switches between `light` (default) and `dark`.

**Switch theme at runtime:**

```ts
document.documentElement.setAttribute('data-theme', 'dark');
```

**Override tokens in your own CSS:**

```css
:root {
  --ku-action-primary: #6366f1;
}

[data-theme="dark"] {
  --ku-action-primary: #818cf8;
}
```

Refer to the bundled `themes.css` file for the full list of available tokens.

---

## Architecture Notes

### Port/Adapter Pattern

```
ImagePreviewComponent
       │
       │ inject(FILE_PORT)
       ▼
   FilePort (interface)
       │
   ┌───┴──────────────────┐
   │                      │
WebFileService    CapacitorFileService
(browser <input>)  (@capacitor/camera)
```

- Components depend only on the `FilePort` interface via the `FILE_PORT` injection token.
- `provideKeepUi()` registers `WebFileService`.
- `provideKeepUiCapacitor()` registers `CapacitorFileService`.
- Capacitor dependencies are **not** pulled into web builds.

### Secondary Entrypoint

`@keepui/ui/capacitor` is a secondary ng-packagr entrypoint compiled alongside the main package. Keeping it separate means Capacitor dependencies are never included in web-only builds.

### Types

Every component that exposes custom TypeScript types places those types in a sibling `<component>.types.ts` file and re-exports them from the main entrypoint. Import them directly from `@keepui/ui`:

```ts
import {
  ButtonVariant, ButtonSize, ButtonShape, ButtonType,
  CardVariant, CardPadding, CardColors,
  IconActionButtonVariant, IconActionButtonType,
} from '@keepui/ui';
```

---

## Testing

Use `MockFileService` to test components that depend on `FILE_PORT`:

```ts
import { MockFileService, FILE_PORT } from '@keepui/ui';

TestBed.configureTestingModule({
  imports: [ImagePreviewComponent],
  providers: [{ provide: FILE_PORT, useClass: MockFileService }],
});
```

`MockFileService` resolves successfully by default. Set `nextError` to test error paths:

```ts
const mock = TestBed.inject(FILE_PORT) as MockFileService;
mock.nextError = new Error('Camera cancelled');
```

---

## Building

```bash
# Production build (APF, partial compilation):
npm run build

# Development build (without schematics):
npm run build:dev

# Schematics only:
npm run build:schematics

# Run unit tests:
npm test
```

Output is placed in `dist/keep-ui/` following Angular Package Format.

---

## Publishing to npm

```bash
npm run build
cd dist/keep-ui
npm publish --access public
```

Ensure `package.json` has the correct `name`, `version`, and `peerDependencies` before publishing.

