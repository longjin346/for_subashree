/* Edit this file to create a quiz. Keep every id unique and map each answer
 * result to an id in the results array. */
window.QUIZ_CONFIG = {
  meta: {
    title: "Your well-being profile",
    description: "A playful five-question workplace well-being check-in.",
    brand: "Well-being check-in",
    progressLabel: "Quiz progress"
  },
  labels: {
    back: "Back",
    next: "Next",
    showResult: "See my profile",
    restart: "Try again",
    resultEyebrow: "Your well-being profile",
    answerGroup: "Answer choices",
    keyboardHint: "Press 1 - 4 to choose. Press Enter to continue.",
    configurationError: "This quiz isn't ready yet. Check the quiz configuration."
  },
  questions: [
    {
      id: "free-time",
      label: "A little free time",
      text: "You get 30 free minutes. How do you spend it?",
      answers: [
        { id: "quiet-break", text: "Find a quiet corner and take a breather.", result: "dreamer" },
        { id: "tiny-win", text: "Clear one quick task for a tiny win.", result: "rationalist" },
        { id: "kopi-chat", text: "Get a kopi / tea or chat with a teammate.", result: "energizer" },
        { id: "check-in-colleague", text: "Check in on a colleague you have not spoken to in a while.", result: "caretaker" }
      ]
    },
    {
      id: "surprise-task",
      label: "Plot twist",
      text: "A surprise task lands. What is your first move?",
      answers: [
        { id: "check-team", text: "Check in on how the team is feeling first.", result: "caretaker" },
        { id: "rally-group", text: "Rally everyone for a quick planning session.", result: "energizer" },
        { id: "next-step", text: "Make an elaborate plan, choose the next step, and get started.", result: "rationalist" },
        { id: "useful-angle", text: "Adapt with optimism — maybe this will lead somewhere better.", result: "dreamer" }
      ]
    },
    {
      id: "dream-team",
      label: "Team magic",
      text: "Your dream team brings…",
      answers: [
        { id: "collective-energy", text: "Energy that gets everyone moving together.", result: "energizer" },
        { id: "fresh-ideas", text: "Fresh ideas and a hopeful outlook.", result: "dreamer" },
        { id: "calm-support", text: "Calm support when things get spicy.", result: "caretaker" },
        { id: "clear-goals", text: "Clear goals and steady progress.", result: "rationalist" }
      ]
    },
    {
      id: "end-of-day",
      label: "The small win",
      text: "What is the best end-of-day feeling?",
      answers: [
        { id: "moved-forward", text: "1 thing moved forward. Nice.", result: "rationalist" },
        { id: "stayed-kind", text: "You stayed kind under pressure.", result: "caretaker" },
        { id: "recharged", text: "You feel recharged, not just logged off.", result: "dreamer" },
        { id: "shared-laugh", text: "You shared a laugh with someone.", result: "energizer" }
      ]
    },
    {
      id: "weekly-reminder",
      label: "Final check-in",
      text: "It has been a long week. What do you remind yourself?",
      answers: [
        { id: "small-hope", text: "A small step is still progress.", result: "dreamer" },
        { id: "good-people", text: "Make room for good food and good people.", result: "energizer" },
        { id: "one-step", text: "Rest now. Reset tomorrow.", result: "rationalist" },
        { id: "quiet-courage", text: "Quiet courage gets things moving.", result: "caretaker" }
      ]
    }
  ],
  results: [
    {
      id: "energizer", title: "Energizer", mark: "E",
      description: "You bring momentum and lift the room. You help people move from 'where do we start?' to 'let's go'.",
      illustration: "assets/energizer-card.png", illustrationAlt: "Energizer profile card showing a teammate sharing energy with colleagues.", supportTitle: "When to reach out",
      supportDescription: "You give a lot of energy to others. If you have been running on empty, a Mental Health First Aider can help you make space to recharge."
    },
    {
      id: "caretaker", title: "Caretaker", mark: "C",
      description: "You notice people and make room for them. Your care helps others feel supported.",
      illustration: "assets/caretaker-card.png", illustrationAlt: "Caretaker profile card showing a teammate holding a growing plant with support from colleagues.", supportTitle: "When to reach out",
      supportDescription: "You always take care of people. It is time to take care of yourself too. A Mental Health First Aider can be there to listen."
    },
    {
      id: "dreamer", title: "Dreamer", mark: "D",
      description: "You spot possibility and bring a hopeful perspective. You help people see beyond today's to-do list.",
      illustration: "assets/dreamer-card.png", illustrationAlt: "Dreamer profile card showing a teammate resting among flowers under a hopeful sky.", supportTitle: "When to reach out",
      supportDescription: "If your thoughts feel heavy, sharing them with a Mental Health First Aider can make them easier to carry."
    },
    {
      id: "rationalist", title: "Rationalist", mark: "R",
      description: "You bring calm thinking and practical clarity. You help turn a big problem into a useful next step.",
      illustration: "assets/rationalist-card.png", illustrationAlt: "Rationalist profile card showing a teammate calmly planning at a desk.", supportTitle: "When to reach out",
      supportDescription: "You do not have to solve everything alone. A Mental Health First Aider can offer a listening ear when you need one."
    }
  ],
  celebration: {
    enabled: true,
    pieces: 85,
    colours: ["#2146c7", "#ffd43d", "#7651bc", "#82d7b5", "#f15b7b", "#fff9e9"]
  }
};
