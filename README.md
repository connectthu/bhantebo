# bhantebo.com

Source for **Bhante Bodhicitta's** peace-walk training site — a Jekyll site
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

## Current status

- ✅ Repo pushed, GitHub Pages enabled and building clean:
  **https://connectthu.github.io/bhantebo/**
- ⏸️ Custom domain (`bhantebo.com`) is intentionally **not** wired up yet —
  see below. Use the `.github.io` URL above for review and for editing
  through `/admin` in the meantime; nothing about content-editing depends
  on the final domain.

## ⚠️ Manual steps still needed

1. **Deploy the Cloudflare Worker.** Full instructions in
   [`worker/README.md`](worker/README.md). Short version:
   ```bash
   cd worker
   npm install
   npx wrangler login
   npx wrangler deploy
   npx wrangler secret put GITHUB_CLIENT_ID
   npx wrangler secret put GITHUB_CLIENT_SECRET
   ```
   You'll need a GitHub OAuth App first (steps also in that README) — the
   Worker deploy gives you the exact callback URL to put in it.

2. **Update `admin/config.yml`** — replace the placeholder:
   ```yaml
   base_url: https://REPLACE-WITH-YOUR-WORKER.workers.dev
   ```
   with your real Worker URL from step 1, then commit + push. This works
   the same whether `/admin` is served from the `.github.io` URL or the
   eventual `bhantebo.com` — the Worker's OAuth popup handshake replies to
   whichever origin opened it, so it isn't tied to one domain.

3. **Add Bhante as a collaborator** on `connectthu/bhantebo` (Settings →
   Collaborators) so his GitHub login works in `/admin`.

4. **When content is finalized and you're ready to go live**, point
   `bhantebo.com` at this site:
   - Add these DNS records at Porkbun:
     ```
     A     @     185.199.108.153
     A     @     185.199.109.153
     A     @     185.199.110.153
     A     @     185.199.111.153
     CNAME www   connectthu.github.io.
     ```
   - Re-add a `CNAME` file at the repo root containing `bhantebo.com`, and
     set it on Pages (either in repo Settings → Pages, or
     `gh api repos/connectthu/bhantebo/pages -X PUT -f "cname=bhantebo.com"`).
   - Enable "Enforce HTTPS" in Settings → Pages once the cert provisions.

5. **Connect Buttondown to the feed** once the site is live:
   `https://bhantebo.com/reflections/feed.xml` (or the `.github.io`
   equivalent in the meantime, though you'll want to switch it once the
   custom domain is live so subscriber links don't break).

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
