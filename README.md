# AI Document Manager – Web

Next.js App Router frontend for the AI Document Manager MVP. It mirrors the backend roadmap (auth, document uploads, AI summaries, tagging, search, and infra) described in [`ai-docs-manager-backend/requirements/requirements.md`](../ai-docs-manager-backend/requirements/requirements.md). The site is not deployed yet; the current deliverable is a locally served landing page that communicates the vision while the core product is under construction.

## What’s in the landing page today

- Hero + CTAs that link to the backend requirements and a placeholder inbox (`hello@placeholder.email`) for early access requests.
- Product pillars, processing pipeline, roadmap, and tech stack sections generated directly from the requirements document so stakeholders can follow progress without opening the backend repo.
- Copy and styling that set expectations that the UI is pre-release and meant for demos/screenshots until the first interactive features ship.

## Project status

- ✅ Placeholder landing page aligned with backend requirements  
- ⏳ Upcoming: auth, upload flows, searchable document workspace

## Getting started (local only)

**Prereqs**

- Node.js 18+
- npm (bundled with Node)

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the latest UI. Edits to `app/page.tsx` hot-reload automatically.

## Planned UI surface (high level)

- Auth (register/login) wired to the NestJS backend
- Document uploads using presigned URLs, with progress and status chips
- Searchable document list with tags, filters, and summaries
- Document detail page with preview, AI-generated summaries, and download links
- Admin view for processing logs / task monitoring

Track the authoritative scope and sequencing in the backend requirements file.

## Project structure snapshot

```
app/
  page.tsx       # Temporary landing page using static data derived from requirements
  globals.css    # Tailwind base + project tokens
public/
  next.svg, ...  # Placeholder assets (replace once design system is ready)
```

Keep new UI work inside `app/` routes. Co-locate components under `app/(group)/components/` once we add additional pages.

## Useful links

- Backend requirements: [`ai-docs-manager-backend/requirements/requirements.md`](../ai-docs-manager-backend/requirements/requirements.md)
- Contact / early access: `hello@placeholder.email`
