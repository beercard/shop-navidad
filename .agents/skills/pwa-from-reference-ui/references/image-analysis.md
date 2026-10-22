# Reading reference UI images

For each image fill this table in `analysis.md`.

1. **Screen**: name, purpose, primary action, entry/exit points; flow map across images.
2. **Frame**: device size guess (common phone widths 360/375/390/393/412/430), status bar and bottom inset zones, scale factor (image px / CSS px).
3. **Layout**: columns, side margin, vertical rhythm, section order, sticky areas, scroll regions; list the 3 biggest blocks and their relative sizes.
4. **Components**: nav bar/tab bar, headers, cards, lists, chips, buttons (hierarchy), inputs, sheets, badges, charts, avatars; variants and states shown.
5. **Tokens**: sample colors (background, surface, text primary/secondary, border, accent, status), compute contrast pairs; type (family guess, sizes, weights, line heights); spacing steps; radii; shadows; icon stroke and size.
6. **Behavior implied**: scrolling, transitions, gestures (give visible alternatives), loading and empty hints.
7. **Problems**: contrast under 4.5:1, targets under 44/48, icon-only controls, tiny text under 12px, color-only status, text over busy images, decorative-only effects.
8. **Decisions**: keep / adapt / replace, each with a reason and the mobile-ui-ux rule number or file.

Tips: sample colors with an image tool when available (e.g. Python Pillow), not by eye; snap spacing to a 4-based scale; treat gradients, blur and shadows as costly and keep at most 1-2 surfaces.
