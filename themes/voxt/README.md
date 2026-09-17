# Voxt — SSG Theme

Voxt is a modern, single-page developer and AI showcase theme for Static Site Generator (SSG).

## Features
- **Hero Terminal Mockup**: Pre-configured 4-pane TMUX IDE visual grid with live badges.
- **Dark/Light Mode**: AAA-contrast CSS color variables with zero flash.
- **Zero Third-Party Requests**: Fully self-contained, no external CDN dependencies.
- **Responsive Architecture**: Fluid layout from mobile to 4K displays.
- **SSG AI Integration**: Generates `agents.txt`, `ai-plugin.json`, and `mcp.json`.

## Usage
Build the theme with SSG:
```sh
ssg build -f themes/voxt/ssg.toml
```

## License
Dual-licensed under Apache 2.0 and MIT.

## Security

Every page carries one Content Security Policy, declared in
`_layouts/base.html` and identical across all themes in this suite:

```
default-src 'self'; base-uri 'none'; object-src 'none';
script-src 'self'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'self'; manifest-src 'self';
form-action 'self' {form_origin}
```

No inline script or inline style is permitted, so the generator extracts
both to external files covered by Subresource Integrity. Nothing loads from
a third-party origin.

`form_origin` is the one value you are expected to change. It is set in each
page's front matter and defaults to the placeholder `https://example.com`.
Point it at your own form endpoint before you deploy, or the browser blocks
the POST. If the theme has no form, set it to your own origin and the
directive becomes inert.
