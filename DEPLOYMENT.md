# Publish Mauforge Gallery

The website is a static site. No build command or special hosting environment is required.

## Option A: Upload directly to Cloudflare Pages

1. Open the Cloudflare dashboard and select **Workers & Pages**.
2. Select **Create application**, then **Pages**, then **Upload assets**.
3. Name the project `mauforge-art-gallery` and upload the contents of this folder, or the provided ZIP file.
4. Select **Deploy site**. Cloudflare will first give the site a temporary address ending in `.pages.dev`.
5. Open the deployed project, select **Custom domains**, and choose **Set up a custom domain**.
6. Enter `art.mauforge.com` and continue.

### Connect the domain

Cloudflare will show the precise DNS record it needs. Follow the path that matches where `mauforge.com` DNS is managed:

- **DNS is already managed by Cloudflare:** allow Cloudflare to add the record automatically when offered. It will usually create a CNAME for `art` that points to your project's `.pages.dev` address.
- **DNS is managed by another provider** such as GoDaddy, Namecheap, Squarespace, or your registrar: sign in to that provider and create the exact record Cloudflare displays. This will normally be a CNAME with host/name `art` and target `mauforge-art-gallery.pages.dev`. Use the project-specific target shown by Cloudflare if it differs.

After the record is saved, return to Cloudflare Pages and wait for the custom domain status to become **Active**. Cloudflare automatically provisions HTTPS. DNS updates can take a few minutes, and occasionally up to 24 hours.

## Security and search setup included

The project contains Cloudflare Pages security headers in `_headers`, plus `robots.txt`, `sitemap.xml`, a canonical URL, social-preview metadata, and structured gallery data. Keep these files at the published site's root. The Content Security Policy intentionally allows only files hosted by this site; add a domain to the relevant directive only when a future feature truly needs it.

## Option B: Deploy from any supported Git provider

If you prefer automatic updates, create a repository with these files in its root, then in Cloudflare Pages choose **Connect to Git** instead of **Upload assets**. Cloudflare supports GitHub and GitLab; use the provider you already have. For this site use:

- Framework preset: `None`
- Build command: leave blank
- Build output directory: `/`

After the first deployment, attach `art.mauforge.com` using the same custom-domain steps above.

## Before publishing

- Replace `hello@mauforge.com` in `index.html` with the preferred public email address.
- The opening artwork is your uploaded image, `assets/sunlit-valley.png`. Replace the remaining placeholder files in `assets/` with final artwork images when they are ready. Keep the file names or update the matching image paths in `index.html` and `script.js`.
- Open `site-config.js` and paste the public HTTPS PayPal payment link, sign-in page URL, and sign-up page URL. Do not paste PayPal credentials, passwords, API keys, or private tokens anywhere in the website files.
- The sign-in and sign-up buttons intentionally stay inactive until those URLs are configured. Use an authentication provider or membership system that handles passwords on its own secure domain; this static website does not collect or store passwords.
- Test the `.pages.dev` address before pointing the custom domain at it.
