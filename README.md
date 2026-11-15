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
| Order intake | Google Apps Script + Sheet | Logs orders, serves pickup dates, emails bakery + customer (`hello@kneadedwithlove.com`) |

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

Production is live. The contact form talks to a Google Apps Script web app
owned by **hello@kneadedwithlove.com**. That script:

1. Serves the pickup calendar on GET (`pickupDates` as `YYYY-MM-DD`)
2. Appends a row to the **Orders** spreadsheet (status starts as `New`)
3. Emails **hello@kneadedwithlove.com** with the order details (Reply-To is the customer)
4. Emails the customer a confirmation from hello@ (Reply-To is the bakery)

| Piece | Production |
|-------|------------|
| Spreadsheet | [Kneaded with Love Orders](https://docs.google.com/spreadsheets/d/1Dgj1E4pe9SQnGMyi_4WF7ozyDUV_9rpgWoXnYNXyy4Y/edit) |
| Availability tab | same spreadsheet, [gid=2043331286](https://docs.google.com/spreadsheets/d/1Dgj1E4pe9SQnGMyi_4WF7ozyDUV_9rpgWoXnYNXyy4Y/edit#gid=2043331286) |
| Apps Script | Execute as hello@, access **Anyone** |
| Web app URL | [`/macros/s/…/exec`](https://script.google.com/macros/s/AKfycbylSxwJoLKlcYVs-qJGr5pbw4TYdHcmpHKLSCc9NCWWe1h6NjgU7Rj_ZuBN_6Wt-NoE/exec) (also GitHub Actions variable `VITE_ORDER_INTAKE_URL`) |

If `VITE_ORDER_INTAKE_URL` is missing locally, the form falls back to
[FormSubmit.co](https://formsubmit.co). That path notifies the bakery but
**does not** send a reliable customer confirmation — FormSubmit's auto-reply
has no authentication for `kneadedwithlove.com`, so Gmail and Outlook treat it
as spam. The site only claims an email was sent after the Apps Script confirms it.

### Why the script composes the emails

The web app is deployed to **Anyone**, so anything POSTed to it is untrusted.
`OrderIntake.gs` builds both email bodies itself from validated fields and
recomputes every line total from its own `CONFIG.PRICES` table. Do not change it
to email a string taken from the request — that would turn the endpoint into an
open relay for sending mail as the bakery. It also caps throughput at
`CONFIG.MAX_ORDERS_PER_HOUR` and refuses to record an order it cannot email.

`CONFIG` in the script duplicates things that live in the site source.
Update both sides together, then redeploy a new version:

| Script | Site |
|--------|------|
| `CONFIG.PRICES` | `priceUsd` in `src/data/menu.ts` |
| `CONFIG.MIN_LEAD_DAYS`, `CUTOFF_HOUR`, `BOOKING_HORIZON_DAYS`, timezone | `src/lib/pickupAvailability.ts` |
| `CONFIG.PAYMENT_LABELS` | `PAYMENT_METHODS` in `src/constants.ts` |

A menu item missing from `CONFIG.PRICES` is still accepted, but the order is
flagged `price TBD` so you can price it by hand instead of losing the sale.

### One-time Google setup

Production already has this. Recreate only if the hello@ project is lost:

1. In Google Drive **as hello@kneadedwithlove.com**, create a spreadsheet named **Kneaded with Love Orders**.
2. Open **Extensions → Apps Script**. Delete any stub code.
3. Paste `scripts/google-apps/OrderIntake.gs` and save.
4. **Deploy → New deployment → Web app**
   - Execute as: **Me** (must be hello@ — that is the From address)
   - Who has access: **Anyone**
5. Copy the web app URL (`https://script.google.com/macros/s/…/exec`).
6. Authorize when prompted (Sheets + Gmail).

Do not deploy from a personal Gmail. Confirmations would then send as that
account instead of hello@.

### Point the website at the script

Locally, copy `.env.example` to `.env.local` and set `VITE_ORDER_INTAKE_URL` to
the same `/exec` URL production uses (see the GitHub Actions variable).

Production already has:

| Name | Where |
|------|--------|
| `VITE_ORDER_INTAKE_URL` | Repo → **Settings → Secrets and variables → Actions → Variables** |

It is a **variable**, not a secret — the URL is public in the built JS. After
changing it, push to `main` or run **Deploy to GitHub Pages** so the site rebuilds.

### Verify it works

Work through these in order — the first two catch most setup mistakes.

1. **Script is reachable.** Open the production `/exec` URL in a browser. You should see
   JSON with `"ok":true`, `"service":"kneaded-with-love-order-intake"`, and a
   `pickupDates` array of `YYYY-MM-DD` strings. An HTML sign-in page instead
   means access is not set to **Anyone**. Opening this URL also creates the
   **Availability** sheet tab if it is missing.
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

Order mail goes out through **`GmailApp.sendEmail`, never `MailApp.sendEmail`**.
`MailApp` hands the message to an external SMTP path, and Gmail hard-bounced
every one of those to an outside address ("Message rejected", 0/1 delivered),
including a plain-text test with no links — while the identical recipient
received mail composed in Gmail. `GmailApp` sends as the mailbox itself, which
Email Log Search shows as "Delivered to a Google internal server". Switching
back to `MailApp` silently breaks customer confirmations again.

Customer confirmations are sent as `hello@kneadedwithlove.com`, so the domain
also authenticates its own mail.

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

Columns: Timestamp, Status, Name, Phone, Email, Pickup date, Payment, Items, Estimated total, Message, Source.

Pickup date is a calendar day (`2026-09-24`), not a weekday name. Older sheets labeled this column **Pickup day**; the script renames it the next time it runs.

Use **Status** (`New`, `Confirmed`, `Paid`, `Ready`, `Picked up`, `Cancelled`) as the working queue. After you change the Apps Script, deploy a **new version** (Deploy → Manage deployments → Edit → New version).

### Opening and blocking pickup dates

Default (no Availability rows): every day in the next **4 weeks**, as long as
it is not less than **2 calendar days** out.

Lead time is Eastern time (`America/New_York`):

- Before **12:00pm**, the earliest pickup is today + 2 days.
- At **12:00pm or later**, today does not count, so the earliest pickup is
  tomorrow + 2 days (orders cannot be placed with less than that 48-hour
  window after noon).

The website calendar reads `pickupDates` from the script. Changing the
**Availability** tab is enough — you do not need a code deploy for open/closed
days. The script re-checks the sheet on every GET and every order.

Manage dates on the **Availability** tab:

| Start date | End date | Status | Note |
|------------|----------|--------|------|
| 2026-09-21 | 2026-09-23 | Blocked | Weekdays closed — Thursday/Sunday only |
| 2026-09-22 | | Open | One rush Tuesday |

- Leave **End date** blank to affect a single day.
- **Blocked** hides those dates on the site and rejects them if someone submits them anyway.
- **Open** adds a date even if it is inside the 2-day window or past 4 weeks. Use this for a one-off extra pickup day.
- If the same day is both Blocked and Open, **Blocked wins**.
- Delete a row (or clear Status) to go back to “any day that meets lead time.”

**Current bakery hours (sheet, not code):** weekday ranges are Blocked so the
site only offers **Thursday and Sunday**. To add a Saturday later, delete or
shorten the Blocked range that covers it — or add an **Open** row for that day.

> **The last offered date is not the last open day.** The window is always
> today + 28 days, so the final Thursday or Sunday inside it looks like a wall
> — e.g. on Sep 19 the window ends Fri Oct 17, and since Oct 16–17 are closed,
> nothing shows after Thu Oct 15 even though Sun Oct 18 is open. It appears the
> next day, when the window rolls forward. Nothing past the window is
> "blocked"; it just is not bookable yet.

Because the window rolls daily, **Blocked rows expire**. Rows covering weekdays
only through Oct 17 mean that on Oct 18 the window reaches Mon Oct 19, which no
row blocks, so a Monday quietly becomes bookable. Either keep extending the
ranges, or move the weekday rule into `CONFIG` and `src/lib/pickupAvailability.ts`
so it cannot decay.

---

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

```bash
npm test         # pickup-date rules (src/lib/pickupAvailability.test.ts)
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
| Orders spreadsheet | https://docs.google.com/spreadsheets/d/1Dgj1E4pe9SQnGMyi_4WF7ozyDUV_9rpgWoXnYNXyy4Y/edit |
| Availability tab | https://docs.google.com/spreadsheets/d/1Dgj1E4pe9SQnGMyi_4WF7ozyDUV_9rpgWoXnYNXyy4Y/edit#gid=2043331286 |
| Pages settings | https://github.com/nabihsabeh85/kneadedwithlove/settings/pages |
| Deploy workflow | https://github.com/nabihsabeh85/kneadedwithlove/actions/workflows/deploy.yml |
| Cloudflare dashboard | https://dash.cloudflare.com (login: `gnsabeh@gmail.com`) |
| Squarespace Domains | https://account.squarespace.com (login: `gnsabeh@gmail.com`) |
