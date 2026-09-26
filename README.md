# Rafdan Prototype

## Purpose

This repository contains a hardcoded, interactive hackathon prototype of **Rafdan | رفدان**. It demonstrates how Rafdan identifies the prerequisite concepts an upcoming course actually depends on, diagnoses readiness at the concept level, explains why each gap matters, and creates a focused review plan.

The featured course connection is:

`CS 310 — Data Structure → CS 412 — Algorithm Analysis and Design`

## Prototype Scope

This is a presentation prototype, not the production Rafdan platform.

- Syllabus analysis is simulated.
- The six bridge concepts are predetermined.
- Quiz questions and answer choices are hardcoded in `data/demo-content.js`.
- Scoring is simplified and runs entirely in the browser.
- No production backend, database, authentication, API, or AI inference is running.
- The interface interactions, answer selection, scoring, concept results, review plan, and reassessment reset are functional.

## Run Locally

No installation or build step is required.

### Option 1: Open the file directly

Open `index.html` in a modern browser.

### Option 2: Use a local static server

From the repository root, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Demo Mode

For a recorded presentation, open:

```text
http://localhost:8000/?demo=true
```

When the quiz is open, press **Shift + D** to select the current question's predetermined `demoStudentAnswer`. The shortcut is intentionally invisible in the interface. Use it on each question, then continue normally. The supplied demo answers calculate to **66% overall readiness**, with Heap Fundamentals as the critical gap.

The presenter can still choose any answer manually.

## Project Structure

```text
index.html                  Semantic application shell
css/styles.css              Rafdan visual system and responsive layouts
js/app.js                   State, screen rendering, and interactions
js/scoring.js               Deterministic concept and weighted scoring
data/demo-content.js        Academic content and primary UI copy
assets/                     Official website logo and icon assets
brand/                      Original brand guide and complete brand kit
docs/                       Product brief and implementation notes
tests/                      Dependency-free browser test and visual QA pages
```

The prototype loads `data/demo-content.js` before the application scripts. Academic content should remain centralized in that file.

## Browser Tests

With the local server running, open:

```text
http://localhost:8000/tests/runner.html
```

The runner verifies scoring, demo-result parity, quiz guardrails, answer persistence, demo mode, reassessment reset, accessibility structure, relative paths, visual-system requirements, and this documentation contract.

## GitHub Pages Deployment

1. Push this repository to GitHub.
2. Open the repository **Settings**.
3. Open **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Select Branch: `main`.
6. Select Folder: `/ (root)`.
7. Click **Save**.
8. Wait for GitHub to show the deployment URL.

All application assets use relative paths, so the site works from a repository subpath such as `https://USERNAME.github.io/rafdan-prototype/`.

## Recommended Recording Setup

Use a Chromium-based browser at **1440 × 900** or **1920 × 1080**. Keep browser zoom at 100% and open the `?demo=true` URL before recording.
