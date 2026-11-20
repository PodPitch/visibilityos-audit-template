export function calculateChanges(testBefore, testAfter, controlBefore, controlAfter) {
  const [testStart, testEnd, controlStart, controlEnd] =
    [testBefore, testAfter, controlBefore, controlAfter]
      .map(({mentions, answers}) => 100 * mentions / answers);
  const testChange = testEnd - testStart;
  const controlChange = controlEnd - controlStart;

  return {testStart, testEnd, controlStart, controlEnd, testChange, controlChange, gap: testChange - controlChange};
}

function signedPoints(value) {
  const rounded = Math.sign(value) * Math.round(Math.abs(value) * 10) / 10;
  return `${rounded > 0 ? "+" : ""}${rounded.toFixed(1)}`;
}

if (typeof document !== "undefined") {
  const form = document.querySelector("#audit");
  const inputs = [...form.querySelectorAll("input")];
  const error = document.querySelector("#count-error");
  const result = document.querySelector("#result");
  const gap = document.querySelector("#gap");
  const testSummary = document.querySelector("#test-summary");
  const controlSummary = document.querySelector("#control-summary");
  const coverage = document.querySelector("#coverage");

  function updateSummary(element, start, end, change) {
    const swing = document.createElement("strong");
    swing.textContent = `${signedPoints(change)} points`;
    element.replaceChildren(`${start.toFixed(1)}% to ${end.toFixed(1)}% `, swing);
  }

  function readRound(idPrefix) {
    return {
      mentions: document.getElementById(idPrefix + "-mentions").valueAsNumber,
      answers: document.getElementById(idPrefix + "-answers").valueAsNumber,
    };
  }

  function update() {
    const testBefore = readRound("test-before");
    const testAfter = readRound("test-after");
    const controlBefore = readRound("control-before");
    const controlAfter = readRound("control-after");

    const invalidNumber = inputs.some(input => !input.validity.valid);
    const tooManyMentions = [testBefore, testAfter, controlBefore, controlAfter]
      .some(({mentions, answers}) => mentions > answers);

    result.hidden = invalidNumber || tooManyMentions;
    error.hidden = !result.hidden;
    if (result.hidden) {
      error.textContent = invalidNumber
        ? "Enter whole-number counts with at least one completed answer in each round."
        : "Mentions must be at or below the number of completed answers in each round.";
      return;
    }

    const changes = calculateChanges(testBefore, testAfter, controlBefore, controlAfter);
    gap.textContent = signedPoints(changes.gap);
    updateSummary(testSummary, changes.testStart, changes.testEnd, changes.testChange);
    updateSummary(controlSummary, changes.controlStart, changes.controlEnd, changes.controlChange);
    coverage.hidden = testBefore.answers === testAfter.answers && controlBefore.answers === controlAfter.answers;
  }

  form.addEventListener("input", update);
  form.addEventListener("submit", event => event.preventDefault());
  form.addEventListener("reset", () => setTimeout(update, 0));
  update();
}
