(function (global) {
  "use strict";

  const IMPORTANCE_WEIGHTS = Object.freeze({
    CRITICAL: 3,
    IMPORTANT: 2,
    HELPFUL: 1
  });

  function statusForScore(score, scoring) {
    if (score >= scoring.readyThreshold) {
      return "READY";
    }

    if (score >= scoring.needsReviewThreshold) {
      return "NEEDS REVIEW";
    }

    return "CRITICAL GAP";
  }

  function calculateResults(answers, data) {
    const safeAnswers = answers || {};
    const answeredCount = data.questions.filter((question) => Boolean(safeAnswers[question.id])).length;

    const concepts = data.bridgeConcepts.map((bridgeConcept) => {
      const questions = data.questions.filter((question) => question.conceptId === bridgeConcept.id);
      const correctCount = questions.filter((question) => safeAnswers[question.id] === question.correctAnswer).length;
      const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
      const suppliedResult = data.conceptResults.find((result) => result.conceptId === bridgeConcept.id) || {};

      return {
        ...bridgeConcept,
        ...suppliedResult,
        score,
        status: statusForScore(score, data.project.scoring),
        correctCount,
        questionCount: questions.length,
        weight: IMPORTANCE_WEIGHTS[bridgeConcept.importance] || 1
      };
    });

    const totalWeight = concepts.reduce((sum, concept) => sum + concept.weight, 0);
    const weightedScore = concepts.reduce((sum, concept) => sum + concept.score * concept.weight, 0);

    return {
      concepts,
      overallReadiness: totalWeight ? Math.round(weightedScore / totalWeight) : 0,
      answeredCount,
      totalQuestions: data.questions.length,
      isComplete: answeredCount === data.questions.length
    };
  }

  global.RafdanScoring = Object.freeze({
    IMPORTANCE_WEIGHTS,
    calculateResults,
    statusForScore
  });
})(window);
