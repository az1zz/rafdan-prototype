# AGENTS.md — Rafdan | رفدان

## Purpose

This file gives any AI agent or team member the minimum context needed to work on Rafdan without re-explaining the project every time.

Keep this file lightweight. For details, read the referenced project files instead of duplicating them here.

---

## Project

**Name:** Rafdan | رفدان  
**Team:** SaudiConsulters  
**Hackathon:** Farq Hackathon  
**Track:** Student Journey

Rafdan is named from the Arabic root **رفد**, associated with support and reinforcement.

### Current concept

Rafdan helps university students prepare for a new course that has a prerequisite.

A student selects:
- the upcoming course
- the prerequisite course

Rafdan uses the syllabi of both courses to identify the **bridge concepts** from the prerequisite that the upcoming course actually depends on.

It then:
1. generates a targeted diagnostic quiz
2. measures readiness at the concept level
3. identifies weak prerequisite concepts
4. explains why each weak concept matters for the upcoming course
5. gives the student a focused review plan before the semester starts
6. may optionally re-test reviewed concepts

### Core idea

> Do not test the whole prerequisite course.  
> Test only the prior concepts that the upcoming course actually depends on.

---

## Product Flow

```text
Prerequisite syllabus
        +
Upcoming-course syllabus
        ↓
Concept extraction
        ↓
Dependency mapping
        ↓
Targeted diagnostic quiz
        ↓
Concept-level readiness
        ↓
Weak prerequisite concepts
        ↓
Prioritized review plan
        ↓
Optional re-test
```

---

## Important Product Decisions

These are currently considered decided unless the team explicitly changes them.

- Rafdan remains the product name and keeps the existing Rafdan brand identity.
- The product focuses on **prerequisite readiness before a course starts**.
- The upcoming course determines which prior concepts matter.
- The diagnostic should not test the entire prerequisite course.
- Results should be shown at the **concept level**, not only as one overall percentage.
- A weak result is guidance for review, not a formal academic judgment.
- AI may interpret syllabi and generate questions, but scoring and coverage should be structured and auditable.
- The hackathon MVP should prove the idea deeply on a small number of course pairs rather than support an entire university catalog.

---

## AI Responsibilities

AI can be used for:
- syllabus understanding
- topic and learning-outcome extraction
- concept normalization
- dependency mapping between courses
- diagnostic question drafting
- explanations
- review-plan wording

AI should **not** freely invent:
- concepts not supported by the supplied syllabus/material
- prerequisite relationships
- mastery scores
- academic facts
- official university rules

Important outputs should remain traceable to source material and explicit logic.

---

## MVP Scope

Recommended MVP:

- 1–2 prerequisite course pairs
- preloaded syllabi or syllabus upload
- generated concept-dependency map
- targeted 15–20 question diagnostic
- concept-level results
- prioritized review plan
- optional short re-test

Do not overbuild:
- full LMS integration
- every university course
- formal academic advising
- prerequisite enforcement
- instructor administration suite
- large content marketplace

---

## Demo Story

The preferred demo flow is:

1. Select the upcoming course and its prerequisite.
2. Show both syllabi.
3. Show the bridge/dependency concepts Rafdan identified.
4. Take a short diagnostic.
5. Reveal strengths and weak concepts.
6. Show why the highest-priority gap matters in the upcoming course.
7. Generate a focused review plan.
8. Optionally re-test one concept.

The demo should make it obvious that Rafdan is **more than an AI-generated quiz**.

---

## Source of Truth

Use the correct file instead of duplicating its content here.

### Product concept

`Rafdan_Prerequisite_Readiness_Concept_Brief.pdf`

Read this when you need:
- full problem statement
- product flow
- student experience
- MVP
- differentiation
- validation questions

### Brand rules

`Rafdan-brand-guide.pdf`

Read this before doing any visual/design work.

Do not guess:
- colors
- typography
- spacing
- logo usage
- approved variants

### Brand assets

`Rafdan-complete-brand-kit.zip`

Use the supplied assets. Do not redraw or regenerate the Rafdan logo.

Prefer official SVG assets when supported.

---

## Working Rules for Agents

Before major work:

1. Read this file.
2. Identify whether the task is product, code, design, research, or content.
3. Open the relevant source-of-truth file.
4. Reuse existing brand/product assets.
5. Do not silently invent missing decisions.
6. Ask only when missing information materially affects the result.

If a new important decision is made, update this file briefly rather than adding a long explanation.

---

## Still Open / Needs Validation

Do not present these as finalized:

- exact dependency-mapping method
- whether instructors must validate the dependency map
- exact diagnostic length
- question difficulty model
- exact readiness/mastery formula
- how weak concepts are prioritized
- whether review resources are generated or university-approved
- exact technical stack
- LMS integration approach
- long-term instructor analytics
- final impact metric

---

## Product Test

A feature belongs in Rafdan if it helps answer one of these questions:

1. **What prerequisite knowledge does this new course actually depend on?**
2. **Which of those concepts is this student weak in?**
3. **What should the student review before the course starts?**
4. **Why does that review matter for the upcoming course?**

If a feature does not strengthen one of these answers, it is probably outside the MVP.
