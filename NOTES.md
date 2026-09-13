# Architectural Comparison: Custom vs. Radix / shadcn/ui

## Evaluated Components
1. **Modal Dialog** (`<Modal />` vs. shadcn `Dialog`)
2. **Tabs** (`<Tabs />` vs. shadcn `Tabs`)
3. **Disclosure** (`<Disclosure />` vs. shadcn `Accordion` / `Collapsible`)

---

## What shadcn/ui (Radix Primitives) Handled That We Missed

### 1. React Portals and DOM Positioning
* **Hand-Built Limitation**: The custom `<Modal />` is rendered directly inline into the React DOM tree where it was invoked. While styled with `fixed inset-0`, it remains vulnerable to parent CSS transforms, filters, and conflicting `z-index` contexts (stacking context bugs).
* **shadcn/Radix Solution**: Uses `@radix-ui/react-portal` to unmount and remount the modal root directly into `document.body`. This guarantees that the dialog sits on the top stacking layer regardless of ancestor styles.

### 2. Full ARIA Inert and Screen Reader Hiding
* **Hand-Built Limitation**: The custom modal locks `body.style.overflow = "hidden"` and uses a manual keyboard focus-trap loop. However, elements outside the modal are not marked `aria-hidden="true"`, meaning screen reader virtual cursors (VoiceOver, NVDA, JAWS) can still navigate out of the dialog into background DOM nodes.
* **shadcn/Radix Solution**: Radix incorporates `aria-hidden` across all sibling root elements automatically (via packages like `aria-hidden`), ensuring that the rest of the application is inert to assistive technologies while the dialog is active.

### 3. Asynchronous Initial Focus and Selection Preservation
* **Hand-Built Limitation**: Our modal eagerly runs `.focus()` on the first focusable child synchronously inside a `useEffect`. If the dialog contains dynamic content or an animation delay, the query selector may execute before DOM elements stabilize.
* **shadcn/Radix Solution**: Radix implements configurable auto-focus targets via props (`onOpenAutoFocus`, `onCloseAutoFocus`), allowing developers to point focus to a designated primary action or suppress autofocus to prevent jarring scroll jumps.

### 4. Tab Activation Modes (Automatic vs. Manual)
* **Hand-Built Limitation**: In our `<Tabs />`, pressing `ArrowRight` or `ArrowLeft` automatically selects and displays the new tab panel immediately.
* **shadcn/Radix Solution**: Radix supports both automatic selection and manual selection (where arrow keys move focus among tabs without switching panels until the user presses `Enter` or `Space`), satisfying specific W3C APG composite widget scenarios.
