# bhantebo-cms-auth — Decap CMS GitHub OAuth Worker

This Worker lets two people log into `/admin` on bhantebo.com with their own
GitHub accounts (each needs **write access to `connectthu/bhantebo`**, e.g.
as a collaborator).

## 1. Create the GitHub OAuth App

GitHub → Settings → Developer settings → **OAuth Apps → New OAuth App**
(or org-level equivalent):

| Field | Value |
|---|---|
| Application name | Bhante Bodhicitta CMS |
| Homepage URL | `https://bhantebo.com` |
| Authorization callback URL | `https://<your-worker-subdomain>.workers.dev/callback` (update after step 2 — see below) |

Copy the **Client ID**, and generate + copy a **Client Secret**. Keep the
secret out of chat, files, and git — you'll paste it directly into
`wrangler secret put` in step 3, which prompts interactively and doesn't
echo or store it in shell history.

## 2. Deploy the Worker

From this `worker/` directory:

```bash
npm install
npx wrangler login
npx wrangler deploy
```

`wrangler deploy` prints the live URL, something like:

```
https://bhantebo-cms-auth.<your-account>.workers.dev
```

**That exact URL is what you plug into two places:**

1. Back in the GitHub OAuth App settings (step 1), set the callback URL to
   `<that-url>/callback`.
2. In [`admin/config.yml`](../admin/config.yml) at the repo root, set:
   ```yaml
   base_url: <that-url>
   ```
   (already scaffolded with a `REPLACE-WITH-YOUR-WORKER` placeholder —
   just swap it in and commit/push.)

## 3. Set the secrets

Still from `worker/`:

```bash
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

Each command prompts for the value — paste it there, not on the command
line, so it never lands in shell history. These are stored encrypted by
Cloudflare and are never committed to the repo.

## 4. Test it

Visit `https://bhantebo.com/admin/`, click "Login with GitHub". You should
get a GitHub popup → authorize → the popup closes and the CMS loads.

## Notes

- The Worker only proxies the OAuth code-exchange; it never touches repo
  content itself. Decap CMS talks to the GitHub API directly from the
  browser using the token this Worker hands back.
- Both you and Bhante can use the **same Worker and OAuth App** — each of
  you logs in with your own GitHub account (add both as collaborators, or
  give both write access via the org), and Decap commits as whichever
  account is signed in.
- If you ever rotate the GitHub Client Secret, just re-run
  `wrangler secret put GITHUB_CLIENT_SECRET` — no redeploy needed.
