# Horizon Response

A minimalist, photographic security services homepage built with Vite and locally hosted variable fonts. Includes a full-viewport security portrait hero with overlay navigation, a soft blurred foreground, staged text entrance, subtle photograph motion with a pause control and a working service selector; six image-led service cards, accessible service dialogs, mobile navigation, reduced-motion support, a two-step security brief builder and an aligned footer. The HR identity uses black, white and neutral greys. The immersive hero composition was informed by a visual review of the public Pinterest reference at https://www.pinterest.com/pin/713609503496683293/. The hero uses a newly generated photograph animated in CSS, not the reference footage.

The brief builder guides visitors through service/site requirements and contact details, then creates a local downloadable or copyable brief. It does not submit an enquiry or persist personal data. A transparent PNG of the two hero security officers is available in `public/images/security-officers-transparent.png`.

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
- Design preferences were researched visually in Chromium, then adapted into an original photographic layout: Edenviews/Shahrukhz (cinematic imagery and elegant typography), World Wise (layered visuals, animated pathways, image-led services) and HUCO Digital (sculptural hero, moving ribbons, varied bento sections). Allied, GMR, JR Security and Sunstate were reviewed for security industry context.

The HR brand asset was prepared from the user-supplied logo reference. Security photographs were generated for this design and do not depict verified Horizon Response staff or facilities. No credentials are required to build the homepage.
