const backendRequirementsUrl =
  "https://github.com/ermin/ai-docs-manager-backend/blob/main/requirements/requirements.md";

const features = [
  {
    title: "Uploads & metadata",
    description:
      "Secure presigned S3 uploads, document status tracking (uploaded → done), and rich metadata stored in Postgres.",
  },
  {
    title: "Background processing",
    description:
      "NestJS workers orchestrate extraction with PyPDF2 or Tesseract, capturing errors and task metrics for admin review.",
  },
  {
    title: "AI summaries & tags",
    description:
      "OpenAI-powered short + long summaries, keyword tagging, and optional title generation saved alongside each document.",
  },
  {
    title: "Searchable workspace",
    description:
      "Next.js UI for filters, tag pivots, previews, and admin processing logs, styled with Tailwind for rapid iteration.",
  },
];

const pipeline = [
  {
    title: "1. Presigned upload",
    description:
      "User requests `/documents/presign`, uploads to the `raw-docs` bucket, and creates the initial record.",
  },
  {
    title: "2. Extraction worker",
    description:
      "S3 > SQS/Lambda trigger fetches the file, extracts or OCRs text, normalizes content, and stores it temporarily.",
  },
  {
    title: "3. AI enrichment",
    description:
      "OpenAI summarization + tagging runs server-side, capturing both concise highlights and deeper knowledge.",
  },
  {
    title: "4. Storage & notify",
    description:
      "Summaries/tags persist in Postgres, processed assets move to `processed-docs`, statuses flip to done, and notifications fire.",
  },
];

const phases = [
  {
    title: "Phase 1 — Backend + Storage",
    status: "In progress",
    highlights: [
      "NestJS auth & document endpoints",
      "S3 bucket wiring with presign flow",
      "Postgres models for users, documents, tags",
    ],
  },
  {
    title: "Phase 2 — AI Processing",
    status: "Up next",
    highlights: [
      "Tesseract / PyPDF2 worker pipeline",
      "OpenAI summaries, tags, optional titles",
      "Task monitoring + retries (BullMQ/SQS)",
    ],
  },
  {
    title: "Phase 3 — Frontend Experience",
    status: "Planned",
    highlights: [
      "Drag & drop uploader with progress",
      "Document list, search, filters, detail view",
      "Admin dashboard for processing logs",
    ],
  },
  {
    title: "Phases 4-5 — Infra & Polish",
    status: "Planned",
    highlights: [
      "Terraform stacks (S3, RDS, IAM, SNS/SQS)",
      "GitHub Actions for lint/test/deploy",
      "Docs, tests, demo screenshots & assets",
    ],
  },
];

const stack = [
  "Next.js App Router + Tailwind",
  "NestJS REST API",
  "PostgreSQL (RDS/Supabase)",
  "Amazon S3 (raw & processed)",
  "SQS/Lambda or Nest worker",
  "OpenAI API",
  "Terraform + GitHub Actions",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-16 sm:px-10 lg:px-0">
        <section className="space-y-6 text-center sm:text-left">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 ring-1 ring-white/10 sm:mx-0">
            AI Document Manager · MVP in progress
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            We&apos;re building a smarter way to store, process, and summarize
            every document.
          </h1>
          <p className="text-lg text-slate-300 sm:max-w-2xl">
            The frontend is still under active construction. Follow along as we
            translate the backend requirements into a cohesive Next.js
            experience that handles uploads, AI summaries, tagging, and
            searchable archives for your entire document library.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row sm:justify-start">
            <a
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              href={backendRequirementsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Track the backend plan
            </a>
            <a
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5"
              href="mailto:hello@placeholder.email?subject=AI%20Document%20Manager%20early%20access"
            >
              Request early access
            </a>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Product pillars
            </p>
            <h2 className="text-2xl font-semibold text-white">
              Inspired directly by the backend requirements
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_-30px_rgba(15,23,42,1)]"
              >
                <p className="text-sm uppercase tracking-widest text-slate-400">
                  {feature.title}
                </p>
                <p className="mt-3 text-base text-slate-200">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Processing pipeline
              </p>
              <h2 className="text-2xl font-semibold text-white">
                From upload to AI-enriched document
              </h2>
            </div>
            <span className="rounded-full border border-emerald-400/40 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
              Built for automation
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {pipeline.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-900/20 p-6"
              >
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-2 text-sm text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Roadmap snapshot
            </p>
            <h2 className="text-2xl font-semibold text-white">
              Phase-by-phase build plan
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {phases.map((phase) => (
              <div
                key={phase.title}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-semibold text-white">
                    {phase.title}
                  </p>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-slate-200">
                    {phase.status}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {phase.highlights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-emerald-300">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/60 p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Tech stack
              </p>
              <h2 className="text-2xl font-semibold text-white">
                Serverless-friendly by design
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Optimized for AWS + modern DX tooling.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-emerald-400/40 bg-emerald-400/10 p-8 text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
            Stay in the loop
          </p>
          <h2 className="text-3xl font-semibold text-white">
            This page will evolve as each milestone ships.
          </h2>
          <p className="text-lg text-emerald-50/80">
            Frontend wiring, uploads, AI summaries, and document search are
            landing soon. Drop us a line if you&apos;d like to be a design
            partner or get early demos.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row sm:justify-start">
            <a
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              href="mailto:hello@placeholder.email?subject=AI%20Document%20Manager%20feedback"
            >
              Share feedback
            </a>
            <a
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              href="https://calendar.app.google/meetings"
              target="_blank"
              rel="noreferrer"
            >
              Book a quick chat
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
