const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const context = { window: {}, console };
vm.runInNewContext(fs.readFileSync("dist/quiz.config.js", "utf8"), context);
vm.runInNewContext(fs.readFileSync("dist/app.js", "utf8"), context);

const config = context.window.QUIZ_CONFIG;
const engine = context.window.QuizTemplate;

assert.deepEqual(Array.from(engine.validateConfig(config)), []);

const reachableResults = new Set();
const scenarioCount = config.questions.reduce(function (count, question) {
  return count * question.answers.length;
}, 1);

for (let scenario = 0; scenario < scenarioCount; scenario += 1) {
  let remaining = scenario;
  const answers = config.questions.map(function (question) {
    const answer = remaining % question.answers.length;
    remaining = Math.floor(remaining / question.answers.length);
    return answer;
  });
  reachableResults.add(engine.calculateResult(config, answers));
}

config.results.forEach(function (result) {
  assert.equal(reachableResults.has(result.id), true, result.id + " should be reachable");
});

const tieConfig = {
  results: [{ id: "first" }, { id: "second" }, { id: "third" }],
  questions: [
    { answers: [{ result: "first" }] },
    { answers: [{ result: "second" }] },
    { answers: [{ result: "first" }] },
    { answers: [{ result: "third" }] },
    { answers: [{ result: "second" }] }
  ]
};

assert.equal(engine.calculateResult(tieConfig, [0, 0, 0, 0, 0]), "second");

const fallbackTieConfig = {
  results: [{ id: "first" }, { id: "second" }, { id: "third" }],
  questions: [
    { answers: [{ result: "first" }] },
    { answers: [{ result: "second" }] },
    { answers: [{ result: "first" }] },
    { answers: [{ result: "second" }] },
    { answers: [{ result: "third" }] }
  ]
};

assert.equal(engine.calculateResult(fallbackTieConfig, [0, 0, 0, 0, 0]), "first");

const invalidConfig = {
  meta: { title: "Broken quiz" },
  questions: [{ id: "q1", text: "Question", answers: [{ id: "a1", text: "Answer", result: "missing" }] }],
  results: [{ id: "known", title: "Known", description: "Description" }]
};

assert.equal(engine.validateConfig(invalidConfig).length > 0, true);
console.log("Quiz engine tests passed (" + scenarioCount + " well-being scenarios checked). ");
