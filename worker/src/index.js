/**
 * Cloudflare Worker — GitHub OAuth proxy for Decap CMS.
 *
 * Implements the standard two-route Decap/Netlify CMS OAuth handshake:
 *   GET /auth      → redirect the popup to GitHub's OAuth authorize URL
 *   GET /callback  → exchange the ?code for an access token and post it
 *                    back to the Decap CMS popup opener via postMessage
 *
 * Required secrets (set with `wrangler secret put <NAME>`, never committed):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 *
 * The token is never broadcast with postMessage("*") — the popup only
 * replies to whichever origin the opener (the /admin page) messages it
 * from, which is the standard Decap/Netlify CMS handshake pattern.
 */

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const DEFAULT_SCOPE = "repo,user";
const STATE_COOKIE = "decap_oauth_state";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      return handleAuth(url, env);
    }
    if (url.pathname === "/callback") {
      return handleCallback(request, url, env);
    }
    if (url.pathname === "/" || url.pathname === "") {
      return new Response("Decap CMS GitHub OAuth proxy is running.", {
        status: 200,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    return new Response("Not found", { status: 404 });
  },
};

function handleAuth(url, env) {
  if (!env.GITHUB_CLIENT_ID) {
    return new Response("Missing GITHUB_CLIENT_ID secret", { status: 500 });
  }

  const state = crypto.randomUUID();
  const redirectUri = new URL("/callback", url).toString();

  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", env.GITHUB_SCOPE || DEFAULT_SCOPE);
  authorizeUrl.searchParams.set("state", state);

  const headers = new Headers({ Location: authorizeUrl.toString() });
  // Short-lived state cookie, checked on /callback to guard against CSRF.
  headers.append(
    "Set-Cookie",
    `${STATE_COOKIE}=${state}; Max-Age=600; Path=/; HttpOnly; Secure; SameSite=Lax`
  );

  return new Response(null, { status: 302, headers });
}

async function handleCallback(request, url, env) {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return renderMessagePage({
      status: "error",
      message: "Worker is missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET secrets.",
    });
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = getCookie(request, STATE_COOKIE);

  if (!code) {
    return renderMessagePage({ status: "error", message: "Missing ?code from GitHub." });
  }
  if (!state || !cookieState || state !== cookieState) {
    return renderMessagePage({ status: "error", message: "OAuth state mismatch — please try logging in again." });
  }

  const redirectUri = new URL("/callback", url).toString();

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      state,
    }),
  });

  if (!tokenResponse.ok) {
    return renderMessagePage({ status: "error", message: `GitHub token exchange failed (${tokenResponse.status}).` });
  }

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return renderMessagePage({
      status: "error",
      message: tokenData.error_description || tokenData.error,
    });
  }

  return renderMessagePage({
    status: "success",
    token: tokenData.access_token,
    provider: "github",
  });
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? match[1] : null;
}

/**
 * Renders the tiny handshake page the Decap CMS popup expects. On load it
 * announces itself to window.opener, waits for the opener's ack message,
 * then replies with the real token — the token is only ever sent to the
 * origin that first messaged back, never broadcast with "*".
 */
function renderMessagePage({ status, token, provider, message }) {
  const payload =
    status === "success"
      ? JSON.stringify({ token, provider })
      : JSON.stringify({ message });

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Authorizing…</title></head>
<body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:${status}:${payload.replace(/'/g, "\\'")}',
      e.origin
    );
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
${status === "error" ? `<p>Authorization failed: ${escapeHtml(message || "")}. You may close this window.</p>` : "<p>Authorized — you may close this window.</p>"}
</body></html>`;

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}
