# Horizon Response

A minimalist security services homepage built with Vite and locally hosted variable fonts. Includes a bright, uncropped real event-security photograph, overlay navigation, a compact hero lead form, six bright photographic service cards in a touch- and keyboard-accessible gallery, accessible dialogs, mobile navigation, reduced-motion support, a two-step security brief builder and an aligned footer. The HR identity uses black, white and neutral greys.

The hero lead form validates name, email and service, then carries these details into the main brief builder for site requirements. It does not send an enquiry. The main brief builder creates a local downloadable or copyable brief and does not persist personal data.

The hero photograph is “Security Guard Overseeing Outdoor Event Crowd” by Caleb Oquendo, sourced from Pexels under the Pexels licence. See [media credits](docs/media-credits.md). The photograph retains its full 3:2 source frame with `object-fit: contain`; zoom and dark blur overlays are removed. Mobile displays the complete image between the introduction and lead form.

A transparent PNG of the previously generated two-officer image remains available in `public/images/security-officers-transparent.png`.

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

The HR brand asset was prepared from the user-supplied logo reference. Secondary service photographs were generated for this design; the hero is a real licensed stock photograph. The photographs do not depict verified Horizon Response staff or facilities. No credentials are required to build the homepage.

## Homepage design refresh

The services gallery adapts the selector, tall imagery and inset text panels reviewed at https://hucoskills.com/world-wise/. All six services remain reachable by selector buttons, previous/next controls, native scrolling and keyboard navigation. Colour imagery also replaces the monochrome supporting image.

The footer adapts the invitation and four rounded panels reviewed at https://hucoskills.com/we-serve-website/ into a dark navy and muted green palette. Its calls to action lead into the existing security brief builder; no unverified phone, address or social profiles are added. The current HR identity, licensed real hero photo, compact lead form and two-step brief builder are preserved.
