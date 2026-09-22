(function () {
  "use strict";

  function validateConfig(config) {
    const errors = [];
    if (!config || typeof config !== "object") return ["QUIZ_CONFIG is missing."];
    if (!config.meta || !config.meta.title) errors.push("meta.title is required.");
    if (!Array.isArray(config.questions) || config.questions.length === 0) errors.push("Add at least 1 question.");
    if (!Array.isArray(config.results) || config.results.length === 0) errors.push("Add at least 1 result.");

    const results = Array.isArray(config.results) ? config.results : [];
    const questions = Array.isArray(config.questions) ? config.questions : [];
    const resultIds = new Set();
    results.forEach(function (result, index) {
      if (!result.id) errors.push("Result " + (index + 1) + " needs an id.");
      else if (resultIds.has(result.id)) errors.push("Result id ‘" + result.id + "’ is duplicated.");
      else resultIds.add(result.id);
      if (!result.title) errors.push("Result " + (index + 1) + " needs a title.");
      if (!result.description) errors.push("Result " + (index + 1) + " needs a description.");
      if (result.illustration && !result.illustrationAlt) errors.push("Result ‘" + result.id + "’ needs illustrationAlt.");
    });

    const questionIds = new Set();
    questions.forEach(function (question, questionIndex) {
      if (!question.id) errors.push("Question " + (questionIndex + 1) + " needs an id.");
      else if (questionIds.has(question.id)) errors.push("Question id ‘" + question.id + "’ is duplicated.");
      else questionIds.add(question.id);
      if (!question.text) errors.push("Question " + (questionIndex + 1) + " needs text.");
      if (!Array.isArray(question.answers) || question.answers.length < 2) {
        errors.push("Question ‘" + (question.id || questionIndex + 1) + "’ needs at least 2 answers.");
        return;
      }
      const answerIds = new Set();
      question.answers.forEach(function (answer, answerIndex) {
        if (!answer.id) errors.push("Answer " + (answerIndex + 1) + " in ‘" + question.id + "’ needs an id.");
        else if (answerIds.has(answer.id)) errors.push("Answer id ‘" + answer.id + "’ is duplicated in ‘" + question.id + "’.");
        else answerIds.add(answer.id);
        if (!answer.text) errors.push("Answer ‘" + (answer.id || answerIndex + 1) + "’ needs text.");
        if (!resultIds.has(answer.result)) errors.push("Answer ‘" + (answer.id || answerIndex + 1) + "’ maps to unknown result ‘" + answer.result + "’.");
      });
    });
    return errors;
  }

  function calculateResult(config, answerIndexes) {
    const scores = {};
    config.results.forEach(function (result) { scores[result.id] = 0; });
    answerIndexes.forEach(function (answerIndex, questionIndex) {
      const question = config.questions[questionIndex];
      const answer = question && question.answers[answerIndex];
      if (answer && Object.prototype.hasOwnProperty.call(scores, answer.result)) scores[answer.result] += 1;
    });
    const highestScore = Math.max.apply(null, Object.values(scores));
    const tiedIds = config.results.map(function (result) { return result.id; })
      .filter(function (id) { return scores[id] === highestScore; });
    if (tiedIds.length === 1) return tiedIds[0];
    const finalQuestionIndex = config.questions.length - 1;
    const finalQuestion = config.questions[finalQuestionIndex];
    const finalAnswer = finalQuestion && finalQuestion.answers[answerIndexes[finalQuestionIndex]];
    if (finalAnswer && tiedIds.includes(finalAnswer.result)) return finalAnswer.result;
    return tiedIds[0];
  }

  window.QuizTemplate = { validateConfig: validateConfig, calculateResult: calculateResult };
  if (typeof document === "undefined") return;

  const config = window.QUIZ_CONFIG;
  const errors = validateConfig(config);
  const stage = document.getElementById("stage");
  if (errors.length) {
    const message = document.createElement("p");
    message.className = "configuration-error";
    message.textContent = config && config.labels && config.labels.configurationError
      ? config.labels.configurationError
      : "This quiz isn't ready yet. Check the quiz configuration.";
    stage.replaceChildren(message);
    console.error("Invalid quiz configuration:\n" + errors.join("\n"));
    return;
  }

  const labels = Object.assign({
    back: "Back", next: "Continue", showResult: "See result", restart: "Try again",
    resultEyebrow: "Your result", answerGroup: "Answer choices",
    keyboardHint: "Use the number keys to choose. Press Enter to continue."
  }, config.labels || {});
  const brand = document.getElementById("brand");
  const topbar = document.getElementById("topbar");
  const progressTrack = document.getElementById("progress-track");
  const progress = document.getElementById("progress");
  const count = document.getElementById("count");
  const footer = document.getElementById("footer");
  const hint = document.getElementById("hint");
  const back = document.getElementById("back");
  const next = document.getElementById("next");
  let step = 0;
  const answers = Array(config.questions.length).fill(null);

  document.title = config.meta.title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && config.meta.description) metaDescription.content = config.meta.description;
  topbar.setAttribute("aria-label", config.meta.progressLabel || "Quiz progress");
  brand.textContent = config.meta.brand || config.meta.title;
  progressTrack.setAttribute("aria-valuemax", String(config.questions.length));
  hint.textContent = labels.keyboardHint;
  back.textContent = labels.back;

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function selectAnswer(index) {
    answers[step] = index;
    renderQuestion();
    const selected = stage.querySelector('[data-answer-index="' + index + '"]');
    if (selected) selected.focus();
  }

  function renderQuestion() {
    const question = config.questions[step];
    const questionCard = makeElement("div", "question");
    const eyebrow = makeElement("div", "eyebrow", "✦ " + (question.label || "Question " + (step + 1)));
    const heading = makeElement("h1", "", question.text);
    const answerGroup = makeElement("div", "answers");
    answerGroup.setAttribute("role", "radiogroup");
    answerGroup.setAttribute("aria-label", labels.answerGroup);

    question.answers.forEach(function (answer, index) {
      const selected = answers[step] === index;
      const button = makeElement("button", "answer" + (selected ? " selected" : ""));
      const key = makeElement("span", "key", String(index + 1));
      const copy = makeElement("span", "answer-copy", answer.text);
      button.type = "button";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", String(selected));
      button.dataset.answerIndex = String(index);
      button.append(key, copy);
      button.addEventListener("click", function () { selectAnswer(index); });
      answerGroup.appendChild(button);
    });

    questionCard.append(eyebrow, heading, answerGroup);
    stage.replaceChildren(questionCard);
    count.textContent = (step + 1) + " / " + config.questions.length;
    progress.style.width = ((step + 1) / config.questions.length * 100) + "%";
    progressTrack.setAttribute("aria-valuenow", String(step + 1));
    back.disabled = step === 0;
    next.disabled = answers[step] === null;
    next.textContent = step === config.questions.length - 1 ? labels.showResult : labels.next;
  }

  function celebrate() {
    const settings = config.celebration || {};
    if (!settings.enabled) return;
    const colours = settings.colours && settings.colours.length ? settings.colours : ["#2146c7", "#ffd43d"];
    const pieces = Number.isInteger(settings.pieces) ? settings.pieces : 60;
    for (let index = 0; index < pieces; index += 1) {
      const bit = document.createElement("i");
      bit.className = "confetti";
      bit.style.left = Math.random() * 100 + "vw";
      bit.style.setProperty("--x", (Math.random() * 180 - 90) + "px");
      bit.style.setProperty("--d", (2.2 + Math.random() * 2.2) + "s");
      bit.style.setProperty("--delay", Math.random() * 0.65 + "s");
      bit.style.setProperty("--r", Math.random() * 180 + "deg");
      bit.style.setProperty("--c", colours[index % colours.length]);
      document.body.appendChild(bit);
      window.setTimeout(function () { bit.remove(); }, 5000);
    }
  }

  function showResult() {
    const resultId = calculateResult(config, answers);
    const result = config.results.find(function (item) { return item.id === resultId; });
    const resultCard = makeElement("div", "result");
    const resultCopy = makeElement("div", "result-copy");
    if (result.illustration) {
      const illustration = document.createElement("img");
      illustration.className = "result-illustration";
      illustration.src = result.illustration;
      illustration.alt = result.illustrationAlt;
      resultCopy.appendChild(illustration);
    } else if (result.mark) {
      const mark = makeElement("div", "profile-mark", result.mark);
      mark.setAttribute("aria-hidden", "true");
      resultCopy.appendChild(mark);
    }
    const eyebrow = makeElement("div", "eyebrow", labels.resultEyebrow);
    const heading = makeElement("h1", "", result.title);
    const description = makeElement("p", "", result.description);
    resultCopy.append(eyebrow, heading, description);
    if (result.supportTitle || result.supportDescription) {
      const support = makeElement("div", "wish");
      if (result.supportTitle) support.appendChild(makeElement("strong", "", result.supportTitle));
      if (result.supportTitle && result.supportDescription) support.appendChild(document.createElement("br"));
      if (result.supportDescription) support.appendChild(document.createTextNode(result.supportDescription));
      resultCopy.appendChild(support);
    }
    resultCard.appendChild(resultCopy);
    stage.replaceChildren(resultCard);
    topbar.style.visibility = "hidden";
    footer.replaceChildren(document.createElement("div"));
    const controls = makeElement("div", "controls");
    const restart = makeElement("button", "nav", labels.restart);
    restart.type = "button";
    restart.addEventListener("click", function () { window.location.reload(); });
    controls.appendChild(restart);
    footer.appendChild(controls);
    heading.setAttribute("tabindex", "-1");
    heading.focus();
    celebrate();
  }

  next.addEventListener("click", function () {
    if (answers[step] === null) return;
    if (step < config.questions.length - 1) { step += 1; renderQuestion(); }
    else showResult();
  });
  back.addEventListener("click", function () {
    if (step > 0) { step -= 1; renderQuestion(); }
  });
  document.addEventListener("keydown", function (event) {
    if (stage.querySelector(".result")) return;
    const answerNumber = Number(event.key);
    const question = config.questions[step];
    if (Number.isInteger(answerNumber) && answerNumber >= 1 && answerNumber <= question.answers.length) selectAnswer(answerNumber - 1);
    if (event.key === "Enter" && !next.disabled) next.click();
    if (event.key === "ArrowLeft" && step > 0) back.click();
  });
  renderQuestion();
}());
