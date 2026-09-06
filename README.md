# freaky

A minimal, dark, single-page portfolio theme for [Hugo](https://gohugo.io/). It provides a hero section with a typing animation, organization tags, role cards, content sections for projects, publications, articles and blogs, and a backend-free contact form. All content and identity come from your site configuration — the theme ships with no hardcoded personal data.

![screenshot](https://raw.githubusercontent.com/freaktopus/hugo-theme-freaky/main/images/screenshot.png)

## Features

- Single-page layout with scroll-spy navigation
- Typing animation for current roles
- Avatar and role-card images with a subtle flicker transition
- Projects (with "show more"), publications, articles/news, and blogs sections
- Contact form with an animated purpose selector; drafts the message to the visitor's clipboard — no backend required and no email address exposed
- Optional site-views counter (bring your own endpoint)
- Design tokens (accent color, backgrounds, text, borders) overridable from site configuration
- Extension hooks for custom `<head>` and end-of-body content
- No JavaScript dependencies and no build tooling — plain HTML, CSS, and JS

## Installation

Add the theme as a Git submodule (recommended):

```bash
git submodule add git@github.com:freaktopus/hugo-theme-freaky.git themes/freaky
```

or clone it directly:

```bash
git clone git@github.com:freaktopus/hugo-theme-freaky.git themes/freaky
```

Then set the theme in your site's `hugo.toml`:

```toml
theme = "freaky"
```

Copy the parameters from [`exampleSite/hugo.toml`](exampleSite/hugo.toml) into your own configuration and adapt them.

## Configuration

The theme is configured entirely through `[params]` in your site's `hugo.toml`. No template changes are required.

### Identity

```toml
[params]
  handle = "your-handle"        # shown in the header logo
  name = "Your Name"
  aka = "Optional Alias"        # rendered as "aka <alias>" next to your name
  bio = "One-line description."
  location = "City, Country"
  cv = "files/cv.pdf"           # optional; enables the CV button (path under static/)
```

### Hero

```toml
[params.hero]
  avatar1 = "images/avatar_1.png"   # required to display the avatar
  avatar2 = "images/avatar_2.png"   # optional second image for the flicker effect
  hold_a = 4500                     # milliseconds avatar1 stays visible
  hold_b = 1500                     # milliseconds avatar2 stays visible

[params]
  current_roles = [                 # cycled by the typing animation
    "Role One @ Company",
    "Role Two @ Lab",
  ]
```

If `current_roles` is empty, the terminal line is hidden automatically.

### Organization tags

```toml
[[params.orgs]]
  name = "Example Lab"
  link = "https://example.org/"
```

### About section

```toml
[params.about]
  lead = "A short tagline."
  body = """A longer paragraph. Line breaks are preserved."""

[[params.tracks]]                   # role cards; three recommended
  title = "Research"
  subtitle = "Challenge the known."
  link = "https://example.com/"
  avatar1 = "images/track_1.png"
  avatar2 = "images/track_2.png"
  hold_a = 6500
  hold_b = 4200
  delay = 1100
```

### Content sections

Sections are rendered automatically, and only when they contain pages. Create content under:

| Section        | Content directory       | Front matter used |
| -------------- | ----------------------- | ----------------- |
| Projects       | `content/projects/`     | `title`, `date`, `description`, `lang` or `tags`, `logo` or `mark`, `external_url` (optional) |
| Publications   | `content/publications/` | `title`, `date`, `authors`, `venue`, `description`, `link` (optional) |
| Articles/news  | `content/articles/`     | `title`, `date`, `description`, `link` (optional) |
| Blogs          | `content/blogs/`        | `title`, `date`, `description`, `link` (optional) |

Navigation links for empty sections are hidden automatically.

### Social links

```toml
[params.social]
  github = "https://github.com/your-handle"
  gitlab = "https://gitlab.com/your-handle"
  linkedin = "https://linkedin.com/in/your-handle"
  twitter = "https://x.com/your-handle"
  medium = "https://medium.com/@your-handle"
  huggingface = "https://huggingface.co/your-handle"
  instagram = "https://www.instagram.com/your-handle/"
  facebook = "https://www.facebook.com/your-handle/"
```

Only configured services are rendered — as icons in the hero and as text links alongside the contact form.

### Contact form

```toml
[[params.contact_purposes]]
  value = "research"
  label = "Research Collaboration"
```

The form validates input and copies a drafted message (purpose, sender address, description) to the visitor's clipboard. No backend is required and no email address is exposed.

### Optional: site-views counter

```toml
[params.siteviews]
  enabled = true
  count_url = "https://your-endpoint.example.com/count"  # must return {"count": 42}
  label = "Site Views"
```

Disabled by default. Any endpoint returning JSON with a numeric `count` field is supported.

### Optional: design tokens

```toml
[params.style]
  accentColor = "#d9554e"
  bgColor = "#1a1c20"
  surfaceColor = "#23262b"
  textColor = "#e8eaed"
  mutedColor = "#9aa0a8"
  borderColor = "#32363d"
```

All tokens are optional; unset values fall back to the theme defaults.

### Optional: footer credit

```toml
[params]
  hideThemeCredit = true   # default: false — keeping it helps others discover the theme
```

## Extending the theme

Hugo's template lookup order allows your site to override any theme file without modifying the theme itself. Two dedicated hook partials are provided for common additions:

- `layouts/partials/hooks/head-end.html` — injected at the end of `<head>` (analytics, additional metadata, …)
- `layouts/partials/hooks/body-end.html` — injected before `</body>` (custom scripts, …)

Any other partial (`header`, `footer`, `project-card`, …) can be overridden in the same way by placing a file at the same path in your site's `layouts/` directory.

## Example site

A complete demo site is included in `exampleSite/`:

```bash
cd exampleSite
hugo server --themesDir ../..
```

Open the printed local URL to browse the demo.

## Author

**Sanjay Pahari** (freaktopus)

- Website: [freaktopus.github.io](https://freaktopus.github.io/)
- GitHub: [@freaktopus](https://github.com/freaktopus)
- LinkedIn: [sanjaypahari](https://linkedin.com/in/sanjaypahari)
- X: [@freaktopusWho](https://x.com/freaktopusWho)

If you use this theme, keeping the footer credit is appreciated — it helps others discover the project.

## License

Released under the MIT License. See `LICENSE` for details.
