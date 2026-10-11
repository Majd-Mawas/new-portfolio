# Majd Mawas — Netlify portfolio

The active, standalone website. Built with **Next.js 16, TypeScript, React 19, Tailwind CSS 4, Framer Motion, and Lucide**. Netlify supports this stack through its OpenNext adapter, installed as a development dependency and enabled in `netlify.toml`. No Vinext, Cloudflare Workers runtime, or Sites integration is required.

The homepage, project case studies, résumé, sitemap, and robots file are prerendered. The contact form submits directly from the browser to Web3Forms on its free plan; the website is hosted on Netlify.

## Deploy to Netlify

1. Push this folder to a Git repository and import that repository in Netlify.
2. Use the included `netlify.toml`: build command **`npm run build`**, publish directory **`.next`**, Node **22**. The configuration explicitly enables `@netlify/plugin-nextjs` to generate the routing and server functions.
3. If you push the entire parent workspace instead, its root `netlify.toml` already sets the base directory to **`netlify-portfolio`**.
4. Deploy. No contact-form environment variables are needed. The optional `SITE_URL` override needs Builds scope when set.

Use Git-based deployment or Netlify CLI. **Do not drag and drop the source ZIP or `.next` folder into Netlify Drop**: this site uses a Next.js framework build and Netlify adapter.

The canonical URL, Open Graph URLs, structured data, and sitemap use Netlify's automatic `URL` environment variable. Set `SITE_URL=https://your-domain.example` when you want an explicit custom-domain override. Without either variable, local development uses `http://localhost:3000`.

Official reference: [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).

If a successful build still shows Netlify's default 404, check the deploy log for `@netlify/plugin-nextjs`. A plain `next build` followed immediately by uploading `.next` is missing the adapter step. Commit the included plugin configuration, push it, and redeploy. Keep the base directory and publish directory above; the build settings summary may display the resolved publish path as `netlify-portfolio/.next`.

## Contact form

The form uses **Web3Forms Free**, currently limited to 250 submissions per month. No purchased domain, Resend account, Turnstile widget, or email environment variables are required. The supplied public access key is configured in `lib/contact.ts`; Web3Forms keys identify the recipient form and are designed for browser use.

The recipient is the verified email associated with that key in the Web3Forms dashboard. Confirm it is **majd.mawass@gmail.com**. The visitor's email becomes Reply-To. Form submissions include name, email, project type, budget, and message.

Requests go directly from the browser to Web3Forms because server-side submissions require a paid plan. Web3Forms performs its own server-side spam filtering. The website also validates fields and checks a honeypot and minimum completion time; these client-side checks are not a security boundary. The free integration does not require a CAPTCHA.

The form displays success only when Web3Forms returns a successful HTTP response with `success: true`. Errors preserve the entered fields and offer the direct email fallback. Provider acceptance does not guarantee inbox delivery. After deploying, send a real inquiry and confirm it arrives, including checking Spam. Automated tests use mocked responses and send no email.

Existing `RESEND_API_KEY`, `CONTACT_FROM`, `TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY` variables are no longer used and can be removed from Netlify. `SITE_URL` remains optional.

Provider reference: [Web3Forms API](https://docs.web3forms.com/getting-started/api-reference), [free plan](https://web3forms.com/).

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

No analytics are included. Automated contact tests use mocks and send no email. Real inbox delivery remains unverified until an end-to-end inquiry is submitted after deployment.
