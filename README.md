# Horizon Response

A minimalist security services homepage built with Vite and locally hosted variable fonts. Includes a full-width professional security-team hero, overlay navigation, a compact hero lead form, six bright photographic service cards in a touch- and keyboard-accessible gallery, accessible dialogs, mobile navigation, reduced-motion support, a two-step security brief builder and an aligned footer. The HR identity uses black, white and neutral greys.

The hero lead form validates name, email and service, then carries these details into the main brief builder for site requirements. It does not send an enquiry. The main brief builder creates a local downloadable or copyable brief and does not persist personal data.

The hero uses an original photographic-style illustration of two private security officers at a modern commercial site. Desktop uses an edge-to-edge background with a restrained dark overlay; mobile shows the complete source frame above the introduction and enquiry form. Service images show their complete landscape frames, with compact white text panels below. See [media credits](docs/media-credits.md).

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

The HR brand asset was prepared from the user-supplied logo reference. Secondary service photographs were generated for this design; the previous licensed stock hero is retained as an unused asset. The photographs do not depict verified Horizon Response staff or facilities. No credentials are required to build the homepage.

## Homepage design refresh

The services gallery adapts the selector, tall imagery and inset text panels reviewed at https://hucoskills.com/world-wise/. All six services remain reachable by selector buttons, previous/next controls, native scrolling and keyboard navigation. Colour imagery also replaces the monochrome supporting image.

The footer adapts the invitation and four rounded panels reviewed at https://hucoskills.com/we-serve-website/ into a dark navy and muted green palette. Its calls to action lead into the existing security brief builder; no unverified phone, address or social profiles are added. The current HR identity, compact lead form and two-step brief builder are preserved.

## Pages and navigation

Vite builds three static entry points: `/`, `/about/` and `/contact/`. All pages share the same navigation, footer, service dialogs and privacy information. The About page explains the people-first approach without unsupported business-history or accreditation claims. The Contact page reuses the complete two-step, browser-local enquiry brief; no public phone, email or service area is displayed pending business confirmation.

The homepage visual slider fills the viewport and offers previous/next buttons and touch swipes. On mobile the enquiry form follows the full-screen slider. Service cards retain the tall image and inset white panel design, with reduced text padding and no forced content height. Each page has a unique title, description and canonical URL; AboutPage/ContactPage structured data and the sitemap cover the new routes.

## Interaction and contact polish

The shared services mega menu uses an accessible disclosure button, six service shortcuts, keyboard/Escape handling, a mobile overlay, animated entries and a soft backdrop. The hero crossfades decoded image layers, animates its copy gently and offers a pause/play control; automatic changes pause during hover, focus, open dialogs, navigation use or a hidden tab. Reduced-motion users get static transitions and paused autoplay by default.

Contact Us uses an open editorial layout with fine dividers, line icons and an unboxed form. The left column and form align at both edges on desktop. A ResizeObserver aligns the hero copy with the hero enquiry form without fixed device-specific heights. The enquiry brief still stays in the browser; no sending endpoint or unconfirmed contact details have been introduced.

## Compact header and service rows

The masthead is 74px on desktop and 64px on mobile, with a left-aligned identity, centred desktop navigation and the existing accessible mega menu. All fixed-header offsets use the same CSS variable. Services retain their photographic background and inset white copy panels. Four cards occupy the first desktop row and the remaining cards occupy the second; additional groups can overflow horizontally, while native scrollbars remain hidden. Tablet and mobile retain two rows with touch scrolling and visible navigation controls.

The copy panels now use an automatic flex basis, which prevents them collapsing when the cards have a fixed height. Shortened descriptions and responsive typography keep headings, body copy and service actions inside each panel without truncating the content.

## Expanded security services

The service selector is restored to the left of the two-row photographic gallery on desktop. The original ten service cards retain their inset text treatment; overflow uses the existing controls or native touch scrolling without visible scrollbars. The catalogue now includes Mobile Patrols, Alarm Services, Campus Security and Healthcare Security throughout cards, detail dialogs, mega menus, footers and both enquiry forms.

Desktop mega menus also open on fine-pointer hover with a 140ms intent delay and a 260ms closing bridge. Click, keyboard and touch remain supported. Header navigation text is slightly larger while the compact header height is retained.

## Balanced service rows and compact navigation

The ten service cards are split into two equal rows of five, with four columns visible on wide desktop layouts and matching horizontal overflow for both rows. Five category tabs replace the ten individual sidebar tabs. The footer shows four core service links and a link to the complete catalogue, while all four footer panels retain equal outer heights.

## Compact main enquiry forms

The homepage's final form and Contact Us form now use one visible step. Name and phone appear first, followed by email, organisation, a compact native service dropdown, site location and requirements. Name, phone, email, service, location and requirements are required; the download/copy flow remains browser-local. Existing hero and service-detail shortcuts preserve and preselect the same fields.

## Phone keypad, daily focus and mobile cards

The header opens a website keypad before handing off through an explicit `tel:` link. The currently displayed number, +61 491 570 006, is a temporary example reserved by ACMA for creative works (https://www.acma.gov.au/phone-numbers-use-tv-shows-films-and-creative-works). It is visibly labelled temporary and is not the business's live line. Replace the `data-security-phone` value, header text and temporary status in each static page when the real number is supplied.

The homepage has a short Daytime / Evenings / After hours section with keyboard-accessible tabs and reduced-motion support. Mobile service cards now show two full cards per row, retaining balanced rows, hidden native scrollbars and access to full descriptions through their detail dialogs.

## Locked phone dropdown and service-focused copy

The header call action now reveals an anchored, non-modal phone-shaped dropdown with a smooth drop entrance. Its saved example number is read-only; the visual keypad is decorative and no digit-edit, clear or delete action is exposed. The call link always uses the configured saved number. Escape, click outside, close, focus containment and reduced motion are supported.

The short homepage section now explains Horizon's three service groupings: site guarding; mobile patrols, alarm arrangements and after-hours security; and specialist security for events, residential communities, campuses and healthcare.
