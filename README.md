# Kneaded with Love

Homemade sourdough & baked goods — **Kneaded with Love** landing site.

**Live site:** [https://kneadedwithlove.com](https://kneadedwithlove.com)

Built with React, Vite, and Tailwind CSS.

---

## Architecture

```
Visitor browser
      │
      ▼
kneadedwithlove.com / www.kneadedwithlove.com
      │
      ▼
Cloudflare DNS (nameservers only — DNS-only / gray cloud)
      │
      ▼
GitHub Pages (static hosting + free HTTPS certificate)
      │
      ▼
Built site from this repo (`dist/` via GitHub Actions)
```

| Layer | Provider | Role |
|-------|----------|------|
| Domain registrar | Squarespace Domains | Owns/registers `kneadedwithlove.com` |
| DNS | Cloudflare | Authoritative DNS for the domain |
| Hosting | GitHub Pages | Serves the static site |
| CI/CD | GitHub Actions | Builds and deploys on every push to `main` |
| SSL/HTTPS | GitHub Pages (Let’s Encrypt) | Free certificate after DNS check succeeds |
| Order intake | Google Apps Script + Sheet | Logs orders and emails bakery + customer (FormSubmit fallback until configured) |

**Important:** Cloudflare is used for **DNS only** (gray cloud). Do **not** enable Cloudflare proxy (orange cloud) for this site — it breaks GitHub Pages HTTPS verification and can return 404s.

---

## Accounts

| Service | Account / login |
|---------|-----------------|
| Squarespace Domains | `gnsabeh@gmail.com` |
| Cloudflare | `gnsabeh@gmail.com` |
| GitHub | [`nabihsabeh85/kneadedwithlove`](https://github.com/nabihsabeh85/kneadedwithlove) |

---

## Domain & DNS setup

### Domain

- **Primary domain:** `kneadedwithlove.com`
- **Registrar:** Squarespace Domains
- **Purchased / managed under:** `gnsabeh@gmail.com`

> Note: `kneadedwithlovefl.com` was also purchased (Squarespace parking page). Production uses **`kneadedwithlove.com`**, not the FL domain.

### Nameservers (Squarespace → Cloudflare)

In Squarespace → Domains → `kneadedwithlove.com` → **Domain Nameservers**, custom nameservers are set to Cloudflare:

| Nameserver |
|------------|
| `gerardo.ns.cloudflare.com` |
| `sofia.ns.cloudflare.com` |

- DNSSEC should stay **off** at Squarespace while using Cloudflare nameservers (unless re-enabled carefully via Cloudflare later).
- Do **not** click “Use Squarespace nameservers” or “Update DNS records / Squarespace Defaults” — those restore the parking page.

### Cloudflare DNS records

Cloudflare zone: **`kneadedwithlove.com`** (Free plan)  
Account: `gnsabeh@gmail.com`

All records must be **DNS only** (gray cloud), not Proxied:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `nabihsabeh85.github.io` | DNS only |

These four A records are GitHub Pages’ published IPv4 addresses for apex/custom domains.

Optional presets left on Squarespace (email security TXT, Domain Connect) are unrelated to site hosting and can stay as-is.

---

## GitHub Pages configuration

Repo: [nabihsabeh85/kneadedwithlove](https://github.com/nabihsabeh85/kneadedwithlove)

| Setting | Value |
|---------|--------|
| Source | GitHub Actions (workflow: `.github/workflows/deploy.yml`) |
| Custom domain | `kneadedwithlove.com` |
| Repo `CNAME` file | `public/CNAME` → `kneadedwithlove.com` (copied into `dist/` on build) |
| Enforce HTTPS | Enable after GitHub shows **DNS check successful** |

Pages settings:  
https://github.com/nabihsabeh85/kneadedwithlove/settings/pages

### Deploy workflow

On every push to `main` (or manual `workflow_dispatch`):

1. `npm ci`
2. `npm run build` (root base `/` — required for custom domain)
3. Upload `dist/` as Pages artifact
4. Deploy to GitHub Pages

`npm run build:pages` (base `/kneadedwithlove/`) is only for the old path-based GitHub Pages URL and is **not** used for production custom-domain deploys.

---

## Order intake (email + Google Sheet)

The contact form logs every order to a Google Sheet **and** sends email:

1. Append a row to an **Orders** spreadsheet (status starts as `New`)
2. Email **hello@kneadedwithlove.com** with the order details (Reply-To is the customer)
3. Email the customer a confirmation (Reply-To is the bakery)

> **Customers only get a confirmation email once `VITE_ORDER_INTAKE_URL` is set.**
> Until then the form falls back to [FormSubmit.co](https://formsubmit.co), which
> delivers the bakery notification but **not** the customer confirmation — its
> auto-reply is sent by a third party with no authentication for
> `kneadedwithlove.com`, so Gmail and Outlook filter it as spam. On the fallback
> path the site deliberately does not claim an email was sent.

### Why the script composes the emails

The web app is deployed to **Anyone**, so anything POSTed to it is untrusted.
`OrderIntake.gs` builds both email bodies itself from validated fields and
recomputes every line total from its own `CONFIG.PRICES` table. Do not change it
to email a string taken from the request — that would turn the endpoint into an
open relay for sending mail as the bakery. It also caps throughput at
`CONFIG.MAX_ORDERS_PER_HOUR` and refuses to record an order it cannot email.

`CONFIG` in the script duplicates three things that live in the site source.
Update both sides together, then redeploy a new version:

| Script | Site |
|--------|------|
| `CONFIG.PRICES` | `priceUsd` in `src/data/menu.ts` |
| `CONFIG.PICKUP_DAYS` | `PICKUP_DAYS` in `src/constants.ts` |
| `CONFIG.PAYMENT_LABELS` | `PAYMENT_METHODS` in `src/constants.ts` |

A menu item missing from `CONFIG.PRICES` is still accepted, but the order is
flagged `price TBD` so you can price it by hand instead of losing the sale.

### One-time Google setup

1. In Google Drive (use the account that owns `hello@kneadedwithlove.com` if possible), create a spreadsheet named **Kneaded with Love Orders**.
2. Open **Extensions → Apps Script**. Delete any stub code.
3. Paste `scripts/google-apps/OrderIntake.gs` and save.
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the web app URL (`https://script.google.com/macros/s/…/exec`).
6. Authorize when prompted (Sheets + Gmail).

Customer confirmation emails are sent **from the Google account that owns the script**. Deploy while logged into the inbox that should appear as the sender, or add `hello@kneadedwithlove.com` as a Gmail “Send mail as” alias on that account.

### Point the website at the script

Locally, copy `.env.example` to `.env.local` and set:

```
VITE_ORDER_INTAKE_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

For production, add a GitHub Actions **variable** (not a secret — this URL is public in the built JS):

| Name | Value |
|------|--------|
| `VITE_ORDER_INTAKE_URL` | the web app `/exec` URL |

Repo → **Settings → Secrets and variables → Actions → Variables**. Redeploy after saving (push to `main` or run the workflow).

### Verify it works

Work through these in order — the first two catch most setup mistakes.

1. **Script is reachable.** Open the `/exec` URL in a browser. You should see
   `{"ok":true,"service":"kneaded-with-love-order-intake"}`. An HTML sign-in page
   instead means access is not set to **Anyone**.
2. **Validation is intact.** In the Apps Script editor, select
   `runValidationTests_` and press **Run**. The execution log should end with
   `All validation tests passed.` This sends no email and writes no rows.
3. **End-to-end.** Place a real order on the site using an address you control
   (not `hello@kneadedwithlove.com`, so you can tell the two emails apart). You
   should get a new sheet row, the bakery notification, and the customer
   confirmation. The success dialog names the address it emailed.
4. **Failures are visible.** The form now only shows "we emailed your order
   details" after the script confirms it. If submission fails, the customer sees
   an error asking them to text instead, and the browser console logs the cause.

### Email deliverability

Customer confirmations are sent by Apps Script as `hello@kneadedwithlove.com`,
so the domain must authenticate its own mail or Gmail rejects it outright
(seen once as a hard bounce: "Message rejected", 0/1 delivered).

Cloudflare DNS carries all three records:

| Type | Name | Purpose |
|------|------|---------|
| TXT | `@` | SPF — `v=spf1 include:_spf.google.com ~all` |
| TXT | `google._domainkey` | DKIM public key generated in Admin console |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:hello@kneadedwithlove.com` |

DKIM also has to be switched on in **Admin console → Apps → Google Workspace →
Gmail → Authenticate email → Start authentication**; the DNS record alone does
not make Google sign anything. Status there should read *Authenticating email*.

To confirm delivery of any given message, use **Admin console → Reporting →
Email Log Search**, which shows per-recipient status (`Delivered to Gmail
mailbox` vs `Bounced`) and the bounce reason.

### Tracking orders in the sheet

Columns: Timestamp, Status, Name, Phone, Email, Pickup day, Payment, Items, Estimated total, Message, Source.

Use **Status** (`New`, `Confirmed`, `Paid`, `Ready`, `Picked up`, `Cancelled`) as the working queue. After you change the Apps Script, deploy a **new version** (Deploy → Manage deployments → Edit → New version).

---

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

```bash
npm run build    # production build → dist/
npm run preview  # preview production build locally
```

## Logo

Brand logo: `public/images/logo.png`

The site palette is derived from the logo and defined in one place — the `@theme`
block in `src/index.css`. If the logo art changes, retune those tokens to match.

---

## How to redeploy

1. Commit and push to `main`
2. Wait for **Deploy to GitHub Pages** workflow to finish (Actions tab)
3. Site updates at https://kneadedwithlove.com

No manual upload is required.

---

## Operational notes & lessons learned

1. **Squarespace Defaults** (`A` → `198.49…` / `198.185…`, `www` → `ext-sq.squarespace.com`) serve the “Coming Soon” parking page. They must stay deleted for external hosting.
2. Custom A/CNAME records in Squarespace UI did **not** publish reliably while Squarespace nameservers were in use — moving DNS to Cloudflare fixed that.
3. Cloudflare **Proxied** (orange cloud) caused GitHub 404s / HTTPS issues. Keep **DNS only**.
4. After DNS changes, local routers/phones can cache old answers (including previous Cloudflare proxy IPs). Flush DNS, use cellular, or private browsing if you still see a 404.
5. GitHub’s **Enforce HTTPS** stays disabled until the free certificate is issued (often minutes to ~1 hour after DNS check succeeds).

---

## Quick links

| What | URL |
|------|-----|
| Live site | https://kneadedwithlove.com |
| GitHub repo | https://github.com/nabihsabeh85/kneadedwithlove |
| Pages settings | https://github.com/nabihsabeh85/kneadedwithlove/settings/pages |
| Deploy workflow | https://github.com/nabihsabeh85/kneadedwithlove/actions/workflows/deploy.yml |
| Cloudflare dashboard | https://dash.cloudflare.com (login: `gnsabeh@gmail.com`) |
| Squarespace Domains | https://account.squarespace.com (login: `gnsabeh@gmail.com`) |
