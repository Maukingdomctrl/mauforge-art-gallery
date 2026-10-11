# Mauforge Art Gallery

A static contemporary art gallery with Cloudflare Pages Functions for dynamic routes.

## What is included

- Responsive gallery and full-screen artwork viewer.
- SEO metadata, sitemap, robots rules, and security headers.
- `/api/health` Pages Function for deployment checks.
- `/api/enquiry` Pages Function that validates enquiries and relays them only when a secret webhook URL is configured.
- No password or payment credential handling. Account and PayPal links stay client-side and accept public HTTPS destinations only.

## Deploy with Cloudflare Pages

1. In Cloudflare, open **Workers & Pages** and select **Create application** > **Pages** > **Connect to Git**.
2. Choose `Maukingdomctrl/mauforge-art-gallery` and use `main` as the production branch.
3. Set the framework preset to `None`, leave the build command empty, and set the build output directory to `.`.
4. Deploy. Verify `https://<your-project>.pages.dev/api/health` returns `{"status":"ok"}`.
5. Add `art.mauforge.com` under **Custom domains**, then create the exact DNS record Cloudflare asks for at the provider that hosts your DNS.

## Configure secure enquiry delivery

The enquiry endpoint is intentionally inactive until Cloudflare receives a secret destination URL.

1. In the Pages project, open **Settings** > **Variables and Secrets**.
2. Add `ENQUIRY_WEBHOOK_URL` as an encrypted secret for Production and Preview.
3. Set it to the HTTPS webhook endpoint of the email or form service you choose.
4. Deploy again and test `POST /api/enquiry` with a name, email, and message.

Never put API keys, payment credentials, passwords, or webhook secrets in `site-config.js`, the repository, or browser code.
