# Reusable quiz template

A dependency-free template for short personality quizzes. It shows 1 multiple-choice question at a time, requires an answer before continuing, and maps the completed answers to a result profile.

The included well-being quiz is the first working example. The site is responsive and deploys directly from `dist/` through GitLab Pages.

## Create a quiz

1. Copy or fork this repository.
2. Edit `dist/quiz.config.js` with your quiz title, questions, answers, and results.
3. Add result illustrations to `dist/assets/` and reference them from the result configuration.
4. Edit `dist/styles/theme.css` to create the quiz theme.
5. Preview and test every result before publishing.

The reusable engine and responsive layout live in `dist/app.js` and `dist/styles/base.css`. You usually do not need to edit them.

For the current pilot’s questions, answers, profile copy, and mappings, start with [quiz-content.md](quiz-content.md). It is designed for writing and review. Apply approved copy changes to `dist/quiz.config.js` before publishing.

## Configure questions

Every question and answer needs a unique ID. Each answer's `result` must match a result ID.

```js
{
  id: "free-time",
  label: "A little free time",
  text: "You get 30 free minutes. What do you do?",
  answers: [
    {
      id: "quiet-break",
      text: "Find a quiet corner and watch the clouds.",
      result: "dreamer"
    }
  ]
}
```

The result with the most mapped answers wins. If results are tied, the final answer breaks the tie. If that does not resolve it, the first tied result in the configuration wins.

## Configure results

```js
{
  id: "dreamer",
  title: "Dreamer",
  mark: "D",
  description: "You spot possibility and bring a hopeful perspective.",
  illustration: "assets/dreamer.png",
  illustrationAlt: "A hopeful character looking towards the sky",
  supportTitle: "When to reach out",
  supportDescription: "Sharing a heavy thought can make it easier to carry."
}
```

- `illustration` and `illustrationAlt` are optional as a pair.
- `mark` is used as a fallback when there is no illustration.
- `supportTitle` and `supportDescription` are optional.
- Use relative image paths so GitLab Pages can load them from any project URL.

## Create a theme

Edit the variables at the top of `dist/styles/theme.css` to change colours, typography, width, motion, and illustration size. The same file can override any class from `base.css` when a quiz needs a more distinctive style.

Important variables include:

```css
:root {
  --page-background: #f5a3b4;
  --text-colour: #152454;
  --primary-colour: #2146c7;
  --surface-colour: #fff9e9;
  --accent-colour: #ffd43d;
  --body-font: "DM Sans", sans-serif;
  --display-font: "Fraunces", serif;
}
```

Keep text contrast readable and touch controls at least 44 px high. The base stylesheet already supports small phones, safe areas, keyboard focus, and reduced motion.

## Preview locally

No installation or build step is needed. From the repository root, run:

```sh
python3 -m http.server 8000 --directory dist
```

Then open `http://localhost:8000`.

Opening `dist/index.html` directly also works in current browsers, but a local server is closer to the deployed experience.

Run the dependency-free engine checks after changing questions or result mappings:

```sh
node tests/quiz-engine.test.js
```

## Publish with GitLab Pages

Push the repository to GitLab. The included `.gitlab-ci.yml` publishes `dist/` whenever a commit reaches the default branch.

Before publishing, confirm:

- Every answer maps to an existing result.
- Every result can be reached.
- Illustrations load and have useful alt text.
- Back, Next, keyboard controls, and Try again work.
- The quiz is readable on a 320 px-wide phone and a laptop.
- No personal information or responses are stored or sent anywhere.

## Copy guidelines

- Keep sentences short and use plain English.
- Use a casual, friendly tone with light humour.
- Use British English by default.
- Use sentence case for headings and labels.
- Keep button labels to 3 words or fewer.
- Avoid emojis, jargon, stereotypes, and culture-specific jokes that may exclude people.
- Make every result constructive. Do not diagnose, judge, or make sensitive claims about the user.
