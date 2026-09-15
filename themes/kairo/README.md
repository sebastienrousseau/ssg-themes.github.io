# Kairo

Kairo is an expressive creative-portfolio theme for Static Site Generator.
It translates cinematic type, energetic geometry and studio pacing into an
original, image-free composition.

## Build

From the repository root:

```sh
ssg build -f themes/kairo/ssg.toml
```

The committed `styles.css` is compiled from `styles.styl`, which imports the
local Skeletonic Stylus core. Change `base_url`, the demonstration content and
the contact address before deployment.

## Accessibility and resilience

- WCAG 2.2 AAA colour-token targets in light and dark schemes
- 44-by-44-pixel controls and visible keyboard focus
- 320-pixel and 400% zoom reflow
- reduced-motion, forced-colour, print, no-JavaScript and no-CSS fallbacks
- same-origin content security policy and no third-party requests

Automated checks are evidence for the tested pages and environments, not a
permanent certification. Re-run the repository gates after changing content or
colours.

## Licence

MIT.
