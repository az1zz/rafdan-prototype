# Rafdan Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a branded, accessible, static Rafdan hackathon prototype with a complete interactive diagnostic and deterministic concept-level scoring.

**Architecture:** A semantic `index.html` shell loads the supplied demo data, a pure scoring module, and a state-driven renderer. CSS owns the responsive brand system; a browser-only test harness verifies scoring, demo answers, navigation guardrails, and reset behavior without adding a build step.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, official SVG assets, browser-native test runner

**Spec:** `docs/superpowers/specs/2026-09-26-rafdan-prototype-design.md`

## Global Constraints

- Use only HTML, CSS, and Vanilla JavaScript; no framework, package manager, bundler, server-side code, or network API.
- Use `data/demo-content.js` as the sole academic content source.
- Use relative paths compatible with GitHub Pages repository subpaths.
- Use official supplied logo assets without modification.
- Optimize for 1440 x 900 and 1920 x 1080, with reasonable mobile behavior.
- Keep readiness scoring structured, auditable, and calculated from selected answers.

## Review Focus

- Missing current-question answer must keep quiz progression disabled and explain the requirement accessibly.
- Back/forward navigation must preserve selected answers.
- Demo answers must produce exactly 66% and all six supplied concept results.
- Reassessment must clear prior answers and calculated results before returning to the diagnostic introduction.
- Direct-file and GitHub Pages subpath loading must not depend on root-relative assets or modules.

---

### Task 1: Static shell, official assets, and deterministic scoring

**Files:**
- Create: `index.html`
- Create: `js/scoring.js`
- Create: `tests/runner.html`
- Create: `tests/tests.js`
- Create: `assets/logos/rafdan-horizontal-two-tone.svg`
- Create: `assets/logos/rafdan-horizontal-white.svg`
- Create: `assets/icons/favicon.ico`

**Interfaces:**
- Consumes: global `demoData` from `data/demo-content.js`
- Produces: `window.RafdanScoring.calculateResults(answers, data)` and `window.RafdanScoring.statusForScore(score, scoring)`

- [ ] Write browser tests for concept percentages, thresholds, weighted readiness, supplied demo-answer parity, and incomplete answers.
- [ ] Open the test runner and verify the tests fail because the scoring API is absent.
- [ ] Implement the scoring module and semantic application shell.
- [ ] Reopen the test runner and verify all scoring tests pass.

### Task 2: State-driven product journey and quiz interactions

**Files:**
- Create: `js/app.js`
- Modify: `tests/tests.js`

**Interfaces:**
- Consumes: `window.RafdanScoring`, global `demoData`, and `#app`
- Produces: `window.RafdanApp` with state, `goTo(screen)`, `selectAnswer(questionId, answerId)`, `advanceQuiz()`, `submitQuiz()`, and `resetAssessment()`

- [ ] Add failing browser tests for initial rendering, navigation, answer persistence, unanswered-question blocking, submission, demo shortcut support, and reassessment reset.
- [ ] Verify the new behavior tests fail before `js/app.js` exists.
- [ ] Implement all 11 screens, state transitions, quiz controls, analyzing delay, result calculations, gap selection, review plan, and reset behavior.
- [ ] Run the test runner and verify the complete behavior suite passes.

### Task 3: Rafdan visual system and responsive polish

**Files:**
- Create: `css/styles.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: semantic classes and `data-status` attributes rendered by `js/app.js`
- Produces: branded desktop and mobile layouts with visible focus states and reduced-motion support

- [ ] Add structural assertions for landmarks, accessible labels, non-color status text, and relative asset paths.
- [ ] Verify the new structural assertions fail.
- [ ] Implement the full responsive visual system using the approved palette, typography, spacing, and restrained motion.
- [ ] Verify structural assertions pass and visually inspect 1440 x 900, 1920 x 1080, and mobile widths.

### Task 4: Documentation and repository preparation

**Files:**
- Create: `README.md`
- Create: `.gitignore`

**Interfaces:**
- Consumes: final project behavior and file structure
- Produces: local-run, demo-mode, project-structure, and GitHub Pages deployment instructions

- [ ] Create documentation checks for required headings, commands, query parameter, shortcut, branch, and Pages folder.
- [ ] Verify the documentation checks fail before README creation.
- [ ] Write the README and minimal `.gitignore`.
- [ ] Verify documentation checks pass.

### Task 5: Full-flow verification and Git handoff

**Files:**
- Modify only if verification finds a defect.

**Interfaces:**
- Consumes: the complete static prototype
- Produces: verified project state and a local Git commit

- [ ] Serve the repository with a static HTTP server and complete the entire flow in the in-app browser.
- [ ] Verify all CTAs, previous/next behavior, answer selection, analyzing transition, six concept results, Heap critical gap, three review priorities, reassessment, and console cleanliness.
- [ ] Verify at 1440 x 900, 1920 x 1080, and a mobile viewport; confirm every referenced asset returns successfully.
- [ ] Run the full browser test suite and a static path/content audit.
- [ ] Initialize the project-local Git repository if needed, review the diff, and create the requested commit.
