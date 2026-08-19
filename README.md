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

## ⚠️ Manual steps still needed

This was built and pushed for you, but a few things only you can do,
because they involve credentials or an outward-facing publish step:

1. **Push this repo to GitHub**, if I haven't already done so in this
   session — confirm with me before I push, since it's a public,
   outward-facing action.

2. **Deploy the Cloudflare Worker.** Full instructions in
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

3. **Update `admin/config.yml`** — replace the placeholder:
   ```yaml
   base_url: https://REPLACE-WITH-YOUR-WORKER.workers.dev
   ```
   with your real Worker URL from step 2, then commit + push.

4. **Enable GitHub Pages** — repo Settings → Pages → Build and deployment:
   *Deploy from a branch* → `main` / `(root)`. No custom workflow needed;
   the `github-pages` gem in the `Gemfile` matches what GitHub's Pages
   build servers already run.

5. **Point DNS at GitHub Pages for `bhantebo.com`** (the `CNAME` file is
   already in the repo root). Add these records at your DNS provider:
   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   connectthu.github.io.
   ```
   Then in repo Settings → Pages, enter `bhantebo.com` as the custom
   domain and enable "Enforce HTTPS" once the cert provisions.

6. **Add Bhante as a collaborator** on `connectthu/bhantebo` (Settings →
   Collaborators) so his GitHub login works in `/admin`.

7. **Connect Buttondown to the feed** once the site is live:
   `https://bhantebo.com/reflections/feed.xml`.

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
