# MeshOffice — Cursor-first, Convex-backed Work OS

MeshOffice (MO) is an AI-run work operating system focused on *AI-orchestrated pods for scoped deliverables* — a Cursor-built frontend with Convex powering backend state and serverless functions. MO turns plain-English requests like “I need a product feature built in 2 weeks on $X” into an immutable work-graph, automatically assembles a pod, assigns tasks, routes work, validates deliverables, logs IP and audit trails, and exposes an enterprise-ready dashboard for procurement and HR.

---

## Why MeshOffice — product positioning

MeshOffice positions itself intentionally narrow: **not a general freelancer marketplace**. The strongest go-to-market wedge is *AI-run pods for repeatable, specifiable deliverables* (product engineering sprints, marketing campaign sprints, analytics research packets). By defining and selling discrete, verifiable "work units" and offering an LLM orchestration layer that owns quality SLAs, MO becomes a procurement-grade substitution for fragmented freelance buying + in-house orchestration.

Key strategic differentiators we emphasize in this repo and README:

* **Cursor-first frontend**: handcrafted UI & UX coded by the creators using Cursor — front-end code comes from deliberate, readable, componentized source rather than a black-box generator. This README documents the Cursor-first development approach and how the frontend maps to the MO product model.
* **Convex backend (single source of truth)**: Convex holds the authoritative state (WorkGraph, Pods, Tasks, Candidates, Deliverables). Use Convex serverless functions for business logic and background workflows.
* **LLM as orchestrator (MO Brain)**: A dedicated LLM agent does decomposition, routing, scoring and validation. It is a service client (API-based) that calls Convex functions and interacts via structured prompts and JSON contracts.
* **Enterprise rails**: audit trails, IP assignment, NDAs, invoicing hooks, observable activity logs.

---

## TL;DR — What MeshOffice can do now (Repo state)

* **Frontend (Cursor) — complete scaffold + production-ready pages**: UI components, routing, role-based views (requester / worker / hiring manager), WorkGraph dashboard, Pod management UI, and deliverable viewer are implemented and polished.
* **Convex backend — schema + serverless functions**: data models for WorkGraph, Requests, Pods, Tasks, Candidates, Deliverables and audit logs exist. Core functions for CRUD and basic workflows are implemented.
* **MO Brain (LLM) — integration layer present, logic stubbed**: prompts, schemas, and an LLM client integration layer exist. Complex decomposition and autonomous rerouting are implemented as *clear callables* but require live LLM API keys + runtime to exercise full autonomy.
* **End-to-end MVP flow**: you can run a demo where a Request is created, the Convex-backed matching engine returns candidate matches, and the WorkGraph is persisted. Full autonomous orchestration (LLM-led, production pods with SLA enforcement and payments) is functionally wired but gated by external LLM and payment integrations.

---

## Key concepts & data model (high level)

**WorkGraph** (first-class): immutable, versioned graph representing a request and all derivative work units.

* `Request` — user's natural-language ask (budget, timeline, quality requirements)
* `WorkPackage` — LLM-decomposed unit of work (deliverable + acceptance criteria + time estimate + dependencies)
* `Pod` — a collection of `Task` assignments and people who will execute the package
* `Task` — smallest assignable unit (owner, ETA, status, dependencies)
* `CandidateProfile` — curated profile (resume, portfolio links, rates, verified skills, scores)
* `Deliverable` — artifact + metadata + validation verdict
* `AuditLog` — immutable activity stream (who changed what, when, how)

All data is stored in Convex documents and indexed for fast queries. Each mutation is appended with a cryptographic-ish `operationId` and version tag so the WorkGraph can be audited and replayed.

---

## Architecture — Cursor frontend + Convex backend

**Overview**

* **Frontend (Cursor, React + TypeScript)**

  * Cursor was used as the development environment and authoring tool; frontend code is deliberately componentized and authored from scratch (no opaque JS blobgers). The UI ships with:

    * `RequestComposer` — natural-language UI + budget/time fields
    * `WorkgraphViewer` — visual graph of dependencies and progress
    * `PodBuilder` — manual override UI to accept or replace AI-suggested matches
    * `CandidateExplorer` — semantic search over candidate embeddings
    * `DeliverableValidator` — QA / checklist + reviewer panel
  * UI state is local + connected to Convex subscriptions for realtime updates.

