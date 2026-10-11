# Majd Mawas — Netlify portfolio

The active, standalone website. Built with **Next.js 16, TypeScript, React 19, Tailwind CSS 4, Framer Motion, and Lucide**. Netlify supports this stack through its automatically managed OpenNext adapter. No Vinext, Cloudflare Workers runtime, or Sites integration is required.

The homepage, project case studies, résumé, sitemap, and robots file are prerendered. `/api/contact` runs server-side for Resend delivery. Cloudflare Turnstile is used only as a spam-check service; the website is hosted entirely on Netlify.

## Deploy to Netlify

1. Push this folder to a Git repository and import that repository in Netlify.
2. Use the included `netlify.toml`: build command **`npm run build`**, publish directory **`.next`**, Node **22**. Netlify installs the current Next.js adapter automatically.
3. If you push the entire parent workspace instead, its root `netlify.toml` already sets the base directory to **`netlify-portfolio`**.
4. Set the environment variables below in Netlify, then deploy. Give the email/security variables **Functions** scope (or all scopes). `SITE_URL` needs Builds scope when set.

Use Git-based deployment or Netlify CLI. **Do not drag and drop the source ZIP or `.next` folder into Netlify Drop**: this site needs a framework build and a server function for the contact form.

The canonical URL, Open Graph URLs, structured data, and sitemap use Netlify's automatic `URL` environment variable. Set `SITE_URL=https://your-domain.example` when you want an explicit custom-domain override. Without either variable, local development uses `http://localhost:3000`.

Official reference: [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).

## Enable the contact form

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | A Resend API key with sending permission. |
| `CONTACT_FROM` | A sender address on a domain verified in your Resend account, for example `Majd Mawas <hello@your-domain.example>`. |
| `TURNSTILE_SITE_KEY` | Public key for your Turnstile widget. |
| `TURNSTILE_SECRET_KEY` | Secret key for the same widget. |
| `SITE_URL` | Optional public canonical URL override. |

Allow your actual `*.netlify.app` site hostname and any custom domain in the Turnstile widget configuration. Add `localhost` only if testing the form locally. Do not use Turnstile test keys in production. Redeploy after changing environment variables.

The recipient is fixed server-side to **majd.mawass@gmail.com**. The visitor's address is used as Reply-To. All four delivery/security settings are required before the send button is enabled. Until then, the site shows a direct email link and an honest setup notice.

The server validates all fields, limits payloads to 16 KiB, rejects cross-origin requests, checks a honeypot and minimum completion time, and verifies the Turnstile token's hostname and action. Provider errors and timeouts never produce fake success. A successful response requires an accepted Resend message ID; acceptance is not a guarantee of inbox delivery. Run one real end-to-end inquiry after configuring the keys and confirm it arrives before launch.

Provider references: [Resend send email](https://resend.com/docs/api-reference/emails/send-email), [Turnstile verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## Local development

Requires Node 22.13 or newer. Install dependencies, optionally copy `.env.example` to `.env.local`, and start:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Do not commit `.env.local` or real credentials.

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Content and features

- Profile, experience, skills, and project details: `lib/content.ts`.
- Responsive dark/light themes; theme selection persists locally.
- Interactive system diagram and restrained, reduced-motion-aware animations.
- Four case-study pages with supplied responsibilities and only supplied outcomes.
- Original conceptual architecture diagrams, not fabricated product screenshots.
- `/resume`: print-friendly résumé with a Print / save PDF button.
- SEO metadata, PNG social preview, professional-profile structured data, sitemap, and robots file.
- Semantic HTML, labeled controls, visible keyboard focus, and a working skip link.
- GitHub remains a clearly labeled placeholder until a real profile URL is supplied.

No analytics are included. Automated contact tests use mocks and send no email. Real email delivery remains unverified until owner-provided credentials are configured.
