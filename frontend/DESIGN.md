# Design System Document: The Scholarly Precision Framework

## 1. Overview & Creative North Star
**Creative North Star: "The Academic Atelier"**
This design system moves beyond the generic "SaaS Dashboard" look to create a digital environment that feels like a high-end, modern university library—quiet, authoritative, and meticulously organized. We reject the "boxed-in" layout of traditional software. Instead, we embrace **intentional asymmetry** and **tonal layering** to guide the eye. 

The goal is to transform "attendance tracking" from a chore into a premium editorial experience. We achieve this by utilizing expansive white space (breathing room), sophisticated type scales, and the elimination of harsh structural lines in favor of soft, atmospheric depth.

---

## 2. Colors: Tonal Architecture
We use color not just for branding, but as a structural material. Our palette is anchored in deep blues and clinical grays, punctuated by high-contrast functional accents.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders (`#CCCCCC`, etc.) are strictly prohibited for sectioning or containment. 
*   **How to define boundaries:** Use background shifts. A `surface_container_low` section sitting on a `surface` background creates a clear but sophisticated boundary. 
*   **The Depth Stack:** To define a card, use `surface_container_lowest` (Pure White) against a `surface_container` background.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine stationery.
*   **Base Level:** `surface` (#f7f9fb) – The canvas.
*   **Secondary Level:** `surface_container_low` (#f2f4f6) – Use for sidebar backgrounds or grouping secondary content.
*   **Interactive Level:** `surface_container_lowest` (#ffffff) – Reserved for the most important interactive cards.

### The "Glass & Gradient" Rule
For "floating" elements like modals or mobile navigation, use **Glassmorphism**:
*   **Fill:** `surface_variant` at 70% opacity.
*   **Effect:** `backdrop-blur: 12px`.
*   **CTA Signature:** For primary buttons, apply a subtle linear gradient from `primary` (#004ac6) to `primary_container` (#2563eb) at a 135-degree angle. This adds a "soul" and "light" to the action that flat hex codes lack.

---

## 3. Typography: Editorial Authority
We use **Inter** not as a utility font, but as a design centerpiece. 

*   **Display & Headlines:** Use `display-md` or `headline-lg` for dashboard summaries. Track these tightly (letter-spacing: -0.02em) to give them a modern, "shaved" editorial look.
*   **The Power of Labels:** Use `label-md` in all-caps with increased letter-spacing (0.05em) for category headers (e.g., "RECENT LOGS"). This creates a rhythmic contrast against fluid body text.
*   **Hierarchy:** `title-lg` is your primary anchor for card titles. Ensure there is at least a `12` (3rem) spacing gap between a headline and the start of a data grid to maintain the "Academic Atelier" feel.

---

## 4. Elevation & Depth: Atmospheric Layering
We do not "drop shadows"; we create "ambient light."

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface_container_highest` element inside a `surface_container` to indicate a "pressed" or "nested" state.
*   **Ambient Shadows:** If an element must float (e.g., a dropdown), use a shadow with a blur of `32px` and an opacity of 4% using the `on_surface` color. It should feel like a soft glow, not a dark smudge.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., in high-contrast needs), use `outline_variant` at **15% opacity**. It should be barely felt, only sensed.
*   **Forced Asymmetry:** Offset your card containers. Instead of perfectly centered grids, allow a sidebar to "bleed" into the content area using `surface_container_low` to create a more custom, non-template feel.

---

## 5. Components: The Primitive Set

### Buttons & Inputs
*   **Primary Button:** Gradient fill (Primary to Primary-Container), `xl` (0.75rem) roundedness. No border.
*   **Secondary/Tertiary:** No background. Use `on_surface` text. On hover, shift the background to `surface_container_high`.
*   **Input Fields:** Use `surface_container_low` as the field background. On focus, transition to `surface_container_lowest` with a 1px `primary` Ghost Border (20% opacity).

### Data Tables & Lists
*   **The No-Divider Rule:** Forbid the use of horizontal lines between rows. Use vertical white space (`spacing.4`) to separate students. 
*   **Row States:** On hover, change the row background to `surface_container_highest`.
*   **Role-Based Elements:** Use `data-role="admin"` or `data-role="teacher"` attributes to toggle visibility. Admin-only actions should be styled using `secondary` tones to distinguish them from standard "educational" actions.

### Cards (The "Scholar Card")
*   **Style:** `surface_container_lowest` background, `xl` roundedness, no border.
*   **Content:** Use `title-md` for the student's name and `body-sm` for their ID/Status. 
*   **Status Indicators:** Use `tertiary` (#ae0010) for "Absent" and `primary` (#004ac6) for "Present." These should be small, high-density chips with `full` roundedness.

---

## 6. Do's and Don'ts

### Do
*   **DO** use the `10` (2.5rem) and `12` (3rem) spacing tokens to create massive gaps between major functional areas.
*   **DO** use `surface_bright` for the main content area to keep the "educational" feel energetic.
*   **DO** use `title-sm` for table headers instead of bold labels to maintain an editorial vibe.

### Don't
*   **DON'T** use 100% black text. Always use `on_surface` (#191c1e) to keep the contrast sophisticated rather than jarring.
*   **DON'T** use `none` roundedness. Even for the most professional setting, a minimum of `DEFAULT` (0.25rem) is required to avoid a "legacy system" look.
*   **DON'T** use standard "Warning Red" for every error. Reserve `tertiary` for critical attendance failures; use `error_container` for soft warnings or "Late" statuses.

### Role-Based Implementation Note
When rendering elements with `data-role="student"`, minimize the use of `primary` accents. Reserve the heavy blue signature for `data-role="admin"` to reinforce the "Authority" of the tracker.