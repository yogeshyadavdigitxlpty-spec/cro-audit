# Website Conversion Audit

A premium, editorial-styled CRO audit tool with three audit types (Home Page,
Product Page, Full Site), built with React + Vite on the frontend and
Netlify Functions on the backend. Free AI audits call a configurable LLM
provider; the Full Site Audit captures a lead for a human-led engagement.

---

## 1. Install

```bash
npm install
```

## 2. Run locally

The frontend and functions run together via the Netlify CLI (recommended),
which emulates the production redirect from `/.netlify/functions/*`:

```bash
npm install -g netlify-cli   # once, globally
netlify dev
```

This starts Vite and the Functions runtime together, usually on
`http://localhost:8888`.

Alternatively, for frontend-only work (forms will hit a 404 on submit
since no functions server is running):

```bash
npm run dev
```

## 3. Environment variables

Copy the example file and fill in real values locally:

```bash
cp .env.example .env
```

| Variable | Where it's used | Required? |
|---|---|---|
| `VITE_APP_NAME` | Frontend | No |
| `AI_PROVIDER` | `netlify/functions/utils/aiProvider.js` | No (defaults to `openai`) |
| `OPENAI_API_KEY` | `netlify/functions/utils/aiProvider.js` | No — without it, audits fall back to a realistic mock so the app works with zero paid services |
| `AI_MODEL` | `netlify/functions/utils/aiProvider.js` | No (defaults to `gpt-4o-mini`) |
| `LEAD_WEBHOOK_URL` | `netlify/functions/lead.js` | No — without it, leads are logged only |
| `AUDIT_SHARED_SECRET` | `netlify/functions/audit.js` | No — optional light abuse protection |

**Never prefix server-side secrets with `VITE_`.** Anything prefixed
`VITE_` is bundled into the public frontend JavaScript. `OPENAI_API_KEY`,
`LEAD_WEBHOOK_URL`, and `AUDIT_SHARED_SECRET` are only ever read inside
`netlify/functions/*`, which run server-side.

In production, set these under **Netlify → Site settings → Environment
variables** — do not commit a real `.env` file.

## 4. Configuring the AI provider

The AI call is isolated in one file: `netlify/functions/utils/aiProvider.js`.

- With `OPENAI_API_KEY` set, `audit.js` calls the OpenAI Chat Completions
  API and asks for strict JSON back.
- Without a key, the same function returns a deterministic mock result, so
  the full product (tabs, forms, validation, loading states, results
  screen) works out of the box with no paid dependency.
- To swap providers (Anthropic, Azure OpenAI, a self-hosted model), replace
  the body of `callOpenAI` (or add a sibling function and switch on
  `AI_PROVIDER`) — nothing in `audit.js` or the frontend needs to change.

## 5. How Netlify Functions work here

- `netlify/functions/audit.js` — handles the two free AI audits (`home`,
  `product`). Validates input, best-effort fetches the target URL for
  context, calls the AI provider, and returns
  `{ score, findings, recommendations }`.
- `netlify/functions/lead.js` — handles Full Site Audit submissions.
  Validates input and forwards the lead to `LEAD_WEBHOOK_URL` if configured
  (e.g. a Zapier/Make webhook that fans out to Airtable, HubSpot, Zoho, a
  CRM, or email) — otherwise it just logs the lead.
- Both are plain Node handlers (`exports.handler`) with no framework
  dependency, so they work unmodified on Netlify and with minimal changes
  on Vercel/Cloudflare Functions if you migrate later.
- `netlify.toml` maps `/.netlify/functions/*` (and a friendlier `/api/*`
  alias) to these handlers and points the build at `dist/`.

## 6. Deploying to Netlify

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project**, select the
   repo. Build command and publish directory are already set via
   `netlify.toml` (`npm run build` → `dist`).
3. Add the environment variables from step 3 under **Site settings →
   Environment variables**.
4. Deploy. Netlify automatically builds the Vite frontend and deploys the
   functions in `netlify/functions`.

## 7. Connecting a custom domain

In Netlify: **Domain settings → Add a custom domain**, then follow the
prompts to either use Netlify DNS or add the provided CNAME/A records at
your existing registrar. HTTPS is provisioned automatically once DNS
propagates.

## 8. Changing the audit content

All copy, form fields, deliverables, and CTA text live in one file:

```
src/data/auditConfig.js
```

Edit the `auditOptions` (top card labels) or `auditContent` (headings,
descriptions, deliverables, footer text) objects — no component code needs
to change.

## 9. Changing colors / fonts

Design tokens live at the top of `src/index.css`:

```css
:root {
  --bg: #ffffff;
  --section-bg: #f7f2e8;
  --accent: #fabc34;
  --text: #212121;
  --muted: #615b55;
  /* ...etc */
}
```

**Fonts:** the design spec references *Maison Neue Extended*, a licensed
commercial typeface. This project ships with **Plus Jakarta Sans** (a free,
visually close geometric sans) as the default via Google Fonts in
`index.html`. If you hold a Maison Neue Extended license:

1. Add the font files to `public/fonts/`.
2. Add an `@font-face` declaration at the top of `src/index.css`.
3. Update `--font-display` / `--font-body` in the same file to
   `'Maison Neue Extended', ...`.

## 10. Replacing the AI provider

See section 4 above — everything is isolated in
`netlify/functions/utils/aiProvider.js`.

---

## Project structure

```
/src
  /components        # AuditSection, AuditSelector, AuditOption, AuditPanel,
                      # HomeAuditForm, ProductAuditForm, FullSiteAuditForm,
                      # DeviceToggle, AuditDeliverables, DeliverableItem,
                      # LoadingState, AuditResults, FormMessage
  /data
    auditConfig.js    # all copy + structure — single source of truth
  /utils
    validation.js      # client-side validation
    useSimpleAuditForm.js
    api.js             # fetch wrapper for the two function endpoints
    icons.js
  App.jsx
  main.jsx
  index.css            # design tokens + all styles
/netlify/functions
  audit.js             # POST /.netlify/functions/audit
  lead.js              # POST /.netlify/functions/lead
  /utils
    validate.js        # server-side validation (never trusts the client)
    aiProvider.js       # modular AI call + mock fallback
/public
package.json
vite.config.js
netlify.toml
.env.example
```

## Security notes

- The AI/API key is only ever read inside `netlify/functions/*` — it is
  never bundled into frontend JavaScript.
- Every request is re-validated server-side (URL shape, required lead
  fields, email format) regardless of what the client already checked.
- An optional `AUDIT_SHARED_SECRET` header check is available for the free
  audit endpoint to discourage casual scripted abuse.
- Lead data is minimal (URL, name, email, optional phone) and is only
  persisted if you configure an outbound webhook — nothing is stored in
  this repo by default.

## Accessibility

- Semantic headings, `<label>`s tied to inputs via `htmlFor`/`id`.
- Selector cards and device toggle use `aria-pressed` for state.
- Inline errors use `aria-invalid` + `aria-describedby`.
- Loading state uses `role="status"` / `aria-live="polite"`.
- Visible focus rings via `:focus-visible` throughout.
