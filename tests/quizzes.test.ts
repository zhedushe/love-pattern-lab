import assert from "node:assert/strict";
import test from "node:test";
import { buildResult, getTier, isValidAnswers, quizzes } from "../lib/quizzes.ts";

test("ships exactly three bilingual MVP quizzes", () => {
  assert.equal(quizzes.length, 3);
  for (const quiz of quizzes) {
    assert.ok(quiz.title.en);
    assert.ok(quiz.title.es);
    assert.equal(quiz.questions.length, 5);
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
