# KEEPUI Agent Guide

## Purpose

This document defines how an agent should work on **KeepUI**, a component library for Angular with multi-platform support for **web** and **Angular + Capacitor**, alongside a **demo application** where all components must be integrated and validated.

The goal is to maintain a consistent, reusable, scalable, and easy-to-test architecture.

---

## Repository Scope

The repository contains at least these blocks:

- **KeepUI Core Library**
  - Reusable components
  - Platform-agnostic directives, pipes, tokens, ports, services, and providers
- **Capacitor Extension or Entrypoint**
  - Native adapters
  - Mobile-specific providers
- **Demo Project**
  - Angular application used to visualize, test, and validate components
- **Styles Infrastructure**
  - Tailwind CSS
  - `light` theme
  - `dark` theme

---

## Mandatory Principles

### 1. Platform-Agnostic Core

The library core must not directly depend on native APIs or Capacitor plugins.

Do not introduce direct imports in the core from:

- `@capacitor/core`
- `@capacitor/camera`
- `@capacitor/filesystem`
- any other native plugin

All platform integration must be resolved through:

- interfaces (`ports`)
- injection tokens
- adapters
- specific providers

### 2. One Component, Multiple Environments

The same KeepUI component must work in:

- an Angular web app
- an Angular + Capacitor app

The difference between environments must be resolved in the registered provider, not inside the component.

### 3. Mandatory Demo

**Every time a new component is added to the library, it must also be added to the demo project.**

This rule is mandatory and never skipped.

This implies:

- exporting the component from the library
- integrating it in a page or section of the demo
- creating a minimal functional example
- visually validating the component in `light` mode
- visually validating the component in `dark` mode

A component is not considered finished if it exists in the library but not in the demo.

### 4. Tailwind as the Base Style System

The library will use **Tailwind CSS** as the primary styling base.

The agent must:

- maintain consistency of utility classes
- avoid unnecessary ad hoc styles
- favor simple composition
- minimize manual CSS except in justified cases
- ensure components are compatible with theming

### 5. Two Mandatory Themes

KeepUI must support two themes:

- `light`
- `dark`

Every new component must be tested in both themes.

Finished components that do the following will not be accepted:

- only work visually in light mode
- break contrast in dark mode
- use hardcoded colors incompatible with both themes

---

## Component Design Rules

### 1. Standalone Components

All new components must be **standalone**, unless there is a strong and explicit technical reason.

### 2. Careful Public API

Each component must be designed with a clear API:

- minimal and well-named inputs
- outputs only when they add value
- consistent naming
- avoid coupling business logic to the component

### 3. Accessibility as a First-Class Requirement

Accessibility is not optional. Every component must fully satisfy the following requirements before it is considered done.

#### Semantic structure

- use the correct HTML element for each role (`<button>`, `<input>`, `<a>`, etc.)
- use non-semantic elements (`<div>`, `<span>`) only when no semantic alternative exists, and always add the corresponding `role`
- never suppress the browser's native focus management without providing an explicit alternative

#### ARIA attributes

Apply ARIA attributes wherever the native HTML alone is not sufficient:

| State / Need | Attribute |
|---|---|
| Disabled (non-native) | `aria-disabled="true"` |
| Loading / in progress | `aria-busy="true"` |
| Expanded / collapsed | `aria-expanded` |
| Selected | `aria-selected` |
| Required field | `aria-required="true"` |
| Invalid field | `aria-invalid="true"` + `aria-describedby` pointing to the error |
| Icon-only control | `aria-label` on the control; `aria-hidden="true"` on the decorative icon |
| Live region | `role="status"` or `role="alert"` for dynamic content |

#### Keyboard navigation

- all interactive elements must be reachable and operable with the keyboard alone
- `Enter` and `Space` must activate buttons and clickable controls
- modals, drawers, and overlays must trap focus while open and restore it on close
- `Escape` must close dismissible elements
- do not use `tabindex` values greater than `0`

#### Visual focus

- all interactive elements must show a visible focus ring when focused via keyboard
- use `focus-visible:ring-2 focus-visible:ring-keepui-primary focus-visible:ring-offset-2` or an equivalent pattern
- do not use `outline: none` without providing a custom focus style

#### Touch targets (mobile / Capacitor)

- every interactive element must have a minimum touch target of **44 × 44 px** (iOS HIG) or **48 × 48 dp** (Android)
- use `min-h-[2.75rem] min-w-[2.75rem]` as the minimum safe values in Tailwind

#### Color and contrast

- do not rely solely on color to convey meaning — always pair color with text, icon, or pattern
- maintain a minimum contrast ratio of **4.5:1** for body text and **3:1** for large text and UI components
- validate contrast in both `light` and `dark` themes

#### Screen reader announcements

