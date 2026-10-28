# Horizon Response

Responsive security services homepage built with Vite, locally hosted variable fonts and custom generated imagery. Includes six service panels, accessible dialogs, mobile navigation, reduced-motion support and a browser-only security brief builder.

## Development

Use Node.js 22.12+ or Node.js 24 and the existing checkout. No worktree is needed.

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy `dist/` as a static website. Vercel configuration is included: connect this repository, select production branch `main`, and use the repository root directory.

## Browser tests

```sh
npx playwright install chromium
npm run build
npm test
```

Where Chromium is already installed, use `CHROMIUM_PATH=/usr/bin/chromium npm test`. Tests cover service selection, brief validation and downloads, mobile keyboard navigation, responsive overflow, accessibility and search metadata.

## Before a full business launch

- Confirm the public phone, email, actual service area and business/licensing information.
- Connect an approved enquiry delivery service if enquiries should be submitted online. The current brief builder only prepares and downloads a local text file; it does not send enquiries or persist form data.
- Confirm the production domain before adding canonical URLs, sitemap and absolute social image metadata.
- Reference website review remains pending because the cloud network denied requests. The current design is an original draft.

Images were generated for this design and do not depict verified Horizon Response staff or facilities. No credentials are required to build the homepage.