* **Backend (Convex)**

  * Convex functions act as authoritative business logic (CRUD + orchestrators):

    * `fn/createRequest` — validates request payload → persist Request → queue `fn/runDecomposition`
    * `fn/runDecomposition` — calls LLM (MO Brain) with a structured prompt, receives JSON WorkPackage(s), and writes them into the WorkGraph
    * `fn/matchCandidates` — run semantic matching using stored candidate embeddings and scoring heuristics
    * `fn/assignTasks` — allocate tasks to candidate IDs, apply SLA penalties, and create task timers
    * `fn/validateDeliverable` — compute LLM-assisted validation + human overrides, write verdict
  * Convex also holds authentication, row-level access control patterns, and real-time subscriptions so the UI updates instantly.

* **MO Brain (LLM service)**

  * LLM runs externally via an API adapter. Convex functions call the LLM adapter which returns structured JSON that follows our internal protocol (`WorkPackage[]` schema). The adapter includes provenance metadata, temperature, and tokens used for observability.

* **Optional integrations**

  * Payment (Stripe/PayPal): invoicing webhook hooks — left as pluggable service adapters.
  * Data export / SIEM: audit streams to S3 / GCP buckets.
  * VCS & CI: optionally store accepted deliverables to a private Git repo (for engineering pods).

---

## Developer quickstart (local)

> The goal here is a Cursor-first developer experience. This section assumes you have Node 18+, an account for your LLM provider, and a Convex deployment.

1. Clone the repo (assumed): `git clone <repo>`
2. Install frontend deps: `cd web && npm ci`
3. Start Cursor dev environment (if you use the Cursor CLI): `cursor dev` (or `npm run dev`)
4. Setup Convex (create a project) and copy your Convex URL/keys into `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=https://convex.<your-project>.convex.dev
CONVEX_ADMIN_KEY=xxxx
MO_LLM_API_KEY=sk_XXXX
```

