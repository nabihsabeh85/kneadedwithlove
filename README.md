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
