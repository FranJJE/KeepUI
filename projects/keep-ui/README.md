# KeepUI

> Angular cross-platform UI component library with optional Capacitor support.

[![npm version](https://img.shields.io/npm/v/@keepui/ui.svg)](https://www.npmjs.com/package/@keepui/ui)
[![license](https://img.shields.io/npm/l/@keepui/ui.svg)](LICENSE)

---

## Purpose

KeepUI is a reusable Angular component library designed to work seamlessly across:

- **Standard Angular web applications** (browser only)
- **Angular + Capacitor applications** (iOS, Android, PWA)

The library uses a **Port/Adapter pattern** to keep UI components fully decoupled from platform-specific APIs. Components never import `@capacitor/*` directly; they depend on an injected `FilePort` interface. Concrete implementations are registered via functional providers.

---

## Package Structure

| Package | Description |
|---|---|
| `@keepui/ui` | Core components, ports, tokens, web adapter |
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

## Usage — Angular Web App

### 1. Register the web provider

```ts
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideKeepUi } from '@keepui/ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideKeepUi(),
    // ...other providers
  ],
};
```

### 2. Use components

```ts
// src/app/app.component.ts
import { Component } from '@angular/core';
import {
  ButtonComponent,
  CardComponent,
  ImagePreviewComponent,
} from '@keepui/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonComponent, CardComponent, ImagePreviewComponent],
  template: `
    <keepui-card>
      <h2>Image Picker</h2>
      <keepui-image-preview />
    </keepui-card>

    <keepui-button (clicked)="greet()">Hello</keepui-button>
  `,
})
export class AppComponent {
  greet() {
    alert('Hello from KeepUI!');
  }
}
```

---

## Usage — Angular + Capacitor App

### 1. Register the Capacitor provider

```ts
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideKeepUiCapacitor } from '@keepui/ui/capacitor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideKeepUiCapacitor(),
    // ...other providers
  ],
};
```

> **Note:** Use `provideKeepUiCapacitor()` **instead of** `provideKeepUi()` — never both.

### 2. Use the same components

```ts
// src/app/app.component.ts — IDENTICAL to the web example above
import { ImagePreviewComponent } from '@keepui/ui';
```

The component is unchanged. Only the provider differs.

---

## Available Components

### `<keepui-button>`

```html
<keepui-button (clicked)="doSomething()">Click me</keepui-button>
<keepui-button [disabled]="isLoading" type="submit">Submit</keepui-button>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `disabled` | `boolean` | `false` | Disables the button |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML type attribute |

| Output | Type | Description |
|---|---|---|
| `clicked` | `void` | Emitted on click |

### `<keepui-card>`

```html
<keepui-card [elevation]="2">
  <p>Card content</p>
</keepui-card>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `elevation` | `0 \| 1 \| 2 \| 3` | `1` | Shadow depth |

### `<keepui-image-preview>`

```html
<keepui-image-preview />
```

No inputs. Requires `FILE_PORT` to be provided (via `provideKeepUi()` or `provideKeepUiCapacitor()`).

**Exposed signals (for advanced usage):**

| Signal | Type | Description |
|---|---|---|
| `imageUrl` | `Signal<string \| null>` | URL of the selected image |
| `error` | `Signal<string \| null>` | Error message if pick failed |
| `loading` | `Signal<boolean>` | True while picking is in progress |

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
   ┌───┴───────────┐
   │               │
WebFileService  CapacitorFileService
(browser input)  (@capacitor/camera)
```

- Components depend only on the `FilePort` interface via the `FILE_PORT` injection token.
- `provideKeepUi()` registers `WebFileService`.
- `provideKeepUiCapacitor()` registers `CapacitorFileService`.
- Capacitor dependencies are **not** pulled into web builds.

### Secondary Entrypoint

The `@keepui/ui/capacitor` entrypoint is a secondary ng-packagr entrypoint within the same library project. It is compiled and published alongside the main package but kept in a separate entry so Capacitor dependencies are not required in web-only applications.

---

## Testing

Use `MockFileService` in your tests:

```ts
import { MockFileService } from '@keepui/ui';
import { FILE_PORT } from '@keepui/ui';

TestBed.configureTestingModule({
  imports: [ImagePreviewComponent],
  providers: [{ provide: FILE_PORT, useClass: MockFileService }],
});
```

`MockFileService` resolves by default. Set `nextError` to test error paths:

```ts
const mock = TestBed.inject(FILE_PORT) as MockFileService;
mock.nextError = new Error('Camera cancelled');
```

---

## Building

```bash
# Build for production (APF, partial compilation):
npm run build

# Build for development (without schematics):
npm run build:dev

# Build schematics only:
npm run build:schematics

# Run tests:
npm test
```

The production build output is placed in `dist/keep-ui/` and follows Angular Package Format.

---

## Publishing to npm

```bash
npm run build
cd dist/keep-ui
npm publish --access public
```

Ensure `package.json` has the correct `name`, `version`, and `peerDependencies` before publishing.

---

## Future Improvements

- Additional components (modal, toast, form controls, etc.)
- More Capacitor adapters (Geolocation, Share, Haptics)
- Theming support via CSS custom properties
- Storybook integration
- Automated publishing via GitHub Actions
- E2E tests with Playwright
