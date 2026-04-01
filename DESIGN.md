# Design System Strategy: ZSocial

**Project ID:** projects/11754558665541925581

## 1. Visual Theme & Atmosphere
The core philosophy is the "Kinetic Curator"—a fluid, high-editorial aesthetic tailored for Gen Z. The atmosphere moves away from rigid, boxed-in layouts to embrace an energetic, living digital canvas. 
- **Mood:** Vibrant, premium, youthful, airy, and in motion.
- **Key Concepts:** Intentional asymmetry, tonal layering (using surface colors rather than distinct borders), and an organic, unconstrained feel that rejects traditional dark, heavy drop-shadows.

## 2. Color Palette & Roles
The palette relies on high-energy electric blues balanced against a sophisticated, lavender-tinted neutral base to establish a premium, editorial identity.

* **Electric Blue / Primary** (`#004BE2`): The high-impact core brand color. Used for primary actions, critical emphasis, and signature textures.
* **Vibrant Sky / Primary Container** (`#809BFF`): Often paired with Primary to create dimensional, soulful gradients for heavy CTAs.
* **Deep Navy / On-Surface** (`#2A2B51`): High-contrast text color, ensuring legibility while avoiding the starkness of pure black. Used as a tint base for ambient shadows.
* **Lavender Aura / Background** (`#F8F5FF`): The foundational base layer of the application. Provides a soft, clean backdrop.
* **Surface Container Low** (`#F2EFFF`): The secondary sectioning base—used to separate distinct app regions from the main background.
* **Surface Container Lowest** (`#FFFFFF`): The "lifted" layer—used for interactive cards to pull them forward visually against the lavender base.
* **Surface Container High** (`#E1E0FF`): Used for prominent overlays and floating modals.
* **Cyan Pop / Secondary Container** (`#26E6FF`): Used as an accent fill for selections (like chips) and secondary highlights.
* **Ghost Silver / Outline Variant** (`#A9A9D7`): Used strictly as a fallback when accessibility demands a border (kept at ~15% opacity).

*Note: The system generally enforces a "No-Line" rule. 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined through these tonal shifts instead.*

## 3. Typography Rules
The typography utilizes a dual-font approach combining extreme geometric precision with high legibility. Contrast in scale is heavily relied upon to create drama and hierarchy. 

* **Display & Headlines:** `Plus Jakarta Sans`
  * Applied to hero statements and main headings. Provides a geometric, modern, high-fashion flair.
* **Body & Titles & Labels:** `Be Vietnam Pro`
  * A highly legible, approachable sans-serif ideal for long-form content, UI labels, and meta-data.
* **Hierarchy Principles:** 
  * Ensure a "Power Gap"—a dramatic jump in size between large headlines and small body text to assert visual drama.
  * For metadata and labels, add a tracking (letter-spacing) increase of **2% to 5%** to make the UI feel intentionally "designed."

## 4. Component Stylings
The geometry centers on a "Super-Curve" philosophy, completely rejecting sharp edges in favor of approachability and fluidity.

* **Buttons:**
  * **Primary:** Pill-shaped (`rounded-full`), utilizing a striking linear gradient fill spanning from `primary` to `primary-container`.
  * **Secondary:** Background of `surface-container-highest` without borders, paired with `primary` colored text.
* **Cards & Containers:**
  * **Shape:** Subtly rounded corners (`rounded-md`, typically ~1.5rem/24px) for most standard content blocks. 
  * **Dividing Content:** Strictly forbid center divider lines. Use wide negative space to distinguish boundaries, or nest a differently toned container inside to separate metadata.
* **Inputs & Forms:**
  * **Base:** Resting state uses `surface-container-low`. Pill-shaped (`rounded-full`) geometry.
  * **Focus:** Transitions cleanly to `surface-container-lowest` and applies a subtle "Ghost Border" of the `primary` color at ~20% opacity.
* **Floating Navigation (Glassmorphism):**
  * Semi-transparent `surface` background combined with heavy background blurring (e.g., `backdrop-blur-xl` or ~20px). Finished with a subtle primary-colored glow denoting the active state.

## 5. Layout Principles
Layout spacing is a primary tool for creating the "Kinetic Curator" effect, valuing breathing space over high information density. 

* **Whitespace & Scale:** Embrace high-volume whitespace. Always maintain at least a generous 1.5rem to 2rem padding at screen edges to secure the "editorial" presence.
* **Asymmetry:** Wherever possible (like profile headers or feed items), break rigid grid structures by offsetting text and imagery for a more fluid, dynamic composition.
* **Elevation through Tonal Stacking:** Depth is created by layering brighter surfaces on top of darker backgrounds.
* **Shadows:** Avoid pure black or muddy shadows entirely. If a shadow is absolutely required to float a prominent element, deploy a massive blur (e.g., 32px+) but at extremely low opacity (~6%), tinting the shadow with the `on-surface` deep navy color (`rgba(42, 43, 81, 0.06)`).