5. Deploy Convex functions locally (or run them via the Convex dev server): `npx convex dev`
6. Seed demo data (helper script): `node ./scripts/seed-demo.js`
7. Open the app in your browser at `http://localhost:5173` (or Cursor's dev host).

> Notes: if you're running Cursor's workspace directly, the `cursor` command will serve both Cursor previews and the React app. We keep the frontend tightly integrated with Cursor so designers and devs can iterate rapidly.

---

## Example: end-to-end flow (detailed)

1. **User**: Opens `RequestComposer` and types: `Build a checkout microfeature (cart merge) — deliver in 10 days — $6k budget. Must be unit-tested and deployable.`
2. **Frontend**: Posts `createRequest` to Convex `fn/createRequest`.
3. **Convex fn**: Validates schema, persists Request with status `queued`, and calls `fn/runDecomposition`.
4. **fn/runDecomposition**: Calls LLM adapter with `ROLE`: `planner` prompt and structured schema. LLM returns `WorkPackage[]` with tasks like `api-design`, `backend`, `integration-tests`.
5. **Convex fn**: Persists WorkPackages, indexes required skills into a matching queue and then calls `fn/matchCandidates`.
6. **fn/matchCandidates**: Runs semantic search over Candidate embeddings and returns a ranked list; applies business rules (rate caps, availability, certification)
7. **Convex fn**: Creates a `Pod` and writes `Task` assignments to Convex, sets task timers and SLA markers.
8. **Frontend**: Subscribes to the WorkGraph; the UI shows the assembled Pod, who’s doing what, and projected timeline.
9. **Execution**: Workers submit `Deliverable` artifacts. Each submission triggers `fn/validateDeliverable` which runs an LLM validator and also creates a human QA job if needed.
10. **Accept/Reject & Payment**: Once Deliverable passes validation, Convex emits an `invoice_ready` event to user. Payment is manual (user checks and pays) or optionally processed via integrated payment provider.

---

## Candidate discovery & profile model (intelligent)

* Candidates provide both structured resumes and an **informal "experience box"** — a freeform, time-labeled account of projects, skills, and depth. MO’s candidate profiles are therefore *richer than keywords*; they power embeddings that the matching function can query semantically.
* Candidate scoring uses a composite score: `skill_fit * recent_activity * rating_history * availability_adjustment * price_fit`.
* Continuous learning: when a candidate completes a POD successfully, their historical vectors are updated and the system reweights features.

---

## Implementation notes — LLM and schema contracts

**LLM to Convex contract (example)**

When Convex calls the LLM for decomposition, it expects a strict JSON response that matches this TypeScript interface:

```ts
interface WorkPackage {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  estimatedHours: number;
  requiredSkills: string[]; // normalized skill tokens
  dependencies: string[]; // other WorkPackage IDs
  deliverables: { url?: string; checksum?: string; type: string }[];
  confidence: number; // 0..1
}
```

**Prompt hygiene**

* Always include: `SYSTEM` instructions, schema contract, examples, max_tokens cap, and `temperature=0.0` for deterministic decomposition.
* Keep LLM calls idempotent by including `requestId` and deterministic seeding values.

**Fail-safes**

* If the LLM returns invalid JSON, Convex `fn/runDecomposition` retries with stricter schema and finally falls back to a human-in-the-loop composer in the UI.
* Every LLM decision is stored with `prompt`, `response`, and `token_count` for audit and billing.

---

## Security, privacy & enterprise controls

* **NDAs & IP**: NDAs attached to Pod level; IP assignment metadata recorded on acceptance.
* **Activity logging**: every Convex write is annotated with `actorId`, `clientFingerprint`, and `timestamp`. Convex audit exports are supported.
* **Secrets**: LLM keys and payment credentials are only injected into Convex serverless environment variables and never persisted on-client.
* **RBAC**: role-based access controls at Convex function and document level (Requester, Worker, Auditor, Finance).

---

## Where to add payment & SLA engines

* **Payments**: add a `fn/payments/createInvoice` Convex function that calls Stripe; store invoice state in Convex and emit `payment_succeeded` events.
* **SLA engine**: a Convex scheduled function monitors running Pods, computes SLA drift, and can (optionally) trigger automatic re-routing or penalty credits.

---

## File map (cursor-first emphasis)

```
/ (repo root)
├─ /web/                 # Cursor-authored frontend (React + TypeScript)
│  ├─ /components/       # Componentized UI (RequestComposer, WorkgraphViewer...)
│  ├─ /pages/            # Route-entry pages
│  ├─ /lib/              # Convex client adapter, LLM client adapter, utils
│  └─ /styles/           # Tailwind + design tokens
├─ /convex/              # Convex functions and schema
│  ├─ /functions/        # serverless function endpoints (fn/*.ts)
│  └─ /schemas/          # Document schemas and indexes
├─ /scripts/             # seed-demo, migrations, export utilities
└─ README.md
```

---

## Applications & real-world use-cases

* **Product engineering pods**: scoped feature builds, API endpoints, bugfix sprints.
* **Marketing campaign pods**: campaign creative + analytics + distribution bundles.
* **Analytics & data pods**: research packets, reporting, dashboards delivered as repeatable artifacts.
* **Hiring-as-software**: use MO to discover and rank candidates for full-time roles by combining resume data + informal experience box + project-level verification.

---

## Operational notes & scaling

* Start with a meta-layer model: surface candidate pools from Upwork/Toptal/agency networks, run your QA & orchestration on top. Only later migrate to an owned network.
* Use Convex for low-latency state and small-to-medium scale; horizon for growth should include a migration plan for large-scale datasets (move embeddings to a vector DB, move time-series logs to a data lake).

---

## Roadmap & recommended next steps

1. Harden LLM validation loops (implement deterministic schema-based retries + human-in-the-loop composer UI).
2. Implement payment rails (Stripe) and SLA enforcement.
3. Build seeding integrations for external talent sources (Upwork APIs, LinkedIn APIs via scraping/adapters) and keep privacy protections.
4. Add enterprise features: procurement dashboards, legal templates, spend analytics.

---

## Contributing

We prefer small, reviewable PRs. If you're adding features to the MO Brain, add a deterministic test harness and a sample `prompt + expected JSON` fixture.

---

## License

License appropriate to your goals (MIT for open-source community, Business Source License for hybrid commercial control, etc.).

## Candidate discovery & profile model (intelligent)

* Candidates provide both structured resumes and an **informal "experience box"** — a freeform, time-labeled account of projects, skills, and depth.
* Profiles are richer than keyword-based systems — embeddings are computed from **resume + experience box + deliverables**.
* Composite score used for ranking: `skill_fit * recent_activity * rating_history * availability_adjustment * price_fit`.
* Continuous learning: each completed Pod updates candidate vectors, reliability scores, and estimated delivery accuracy.
