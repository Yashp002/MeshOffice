MeshOffice — Cursor-first, Convex-backed Work OS

Short pitch (one line): MeshOffice (MO) is an AI-run work operating system focused on AI-orchestrated pods for scoped deliverables — a Cursor-built frontend with Convex powering backend state and serverless functions. MO turns plain-English requests like “I need a product feature built in 2 weeks on $X” into an immutable work-graph, automatically assembles a pod, assigns tasks, routes work, validates deliverables, logs IP and audit trails, and exposes an enterprise-ready dashboard for procurement and HR.

Why MeshOffice — product positioning

MeshOffice positions itself intentionally narrow: not a general freelancer marketplace. The strongest go-to-market wedge is AI-run pods for repeatable, specifiable deliverables (product engineering sprints, marketing campaign sprints, analytics research packets). By defining and selling discrete, verifiable "work units" and offering an LLM orchestration layer that owns quality SLAs, MO becomes a procurement-grade substitution for fragmented freelance buying + in-house orchestration.

Key strategic differentiators:
- Cursor-first frontend: handcrafted UI & UX coded using Cursor, not auto-generated blobs. Frontend maps directly to MO’s product model.
- Convex backend: single source of truth for state, workflow, documents, and serverless business logic.
- LLM orchestrator (MO Brain): autonomous reasoning layer for decomposition, routing, and validation.
- Enterprise rails: audit logs, IP controls, NDAs, invoicing hooks.

TL;DR — What MeshOffice can do now (Repo state)

Frontend (Cursor) — complete scaffold and polished production-ready UI for requester, worker, hiring manager views. Includes RequestComposer, WorkGraph dashboard, Pod management, deliverable viewer.
Convex backend — schemas and serverless functions for workgraph state, requests, pods, tasks, candidates, deliverables, audit logs.
MO Brain (LLM) — integration with prompt schemas ready; full logic stubs for decomposition and routing.
End-to-end MVP: create a request → decompose → match candidates → create workgraph. Autonomous full-cycle execution wired but dependent on external LLM and payments.

Key concepts & Data model

WorkGraph: versioned, immutable graph of work units.
Request: initial user ask with constraints.
WorkPackage: LLM-generated unit with acceptance criteria and dependencies.
Pod: group of assigned workers and tasks.
Task: smallest assignable unit.
CandidateProfile: structured & unstructured skill data, embeddings, historical scores.
Deliverable: submitted artifact with metadata and validation result.
AuditLog: immutable activity trail.

Architecture — Cursor frontend + Convex backend

Frontend (Cursor, React, TS):
- Componentized UI: RequestComposer, WorkGraphViewer, PodBuilder, CandidateExplorer, DeliverableValidator.
- Realtime Convex subscriptions.

Backend (Convex):
- Business logic functions:
  - createRequest
  - runDecomposition
  - matchCandidates
  - assignTasks
  - validateDeliverable
- Authentication, access control, realtime state.

MO Brain (LLM service):
- External LLM API adapter
- Structured JSON protocols for WorkPackage[]
- Deterministic planning mode

Optional integrations:
- Payments (Stripe)
- Audit export
- Git repo storage for engineering deliverables

Developer quickstart (local)

Clone repo, install deps, run dev environment.
Set Convex URL/keys and LLM key in .env.local.
Run Convex dev server.
Seed demo data.
Visit local dev host.

Example end-to-end flow

User creates request.
Convex saves and triggers decomposition.
LLM returns WorkPackages.
Convex persists tasks, runs matching.
Pod is assembled.
Frontend shows graph and assignments.
Deliverables validated via LLM + optional human QA.
Invoice-ready events emitted.

Candidate discovery model

Candidate data includes resume + informal experience box.
Semantic embeddings drive matching.
Scoring formula considers skill fit, recency, ratings, availability, price.
System learns from successful pods.

LLM contract example

WorkPackage schema includes: id, title, description, acceptanceCriteria, estimatedHours, requiredSkills, dependencies, deliverables metadata, confidence.
Strict JSON required.
Retries and human fallback on invalid JSON.

Security & enterprise controls

NDAs and IP assignment metadata.
Full audit logs with actor identity and fingerprints.
Secrets only in Convex serverless env.
Role-based access enforcement.

Payment & SLA engine notes

Stripe invoicing function recommended.
SLA drift monitors via scheduled Convex functions.

File structure (Cursor-first)

web/ — frontend (components, pages, lib, styles)
convex/ — functions + schemas
scripts/ — seeding + migrations
README.md

Applications

Product engineering pods (features, APIs).
Marketing pods (campaign bundles).
Analytics pods (reports, dashboards).
Hiring-as-software (candidate matching and ranking).

Operational notes

Start with meta-layer on top of existing talent networks.
Use Convex for real-time small to medium scale.
Future migration of embeddings to vector DB and logs to data lake.

Roadmap

Harden LLM validation loops.
Add payments + SLA engine.
Talent sourcing integrations.
Enterprise procurement dashboards and analytics.

Contributing

Prefer small PRs. Add fixtures/tests for MO Brain JSON responses.

License

Choose MIT or Business Source License depending on strategy.
