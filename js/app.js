(function (global) {
  "use strict";

  const appRoot = document.querySelector("#app");
  const announcer = document.querySelector("#announcer");

  if (!appRoot) {
    return;
  }

  if (typeof demoData === "undefined" || !global.RafdanScoring) {
    appRoot.innerHTML = `
      <section class="screen error-screen">
        <p class="eyebrow">Unable to start</p>
        <h1>Rafdan's demo content could not be loaded.</h1>
        <p>Please confirm that the data and scoring files are available, then refresh the page.</p>
      </section>`;
    return;
  }

  const data = demoData;
  const testMode = Boolean(global.__RAFDAN_TEST__);
  const state = {
    currentScreen: "landing",
    currentQuestion: 0,
    answers: {},
    quizCompleted: false,
    results: null,
    selectedGap: "BC5",
    validationMessage: "",
    demoMode: new URLSearchParams(global.location.search).get("demo") === "true"
  };

  const screenMeta = {
    landing: { step: "Welcome", index: 0 },
    connection: { step: "Course connection", index: 1 },
    bridge: { step: "Knowledge bridge", index: 2 },
    diagnosticIntro: { step: "Diagnostic", index: 3 },
    quiz: { step: "Diagnostic", index: 3 },
    analyzing: { step: "Analysis", index: 4 },
    results: { step: "Results", index: 5 },
    concepts: { step: "Concept readiness", index: 6 },
    gap: { step: "Why the gap matters", index: 7 },
    review: { step: "Review plan", index: 8 },
    reassessment: { step: "Reassess", index: 9 }
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function button(label, action, variant = "primary", extra = "") {
    return `<button class="button button--${variant}" type="button" data-action="${action}" ${extra}>${escapeHtml(label)}<span aria-hidden="true">→</span></button>`;
  }

  function backButton(label, action) {
    return `<button class="back-button" type="button" data-action="${action}"><span aria-hidden="true">←</span>${escapeHtml(label)}</button>`;
  }

  function importanceBadge(importance) {
    return `<span class="importance importance--${importance.toLowerCase()}">${escapeHtml(importance)}</span>`;
  }

  function statusBadge(status) {
    const icon = status === "READY" ? "✓" : status === "NEEDS REVIEW" ? "!" : "×";
    const slug = status.toLowerCase().replaceAll(" ", "-");
    return `<span class="status status--${slug}" data-status="${escapeHtml(status)}"><span aria-hidden="true">${icon}</span>${escapeHtml(status)}</span>`;
  }

  function screenFrame(content, options = {}) {
    const meta = screenMeta[state.currentScreen] || screenMeta.landing;
    const back = options.backAction ? backButton(options.backLabel || "Back", options.backAction) : "";
    return `
      <section class="screen screen--${state.currentScreen}" data-screen="${state.currentScreen}" aria-labelledby="screen-title">
        <div class="screen-rail">
          <div>${back}</div>
          <p class="journey-position"><span>${escapeHtml(meta.step)}</span><span>${String(meta.index).padStart(2, "0")}</span></p>
        </div>
        ${content}
      </section>`;
  }

  function renderLanding() {
    const copy = data.uiCopy.landing;
    return screenFrame(`
      <div class="landing-layout">
        <div class="landing-copy">
          <p class="eyebrow">Prepare for what comes next</p>
          <h1 id="screen-title">${escapeHtml(copy.headline)}</h1>
          <p class="lead">${escapeHtml(copy.subtitle)}</p>
          <div class="landing-actions">
            ${button(copy.cta, "connection")}
            <p class="microcopy"><span aria-hidden="true">●</span> A focused check using 6 course-to-course dependencies</p>
          </div>
        </div>
        <div class="landing-visual" aria-label="Rafdan connects relevant prerequisite knowledge to the upcoming course">
          <div class="course-stamp course-stamp--previous">
            <span>Previous course</span>
            <strong>${escapeHtml(data.project.prerequisiteCourse.code)}</strong>
            <p>${escapeHtml(data.project.prerequisiteCourse.name)}</p>
          </div>
          <div class="bridge-emblem">
            <img src="./assets/logos/rafdan-symbol-terracotta.svg" alt="">
            <span>Only the knowledge<br>that carries forward</span>
          </div>
          <div class="course-stamp course-stamp--upcoming">
            <span>Upcoming course</span>
            <strong>${escapeHtml(data.project.upcomingCourse.code)}</strong>
            <p>${escapeHtml(data.project.upcomingCourse.name)}</p>
          </div>
        </div>
      </div>`);
  }

  function renderConnection() {
    const copy = data.uiCopy.courseConnection;
    const previous = data.project.prerequisiteCourse;
    const upcoming = data.project.upcomingCourse;
    return screenFrame(`
      <div class="content-heading content-heading--wide">
        <p class="eyebrow">Course dependency</p>
        <h1 id="screen-title">${escapeHtml(copy.headline)}</h1>
        <p class="lead">${escapeHtml(copy.explanation)}</p>
      </div>
      <div class="course-connection" aria-label="Previous course connects to upcoming course">
        <article class="course-panel course-panel--previous">
          <p class="panel-label">Previous / Prerequisite Course</p>
          <span class="course-code">${escapeHtml(previous.code)}</span>
          <h2>${escapeHtml(previous.name)}</h2>
          <p>The source of the foundations Rafdan checks.</p>
        </article>
        <div class="connection-arrow" aria-hidden="true">
          <span>Relevant foundations</span>
          <i></i>
          <b>→</b>
        </div>
        <article class="course-panel course-panel--upcoming">
          <p class="panel-label">Upcoming Course</p>
          <span class="course-code">${escapeHtml(upcoming.code)}</span>
          <h2>${escapeHtml(upcoming.name)}</h2>
          <p>The course that determines what prior knowledge matters.</p>
        </article>
      </div>
      <div class="insight-strip">
        <span class="insight-number">01</span>
        <p><strong>Rafdan starts with the destination.</strong> It identifies the CS 310 concepts that CS 412 actually reuses—then leaves the rest out of the diagnostic.</p>
      </div>
      <div class="screen-actions screen-actions--end">${button(copy.cta, "bridge")}</div>
    `, { backAction: "landing", backLabel: "Welcome" });
  }

  function renderBridge() {
    const copy = data.uiCopy.knowledgeBridge;
    const previous = data.project.prerequisiteCourse;
    const upcoming = data.project.upcomingCourse;
    return screenFrame(`
      <div class="bridge-heading">
        <div class="content-heading">
          <p class="eyebrow">The knowledge bridge</p>
          <h1 id="screen-title">${escapeHtml(copy.headline)}</h1>
          <p class="lead">${escapeHtml(copy.explanation)}</p>
        </div>
        <div class="bridge-key" aria-label="Bridge direction">
          <span>${escapeHtml(previous.code)}</span><i></i><span>${escapeHtml(upcoming.code)}</span>
        </div>
      </div>
      <div class="bridge-map" role="list">
        ${data.bridgeConcepts.map((concept, index) => `
          <article class="bridge-row" role="listitem">
            <div class="bridge-index">${String(index + 1).padStart(2, "0")}</div>
            <div class="bridge-concept">
              <div class="bridge-title-line">
                <h2>${escapeHtml(concept.name)}</h2>
                ${importanceBadge(concept.importance)}
              </div>
              <p>${escapeHtml(concept.description)}</p>
              <small>${escapeHtml(concept.prerequisiteSource)}</small>
            </div>
            <div class="bridge-link" aria-hidden="true"><i></i><span>→</span></div>
            <div class="bridge-dependency">
              <p class="panel-label">Used next in</p>
              <div class="topic-list">${concept.upcomingTopics.map((topic) => `<span>${escapeHtml(topic)}</span>`).join("")}</div>
              <p>${escapeHtml(concept.whyItMatters)}</p>
            </div>
          </article>`).join("")}
      </div>
      <div class="screen-actions screen-actions--between">
        <p>Only these six foundations continue into the readiness check.</p>
        ${button("Continue to diagnostic", "diagnosticIntro")}
      </div>
    `, { backAction: "connection", backLabel: "Course connection" });
  }

  function renderDiagnosticIntro() {
    const copy = data.uiCopy.diagnosticIntro;
    return screenFrame(`
      <div class="diagnostic-layout">
        <div class="content-heading">
          <p class="eyebrow">Targeted diagnostic</p>
          <h1 id="screen-title">${escapeHtml(copy.headline)}</h1>
          <p class="lead">${escapeHtml(copy.explanation)}</p>
          <div class="diagnostic-note">
            <span aria-hidden="true">✓</span>
            <p><strong>Focused by design.</strong> You will only be tested on CS 310 knowledge that supports CS 412.</p>
          </div>
          ${button(copy.cta, "startQuiz")}
        </div>
        <dl class="diagnostic-stats">
          <div><dt>${escapeHtml(copy.numberOfQuestions)}</dt><dd>Two per dependency</dd></div>
          <div><dt>${escapeHtml(copy.numberOfConcepts)}</dt><dd>Selected for CS 412</dd></div>
          <div><dt>${escapeHtml(copy.estimatedTime)}</dt><dd>One focused check</dd></div>
        </dl>
      </div>
    `, { backAction: "bridge", backLabel: "Knowledge bridge" });
  }

  function renderQuiz() {
    const question = data.questions[state.currentQuestion];
    const selected = state.answers[question.id];
    const progress = ((state.currentQuestion + 1) / data.questions.length) * 100;
    const copy = data.uiCopy.quiz;
    const progressLabel = copy.progressLabel.replace("{current}", state.currentQuestion + 1);
    const isLast = state.currentQuestion === data.questions.length - 1;
    return screenFrame(`
      <div class="quiz-shell">
        <div class="quiz-progress" aria-label="${escapeHtml(progressLabel)}">
          <div class="quiz-progress__labels"><span>${escapeHtml(progressLabel)}</span><span>${Math.round(progress)}%</span></div>
          <div class="quiz-progress__track"><i style="width:${progress}%"></i></div>
        </div>
        <div class="quiz-card">
          <div class="quiz-meta">
            <span>${escapeHtml(copy.conceptLabel)}</span>
            <span>${escapeHtml(question.difficulty)}</span>
          </div>
          <fieldset aria-describedby="answer-hint">
            <legend id="screen-title">${escapeHtml(question.question)}</legend>
            <div class="answer-list">
              ${question.options.map((option) => `
                <label class="answer-option${selected === option.id ? " is-selected" : ""}">
                  <input type="radio" name="answer" value="${escapeHtml(option.id)}" ${selected === option.id ? "checked" : ""}>
                  <span class="answer-letter" aria-hidden="true">${escapeHtml(option.id)}</span>
                  <span>${escapeHtml(option.text)}</span>
                </label>`).join("")}
            </div>
          </fieldset>
          <p id="answer-hint" class="quiz-validation" role="status" aria-live="polite">${escapeHtml(state.validationMessage || (selected ? "Answer selected. You can continue." : "Choose an answer to continue."))}</p>
          <div class="quiz-actions">
            <button class="button button--secondary" type="button" data-action="previousQuestion"><span aria-hidden="true">←</span>${escapeHtml(copy.previous)}</button>
            <button class="button button--primary" type="button" data-action="${isLast ? "submitQuiz" : "nextQuestion"}" aria-describedby="answer-hint" ${selected ? "" : "disabled"}>${escapeHtml(isLast ? copy.submit : copy.next)}<span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>
    `);
  }

  function renderAnalyzing() {
    return screenFrame(`
      <div class="analyzing-panel">
        <img src="./assets/logos/rafdan-symbol-terracotta.svg" alt="">
        <p class="eyebrow">Building your readiness picture</p>
        <h1 id="screen-title">Connecting what you know to what comes next.</h1>
        <div class="analysis-track" aria-label="Analysis in progress">
          ${data.uiCopy.analyzing.messages.map((message, index) => `
            <p style="--delay:${index * 0.35}s"><span aria-hidden="true"></span>${escapeHtml(message)}</p>`).join("")}
        </div>
      </div>`);
  }

  function resultInterpretation() {
    const matchesSuppliedDemo = state.results.concepts.every((concept) => {
      const supplied = data.conceptResults.find((result) => result.conceptId === concept.id);
      return supplied && supplied.score === concept.score && supplied.status === concept.status;
    });

    if (matchesSuppliedDemo) {
      return data.uiCopy.results.interpretation;
    }

    const ready = state.results.concepts.filter((concept) => concept.status === "READY").map((concept) => concept.name);
    const gaps = state.results.concepts.filter((concept) => concept.status !== "READY").map((concept) => concept.name);
    const strongText = ready.length ? `Strong foundations: ${ready.join(", ")}.` : "No foundation has reached the ready threshold yet.";
    const gapText = gaps.length ? `Focus next on ${gaps.join(", ")}.` : "No immediate prerequisite gaps were detected.";
    return `${strongText} ${gapText}`;
  }

  function renderResults() {
    const result = state.results;
    const ready = result.concepts.filter((concept) => concept.status === "READY");
    const priority = result.concepts.filter((concept) => concept.status !== "READY").sort((a, b) => a.score - b.score)[0] || null;
    return screenFrame(`
      <div class="results-layout">
        <div class="readiness-score" aria-label="Overall prerequisite readiness ${result.overallReadiness} percent">
          <div class="score-ring" style="--score:${result.overallReadiness}">
            <strong>${result.overallReadiness}<span>%</span></strong>
          </div>
          <p>Overall Prerequisite Readiness</p>
        </div>
        <div class="results-copy">
          <p class="eyebrow">Your readiness picture</p>
          <h1 id="screen-title">You are ${result.overallReadiness}% ready for ${escapeHtml(data.project.upcomingCourse.code)}</h1>
          <p class="lead">${escapeHtml(resultInterpretation())}</p>
          <div class="strength-line">
            <span>Strong foundations</span>
            <div>${ready.map((concept) => `<span>${escapeHtml(concept.name.replace(" Foundations", "").replace(" Fundamentals", ""))}</span>`).join("")}</div>
          </div>
        </div>
      </div>
      ${priority ? `
        <article class="priority-callout">
          <div>
            <p class="panel-label">Highest-priority gap</p>
            <h2>${escapeHtml(priority.name)}</h2>
            <p>${escapeHtml(conceptExplanation(priority))}</p>
          </div>
          <div class="priority-score">${statusBadge(priority.status)}<strong>${priority.score}%</strong></div>
        </article>` : `
        <article class="all-ready-callout">
          <div>
            <p class="panel-label">No priority gap detected</p>
            <h2>Your six bridge foundations are ready.</h2>
            <p>This diagnostic found no immediate prerequisite area below the ready threshold.</p>
          </div>
          ${statusBadge("READY")}
        </article>`}
      <div class="screen-actions screen-actions--end">${button("See readiness by concept", "concepts")}</div>
    `, { backAction: "diagnosticIntro", backLabel: "Diagnostic overview" });
  }

  function matchesDemoAnswerProfile(conceptId) {
    return data.questions
      .filter((question) => question.conceptId === conceptId)
      .every((question) => state.answers[question.id] === question.demoStudentAnswer);
  }

  function conceptExplanation(concept) {
    const supplied = data.conceptResults.find((result) => result.conceptId === concept.id);
    if (supplied && matchesDemoAnswerProfile(concept.id)) {
      return supplied.explanation;
    }
    return `You answered ${concept.correctCount} of ${concept.questionCount} questions correctly in this prerequisite area.`;
  }

  function gapDifficulty(concept) {
    if (matchesDemoAnswerProfile(concept.id)) {
      return concept.whatCouldBecomeDifficult;
    }

    if (concept.status === "READY") {
      return "No immediate prerequisite issue was detected in this concept.";
    }

    return `Following ${concept.upcomingTopicsAffected.join(" and ")} may be harder until this prerequisite foundation is reviewed.`;
  }

  function renderConcepts() {
    const copy = data.uiCopy.conceptBreakdown;
    const hasGaps = state.results.concepts.some((concept) => concept.status !== "READY");
    return screenFrame(`
      <div class="content-heading content-heading--wide">
        <p class="eyebrow">Concept-level diagnosis</p>
        <h1 id="screen-title">${escapeHtml(copy.headline)}</h1>
        <p class="lead">${escapeHtml(copy.explanation)}</p>
      </div>
      <div class="concept-grid">
        ${state.results.concepts.map((concept) => `
          <article class="concept-card" data-status="${escapeHtml(concept.status)}">
            <div class="concept-card__top">
              ${statusBadge(concept.status)}
              <strong>${concept.score}%</strong>
            </div>
            <h2>${escapeHtml(concept.name)}</h2>
            <p>${escapeHtml(conceptExplanation(concept))}</p>
            <div class="concept-meter"><i style="width:${concept.score}%"></i></div>
            ${concept.status !== "READY" ? `<button type="button" class="text-button" data-action="selectGap" data-concept="${concept.id}">Why this matters for CS 412 <span aria-hidden="true">→</span></button>` : `<span class="no-action">No immediate review needed</span>`}
          </article>`).join("")}
      </div>
      <div class="screen-actions screen-actions--between">
        <p>Scores reflect only the knowledge connected to ${escapeHtml(data.project.upcomingCourse.code)}.</p>
        ${hasGaps ? button("Understand the top gap", "topGap") : button("Continue to reassessment", "reassessment")}
      </div>
    `, { backAction: "results", backLabel: "Readiness overview" });
  }

  function renderGap() {
    const nonReady = state.results.concepts.filter((concept) => concept.status !== "READY");
    const selected = state.results.concepts.find((concept) => concept.id === state.selectedGap) || nonReady[0];
    return screenFrame(`
      <div class="gap-layout">
        <aside class="gap-selector" aria-label="Concepts to review">
          <p class="eyebrow">Focus areas</p>
          ${nonReady.map((concept) => `
            <button type="button" data-action="selectGap" data-concept="${concept.id}" class="gap-tab${selected.id === concept.id ? " is-active" : ""}" aria-pressed="${selected.id === concept.id}">
              <span>${escapeHtml(concept.name)}</span><strong>${concept.score}%</strong>
            </button>`).join("")}
        </aside>
        <div class="gap-detail">
          <div class="content-heading">
            <p class="eyebrow">Why this gap matters</p>
            <h1 id="screen-title">${escapeHtml(selected.name)}</h1>
            <div class="gap-status-line"><span>Readiness <strong>${selected.score}%</strong></span>${statusBadge(selected.status)}</div>
          </div>
          <div class="dependency-story">
            <article class="dependency-node dependency-node--weak">
              <p class="panel-label">Weak prerequisite concept</p>
              <h2>${escapeHtml(selected.name)}</h2>
              <p>${escapeHtml(selected.description)}</p>
            </article>
            <div class="dependency-arrow" aria-hidden="true"><span>CS 412 depends on this</span><i></i><b>↓</b></div>
            <article class="dependency-node dependency-node--next">
              <p class="panel-label">Upcoming topic affected</p>
              <h2>${escapeHtml(selected.upcomingTopicsAffected.join(" · "))}</h2>
              <p>${escapeHtml(selected.whyItMatters)}</p>
            </article>
          </div>
          <div class="difficulty-note">
            <p class="panel-label">What could become difficult</p>
            <p>${escapeHtml(gapDifficulty(selected))}</p>
          </div>
        </div>
      </div>
      <div class="screen-actions screen-actions--end">${button("Open my review plan", "review")}</div>
    `, { backAction: "concepts", backLabel: "Concept readiness" });
  }

  function renderReview() {
    const copy = data.uiCopy.reviewPlan;
    return screenFrame(`
      <div class="review-heading">
        <div class="content-heading">
          <p class="eyebrow">Personalized review plan</p>
          <h1 id="screen-title">${escapeHtml(copy.headline)}</h1>
          <p class="lead">${escapeHtml(copy.subtitle)}</p>
        </div>
        <div class="review-total"><strong>3</strong><span>focused priorities</span></div>
      </div>
      <ol class="review-list">
        ${data.reviewPlan.map((item) => `
          <li class="review-item">
            <div class="review-priority"><span>Priority</span><strong>${item.priority}</strong></div>
            <div class="review-main">
              <div class="review-title">
                <div><h2>${escapeHtml(item.conceptName)}</h2><p>${escapeHtml(item.reason)}</p></div>
                <span class="time-chip">${escapeHtml(item.estimatedTime)}</span>
              </div>
              <div class="review-columns">
                <div><p class="panel-label">Review topics</p><ul>${item.reviewTopics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}</ul></div>
                <div><p class="panel-label">Suggested exercise</p><p>${escapeHtml(item.suggestedExercise)}</p></div>
                <div><p class="panel-label">Expected outcome</p><p>${escapeHtml(item.expectedOutcome)}</p></div>
              </div>
              ${item.retestRecommended ? `<p class="retest-note"><span aria-hidden="true">↻</span> Re-test recommended after review</p>` : ""}
            </div>
          </li>`).join("")}
      </ol>
      <div class="screen-actions screen-actions--between">
        <p>Complete the priorities in order, then confirm what changed.</p>
        ${button("See the reassessment loop", "reassessment")}
      </div>
    `, { backAction: "gap", backLabel: "Gap explanation" });
  }

  function renderReassessment() {
    const copy = data.uiCopy.reassessment;
    const loop = [
      { number: "01", label: "Assess", note: "Check only the foundations CS 412 reuses." },
      { number: "02", label: "Review", note: "Repair the highest-impact prerequisite gaps." },
      { number: "03", label: "Reassess", note: "Confirm readiness before the course begins." }
    ];
    return screenFrame(`
      <div class="reassessment-heading">
        <img src="./assets/logos/rafdan-symbol-terracotta.svg" alt="">
        <p class="eyebrow">The readiness loop</p>
        <h1 id="screen-title">${escapeHtml(copy.headline)}</h1>
        <p class="lead">${escapeHtml(copy.explanation)}</p>
      </div>
      <div class="reassessment-loop" aria-label="Assess, review, reassess">
        ${loop.map((item, index) => `
          <article><span>${item.number}</span><h2>${item.label}</h2><p>${item.note}</p></article>
          ${index < loop.length - 1 ? `<div aria-hidden="true">→</div>` : ""}`).join("")}
      </div>
      <div class="reassessment-action">
        ${button(copy.cta, "resetAssessment")}
        <p>Your new attempt starts with a clean diagnostic.</p>
      </div>
    `, { backAction: "review", backLabel: "Review plan" });
  }

  const renderers = {
    landing: renderLanding,
    connection: renderConnection,
    bridge: renderBridge,
    diagnosticIntro: renderDiagnosticIntro,
    quiz: renderQuiz,
    analyzing: renderAnalyzing,
    results: renderResults,
    concepts: renderConcepts,
    gap: renderGap,
    review: renderReview,
    reassessment: renderReassessment
  };

  function render() {
    const renderer = renderers[state.currentScreen] || renderLanding;
    appRoot.innerHTML = renderer();
    document.body.dataset.screen = state.currentScreen;

    if (!testMode) {
      global.scrollTo({ top: 0, behavior: "smooth" });
      global.requestAnimationFrame(() => appRoot.focus({ preventScroll: true }));
    }
  }

  function announce(message) {
    if (announcer) {
      announcer.textContent = "";
      global.setTimeout(() => { announcer.textContent = message; }, 20);
    }
  }

  function goTo(screen) {
    if (!renderers[screen]) {
      return;
    }
    state.currentScreen = screen;
    state.validationMessage = "";
    render();
  }

  function selectAnswer(questionId, answerId) {
    state.answers[questionId] = answerId;
    state.validationMessage = "";
    if (state.currentScreen === "quiz") {
      appRoot.querySelectorAll('input[name="answer"]').forEach((input) => {
        input.checked = input.value === answerId;
        input.closest(".answer-option").classList.toggle("is-selected", input.checked);
      });
      const progression = appRoot.querySelector('[data-action="nextQuestion"], [data-action="submitQuiz"]');
      if (progression) {
        progression.disabled = false;
      }
      const hint = appRoot.querySelector("#answer-hint");
      if (hint) {
        hint.textContent = "Answer selected. You can continue.";
      }
      announce(`Answer ${answerId} selected.`);
    }
  }

  function advanceQuiz() {
    const question = data.questions[state.currentQuestion];
    if (!state.answers[question.id]) {
      state.validationMessage = "Choose an answer before continuing.";
      render();
      return false;
    }

    if (state.currentQuestion < data.questions.length - 1) {
      state.currentQuestion += 1;
      state.validationMessage = "";
      render();
      return true;
    }

    return false;
  }

  function previousQuiz() {
    if (state.currentQuestion === 0) {
      goTo("diagnosticIntro");
      return;
    }
    state.currentQuestion -= 1;
    state.validationMessage = "";
    render();
  }

  async function submitQuiz() {
    const current = data.questions[state.currentQuestion];
    if (!state.answers[current.id]) {
      state.validationMessage = "Choose an answer before viewing your readiness.";
      render();
      return false;
    }

    const results = global.RafdanScoring.calculateResults(state.answers, data);
    if (!results.isComplete) {
      const firstMissing = data.questions.findIndex((question) => !state.answers[question.id]);
      state.currentQuestion = firstMissing;
      state.validationMessage = "Complete every question before viewing your readiness.";
      state.currentScreen = "quiz";
      render();
      return false;
    }

    state.results = results;
    state.quizCompleted = true;
    const topGap = results.concepts.filter((concept) => concept.status !== "READY").sort((a, b) => a.score - b.score)[0];
    state.selectedGap = topGap ? topGap.id : null;
    state.currentScreen = "analyzing";
    render();

    await new Promise((resolve) => global.setTimeout(resolve, testMode ? 0 : 1800));
    state.currentScreen = "results";
    render();
    return true;
  }

  function startQuiz() {
    state.currentQuestion = 0;
    state.validationMessage = "";
    goTo("quiz");
  }

  function resetAssessment() {
    state.currentScreen = "diagnosticIntro";
    state.currentQuestion = 0;
    state.answers = {};
    state.quizCompleted = false;
    state.results = null;
    state.selectedGap = "BC5";
    state.validationMessage = "";
    render();
  }

  function selectGap(conceptId) {
    state.selectedGap = conceptId;
    state.currentScreen = "gap";
    render();
  }

  function setDemoMode(enabled) {
    state.demoMode = Boolean(enabled);
  }

  appRoot.addEventListener("change", (event) => {
    if (event.target.matches('input[name="answer"]')) {
      selectAnswer(data.questions[state.currentQuestion].id, event.target.value);
    }
  });

  appRoot.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    const action = target.dataset.action;
    const routes = ["landing", "connection", "bridge", "diagnosticIntro", "results", "concepts", "gap", "review", "reassessment"];
    if (routes.includes(action)) {
      goTo(action);
      return;
    }

    if (action === "startQuiz") startQuiz();
    if (action === "nextQuestion") advanceQuiz();
    if (action === "previousQuestion") previousQuiz();
    if (action === "submitQuiz") submitQuiz();
    if (action === "resetAssessment") resetAssessment();
    if (action === "selectGap") selectGap(target.dataset.concept);
    if (action === "topGap") {
      const topGap = state.results.concepts.slice().sort((a, b) => a.score - b.score)[0];
      if (topGap && topGap.status !== "READY") {
        selectGap(topGap.id);
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.shiftKey && event.key.toLowerCase() === "d" && state.demoMode && state.currentScreen === "quiz") {
      event.preventDefault();
      const question = data.questions[state.currentQuestion];
      selectAnswer(question.id, question.demoStudentAnswer);
    }
  });

  global.RafdanApp = {
    state,
    advanceQuiz,
    goTo,
    previousQuiz,
    render,
    resetAssessment,
    selectAnswer,
    setDemoMode,
    submitQuiz
  };

  render();
})(window);