- state changes that are not visually obvious (loading completion, errors, success messages) must be announced via a live region (`role="status"` or `role="alert"`)
- loading spinners must have `aria-hidden="true"` on the visual element and the containing button must carry `aria-busy="true"`

### 4. Internationalisation (i18n)

KeepUI uses **`@jsverse/transloco`** as its i18n solution with the translation scope `'keepui'`.

#### When to add translations

Add transloco support whenever a component exposes any user-visible string that is not a developer-supplied value — e.g., button labels, placeholder text, error messages, ARIA labels generated internally.

Do **not** add transloco to purely structural or container components that render only consumer-provided content.

#### How to add translations

1. **Define typed keys** — add the new keys to `KEEPUI_TRANSLATION_KEYS` in `src/lib/i18n/translation-keys.ts` following the naming pattern `componentName.keyName`:

   ```ts
   export const KEEPUI_TRANSLATION_KEYS = {
     MY_COMPONENT: {
       LABEL: 'myComponent.label',
       ERROR: 'myComponent.error',
     },
   } as const;
   ```

2. **Add translation files** — add the key/value pairs to every supported language (`en`, `es`, `de`) in the corresponding JSON or TS translation assets.

3. **Register the scope** — add `{ provide: TRANSLOCO_SCOPE, useValue: 'keepui' }` to the component's `providers` array.

4. **Use the pipe in templates** — bind via `{{ key | transloco }}` or `[attr.aria-label]="key | transloco"`. Never hardcode UI strings.

5. **Export the keys** — `KEEPUI_TRANSLATION_KEYS` is already exported from `public-api.ts`. When adding a new component namespace, verify the export is in place.

#### Supported languages

| Code | Language |
|---|---|
| `en` | English |
| `es` | Spanish |
| `de` | German |

Every new translation key must have values in all three languages before the component is considered done.

#### Provider requirement

Consumers must call `provideKeepUiI18n()` in their `app.config.ts` to activate transloco support. Document this requirement in the component's JSDoc.

### 5. Responsiveness

Components must behave reasonably well on:

- desktop
- tablet
- mobile

The demo should help review this when applicable.

---

## Architecture Rules

### 1. Layer Organization

Maintain the separation between:

- `components`
- `directives`
- `pipes`
- `models`
- `ports`
- `tokens`
- `services`
- `providers`

If Capacitor support exists, keep native code separate from the core.

### 2. Ports + Adapters

When a component needs capabilities that depend on the environment, use this pattern:

- define a `port`
- define a `token`
- create a web implementation
- create a Capacitor implementation if applicable
- register the correct provider per host

### 3. Don't Contaminate the Core with Mobile

Even if a use case has a mobile variant, do not move native dependencies into the core.

### 4. Public Imports

Use imports from the public API.

Avoid deep imports from internal files in consumer apps and in the demo, except for internal workspace needs.

---

## Demo-Specific Rules

The demo application is not optional or decorative. It is part of the development workflow.

### Demo Objectives

- visualize components
- test variants
- validate composition
- detect visual regressions
- verify light/dark
- serve as a quick inspection environment

### Mandatory Rule per New Component

When a new component is created, the agent must also perform these tasks in the demo:

1. create a visible entry for the component
2. mount a simple real-use example
3. show important states if it has them
4. verify behavior in light mode
5. verify behavior in dark mode
6. confirm it compiles and renders correctly

### What Each Demo Example Should Include

Each new component should be shown, when it makes sense, with:

- base version
- relevant variants
- disabled state if it exists
- long/short content if applicable
- responsive behavior if applicable

The demo does not need to be over-documented, but it should show a useful real-world case.

### Suggested Demo Structure

The demo should have a simple and maintainable structure, for example:

- navigation by component
- a page per component or a clear section per component
- theme selector
- clean layout oriented to inspection

---

## Theming Rules

### 1. Theme Source of Truth

The agent must respect the existing theme system in the project. If it needs to be extended:

- do so centrally
- avoid duplication
- do not hardcode colors inside components except for well-defined utility tokens

### 2. Light and Dark as First-Class Citizens

Every new component must be reviewed with both active themes.

Validate at least:

- background
- text
- border
- hover
- focus
- disabled
- semantic states if they exist

### 3. Tailwind Classes

Prioritize classes compatible with the theme and design consistency.

Avoid scattered visual decisions. Reuse patterns.

---

## Workflow per Task

When the agent receives a task on KeepUI, it must follow this sequence:

### A. Understand the Impact

Identify if it affects:

- library
- demo
- theming
- Capacitor support
- public API
- tests
- accessibility (ARIA, keyboard, contrast, touch targets)
- i18n (new user-visible strings, new translation keys)

### B. Implement in the Library

Create or modify:

- component
- styles
- types
- providers
- exports
- tests
- ARIA attributes and keyboard behaviour if interactive
- translation keys in `translation-keys.ts` if the component has internal strings
- translation values in all supported languages (`en`, `es`, `de`) if keys were added

