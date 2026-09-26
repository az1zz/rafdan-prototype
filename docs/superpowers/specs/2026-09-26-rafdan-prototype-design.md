# Rafdan Prototype Design

## Intent

Build a polished, hardcoded, interactive hackathon prototype that makes Rafdan's differentiator immediately understandable: the upcoming course determines which prerequisite concepts matter, the diagnostic measures only those concepts, and every weak result is connected to a specific upcoming-course dependency and review action.

The prototype is optimized for a recorded desktop demonstration at 1440 x 900 or 1920 x 1080, while remaining usable on mobile and with keyboard navigation.

## Binding sources

- `AGENTS.md` defines product direction and scope.
- `data/demo-content.js` is the final source for all academic content, scores, answers, review items, and primary UI copy.
- `brand/Rafdan-brand-guide.pdf` defines the visual system.
- `brand/Rafdan-complete-brand-kit.zip` supplies the official logo artwork.
- `docs/Rafdan_Prerequisite_Readiness_Concept_Brief.pdf` supplies deeper product context.

## Architecture

The site is a static single-page experience with no build step. `index.html` supplies the semantic shell and loads `data/demo-content.js`, `js/scoring.js`, and `js/app.js` using relative paths. `js/app.js` owns a small state object and renders one screen at a time into the main region. `js/scoring.js` exposes deterministic scoring helpers so calculated results can be tested independently and used by the interface.

The screen sequence is: landing, course connection, knowledge bridge, diagnostic introduction, quiz, analyzing transition, result overview, concept readiness, gap explanation, personalized review plan, and reassessment. Back navigation preserves state. Reassessment clears answers and returns to the diagnostic introduction.

## Interaction design

- Answer choices use native radio inputs wrapped in accessible labels.
- Quiz progression is blocked until the current question is answered.
- Previous/next navigation preserves selections.
- The final answer submits into a restrained 1-2 second analyzing transition.
- `?demo=true` enables the undocumented presentation shortcut Shift+D, which selects the current question's `demoStudentAnswer` without adding visible controls.
- Concept readiness cards contain text status labels in addition to color.
- Non-ready concept cards open a dependency explanation that connects the weak prerequisite concept to the affected CS 412 topic.
- The review plan presents all three supplied priorities in order and leads into the assess-review-reassess loop.

## Visual design

Use the official two-tone horizontal SVG on light surfaces and the official white horizontal SVG on the navy footer. The palette is navy `#222B43`, terracotta `#DE744F`, warm off-white `#F4F1ED`, and white. Typography is Arial with the supplied fallback stack.

The visual language is editorial and academic: generous whitespace, strong typographic hierarchy, fine rules, restrained borders, minimal shadows, and deliberate terracotta accents. The bridge screen is composed as a dependency pathway rather than a generic card grid. Readiness states use text, icons or shapes, and color together.

## Scoring

For each concept, score correct answers divided by total questions as a percentage. Status is `READY` at or above 80, `NEEDS REVIEW` at or above 50, otherwise `CRITICAL GAP`. The overall result is the weighted average of concept scores using importance weights `CRITICAL = 3`, `IMPORTANT = 2`, and `HELPFUL = 1`, rounded to the nearest whole percent.

The supplied demo answers must yield concept scores `100, 100, 50, 100, 0, 50`, statuses matching `demoData.conceptResults`, and a weighted overall readiness of 66%.

## Accessibility and resilience

Use semantic landmarks, logical headings, real buttons, visible focus rings, accessible progress text, and sufficient contrast. The app must avoid root-relative paths, network dependencies, and APIs so it works from a GitHub Pages repository subpath and when opened directly as a file.

If a required data object is unavailable, the shell shows a readable error message instead of throwing an uncaught exception.

## Out of scope

No backend, authentication, database, parsing, AI inference, API call, LMS integration, external learning resource, or production scoring service is included. Academic intelligence remains simulated by `data/demo-content.js`.
