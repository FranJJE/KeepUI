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

### 3. Minimum Required Accessibility

Every component must address at least:

- accessible labels or names when applicable
- visible focus
- correct use of buttons, inputs, roles, and ARIA attributes when necessary
- acceptable contrast in light/dark

### 4. Responsiveness

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

### B. Implement in the Library

Create or modify:

- component
- styles
- types
- providers
- exports
- tests

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

---

## Mandatory Checklist When Creating a New Component

Always use this checklist.

### Library

- [ ] create component folder
- [ ] implement standalone component
- [ ] define inputs/outputs if applicable
- [ ] apply styles with Tailwind
- [ ] address basic accessibility
- [ ] address responsive behavior if applicable
- [ ] review visual in light mode
- [ ] review visual in dark mode
- [ ] export in `public-api.ts`
- [ ] add basic tests

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

---

## Quality Criteria

### Code

- strict TypeScript
- consistent naming
- small and clear files
- single responsibility
- avoid duplication
- avoid unnecessary logic inside the template

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

---

## Permanent Agent Instruction

Whenever you add, replace, or refactor a KeepUI component:

- also update the demo
- verify light and dark
- keep Tailwind as the style base
- preserve the separation between core and Capacitor
- do not close the task without leaving functional evidence in the demo

When in doubt between speed and consistency, prioritize consistency.

