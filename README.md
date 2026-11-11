# bodhicitta.gives

Source for **Bhante Bodhicitta's** All Season Peace Walks site — a Jekyll site
hosted on GitHub Pages, edited through [Decap CMS](https://decapcms.org) at
`/admin`, authenticated via a small Cloudflare Worker OAuth proxy (see
[`worker/`](worker/)).

## What's here

```
_config.yml          Site config, collections, jekyll-feed setup
_layouts/            default.html (page shell), reflection.html (single post)
_includes/           header, footer, hero pieces, reflection-card, event-row
_reflections/        the "reflections" collection — daily photo + text posts
_events/              the "events" collection — simple event listings
assets/css/style.scss  All design tokens (color/type) from the Claude Design import
assets/images/         Site imagery (hero + about photos)
index.html, about.md, events.md, reflections.md   The four static pages
admin/                Decap CMS (config.yml + index.html)
worker/               Cloudflare Worker: GitHub OAuth proxy for Decap CMS
```

## Content model

**`_reflections`** (daily photo + reflection posts) — fields: `title`,
`date`, `photo`, and the Markdown body itself. Rendered as a
reverse-chronological feed at `/reflections/` (and a 3-item teaser on the
homepage), each with its own permalink and an RSS/Atom feed at
**`/reflections/feed.xml`** (via `jekyll-feed`'s per-collection feed
support — see `feed.collections` in `_config.yml`). That feed URL is what
you'll point Buttondown at.

**`_events`** (simple listings) — fields: `title`, `description`, `date`,
`time`, `link`. Rendered chronologically on `/events/`.

Both collections are edited through `/admin` by either of you — no need to
touch git directly (though you always can; it's a normal Jekyll site).

## Domains

- **https://bodhicitta.gives** is the site's address: the `CNAME` file, `url`
  in `_config.yml`, and `site_url` in `admin/config.yml` all use it.
  GitHub Pages serves one custom domain per site.
- **bhantebo.com** (the original address) forwards to bodhicitta.gives via
  URL forwarding at Porkbun, so old links and bookmarks keep working.
- The newsletter (Buttondown, username `bhantebo`) reads
  `https://bodhicitta.gives/reflections/feed.xml`.
- `/admin` and `/post` log in through the Cloudflare Worker in
  [`worker/`](worker/), which works from any domain.

## Local development

Requires Ruby ≥ 3.1 (GitHub Pages' current supported version) + Bundler.

```bash
bundle install
bundle exec jekyll serve
```

Then visit `http://localhost:4000`. `/admin` won't authenticate locally
against the production Worker/OAuth App unless you point `base_url` at a
local worker (`wrangler dev`) and register a second OAuth App with a
`localhost` callback — not necessary for day-to-day editing, which happens
against the live site.