### C. Reflect Changes in Demo

Whenever the change is visible or affects component usage:

- update the demo
- add a showcase if the component is new
- review light theme
- review dark theme

### D. Verify Integration

Confirm:

- coherent imports
- public API updated
- demo compiling
- component visible and usable
- light theme correct
- dark theme correct

### E. Close the Task

A task on a component is not considered closed if any of these points is missing:

- component implemented
- correctly exported
- demo updated
- light validated
- dark validated
- accessibility requirements met (ARIA, keyboard, focus ring, contrast, touch targets)
- translation keys added and filled in all supported languages (when applicable)

---

## Mandatory Checklist When Creating a New Component

Always use this checklist.

### Library

- [ ] create component folder
- [ ] implement standalone component
- [ ] define inputs/outputs if applicable
- [ ] apply styles with Tailwind
- [ ] use correct semantic HTML elements
- [ ] add ARIA attributes (`aria-label`, `aria-busy`, `aria-disabled`, `aria-expanded`, etc.) where required
- [ ] ensure keyboard operability (Enter, Space, Escape, focus trap if modal)
- [ ] apply visible focus ring via `focus-visible:ring-*` utilities
- [ ] ensure touch targets ≥ 44 × 44 px for interactive elements
- [ ] validate color contrast in light and dark themes
- [ ] add live region announcements for non-obvious state changes
- [ ] add translation keys to `KEEPUI_TRANSLATION_KEYS` if component has internal strings
- [ ] add translation values for `en`, `es`, and `de` if keys were added
- [ ] register `TRANSLOCO_SCOPE` in component providers if transloco is used
- [ ] address responsive behavior if applicable
- [ ] review visual in light mode
- [ ] review visual in dark mode
- [ ] export in `public-api.ts`
- [ ] add basic tests (including ARIA attribute assertions)

### Demo

- [ ] add component showcase
- [ ] add route, section, or visible entry
- [ ] show minimal functional example
- [ ] show relevant variants if applicable
- [ ] validate light mode
- [ ] validate dark mode

### If Platform Support Is Required

- [ ] define port
- [ ] define token
- [ ] implement web adapter
- [ ] implement Capacitor adapter if applicable
- [ ] register correct provider
- [ ] do not import Capacitor in the core

---

## Mandatory Checklist When Modifying an Existing Component

- [ ] review API compatibility
- [ ] avoid unnecessary breaking changes
- [ ] update demo to reflect changes
- [ ] validate visual in light mode
- [ ] validate visual in dark mode
- [ ] adjust tests if the contract changed
- [ ] verify ARIA attributes are still correct after the change
- [ ] add or update translation keys if user-visible strings were added or changed
- [ ] fill new translation values for `en`, `es`, and `de` if keys were modified

---

## Quality Criteria

### Code

- strict TypeScript
- consistent naming
- small and clear files
- single responsibility
- avoid duplication
- avoid unnecessary logic inside the template
- avoid writing comments of any kind, except for JSDoc when it adds value

### UI

- visual consistency
- uniform spacing
- reasonable contrast
- composable components
- stable appearance in both themes

### DX

- predictable imports
- clear public API
- useful demo
- maintainable structure

---

## What to Avoid

Do not do this:

- create components without integrating them in the demo
- use hardcoded colors that break dark mode
- put native logic inside the core
- add styles outside the system without need
- leave components unexported
- introduce fragile internal imports from consumers
- mix product business rules inside KeepUI
- close a visual task without validating light and dark
- suppress focus outlines without providing a visible alternative
- use `tabindex` values greater than `0`
- rely solely on color to convey meaning
- hardcode UI strings inside component templates — use Transloco keys
- add a new user-visible string without adding its translation in `en`, `es`, and `de`
- skip ARIA attributes on interactive elements that lack visible labels

---

## Definition of Done

A component-related task is done only if:

1. the component works in the library
2. it is correctly exported
3. it appears in the demo
4. it has a useful functional example
5. it is validated in light theme
6. it is validated in dark theme
7. its minimum tests are covered if applicable
8. all interactive elements are keyboard-operable with visible focus
9. required ARIA attributes are present and correct
10. every internal user-visible string has translation values in `en`, `es`, and `de`

---

## Permanent Agent Instruction

Whenever you add, replace, or refactor a KeepUI component:

- also update the demo
- verify light and dark
- keep Tailwind as the style base
- preserve the separation between core and Capacitor
- do not close the task without leaving functional evidence in the demo
- apply ARIA attributes for every interactive state (loading, disabled, expanded, invalid…)
- add translation keys for every internal user-visible string and fill them in `en`, `es`, and `de`

When in doubt between speed and consistency, prioritize consistency.

