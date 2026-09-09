import assert from "node:assert/strict";
import test from "node:test";
import { buildResult, getTier, isValidAnswers, quizzes } from "../lib/quizzes.ts";
import { scorePullAway } from "../lib/pull-away.ts";

test("ships four bilingual quizzes including the 25-question pull-away quiz", () => {
  assert.equal(quizzes.length, 4);
  for (const quiz of quizzes) {
    assert.ok(quiz.title.en);
    assert.ok(quiz.title.es);
  }
  assert.equal(quizzes.find((quiz) => quiz.slug === "why-do-you-pull-away")?.questions.length, 25);
});

const answersFor = (indexes: number[], value = 5, base = 3) => {
  const answers = Array<number>(25).fill(base);
  for (const index of indexes) answers[index - 1] = value;
  return answers;
};

test("fixed scoring can produce all five primary patterns", () => {
  assert.equal(scorePullAway(answersFor([5, 6, 9, 14, 18, 22, 24])).primary, "guarded");
  assert.equal(scorePullAway(answersFor([1, 2, 3, 7, 10, 11, 12, 21])).primary, "chase");
  assert.equal(scorePullAway(answersFor([4, 8, 15, 17, 24])).primary, "overthinking");
  assert.equal(scorePullAway(answersFor([6, 13, 19])).primary, "slow");
  assert.equal(scorePullAway(answersFor([16, 20, 23, 25], 5, 1)).primary, "secure");
});

test("tie-break order is deterministic and preserves a secondary pattern", () => {
  const result = scorePullAway(Array<number>(25).fill(3));
  assert.equal(result.primary, "guarded");
  assert.equal(result.secondary, "chase");
});

test("every pull-away result contains nine distinct modules in both languages", () => {
  const cases = [
    answersFor([5, 6, 9, 14, 18, 22, 24]),
    answersFor([1, 2, 3, 7, 10, 11, 12, 21]),
    answersFor([4, 8, 15, 17, 24]),
    answersFor([6, 13, 19]),
    answersFor([16, 20, 23, 25], 5, 1)
  ];
  for (const answers of cases) {
    for (const language of ["en", "es"] as const) {
      const report = buildResult("why-do-you-pull-away", answers, language);
      assert.equal(report.sections.length, 9);
      assert.equal(new Set(report.sections.map((section) => section.heading)).size, 9);
    }
  }
});

test("validates complete bounded answer sets", () => {
  assert.equal(isValidAnswers("attachment-compass", [1, 2, 3, 4, 5]), true);
  assert.equal(isValidAnswers("attachment-compass", [1, 2, 3, 4]), false);
  assert.equal(isValidAnswers("attachment-compass", [1, 2, 3, 4, 6]), false);
  assert.equal(isValidAnswers("unknown", [1, 2, 3, 4, 5]), false);
});

test("assigns result tiers and generates localized full reports", () => {
  assert.equal(getTier([1, 1, 2, 2, 2]), "growing");
  assert.equal(getTier([3, 3, 3, 3, 3]), "exploring");
  assert.equal(getTier([5, 4, 5, 4, 5]), "grounded");
  const report = buildResult("conflict-rhythm", [3, 3, 3, 3, 3], "es");
  assert.equal(report.quizTitle, "Ritmo del conflicto");
  assert.equal(report.sections.length, 4);
});
