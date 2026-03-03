# Innovin Labs Marketing Website

A static marketing website built with Next.js 16, featuring static site generation (SSG) and on-demand revalidation.

## Technology stack

- **Next.js 16** - React framework with static export
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Sanity CMS** - Headless CMS for blog content (placeholder - ready for integration)
- **Supabase** - Database and Edge Functions for form submissions (placeholder - ready for integration)

## Project Structure

```
/
├── app/              # Next.js app directory
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Homepage
│   └── globals.css  # Global styles
├── components/      # React components
│   ├── HomeScreen.tsx
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── WhyUs.tsx
│   ├── Services.tsx
│   ├── TechStack.tsx
│   ├── Testimonials.tsx
│   ├── Offices.tsx
│   └── Footer.tsx
├── lib/             # Utility libraries
│   ├── sanity.client.ts
│   └── supabaseClient.ts
└── public/          # Static assets
```

## Getting started

1. Install dependencies:
```bash
npm install
```

2. (Optional) Set up environment variables for future integrations:
Create a `.env.local` file with:
```
# Only needed when integrating Sanity CMS and Supabase
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Webmaster / SEO Configuration
NEXT_PUBLIC_SITE_URL=https://innovinlabs.com  # Base URL for sitemap and robots.txt
```

**Note:** The site currently uses placeholder content and works without any external services.

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

The static site will be generated in the `out/` directory.

## Deployment

This project is configured for static export. You can deploy to:
- **Vercel** (Static Export Mode)
- **Netlify**
- **Render** (Static Sites)

## Features

- ✅ Fully static pages (SSG)
- ✅ Placeholder content (no external dependencies required)
- ✅ Responsive design
- ✅ Modern UI/UX
- ✅ Ready for Sanity CMS integration (placeholder functions included)
- ✅ Ready for Supabase integration (placeholder functions included)

## Webmaster / SEO Configuration

The website includes automatic sitemap and robots.txt generation:

- **Sitemap** (`/sitemap.xml`): Automatically generated at build time, includes:
  - All static pages (home, about, services, why-us, blog, careers, privacy)
  - Dynamic blog posts from Sanity CMS
  - Dynamic job postings from Sanity CMS
- **Robots.txt** (`/robots.txt`): Configured to allow all crawlers, disallows:
  - `/api/` routes
  - `/admin/` routes
  - `/_next/` internal Next.js files
  - `/draft-mode/` preview routes

**Configuration**: Set `NEXT_PUBLIC_SITE_URL` environment variable (defaults to `https://innovinlabs.com`).

## Sanity live preview / visual editing (performance note)

This website integrates `next-sanity` Live Preview / Visual Editing.

- **Why the hosted site can feel slower**: calling `draftMode()` (or `cookies()` / `headers()`) in the root `app/layout.tsx` forces the whole app to be dynamically rendered, which can disable static optimizations and slow down production.
- **What we changed**: preview tooling is now gated and **disabled in production by default** to keep the public site fast.
- **Enable in production (optional)**: set `NEXT_PUBLIC_ENABLE_SANITY_PREVIEW=true`

## Current Status

The website is fully functional with placeholder content. All components are built and styled according to the Figma design. External services (Sanity CMS and Supabase) are not required to run the site.

## Future Integrations

When ready to connect external services:

1. **Sanity CMS Integration:**
   - Uncomment code in `lib/sanity.client.ts`
   - Set up Sanity project and configure environment variables
   - Update blog components to fetch from Sanity

2. **Supabase Integration:**
   - Uncomment code in `lib/supabaseClient.ts`
   - Set up Supabase project and configure environment variables
   - Create Edge Functions for form submissions
   - Update form components to use Supabase functions

