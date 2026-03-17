# Notion Template Storefront

A lightweight, conversion-focused landing page for selling a Notion template bundle. Built with Vite + TypeScript for easy deployment to GitHub Pages.

## Local development

1. Install dependencies:
   `npm install`
2. Start the dev server:
   `npm run dev`

Build for production:
`npm run build`

Preview the production build:
`npm run preview`

## Configuration

Update the product settings in `src/config.ts`:

- `PRODUCT_NAME`
- `PRICE_TEXT`
- `CHECKOUT_URL`

CTA buttons and pricing automatically update from these constants.

## Email capture export

Emails are stored in `localStorage` under the key `ntb_leads_v1`.

To export:

1. Use the **Copy CSV** button in the Email section.
2. Paste into a spreadsheet or CSV file.

## Deploy to GitHub Pages (GitHub Actions)

1. Push to the `main` branch.
2. In GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` will build and deploy on every push to `main`.

If your repo name changes, keep `base: "./"` in `vite.config.ts` for relative asset paths.
The deploy workflow sets the Vite base path automatically to your repository name for GitHub Pages project URLs.

## Where to paste checkout link

Replace the placeholder `CHECKOUT_URL` in `src/config.ts` with your Gumroad or Stripe payment link.
