# Horizon Response

A monochrome security services homepage built with Vite, locally hosted variable fonts, a metallic HR shield visual and custom security imagery. Includes an animated hero with pointer response and a pause control, an asymmetric bento introduction, six image-linked service panels, accessible dialogs, mobile navigation, reduced-motion support and a browser-only security brief builder.

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
- The canonical URL, sitemap, robots.txt, organisation data and social metadata currently use https://horizon-response2.vercel.app/. Update these together if a custom domain is connected.
- Design references were reviewed visually in Chromium: Edenviews/Shahrukhz (cinematic imagery and elegant typography), World Wise (layered visuals, animated pathways, image-led services) and HUCO Digital (sculptural hero, moving ribbons, varied bento sections). Allied, GMR, JR Security and Sunstate were reviewed for security industry context.

The HR brand asset was prepared from the user-supplied logo reference; the metallic hero emblem is an illustrative 3D interpretation. Security photographs were generated for this design and do not depict verified Horizon Response staff or facilities. No credentials are required to build the homepage.
