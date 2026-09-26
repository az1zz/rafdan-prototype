(async function () {
  "use strict";

  const tests = [];
  const results = [];

  function test(name, run) {
    tests.push({ name, run });
  }

  function assertEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${message}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function getScoring() {
    if (!window.RafdanScoring) {
      throw new Error("RafdanScoring API is not defined");
    }
    return window.RafdanScoring;
  }

  function getApp() {
    if (!window.RafdanApp) {
      throw new Error("RafdanApp API is not defined");
    }
    return window.RafdanApp;
  }

  test("classifies readiness at the supplied thresholds", function () {
    const scoring = getScoring();
    assertEqual(scoring.statusForScore(80, demoData.project.scoring), "READY", "80 should be ready");
    assertEqual(scoring.statusForScore(50, demoData.project.scoring), "NEEDS REVIEW", "50 should need review");
    assertEqual(scoring.statusForScore(49, demoData.project.scoring), "CRITICAL GAP", "49 should be critical");
  });

  test("calculates the exact supplied demo concept scores", function () {
    const scoring = getScoring();
    const answers = Object.fromEntries(demoData.questions.map((question) => [question.id, question.demoStudentAnswer]));
    const result = scoring.calculateResults(answers, demoData);
    assertEqual(result.concepts.map((concept) => concept.score), [100, 100, 50, 100, 0, 50], "concept scores should match source data");
  });

  test("calculates the supplied demo statuses", function () {
    const scoring = getScoring();
    const answers = Object.fromEntries(demoData.questions.map((question) => [question.id, question.demoStudentAnswer]));
    const result = scoring.calculateResults(answers, demoData);
    assertEqual(result.concepts.map((concept) => concept.status), demoData.conceptResults.map((concept) => concept.status), "statuses should match source data");
  });

  test("calculates weighted overall readiness as 66 percent", function () {
    const scoring = getScoring();
    const answers = Object.fromEntries(demoData.questions.map((question) => [question.id, question.demoStudentAnswer]));
    const result = scoring.calculateResults(answers, demoData);
    assertEqual(result.overallReadiness, 66, "weighted readiness should round to 66");
  });

  test("reports incomplete assessments without inventing scores", function () {
    const scoring = getScoring();
    const result = scoring.calculateResults({ Q1: "C" }, demoData);
    assertEqual(result.isComplete, false, "assessment should be incomplete");
    assertEqual(result.answeredCount, 1, "answered count should be explicit");
  });

  test("renders the landing screen from supplied UI copy", function () {
    const app = getApp();
    app.goTo("landing");
    assertEqual(app.state.currentScreen, "landing", "landing should be the current screen");
    assert(document.querySelector("#app").textContent.includes(demoData.uiCopy.landing.headline), "landing headline should come from demo data");
  });

  test("blocks quiz progress until the current question is answered", function () {
    const app = getApp();
    app.resetAssessment();
    app.goTo("quiz");
    app.advanceQuiz();
    assertEqual(app.state.currentQuestion, 0, "question index should not advance");
    assert(Boolean(app.state.validationMessage), "an accessible validation message should be set");
  });

  test("preserves selected answers across previous and next navigation", function () {
    const app = getApp();
    app.resetAssessment();
    app.goTo("quiz");
    app.selectAnswer("Q1", "C");
    app.advanceQuiz();
    app.previousQuiz();
    assertEqual(app.state.answers.Q1, "C", "the selected answer should remain in state");
    assertEqual(document.querySelector('input[name="answer"]:checked').value, "C", "the radio choice should render as selected");
  });

  test("Shift+D selects the supplied demo answer only in demo mode", function () {
    const app = getApp();
    app.resetAssessment();
    app.goTo("quiz");
    app.setDemoMode(true);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "D", shiftKey: true, bubbles: true }));
    assertEqual(app.state.answers.Q1, demoData.questions[0].demoStudentAnswer, "shortcut should select the demo answer");
  });

  test("submits a complete assessment into the calculated result", async function () {
    const app = getApp();
    app.resetAssessment();
    demoData.questions.forEach((question) => app.selectAnswer(question.id, question.demoStudentAnswer));
    app.goTo("quiz");
    await app.submitQuiz();
    assertEqual(app.state.currentScreen, "results", "submission should finish on results");
    assertEqual(app.state.results.overallReadiness, 66, "submission should use calculated readiness");
  });

  test("reassessment clears prior answers and results", function () {
    const app = getApp();
    app.resetAssessment();
    assertEqual(app.state.currentScreen, "diagnosticIntro", "reassessment should return to the introduction");
    assertEqual(app.state.answers, {}, "answers should be cleared");
    assertEqual(app.state.results, null, "results should be cleared");
  });

  test("does not reuse the demo narrative for a different 66 percent concept profile", async function () {
    const app = getApp();
    app.resetAssessment();
    const alternateAnswers = Object.fromEntries(demoData.questions.map((question) => [question.id, question.demoStudentAnswer]));
    alternateAnswers.Q1 = "A";
    alternateAnswers.Q6 = "B";
    Object.entries(alternateAnswers).forEach(([questionId, answerId]) => app.selectAnswer(questionId, answerId));
    app.goTo("quiz");
    await app.submitQuiz();
    assertEqual(app.state.results.overallReadiness, 66, "alternate profile should also total 66 percent");
    assertEqual(app.state.results.concepts.map((concept) => concept.score), [50, 100, 100, 100, 0, 50], "alternate profile should differ by concept");
    const interpretation = document.querySelector(".results-copy .lead").textContent;
    assert(!interpretation.includes("array foundations are strong"), "the demo-specific strength narrative must not be reused");
    assert(interpretation.includes("Stack & Queue Operations"), "the interpretation should reflect the actual ready concepts");
  });

  test("renders an all-ready manual result without inventing a priority gap", async function () {
    const app = getApp();
    app.resetAssessment();
    demoData.questions.forEach((question) => app.selectAnswer(question.id, question.correctAnswer));
    app.goTo("quiz");
    await app.submitQuiz();
    assertEqual(app.state.currentScreen, "results", "all-correct submission should render results");
    assertEqual(app.state.results.overallReadiness, 100, "all-correct submission should calculate 100 percent");
    assert(document.querySelector(".all-ready-callout"), "results should show a no-gap callout");
    app.goTo("concepts");
    assert(document.querySelector('[data-action="reassessment"]'), "all-ready concept results should continue to reassessment instead of opening a nonexistent gap");
  });

  test("Review Plan back control returns to the selected gap explanation", async function () {
    const app = getApp();
    app.resetAssessment();
    demoData.questions.forEach((question) => app.selectAnswer(question.id, question.demoStudentAnswer));
    app.goTo("quiz");
    await app.submitQuiz();
    app.goTo("review");
    const back = document.querySelector('[data-action="gap"]');
    assert(Boolean(back), "Review Plan should render a gap back control");
    back.click();
    assertEqual(app.state.currentScreen, "gap", "back control should return to the gap explanation");
  });

  test("uses neutral concept wording when the same score comes from different answers", async function () {
    const app = getApp();
    app.resetAssessment();
    const reversedProfile = Object.fromEntries(demoData.questions.map((question) => [question.id, question.demoStudentAnswer]));
    reversedProfile.Q5 = "B";
    reversedProfile.Q6 = "B";
    Object.entries(reversedProfile).forEach(([questionId, answerId]) => app.selectAnswer(questionId, answerId));
    app.goTo("quiz");
    await app.submitQuiz();
    app.goTo("concepts");
    const stackCard = Array.from(document.querySelectorAll(".concept-card")).find((card) => card.textContent.includes("Stack & Queue Operations"));
    assert(stackCard.textContent.includes("1 of 2"), "a changed answer profile should use neutral correct-count wording");
    assert(!stackCard.textContent.includes("retained FIFO"), "answer-specific demo wording should not be reused");
  });

  test("does not show a no-issue narrative when a formerly ready concept is weak", async function () {
    const app = getApp();
    app.resetAssessment();
    const weakArrays = Object.fromEntries(demoData.questions.map((question) => [question.id, question.demoStudentAnswer]));
    weakArrays.Q1 = "A";
    weakArrays.Q2 = "A";
    Object.entries(weakArrays).forEach(([questionId, answerId]) => app.selectAnswer(questionId, answerId));
    app.goTo("quiz");
    await app.submitQuiz();
    assert(!document.querySelector(".priority-callout").textContent.includes("accurately handled"), "priority callout should reflect actual answers");
    app.state.selectedGap = "BC1";
    app.goTo("gap");
    assert(!document.querySelector(".difficulty-note").textContent.includes("No immediate prerequisite issue detected"), "gap detail must not contradict a weak manual score");
  });

  test("keeps the selected radio focused so arrow-key navigation can continue", function () {
    const app = getApp();
    app.resetAssessment();
    app.goTo("quiz");
    const choice = document.querySelector('input[name="answer"][value="C"]');
    choice.focus();
    choice.checked = true;
    choice.dispatchEvent(new Event("change", { bubbles: true }));
    assertEqual(document.activeElement, choice, "answer selection should not replace the focused radio");
  });

  test("explains why quiz progression is disabled before an answer is chosen", function () {
    const app = getApp();
    app.resetAssessment();
    app.goTo("quiz");
    const next = document.querySelector('[data-action="nextQuestion"]');
    const hint = document.querySelector("#answer-hint");
    assertEqual(next.disabled, true, "Next should be disabled initially");
    assertEqual(next.getAttribute("aria-describedby"), "answer-hint", "disabled progression should reference its hint");
    assert(hint.textContent.trim().length > 0, "unanswered state should have a persistent explanation");
  });

  test("uses semantic landmarks and GitHub Pages-safe relative paths", async function () {
    const response = await fetch("../index.html");
    const html = await response.text();
    const documentCopy = new DOMParser().parseFromString(html, "text/html");
    assert(Boolean(documentCopy.querySelector("header")), "a semantic header should exist");
    assert(Boolean(documentCopy.querySelector("main#app")), "the application should render inside main");
    assert(Boolean(documentCopy.querySelector("footer")), "a semantic footer should exist");
    assertEqual(documentCopy.querySelector(".brand-link").getAttribute("href"), "./index.html", "the logo should return to index.html even under file://");
    assert(!html.includes('src="/'), "script and image sources must not be root-relative");
    assert(!html.includes('href="/'), "styles and links must not be root-relative");
  });

  test("renders the diagnostic with a labelled fieldset and real radio choices", function () {
    const app = getApp();
    app.resetAssessment();
    app.goTo("quiz");
    assert(Boolean(document.querySelector("fieldset legend")), "question text should label the answer group");
    assertEqual(document.querySelectorAll('input[type="radio"]').length, 4, "four native radio choices should render");
    assertEqual(document.querySelectorAll("label.answer-option").length, 4, "each radio should have a visible label");
  });

  test("renders all six concept results with textual status labels", async function () {
    const app = getApp();
    app.resetAssessment();
    demoData.questions.forEach((question) => app.selectAnswer(question.id, question.demoStudentAnswer));
    app.goTo("quiz");
    await app.submitQuiz();
    app.goTo("concepts");
    const cards = document.querySelectorAll(".concept-card");
    assertEqual(cards.length, 6, "all six concept cards should render");
    cards.forEach((card) => assert(card.querySelector(".status").textContent.trim().length > 1, "each card should include a textual status"));
  });

  test("loads the complete responsive Rafdan visual system", async function () {
    const response = await fetch("../css/styles.css");
    assert(response.ok, "styles.css should exist");
    const css = await response.text();
    ["#222B43", "#DE744F", "#F4F1ED"].forEach((color) => assert(css.includes(color), `${color} should be defined`));
    assert(css.includes(":focus-visible"), "visible keyboard focus styles should exist");
    assert(css.includes("prefers-reduced-motion"), "reduced-motion support should exist");
    assert(css.includes("@media"), "responsive rules should exist");
  });

  test("documents local use, demo mode, scope, structure, and GitHub Pages deployment", async function () {
    const response = await fetch("../README.md");
    assert(response.ok, "README.md should exist");
    const readme = await response.text();
    [
      "# Rafdan Prototype",
      "## Purpose",
      "## Prototype Scope",
      "## Run Locally",
      "python -m http.server 8000",
      "http://localhost:8000",
      "## Demo Mode",
      "?demo=true",
      "Shift + D",
      "## Project Structure",
      "## GitHub Pages Deployment",
      "Branch: `main`",
      "Folder: `/ (root)`"
    ].forEach((requiredText) => assert(readme.includes(requiredText), `README should include ${requiredText}`));
  });

  test("completes the full presenter flow through real buttons", async function () {
    const app = getApp();
    app.resetAssessment();
    app.goTo("landing");

    function clickAction(action, expectedScreen) {
      const target = document.querySelector(`[data-action="${action}"]`);
      assert(Boolean(target), `${action} button should exist`);
      target.click();
      if (expectedScreen) {
        assertEqual(app.state.currentScreen, expectedScreen, `${action} should open ${expectedScreen}`);
      }
    }

    clickAction("connection", "connection");
    clickAction("bridge", "bridge");
    clickAction("diagnosticIntro", "diagnosticIntro");
    clickAction("startQuiz", "quiz");
    app.setDemoMode(true);

    for (let index = 0; index < demoData.questions.length; index += 1) {
      const question = demoData.questions[index];
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "D", shiftKey: true, bubbles: true }));
      assertEqual(app.state.answers[question.id], question.demoStudentAnswer, `demo answer should be selected for ${question.id}`);

      if (index === 0) {
        clickAction("nextQuestion");
        clickAction("previousQuestion");
        assertEqual(app.state.currentQuestion, 0, "the Previous button should return to question 1");
      }

      if (index < demoData.questions.length - 1) {
        clickAction("nextQuestion");
      } else {
        clickAction("submitQuiz");
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 20));
    assertEqual(app.state.currentScreen, "results", "the analyzing transition should end on results");
    assertEqual(app.state.results.overallReadiness, 66, "the presenter flow should calculate 66 percent");
    clickAction("concepts", "concepts");
    clickAction("topGap", "gap");
    assertEqual(app.state.selectedGap, "BC5", "Heap Fundamentals should be the selected top gap");
    clickAction("review", "review");
    clickAction("reassessment", "reassessment");
    clickAction("resetAssessment", "diagnosticIntro");
    assertEqual(app.state.answers, {}, "reassessment should leave a clean attempt");
  });

  test("loads every production asset from its relative path", async function () {
    const assets = [
      "../css/styles.css",
      "../js/scoring.js",
      "../js/app.js",
      "../data/demo-content.js",
      "../assets/logos/rafdan-horizontal-two-tone.svg",
      "../assets/logos/rafdan-horizontal-white.svg",
      "../assets/logos/rafdan-symbol-terracotta.svg",
      "../assets/icons/favicon.ico"
    ];
    const responses = await Promise.all(assets.map((asset) => fetch(asset)));
    responses.forEach((response, index) => assert(response.ok, `${assets[index]} should load successfully`));
  });

  test("finishes the full browser suite without uncaught JavaScript errors", function () {
    assertEqual(window.__rafdanTestErrors, [], "the browser should report no uncaught errors");
  });

  for (const item of tests) {
    try {
      await item.run();
      results.push({ name: item.name, passed: true });
    } catch (error) {
      results.push({ name: item.name, passed: false, message: error.message });
    }
  }

  const failed = results.filter((result) => !result.passed);
  const list = document.querySelector("#results");
  results.forEach((result) => {
    const item = document.createElement("li");
    item.className = result.passed ? "pass" : "fail";
    item.textContent = result.passed ? `PASS — ${result.name}` : `FAIL — ${result.name}: ${result.message}`;
    list.append(item);
  });

  const summary = document.querySelector("#summary");
  summary.dataset.failed = String(failed.length);
  summary.textContent = `${results.length - failed.length}/${results.length} tests passed`;
})();
